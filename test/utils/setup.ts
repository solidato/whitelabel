import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Wallet } from "ethers";
import { parseEther } from "ethers/lib/utils";

import { DEPLOY_SEQUENCE, generateDeployContext } from "../../lib";
import { NeokingdomDAOMemory } from "../../lib/environment/memory";
import { Address, DAOConfig } from "../../lib/internal/types";
import { SETUP_MOCK_SEQUENCE } from "../../lib/sequence/deploy";

const config: DAOConfig = {
  testnet: true,
  multisigAddress: "0x0000000000000000000000000000000000000001",
  tokenName: "Test DAO",
  tokenSymbol: "TD",
  governanceTokenName: "Test DAO Governance",
  governanceTokenSymbol: "TDGOV",
  shareCapital: parseEther("10000").toString(),
  shareTokenName: "Test DAO Share",
  shareTokenSymbol: "TDSHARE",
  reserveAddress: "0x0000000000000000000000000000000000000001",
  usdcAddress: "0x0000000000000000000000000000000000000001",
  diaOracleAddress: "0x0000000000000000000000000000000000000001",
  contributors: [],
};

export async function setupDAO(
  deployer: Wallet | SignerWithAddress,
  reserve: Wallet | SignerWithAddress
) {
  const neokingdom = await NeokingdomDAOMemory.initialize({
    deployer,
  });

  await neokingdom.run(
    generateDeployContext(config),
    SETUP_MOCK_SEQUENCE,
    "integration-mock"
  );

  // We need to load the mocks in the config, first we check the contracts are there
  // to please the TypeScript gods

  const partialContracts = await neokingdom.loadContractsPartial();
  if (!partialContracts.diaOracle || !partialContracts.usdc) {
    throw new Error("Cannot load mocks");
  }
  config["diaOracleAddress"] = partialContracts.diaOracle.address as Address;
  config["usdcAddress"] = partialContracts.usdc.address as Address;
  config["reserveAddress"] = reserve.address as Address;

  await neokingdom.run(
    generateDeployContext(config),
    DEPLOY_SEQUENCE,
    "integration"
  );
  return neokingdom;
}
