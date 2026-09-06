import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("Marketplace", function () {
  async function deployFixture() {
    const [seller, buyer, other] = await ethers.getSigners();

    const gameCard = await ethers.deployContract("GameCard");
    const marketplace = await ethers.deployContract("Marketplace", [
      await gameCard.getAddress(),
    ]);

    // Mint a card to the seller and approve the marketplace to move it
    await gameCard.mintCard(seller.address, "ipfs://fake-metadata-1");
    await gameCard.connect(seller).approve(await marketplace.getAddress(), 0);

    return { gameCard, marketplace, seller, buyer, other };
  }

  it("should let the owner list their card", async function () {
    const { marketplace, seller } = await deployFixture();

    await marketplace.connect(seller).listCard(0, ethers.parseEther("1"));

    const listing = await marketplace.getListing(0);
    expect(listing.seller).to.equal(seller.address);
    expect(listing.price).to.equal(ethers.parseEther("1"));
    expect(listing.active).to.equal(true);
  });

  it("should reject listing at price zero", async function () {
    const { marketplace, seller } = await deployFixture();

    await expect(
      marketplace.connect(seller).listCard(0, 0)
    ).to.be.revertedWith("Price must be greater than zero");
  });

  it("should reject listing by someone who doesn't own the card", async function () {
    const { marketplace, other } = await deployFixture();

    await expect(
      marketplace.connect(other).listCard(0, ethers.parseEther("1"))
    ).to.be.revertedWith("You do not own this card");
  });

  it("should let the seller cancel their own listing", async function () {
    const { marketplace, seller } = await deployFixture();

    await marketplace.connect(seller).listCard(0, ethers.parseEther("1"));
    await marketplace.connect(seller).cancelListing(0);

    const listing = await marketplace.getListing(0);
    expect(listing.active).to.equal(false);
  });

  it("should reject cancellation by someone who isn't the seller", async function () {
    const { marketplace, seller, other } = await deployFixture();

    await marketplace.connect(seller).listCard(0, ethers.parseEther("1"));

    await expect(
      marketplace.connect(other).cancelListing(0)
    ).to.be.revertedWith("You are not the seller");
  });

  it("should let a buyer purchase a listed card and transfer ownership", async function () {
    const { gameCard, marketplace, seller, buyer } = await deployFixture();
    const price = ethers.parseEther("1");

    await marketplace.connect(seller).listCard(0, price);

    await marketplace.connect(buyer).buyCard(0, { value: price });

    expect(await gameCard.ownerOf(0)).to.equal(buyer.address);

    const listing = await marketplace.getListing(0);
    expect(listing.active).to.equal(false);
  });

  it("should pay the seller the correct amount on a sale", async function () {
    const { marketplace, seller, buyer } = await deployFixture();
    const price = ethers.parseEther("1");

    await marketplace.connect(seller).listCard(0, price);

    const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
    await marketplace.connect(buyer).buyCard(0, { value: price });
    const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);

    expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(price);
  });

  it("should reject buying with the wrong ETH amount", async function () {
    const { marketplace, seller, buyer } = await deployFixture();

    await marketplace.connect(seller).listCard(0, ethers.parseEther("1"));

    await expect(
      marketplace.connect(buyer).buyCard(0, { value: ethers.parseEther("0.5") })
    ).to.be.revertedWith("Incorrect ETH amount sent");
  });

  it("should reject a seller buying their own listing", async function () {
    const { marketplace, seller } = await deployFixture();

    await marketplace.connect(seller).listCard(0, ethers.parseEther("1"));

    await expect(
      marketplace.connect(seller).buyCard(0, { value: ethers.parseEther("1") })
    ).to.be.revertedWith("Cannot buy your own listing");
  });

  it("should reject buying a listing that was already cancelled", async function () {
    const { marketplace, seller, buyer } = await deployFixture();

    await marketplace.connect(seller).listCard(0, ethers.parseEther("1"));
    await marketplace.connect(seller).cancelListing(0);

    await expect(
      marketplace.connect(buyer).buyCard(0, { value: ethers.parseEther("1") })
    ).to.be.revertedWith("No active listing");
  });

  it("should reject buying a listing that was already sold", async function () {
    const { marketplace, seller, buyer, other } = await deployFixture();

    await marketplace.connect(seller).listCard(0, ethers.parseEther("1"));
    await marketplace.connect(buyer).buyCard(0, { value: ethers.parseEther("1") });

    await expect(
      marketplace.connect(other).buyCard(0, { value: ethers.parseEther("1") })
    ).to.be.revertedWith("No active listing");
  });
});