import React from "react";
import { ethers } from "ethers";
import { useState } from "react";
import StakeItem from "./StakeItem";
import StakeItemCommunity from "./StakeItemCommunity";
import StakingModal from "./StakingModal/StakingModal";
import { UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";

import { getSelfStakeAmount, getCommunityStakeAmount } from "./StakingModal/utils";

const zero = ethers.BigNumber.from("0");

export const STARTING_GRANTS_ROUND = 14;

const Rounds = ({
  tx,
  tokenSymbol,
  address,
  readContracts,
  writeContracts,
  migrate,
  round,
  latestRound,
  roundEnded,
  mainnetProvider,
  userSigner,
  targetNetwork,
  roundData,
}) => {
  // Set to visibility of Staking Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stakingType, setStakingType] = useState("self");

  const unstake = async amount => {
    tx(writeContracts.NNNStaking.unstake(round + "", ethers.utils.parseUnits(amount)));
  };

  // const unstakeUsers = async users => {
  //   tx(writeContracts.NNNStaking.unstakeUsers(round + "", users));
  // };

  return (
    <>
      <div className="text-gray-600 body-font">
        <StakeItem
          icon={<UserOutlined style={{ fontSize: "25px" }} />}
          title="NNN Staking 1 year"
          roundEnded={roundEnded}
          unstake={unstake}
          description="NNN Staking 1 year"
          amount={getSelfStakeAmount(roundData)}
          buttonText={getSelfStakeAmount(roundData) ? "Modify Stake" : "Stake"}
          buttonHandler={() => {
            setStakingType("self");
            setIsModalVisible(true);
          }}
        />

        <StakeItem
          icon={<UserOutlined style={{ fontSize: "25px" }} />}
          title="NNN Staking 2 year"
          roundEnded={roundEnded}
          unstake={unstake}
          description="NNN Staking 2 year"
          amount={getSelfStakeAmount(roundData)}
          buttonText={getSelfStakeAmount(roundData) ? "Modify Stake" : "Stake"}
          buttonHandler={() => {
            setStakingType("self");
            setIsModalVisible(true);
          }}
        />

        <StakeItem
          icon={<UserOutlined style={{ fontSize: "25px" }} />}
          title="NNN Staking 5 year"
          roundEnded={roundEnded}
          unstake={unstake}
          description="NNN Staking 5 year"
          amount={getSelfStakeAmount(roundData)}
          buttonText={getSelfStakeAmount(roundData) ? "Modify Stake" : "Stake"}
          buttonHandler={() => {
            setStakingType("self");
            setIsModalVisible(true);
          }}
        />
      </div>

      <StakingModal
        roundData={roundData}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        stakingType={stakingType}
        readContracts={readContracts}
        writeContracts={writeContracts}
        tx={tx}
        address={address}
        userSigner={userSigner}
        round={round}
        targetNetwork={targetNetwork}
        mainnetProvider={mainnetProvider}
      />
    </>
  );
};

export default Rounds;
