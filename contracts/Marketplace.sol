// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    IERC721 public immutable cardContract;

    // tokenId => Listing
    mapping(uint256 => Listing) public listings;

    event CardListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event CardSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event ListingCancelled(uint256 indexed tokenId, address indexed seller);

    constructor(address _cardContract) {
        cardContract = IERC721(_cardContract);
    }

    function listCard(uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be greater than zero");
        require(cardContract.ownerOf(tokenId) == msg.sender, "You do not own this card");
        require(
            cardContract.getApproved(tokenId) == address(this) ||
            cardContract.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved to transfer this card"
        );

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true
        });

        emit CardListed(tokenId, msg.sender, price);
    }

    function cancelListing(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];
        require(listing.active, "No active listing");
        require(listing.seller == msg.sender, "You are not the seller");

        delete listings[tokenId];

        emit ListingCancelled(tokenId, msg.sender);
    }

    function buyCard(uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.active, "No active listing");
        require(msg.value == listing.price, "Incorrect ETH amount sent");
        require(msg.sender != listing.seller, "Cannot buy your own listing");

        // Effects: clear the listing BEFORE any external calls
        delete listings[tokenId];

        // Interactions: transfer NFT, then send payment
        cardContract.safeTransferFrom(listing.seller, msg.sender, tokenId);

        (bool success, ) = payable(listing.seller).call{value: msg.value}("");
        require(success, "Payment to seller failed");

        emit CardSold(tokenId, listing.seller, msg.sender, listing.price);
    }

    function getListing(uint256 tokenId) external view returns (Listing memory) {
        return listings[tokenId];
    }
}