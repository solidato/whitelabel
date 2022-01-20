// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/ERC20Snapshot.sol)

pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ShareholderRegistry.sol";
import "./Snapshottable.sol";

contract ShareholderRegistrySnapshot is ShareholderRegistry, Snapshottable {
    struct TotalSupplySnapshots {
        uint256[] ids;
        uint256[] values;
    }

    TotalSupplySnapshots private _totalSupplySnapshots;

    struct StatusAndBalance {
        Status status;
        uint256 balance;
    }

    struct StatusAndBalanceSnapshots {
        uint256[] ids;
        StatusAndBalance[] values;
    }

    mapping(address => StatusAndBalanceSnapshots)
        private _accountStatusAndBalanceSnapshots;

    constructor(string memory name, string memory symbol)
        ShareholderRegistry(name, symbol)
    {}

    // FIXME: add ACL
    function snapshot() public override returns (uint256) {
        return _snapshot();
    }

    /**
     * @dev Retrieves the balance of `account` at the time `snapshotId` was created.
     */
    function balanceOfAt(address account, uint256 snapshotId)
        public
        view
        virtual
        returns (uint256)
    {
        StatusAndBalanceSnapshots
            storage snapshots = _accountStatusAndBalanceSnapshots[account];
        (bool snapshotted, uint256 index) = _indexAt(snapshotId, snapshots.ids);

        return
            snapshotted ? snapshots.values[index].balance : balanceOf(account);
    }

    /**
     * @dev Retrieves the total supply at the time `snapshotId` was created.
     */
    function totalSupplyAt(uint256 snapshotId)
        public
        view
        virtual
        returns (uint256)
    {
        (bool snapshotted, uint256 index) = _indexAt(
            snapshotId,
            _totalSupplySnapshots.ids
        );

        return snapshotted ? _totalSupplySnapshots.ids[index] : totalSupply();
    }

    function getStatusAt(address account, uint256 snapshotId)
        public
        view
        virtual
        returns (Status)
    {
        if (balanceOfAt(account, snapshotId) > 0) {
            StatusAndBalanceSnapshots
                storage snapshots = _accountStatusAndBalanceSnapshots[account];
            (bool snapshotted, uint256 index) = _indexAt(
                snapshotId,
                snapshots.ids
            );

            return
                snapshotted
                    ? snapshots.values[index].status
                    : getStatus(account);
        }
        return Status.NULL;
    }

    function hasStatusAt(
        address account,
        Status status,
        uint256 snapshotId
    ) public view returns (bool) {
        StatusAndBalanceSnapshots
            storage snapshots = _accountStatusAndBalanceSnapshots[account];
        (bool snapshotted, uint256 index) = _indexAt(snapshotId, snapshots.ids);

        Status statusAt = snapshotted
            ? snapshots.values[index].status
            : getStatus(account);

        return balanceOfAt(account, snapshotId) > 0 && statusAt == status;
    }

    // Update balance and/or total supply snapshots before the values are modified. This is implemented
    // in the _beforeTokenTransfer hook, which is executed for _mint, _burn, and _transfer operations.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        if (from == address(0)) {
            // mint
            _updateAccountSnapshot(to);
            _updateTotalSupplySnapshot();
        } else if (to == address(0)) {
            // burn
            _updateAccountSnapshot(from);
            _updateTotalSupplySnapshot();
        } else {
            // transfer
            _updateAccountSnapshot(from);
            _updateAccountSnapshot(to);
        }
    }

    function _updateAccountSnapshot(address account) private {
        uint256 currentId = _getCurrentSnapshotId();
        StatusAndBalanceSnapshots
            storage snapshots = _accountStatusAndBalanceSnapshots[account];
        if (_lastSnapshotId(snapshots.ids) < currentId) {
            snapshots.ids.push(currentId);
            snapshots.values.push(
                StatusAndBalance(getStatus(account), balanceOf(account))
            );
        }
    }

    function _updateTotalSupplySnapshot() private {
        uint256 currentId = _getCurrentSnapshotId();
        TotalSupplySnapshots storage snapshots = _totalSupplySnapshots;
        if (_lastSnapshotId(snapshots.ids) < currentId) {
            snapshots.ids.push(currentId);
            snapshots.values.push(totalSupply());
        }
    }

    function _beforeSetStatus(address account, Status status)
        internal
        override
    {
        super._beforeSetStatus(account, status);
        _updateAccountSnapshot(account);
    }
}