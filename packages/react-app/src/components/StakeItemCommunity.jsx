import React from "react";

// Format User Address
import DisplayAddressEns from "./DisplayAddressEns";
import { formatAmountUnits } from "./StakingModal/utils";
import UnstakeButton from "./UnstakeButton";

const StakeItemCommunity = ({
  icon,
  title,
  roundEnded,
  description,
  amount,
  unstakeUsers,
  buttonText,
  buttonHandler,
  roundData,
  mainnetProvider,
}) => {
  const unstakeHandler = async () => {
    const users = roundData.map(i => i?.to?.address);

    await unstakeUsers(users);
  };

  return (
    <div className="border-b border-divider">
      <div className="flex flex-col items-start pb-4 mx-auto md:items-center md:flex-row">
        <div className="flex items-center justify-start flex-1">
          <div className="inline-flex items-center justify-center w-20 h-20 mr-5 text-indigo-500 bg-indigo-100 rounded-full">
            {icon}
          </div>
          <div className="flex-col text-left">
            <h2 className="mb-0 text-lg font-medium text-gray-900 title-font">{title}</h2>
            <div className="text-base leading-relaxed">{description}</div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center flex-grow text-left md:flex-auto md:text-center md:my-0 my-7">
          <h2 className="mb-0 text-lg font-medium text-gray-900 title-font">{amount} NNN</h2>
          <span className="text-base leading-relaxed">Staked</span>
        </div>
        {roundEnded ? (
          <UnstakeButton amount={amount} handler={unstakeHandler} />
        ) : (
          <button
            onClick={buttonHandler}
            className="flex justify-center w-full py-2 text-lg text-center text-white border-0 rounded-sm md:max-w-button bg-purple-connectPurple focus:outline-none hover:bg-indigo-600"
          >
            <span>{buttonText}</span>
          </button>
        )}
      </div>

      {/* List all users staked on  */}
      <ul className="flex flex-col w-full">
        {roundData &&
          roundData.map(data => (
            <li className="flex flex-grow ml-24">
              <div className="flex flex-1 text-xl">
                <DisplayAddressEns style={{ color: "black" }} address={data.to.address} ensProvider={mainnetProvider} />
              </div>
              <div className="flex flex-1 text-xl">{formatAmountUnits(data.amount)} GTC</div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default StakeItemCommunity;
