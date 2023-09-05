//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 private _totalMinted;
    uint256 private _maxMintingLimit;
    uint256 private _mintingStartTime;
    uint256 private _mintingEndTime;
    mapping(address => string) private _receipts;

    constructor(
        uint256 maxMintingLimit,
        uint256 mintingStartTime,
        uint256 mintingEndTime
    ) ERC721("MyNFT", "NFT") {
        require(mintingStartTime < mintingEndTime, "mintingStartTime must be less than mintingEndTime");
        _totalMinted = 0;
        _maxMintingLimit = maxMintingLimit;
        _mintingStartTime = mintingStartTime;
        _mintingEndTime = mintingEndTime;
    }

    function mintNFT(address recipient, string memory tokenURI, string memory receipt)
        public onlyOwner
        returns (uint256)
    {
        require(bytes(receipt).length > 0, "Rceipt is required.");
        require(bytes(_receipts[recipient]).length == 0, "Receipt exists already");
        require(block.timestamp >= _mintingStartTime && block.timestamp <= _mintingEndTime, "Minting is not allowed at this time.");
        require(_totalMinted < _maxMintingLimit, "Maximum minting limit reached");

        _receipts[recipient] = receipt;

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _totalMinted++;

        return newItemId;
    }

    function count() public view returns (uint256) {
        return _tokenIds.current();
    }
}
