// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


error RandomIpfsNft_RangeOutOfBounds();
error RandomIpfsNft_PoorGuy();
error TransferFailed();

contract RandomIpfsNft is VRFConsumerBaseV2, ERC721URIStorage, Ownable {
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    mapping(uint256 => address) public s_requestIdToSender;

    uint256 public s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE = 100;
    string[] internal s_dogTokenUris;

    uint256 private immutable i_fee;

    enum Breed {
        PUG,
        SHIBA_INU,
        ST_BERNARD
    }

    event NftRequested(uint256 indexed requestId, address indexed sender);
    event NftMinted(Breed indexed dogBreed, address indexed minter);

    constructor(
        address _vrfAddress,
        uint64 _subId,
        bytes32 _gasLane,
        uint32 _callbackGasLimit,
        string[3] memory _dogTokenUris,
        uint256 _fee
    ) VRFConsumerBaseV2(_vrfAddress) ERC721("Random IPFS NFT", "RIN") {
        i_vrfCoordinator = VRFCoordinatorV2Interface(_vrfAddress);
        i_subId = _subId;
        i_gasLane = _gasLane;
        i_callbackGasLimit = _callbackGasLimit;
        s_dogTokenUris = _dogTokenUris;
        i_fee = _fee;
    }

    function requestNft() public payable returns (uint256 requestID) {
        if (msg.value < i_fee) {
            revert RandomIpfsNft_PoorGuy();
        }
        requestID = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToSender[requestID] = msg.sender;
        emit NftRequested(requestID, msg.sender);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address dogOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;

        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;
        /** 0-99
         *  0-10 => Pug
         *  10-60 => ShibaInu
         *  60-99 => St.Bernard
         */
        Breed dogBreed = getBreedFromModdedRng(moddedRng);
        _safeMint(dogOwner, newTokenId);
        _setTokenURI(newTokenId, s_dogTokenUris[uint256(dogBreed)]);
        emit NftMinted(dogBreed, dogOwner);
    }

    function getBreedFromModdedRng(
        uint256 moddedRng
    ) public pure returns (Breed choosenBreed) {
        uint256 cumulativeSum = 0;
        uint256[3] memory chanceArray = getChanceArray();
        for (uint256 i = 0; i < chanceArray.length; i++) {
            if (
                moddedRng >= cumulativeSum &&
                moddedRng < cumulativeSum + chanceArray[i]
            ) {
                choosenBreed = Breed(i);
            }
            cumulativeSum += chanceArray[i];
        }

        // revert RandomIpfsNft_RangeOutOfBounds();
    }

    function getChanceArray() public pure returns (uint256[3] memory) {
        return [10, 30, MAX_CHANCE_VALUE];
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert TransferFailed();
        }
    }

    function getMintFee() public view returns (uint256 mintFee) {
        mintFee = i_fee;
    }

    function getDogTokenUris(
        uint256 index
    ) public view returns (string memory) {
        return s_dogTokenUris[index];
    }

    function getTokenCounter() public view returns (uint256 tokenCount) {
        tokenCount = s_tokenCounter;
    }
}
