import { HardhatRuntimeEnvironment } from "hardhat/types";

import { IProxyAdmin } from "../../typechain";
import { Sequence } from "../internal/types";
import { ROLES } from "../utils";
import { SetupContext } from "./setup";

async function transferOwnership(
  hre: HardhatRuntimeEnvironment,
  address: string
) {
  const proxy = (await hre.upgrades.admin.getInstance()) as IProxyAdmin;
  return proxy.transferOwnership(address);
}

export function finalizeACL(
  hre: HardhatRuntimeEnvironment
): Sequence<SetupContext> {
  return [
    (c) =>
      c.daoRoles.grantRole(ROLES.DEFAULT_ADMIN_ROLE, c.config.multisigAddress),
    (c) => c.daoRoles.grantRole(ROLES.OPERATOR_ROLE, c.config.multisigAddress),
    (c) =>
      c.daoRoles.grantRole(ROLES.RESOLUTION_ROLE, c.config.multisigAddress),
    (c) => transferOwnership(hre, c.config.multisigAddress),
    (c) => c.daoRoles.revokeRole(ROLES.RESOLUTION_ROLE, c.deployer.address),
    (c) => c.daoRoles.revokeRole(ROLES.OPERATOR_ROLE, c.deployer.address),
    (c) => c.daoRoles.revokeRole(ROLES.DEFAULT_ADMIN_ROLE, c.deployer.address),
  ];
}
