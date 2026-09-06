import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MythicRealmsModule", (m) => {
  const gameCard = m.contract("GameCard");
  const marketplace = m.contract("Marketplace", [gameCard]);

  return { gameCard, marketplace };
});