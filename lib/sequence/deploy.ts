import { TransactionResponse } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Wallet } from "ethers";

import { NeokingdomDAO } from "../internal/core";
import type {
  ContractContext,
  ContractNames,
  DAOConfig,
  NeokingdomContracts,
  Sequence,
} from "../internal/types";
import { ROLES } from "../utils";

export type DeployContext = ContractContext & {
  deployer: Wallet | SignerWithAddress;
  config: DAOConfig;
  deploy: (
    contractName: ContractNames,
    args?: any[]
  ) => Promise<TransactionResponse>;
  deployProxy: (
    contractName: ContractNames,
    args?: any[]
  ) => Promise<TransactionResponse>;
};

export function generateDeployContext(config: DAOConfig) {
  async function _generateDeployContext(neokingdomDAO: NeokingdomDAO) {
    const contracts =
      (await neokingdomDAO.loadContractsPartial()) as NeokingdomContracts;
    const context: DeployContext = {
      ...contracts,
      deployer: neokingdomDAO.config.deployer,
      config,
      deploy: neokingdomDAO.deploy.bind(neokingdomDAO),
      deployProxy: neokingdomDAO.deployProxy.bind(neokingdomDAO),
    };
    return context;
  }
  return _generateDeployContext;
}

export const SETUP_MOCK_SEQUENCE: Sequence<DeployContext> = [
  (c) => c.deploy("USDC", ["USDC", "USDC"]),
  (c) => c.deploy("DIAOracleV2"),
  (c) => c.diaOracle.setValue("EUR/USD", 100000000, 1688997107),
  (c) => c.diaOracle.setValue("USDC/USD", 100000000, 1688997107),
];

export const DEPLOY_SEQUENCE: Sequence<DeployContext> = [
  // Deploy Contracts
  /////////////////////
  (c) => c.deploy("DAORoles"),
  (c) => c.deployProxy("Voting", [c.daoRoles.address]),
  (c) =>
    c.deployProxy("GovernanceToken", [
      c.daoRoles.address,
      c.config.governanceTokenName,
      c.config.governanceTokenSymbol,
    ]),
  (c) =>
    c.deploy("NeokingdomToken", [c.config.tokenName, c.config.tokenSymbol]),
  (c) => c.deployProxy("RedemptionController", [c.daoRoles.address]),
  (c) =>
    c.deployProxy("InternalMarket", [
      c.daoRoles.address,
      c.governanceToken.address,
    ]),
  (c) =>
    c.deployProxy("ShareholderRegistry", [
      c.daoRoles.address,
      c.config.shareTokenName,
      c.config.shareTokenSymbol,
    ]),
  (c) =>
    c.deployProxy("ResolutionManager", [
      c.daoRoles.address,
      c.shareholderRegistry.address,
      c.governanceToken.address,
      c.voting.address,
    ]),

  /*
  (c) => c.deploy("ProxyAdmin"),
  */

  // Set ACLs
  /////////////

  (c) => c.daoRoles.grantRole(ROLES.OPERATOR_ROLE, c.deployer.address),
  (c) => c.daoRoles.grantRole(ROLES.RESOLUTION_ROLE, c.deployer.address),

  (c) =>
    c.daoRoles.grantRole(ROLES.RESOLUTION_ROLE, c.resolutionManager.address),
  (c) =>
    c.daoRoles.grantRole(
      ROLES.SHAREHOLDER_REGISTRY_ROLE,
      c.shareholderRegistry.address
    ),
  (c) =>
    c.daoRoles.grantRole(ROLES.TOKEN_MANAGER_ROLE, c.governanceToken.address),
  (c) =>
    c.daoRoles.grantRole(ROLES.TOKEN_MANAGER_ROLE, c.internalMarket.address),
  (c) => c.daoRoles.grantRole(ROLES.MARKET_ROLE, c.internalMarket.address),
  (c) =>
    c.neokingdomToken.grantRole(ROLES.MINTER_ROLE, c.governanceToken.address),

  // Set interdependencies
  //////////////////////////

  // Market
  (c) => c.shareholderRegistry.setVoting(c.voting.address),

  // Voting
  (c) => c.voting.setShareholderRegistry(c.shareholderRegistry.address),
  (c) => c.voting.setToken(c.governanceToken.address),

  // Token
  (c) => c.governanceToken.setVoting(c.voting.address),
  (c) =>
    c.governanceToken.setShareholderRegistry(c.shareholderRegistry.address),
  (c) => c.governanceToken.setTokenExternal(c.neokingdomToken.address),
  (c) =>
    c.governanceToken.setRedemptionController(c.redemptionController.address),

  // Token
  (c) => c.governanceToken.setVoting(c.voting.address),
  (c) =>
    c.governanceToken.setRedemptionController(c.redemptionController.address),

  // Registry
  (c) => c.governanceToken.setVoting(c.voting.address),

  (c) =>
    c.internalMarket.setRedemptionController(c.redemptionController.address),
  (c) => c.internalMarket.setReserve(c.config.reserveAddress),
  (c) => c.internalMarket.setShareholderRegistry(c.shareholderRegistry.address),
  (c) =>
    c.internalMarket.setExchangePair(
      c.config.usdcAddress,
      c.config.diaOracleAddress
    ),
];
