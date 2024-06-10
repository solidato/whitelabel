/**
 * @type{import('./lib/internal/types').DAOConfig}
 */
const config = {
  multisigAddress: "0xc765232D4C259CC3d38aaeDa0BeB12A6C608054f",
  tokenName: "Solidato",
  tokenSymbol: "SOLID",
  shareCapital: "16080000000000000000000",
  governanceTokenName: "Solidato Governance",
  governanceTokenSymbol: "SOLIDGOV",
  shareTokenName: "Solidato Share",
  shareTokenSymbol: "SOLIDSHARE",
  reserveAddress: "0xc765232D4C259CC3d38aaeDa0BeB12A6C608054f",
  usdcAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  diaOracleAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  contributors: [
    {
      address: "0x6B7bfDeB2C5282f284111738987Ccf54291bd3DA", // nicola
      status: "board",
      balance: "0",
      vestingBalance: "0",
      shareBalance: "2000000000000000000000",
    },
    {
      address: "0xace13f04231222a585573312ccf811e9e61ed958", // marko
      status: "board",
      balance: "0",
      vestingBalance: "0",
      shareBalance: "2000000000000000000000",
    },
    {
      address: "0x62817523F3B94182B9DF911a8071764F998f11a4", // alberto
      status: "board",
      balance: "0",
      vestingBalance: "0",
      shareBalance: "2000000000000000000000",
    },
    {
      address: "0xbdED7C8A2eFA4Cf2Ee6C953E6447A246F3aC4e12", // stefano
      status: "board",
      balance: "0",
      vestingBalance: "0",
      shareBalance: "2000000000000000000000",
    },
    {
      address: "0xa64d568f331f2774d5cff492f2299505abc0186a", // ragnar
      status: "board",
      balance: "0",
      vestingBalance: "0",
      shareBalance: "2000000000000000000000",
    },
    {
      address: "0x8e2e09eb2a0a8e6e1d8de3e5fb09ec1e05b0cdbf", // gian
      status: "board",
      balance: "0",
      vestingBalance: "0",
      shareBalance: "2000000000000000000000",
    },
    {
      address: "0xda817b0e5dd79303239876c64ff6d2047077ff6c", // solidato
      status: "investor",
      balance: "0",
      vestingBalance: "0",
      shareBalance: "79000000000000000000",
    },
    {
      address: "0x4706ed7a10064801f260bbf94743f241fcef815e", // neokingdom
      status: "investor",
      balance: "845",
      vestingBalance: "0",
      shareBalance: "1000000000000000000",
    },
    {
      address: "0x4b2625de2d7236b18f728d8c56ae9d9fce910f9f", // merike
      status: "contributor",
      balance: "0",
      vestingBalance: "0",
      shareBalance: "2000000000000000000000",
    },
  ],
};

module.exports = config;
