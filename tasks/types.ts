import { task } from "hardhat/config";

import { NeokingdomDAOHardhat } from "../lib";

task("types", "Add test resolution types").setAction(async ({}, hre) => {
  const neokingdom = await NeokingdomDAOHardhat.initialize(hre);
  const contracts = await neokingdom.loadContracts();

  console.log("Adding resolution types");
  const tx = await contracts.resolutionManager.addResolutionType(
    "confirmation2",
    100,
    0,
    3600 * 24 * 4,
    false
  );

  console.log("  Submitted tx", tx.hash);
  const receipt = await tx.wait();
  console.log("  Transaction included in block", receipt.blockNumber);
});

task("types:get", "Add test resolution types").setAction(async ({}, hre) => {
  const neokingdom = await NeokingdomDAOHardhat.initialize(hre);
  const contracts = await neokingdom.loadContracts();

  console.log("Resolution types");
  console.log(await contracts.resolutionManager.resolutionTypes(8));
  console.log(await contracts.resolutionManager.resolutionTypes(9));
});
