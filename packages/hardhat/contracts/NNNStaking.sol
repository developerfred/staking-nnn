//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {Staking} from "./Staking.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract NNNStaking is Staking, EIP712, Ownable {
    uint256 public latestPeriod;

    // 0xd1a8Dd23e356B9fAE27dF5DeF9ea025A602EC81e
    address public trustedSigner;

    struct Period {
        string meta;
        uint256 tvl;
        uint256 start;
        uint256 duration;
        uint256 rewardsPercent;
    }

    mapping(uint256 => Period) periods;
    mapping(bytes32 => bool) usedDigest;

    event signerUpdated(address signer);
    event periodCreated(uint256 id);
    event selfStake(
        uint256 periodId,
        address staker,
        uint256 amount,
        bool staked
    );
   
    modifier periodExists(uint256 periodId) {
        require(periodId > 0 && periodId <= latestPeriod, "Period does not exist");
        _;
    }

    modifier canStakePeriod(uint256 periodId) {
        require(periodId > 0 && periodId <= latestPeriod, "Period does not exist");
        require(
            periods[periodId].start + periods[periodId].duration > block.timestamp,
            "Can't stake on this round"
        );
        _;
    }

    constructor(IERC20 _token, address _trustedSigner)
        EIP712("Staking Novem Gold Token (NNN)", "1.0")
    {
        token = _token;
        updateSigner(_trustedSigner);
    }

    function updateSigner(address signer) public onlyOwner {
        trustedSigner = signer;

        emit signerUpdated(signer);
    }

    function createPeriod(
        uint256 start,
        uint256 duration,
        uint256 rewardsPercent,
        string calldata meta
    ) external onlyOwner {
        require(start >= block.timestamp, "new periods should be in the future");

        latestPeriod++;

        uint256 currentPeriod = latestPeriod;

        periods[currentPeriod].start = start;
        periods[currentPeriod].duration = duration;
        periods[currentPeriod].rewardsPercent = rewardsPercent;
        periods[currentPeriod].meta = meta;

        emit periodCreated(currentPeriod);
    }

    // stake
    function stake(uint256 periodId, uint256 amount)
        external
        canStakePeriod(periodId)
    {
        _stake(periodId, amount);

        periods[periodId].tvl += amount;

        emit selfStake(periodId, msg.sender, amount, true);
    }

    // unstake
    function unstake(uint256 periodId, uint256 amount)
        external
    {
        require(
            stakes[periodId][msg.sender] >= amount,
            "Not enough balance to withdraw"
        );

        periods[periodId].tvl -= amount;

        _unstake(periodId, amount);

        emit selfStake(periodId, msg.sender, amount, false);
    }

    // VIEW
    function fetchPeriodMeta(uint256 periodId)
        public
        view
        periodExists(periodId)
        returns (
            uint256 start,
            uint256 duration,
            uint256 tvl,
            uint256 rewardsPercent,
            string memory meta
        )
    {
        return (
            periods[periodId].start,
            periods[periodId].duration,
            periods[periodId].tvl,
            periods[periodId].rewardsPercent,
            periods[periodId].meta
        );
    }

    function isActivePeriod(uint256 periodId)
        public
        view
        returns (bool isActive)
    {
        (uint256 start, uint256 duration, , ,) = fetchPeriodMeta(periodId);
        isActive =
            start < block.timestamp &&
            start + duration > block.timestamp;
    }

    function getUserStakeForPeriod(uint256 periodId, address user)
        public
        view periodExists(periodId)
        returns (uint256)
    {
        return _getUserStakeForPeriod(periodId, user);
    }

    function getStakeId(address staker, address user)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(staker, user));
    }

    function getStakingPeriodRewards(uint256 periodId, address user) 
        public
        view
        periodExists(periodId)
        returns (uint256) 
        {

        } 

}