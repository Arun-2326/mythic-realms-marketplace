import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("GameCard", function () {
  async function deployFixture() {
    const [owner, addr1] = await ethers.getSigners();
    const gameCard = await ethers.deployContract("GameCard");
    return { gameCard, owner, addr1 };
  }

  it("should mint a card with token ID 0 for the first mint", async function () {
    const { gameCard, owner } = await deployFixture();

    await gameCard.mintCard(owner.address, "ipfs://fake-metadata-1");

    expect(await gameCard.ownerOf(0)).to.equal(owner.address);
  });

  it("should assign unique, incrementing token IDs across multiple mints", async function () {
    const { gameCard, owner, addr1 } = await deployFixture();

    await gameCard.mintCard(owner.address, "ipfs://fake-metadata-1");
    await gameCard.mintCard(addr1.address, "ipfs://fake-metadata-2");

    expect(await gameCard.ownerOf(0)).to.equal(owner.address);
    expect(await gameCard.ownerOf(1)).to.equal(addr1.address);
  });

  it("should store and return the correct tokenURI", async function () {
    const { gameCard, owner } = await deployFixture();

    await gameCard.mintCard(owner.address, "ipfs://fake-metadata-1");

    expect(await gameCard.tokenURI(0)).to.equal("ipfs://fake-metadata-1");
  });

  it("should emit a CardMinted event on mint", async function () {
    const { gameCard, owner } = await deployFixture();

    await expect(gameCard.mintCard(owner.address, "ipfs://fake-metadata-1"))
      .to.emit(gameCard, "CardMinted")
      .withArgs(owner.address, 0n, "ipfs://fake-metadata-1");
  });
});