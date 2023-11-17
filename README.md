![Test workflow](https://github.com/NeokingdomDAO/whitelabel/actions/workflows/node.yml/badge.svg)

# Neokingdom DAO Contracts

Welcome to the Neokingdom DAO Contacts.

## Documentation

- [NEOKingdom DAO Yellow Paper](./docs/yellowpaper/yellowpaper.md) describes why this project exists, and provides high level overview of the structure of the smart contracts.
- [Flow charts](./docs/flowcharts) includes four flow charts:
  - _contributor_ shows how new people are added to the DAO as contributors.
  - _proposal_ gives an overview of the governance process of the DAO.
  - _tokenomics_ explains how tokens are moved from the contributor's wallet to another wallet.
  - _voting_ shows how contributors vote to resolutions.
- [Complex flows](./docs/complex_flows):
  - _voting_ elaborates the logic behind the voting power distribution and delegation implemented in the Neokingdom DAO contracts
  - _redemption_ elaborates the logic behind the redemption process of Neokingdom DAO
- Integration tests:
  - [Integration](./test/Integration.ts) is a collection of integration tests that touches multiple use cases.
  - [Integration governance+shareholders](./test/IntegrationGovernanceShareholders.ts) tests the invariant that the sum of shares and tokens is equal to the user's voting power
  - [Integration market+redemption](./test/IntegrationInternalMarketRedemptionController.ts) tests that users promoted from investor to contributor have the right voting power.

## Commands

```
# Update readme
python scripts/update-readme.py deployments/9001.network.json
```

```
# Clean the build dir, sometimes this is a good idea
npx hardhat clean

# Compile the contracts
npx hardhat compile

# Test the contracts
npx hardhat test

# Deploy to production
npx hardhat deploy --network evmos
```

# Audits

- [SolidProof](https://solidproof.io/)
  - Tag: https://github.com/NeokingdomDAO/contracts/releases/tag/audit1
  - Report: https://github.com/solidproof/projects/blob/main/2023/NeokingdomDAO/SmartContract_Audit_Solidproof_NeoKingdomDAO.pdf
- [LeastAuthority](https://leastauthority.com)
  - Tag: https://github.com/NeokingdomDAO/contracts/releases/tag/audit2
  - Report: https://leastauthority.com/blog/audits/neokingdom-dao-smart-contracts/
