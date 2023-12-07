// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

interface IERC20Mintable is IERC20 {
    function mint(address account, uint256 amount) external;
}
