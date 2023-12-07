/**
 * @type{import('./lib/internal/types').DAOConfig}
 */
const config = {
  multisigAddress: "0x...",
  tokenName: "Example DAO",
  tokenSymbol: "ED",
  shareCapital: "10000000000000000000000",
  governanceTokenName: "Example DAO Governance",
  governanceTokenSymbol: "EDGOV",
  shareTokenName: "Example DAO Share",
  shareTokenSymbol: "EDSHARE",
  reserveAddress: "0x...",
  usdcAddress: "0x15c3eb3b621d1bff62cba1c9536b7c1ae9149b57",
  diaOracleAddress: "0x3141274e597116f0bfcf07aeafa81b6b39c94325",
  contributors: [
    {
      address: "0x...",
      status: "board",
      balance: "395279331099999999500000",
      vestingBalance: "343000000000000000000000",
      shareBalance: "1000000000000000000",
    },
    {
      address: "0x...",
      status: "contributor",
      balance: "1893620148000000000000",
      vestingBalance: "56000000000000000000000",
      shareBalance: "1000000000000000000",
    },
  ],
};

module.exports = config;
