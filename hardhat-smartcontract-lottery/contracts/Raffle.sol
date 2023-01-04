// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// imports...
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

// errors...
error Raffle__NotEnoughFee();
error Raffle__TransferFailed();
error Raffle__NOTOPEN();
error Raffle__UpkeepNotNeeded(
    uint256 currentBalance,
    uint256 playerNumber,
    uint256 raffle_state_in_number
);

/** @title A sample of Raffle Contract
 */
contract Raffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
    /* Types */
    enum RaffleState {
        OPEN,
        CALCULATING
    }

    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordiantor;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_gasLimit;
    uint32 private constant NUM_WORDS = 1;

    address private s_recentWinner;
    RaffleState private s_raffleState;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    /* Events */
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address vrfCoordinatorV2, // done
        uint256 entranceFee, // done
        bytes32 gasLane, // done
        uint64 subscriptionId, // done
        uint32 callbackGasLimit, // done
        uint256 intervall
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordiantor = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_gasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = intervall;
    }

    /* Functions */

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughFee();
        }

        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__NOTOPEN();
        }

        s_players.push(payable(msg.sender));

        emit RaffleEnter(msg.sender);
    }

    /**
     * @dev This is the function that chainlink keeper nodes call...
     * they look for the 'upkeepNeeded' to return true.
     * following shoold be true in order to true:
     * 1. Time interval passed.
     * 2. at least 1 player
     * 3. subscription is funded with LINK
     * 4. Lottery shold be in open state.
     */

    function checkUpkeep(
        bytes memory /*checkData*/
    ) external view override returns (bool upkeepNeeded, bytes memory /* performs data */) {
        bool isOpen = (s_raffleState == RaffleState.OPEN);
        // (block.timestamp - last block timestamp) > interval
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = s_players.length > 0;
        bool hasBalance = address(this).balance > 0;

        upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        /*
         * Request random number
         * Once we get it, do something with it
         * 2 Tx process
         */

        /*                      BELOW GREENED CODE SHOULD BE OPENED WHEN TEST ON LOCAL NETWORKS */
        // (bool upkeepNeeded, ) = checkUpkeep("");
        // if (!upkeepNeeded) {
        //     revert Raffle__UpkeepNotNeeded(
        //         address(this).balance,
        //         s_players.length,
        //         uint256(s_raffleState)
        //     );
        // }

        s_raffleState = RaffleState.CALCULATING;

        uint256 requestId = i_vrfCoordiantor.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_gasLimit,
            NUM_WORDS
        );

        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256 /*requestId*/,
        uint256[] memory randomWords
    ) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;

        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__TransferFailed();
        }

        emit WinnerPicked(s_recentWinner);

        s_players = new address payable[](0);
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
    }

    /* View Functions */
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getRaffleState() public view returns (RaffleState) {
        return s_raffleState;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function getLastTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getSubscriptionId() public view returns (uint64) {
        return i_subscriptionId;
    }

    function getPlayersLength() public view returns (uint256) {
        return s_players.length;
    }

    function getBalanceOfContract() public view returns (uint256) {
        return address(this).balance;
    }
}
