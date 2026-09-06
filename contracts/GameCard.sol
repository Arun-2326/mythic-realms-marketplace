// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameCard is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    event CardMinted(address indexed owner, uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("MythicRealms", "MYTHIC") Ownable(msg.sender) {}

    function mintCard(address to, string memory tokenURI) public returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit CardMinted(to, tokenId, tokenURI);
        return tokenId;
    }
}