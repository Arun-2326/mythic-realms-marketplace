import GameCardABI from "../abi/GameCard.json";
import MarketplaceABI from "../abi/Marketplace.json";

export const GAME_CARD_ADDRESS = "0x45Bd4242959bE0d668Fbd39cE341E310307eB021" as const;
export const MARKETPLACE_ADDRESS = "0xB948dBa49088e05C68523d749d44D6DE97DfEE4c" as const;

export const gameCardAbi = GameCardABI.abi;
export const marketplaceAbi = MarketplaceABI.abi;