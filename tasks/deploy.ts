import { task } from "hardhat/config";

import {
  DEPLOY_SEQUENCE,
  NeokingdomDAOHardhat,
  SETUP_SEQUENCE,
  generateDeployContext,
} from "../lib";
import { DAOConfig } from "../lib/internal/types";
import { SETUP_MOCK_SEQUENCE } from "../lib/sequence/deploy";
import { finalizeACL } from "../lib/sequence/post";
import {
  SETUP_SEQUENCE_TESTNET,
  generateSetupContext,
} from "../lib/sequence/setup";
import { question } from "../lib/utils";

task("deploy:mocks", "Deploy DAO Mocks")
  .addFlag("verify", "Verify contracts")
  .addFlag("restart", "Start a new deployment from scratch")
  .addOptionalParam("configFile", "Config file", "../config.js")
  .setAction(
    async (
      {
        verify,
        restart,
        configFile,
      }: { verify: boolean; restart: boolean; configFile: string },
      hre
    ) => {
      let config = require("../" + configFile) as DAOConfig;
      if (restart) await hre.run("compile", { force: true });

      const neokingdom = await NeokingdomDAOHardhat.initialize(hre, {
        verifyContracts: verify,
        verbose: true,
      });

      await neokingdom.run(
        generateDeployContext(config),
        SETUP_MOCK_SEQUENCE,
        "setup-test-sequence",
        {
          restart,
        }
      );
    }
  );

task("deploy:dao", "Deploy DAO")
  .addFlag("verify", "Verify contracts")
  .addFlag("restart", "Start a new deployment from scratch")
  .addOptionalParam("configFile", "Config file", "../config.js")
  .setAction(
    async (
      {
        verify,
        restart,
        configFile,
      }: { verify: boolean; restart: boolean; configFile: string },
      hre
    ) => {
      let config = require("../" + configFile) as DAOConfig;

      if (restart) await hre.run("compile", { force: true });

      const neokingdom = await NeokingdomDAOHardhat.initialize(hre, {
        verifyContracts: verify,
        verbose: true,
      });

      await neokingdom.run(
        generateDeployContext(config),
        DEPLOY_SEQUENCE,
        "deploy",
        {
          restart,
        }
      );
    }
  );

task("setup:dao", "Set up the DAO")
  .addOptionalParam("configFile", "Config file", "../config.js")
  .setAction(async ({ configFile }: { configFile: string }, hre) => {
    let config = require("../" + configFile) as DAOConfig;
    let sequence = SETUP_SEQUENCE;
    const neokingdom = await NeokingdomDAOHardhat.initialize(hre, {
      verbose: true,
    });
    await neokingdom.run(generateSetupContext(config), sequence, "setup");
  });

task("setup:test", "Set up the test data for the DAO")
  .addOptionalParam("configFile", "Config file", "../config.js")
  .setAction(async ({ configFile }: { configFile: string }, hre) => {
    let config = require("../" + configFile) as DAOConfig;
    let sequence = SETUP_SEQUENCE_TESTNET;
    const neokingdom = await NeokingdomDAOHardhat.initialize(hre, {
      verbose: true,
    });
    await neokingdom.run(generateSetupContext(config), sequence, "setup-test");
  });

task("setup:acl", "Set up ACL")
  .addOptionalParam("configFile", "Config file", "../config.js")
  .setAction(async ({ configFile }: { configFile: string }, hre) => {
    let config = require("../" + configFile) as DAOConfig;
    const multisig = config.multisigAddress;
    const { chainId } = hre.network.config;

    console.log(
      `Transferring rights and ProxyAdmin ownership to ${multisig} on ${chainId}.`
    );

    const answer = await question(
      "This action is irreversible. Please type 'GoOoooOOoo' to continue.\n"
    );

    if (answer !== "GoOoooOOoo") {
      process.exit(0);
    }

    let sequence = finalizeACL(hre);

    const neokingdom = await NeokingdomDAOHardhat.initialize(hre, {
      verbose: true,
    });

    await neokingdom.run(generateSetupContext(config), sequence, "setup-acl");
  });
