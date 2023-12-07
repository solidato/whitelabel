import { TransactionResponse } from "@ethersproject/providers";

import {
  DAORoles,
  DAORoles__factory,
  DIAOracleV2__factory,
  GovernanceToken,
  GovernanceToken__factory,
  IDIAOracleV2,
  IERC20Mintable,
  InternalMarket,
  InternalMarket__factory,
  NeokingdomToken,
  NeokingdomToken__factory,
  RedemptionController,
  RedemptionController__factory,
  ResolutionManager,
  ResolutionManager__factory,
  ShareholderRegistry,
  ShareholderRegistry__factory,
  USDC__factory,
  Voting,
  Voting__factory,
} from "../../typechain";
import { NeokingdomDAO } from "./core";

export const FACTORIES = {
  DAORoles: DAORoles__factory,
  InternalMarket: InternalMarket__factory,
  GovernanceToken: GovernanceToken__factory,
  NeokingdomToken: NeokingdomToken__factory,
  RedemptionController: RedemptionController__factory,
  ResolutionManager: ResolutionManager__factory,
  ShareholderRegistry: ShareholderRegistry__factory,
  USDC: USDC__factory,
  Voting: Voting__factory,
  DIAOracleV2: DIAOracleV2__factory,
} as const;

export type ContractNames = keyof typeof FACTORIES;

export type Contributor = {
  name?: string;
  address: string;
  status: "contributor" | "board" | "investor";
  shareBalance: string;
  balance?: string;
  vestingBalance?: string;
};

export type Address = `0x${string}`;

export type DAOConfig = {
  testnet: boolean;
  multisigAddress: Address;
  tokenName: string;
  tokenSymbol: string;
  governanceTokenName: string;
  governanceTokenSymbol: string;
  shareTokenName: string;
  shareTokenSymbol: string;
  reserveAddress: Address;
  usdcAddress: Address;
  diaOracleAddress: Address;
  shareCapital: string;
  contributors: Contributor[];
};

export type ContextGenerator<T extends Context> = (
  neokingdomDao: NeokingdomDAO
) => Promise<T>;

export type NeokingdomContracts = {
  daoRoles: DAORoles;
  internalMarket: InternalMarket;
  governanceToken: GovernanceToken;
  neokingdomToken: NeokingdomToken;
  redemptionController: RedemptionController;
  resolutionManager: ResolutionManager;
  shareholderRegistry: ShareholderRegistry;
  usdc: IERC20Mintable;
  voting: Voting;
  diaOracle: IDIAOracleV2;
};

export type Context = {};

export type ContractContext = Context & NeokingdomContracts;

export type Step<T extends Context> = (
  c: T
) => Promise<TransactionResponse> | null;

export type StepWithExpandable<T extends Context> =
  | ExpandableStep<T>
  | ((c: T) => Promise<TransactionResponse> | null);

export type ExpandableStep<T extends Context> = {
  expandableFunction: (c: T) => ProcessedSequence<T>;
};

export type Sequence<T extends Context> = StepWithExpandable<T>[];

export type ProcessedSequence<T extends Context> = (Step<T> | null)[];

// FIXME: There Must Be A Better Way™ to do this in TypeScript
export const CONTRACT_NAMES = [
  "daoRoles",
  "internalMarket",
  "governanceToken",
  "neokingdomToken",
  "redemptionController",
  "resolutionManager",
  "shareholderRegistry",
  "usdc",
  "voting",
  "diaOracle",
];

export function isNeokingdomContracts(
  n: Partial<NeokingdomContracts>
): n is NeokingdomContracts {
  for (let name of CONTRACT_NAMES) {
    if (!(name in n)) {
      console.log("missing", name);
      return false;
    }
  }
  return true;
}
