import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Wallet } from "ethers";
import { parseEther } from "ethers/lib/utils";

import { NeokingdomDAO, expandable } from "../internal/core";
import {
  ContractContext,
  DAOConfig,
  NeokingdomContracts,
  Sequence,
} from "../internal/types";

export type SetupContext = ContractContext & {
  deployer: Wallet | SignerWithAddress;
  config: DAOConfig;
};

export function generateSetupContext(config: DAOConfig) {
  async function _generateSetupContext(n: NeokingdomDAO) {
    const contracts = (await n.loadContractsPartial()) as NeokingdomContracts;
    const context: SetupContext = {
      ...contracts,
      config,
      deployer: n.config.deployer,
    };
    return context;
  }
  return _generateSetupContext;
}

export const SETUP_SEQUENCE: Sequence<SetupContext> = [
  (c) =>
    c.shareholderRegistry.mint(
      c.shareholderRegistry.address,
      c.config.shareCapital
    ),

  expandable((preprocessContext: SetupContext) =>
    preprocessContext.config.contributors.map(
      (contributor) => (c) =>
        c.shareholderRegistry.transferFrom(
          c.shareholderRegistry.address,
          contributor.address,
          contributor.shareBalance
        )
    )
  ),

  // Set address status
  expandable((preprocessContext: SetupContext) =>
    preprocessContext.config.contributors.map((contributor) => async (c) => {
      if (contributor.status === "contributor") {
        return c.shareholderRegistry.setStatus(
          await c.shareholderRegistry.CONTRIBUTOR_STATUS(),
          contributor.address
        );
      }
      if (contributor.status === "board") {
        return c.shareholderRegistry.setStatus(
          await c.shareholderRegistry.MANAGING_BOARD_STATUS(),
          contributor.address
        );
      }
      if (contributor.status === "investor") {
        return c.shareholderRegistry.setStatus(
          await c.shareholderRegistry.INVESTOR_STATUS(),
          contributor.address
        );
      }
      throw new Error("Unknown status for " + contributor);
    })
  ),

  // Give each contributor tokens
  expandable((preprocessContext: SetupContext) =>
    preprocessContext.config.contributors.map(
      (contributor) => (c) =>
        contributor.balance
          ? c.governanceToken.mint(
              contributor.address,
              BigNumber.from(contributor.balance.toString())
            )
          : null
    )
  ),

  // Give each contributor vesting tokens
  expandable((preprocessContext: SetupContext) =>
    preprocessContext.config.contributors.map(
      (contributor) => (c) =>
        contributor.vestingBalance
          ? c.governanceToken.mintVesting(
              contributor.address,
              BigNumber.from(contributor.vestingBalance.toString())
            )
          : null
    )
  ),
];

export const SETUP_SEQUENCE_TESTNET: Sequence<SetupContext> = [
  // Add testing resolution type
  (c) =>
    c.resolutionManager.addResolutionType(
      "30sNotice3mVoting",
      66,
      30,
      60 * 3,
      false
    ),
  expandable((preprocessContext: SetupContext) =>
    preprocessContext.config.contributors.map(
      (contributor) => (c) =>
        c.usdc.mint(contributor.address, parseEther("10000"))
    )
  ),
];
