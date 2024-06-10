import { task } from "hardhat/config";

import { NeokingdomDAOHardhat } from "../lib";

task("admin:transfer", "Transfer ProxyAdmin ownership")
  .addPositionalParam("address", "Requested address")
  .setAction(async ({ address }: { address: string }, hre) => {
    const neokingdom = await NeokingdomDAOHardhat.initialize(hre);
    const contracts = await neokingdom.loadContracts();

    const tx = await contracts.proxyAdmin.transferOwnership(address);
    await tx.wait(1);

    console.log("Done");
  });

task("admin:exchange:set", "Set market exchange pair")
  .addParam("oracle", "Oracle Address")
  .addParam("usdc", "USDC Address")
  .setAction(
    async ({ oracle, usdc }: { oracle: string; usdc: string }, hre) => {
      const neokingdom = await NeokingdomDAOHardhat.initialize(hre);
      const contracts = await neokingdom.loadContracts();

      const tx = await contracts.internalMarket.setExchangePair(usdc, oracle);
      await tx.wait(1);

      console.log("Done");
    }
  );

task("disappear:send", "Sends a transaction with text data")
  .addParam("to", "The address to send the transaction to")
  .addParam("text", "The text to include in the data field")
  .setAction(async (taskArgs, hre) => {
    const { to, text } = taskArgs;
    const accounts = await hre.ethers.getSigners();
    const sender = accounts[0];

    const tx = {
      to: to,
      value: hre.ethers.utils.parseEther("0.0000042"), // sending a small amount of ether
      data: hre.ethers.utils.formatBytes32String(text), // convert text to bytes32
    };

    const txResponse = await sender.sendTransaction(tx);
    console.log(`Transaction sent! TX hash: ${txResponse.hash}`);
  });
