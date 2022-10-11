import React from "react";
import UnstakeButton from "./UnstakeButton";

const StakeItem = ({ icon, roundEnded, unstake, title, description, amount, buttonText, buttonHandler }) => {
  return (
    <div className="flex flex-col items-start pb-10 mx-auto mb-10 border-b md:items-center border-divider md:flex-row">
      <div className="flex items-center justify-start flex-1">
        <div className="inline-flex items-center justify-center w-20 h-20 mr-5 text-indigo-500 bg-indigo-100 rounded-full">
          {icon}
        </div>
        <div className="flex-col text-left">
          <h2 className="mb-0 text-lg text-gray-900">{title}</h2>
          <div className="text-base leading-relaxed">{description}</div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center flex-grow text-left md:flex-auto md:text-center md:my-0 my-7">
        <h2 className="mb-0 text-lg font-medium text-gray-900 title-font">{amount} NNN</h2>
        <span className="text-base leading-relaxed">Staked</span>
      </div>
      {roundEnded ? (
        <UnstakeButton amount={amount} handler={() => unstake(amount)} />
      ) : (
        <button
          onClick={buttonHandler}
          className="flex justify-center w-full py-2 text-lg text-center text-white border-0 rounded-sm md:max-w-button bg-purple-connectPurple focus:outline-none hover:bg-indigo-600"
        >
          <span>{buttonText}</span>
        </button>
      )}
    </div>
  );
};

export default StakeItem;
