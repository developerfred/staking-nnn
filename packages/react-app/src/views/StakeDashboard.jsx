import React, { useEffect, useState, useContext } from "react";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import { Select } from "antd";
import { Rounds, Navbar } from "../components";
import { STARTING_GRANTS_ROUND } from "../components/Rounds";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { gql, useQuery } from "@apollo/client";
import { UsergroupAddOutlined, LockOutlined } from "@ant-design/icons";

import { getAmountStakedOnMe } from "../components/StakingModal/utils";

import { Web3Context } from "../helpers/Web3Context";

// --- sdk import
// import { PassportReader } from "@gitcoinco/passport-sdk-reader";

const { Option } = Select;

const zero = ethers.BigNumber.from("0");
// Update Passport on address change
// const reader = new PassportReader();

function StakeDashboard({
  tx,
  readContracts,
  address,
  writeContracts,
  mainnetProvider,
  networkOptions,
  selectedNetwork,
  setSelectedNetwork,
  yourLocalBalance,
  USE_NETWORK_SELECTOR,
  localProvider,
  targetNetwork,
  logoutOfWeb3Modal,
  selectedChainId,
  localChainId,
  NETWORKCHECK,
  passport,
  userSigner,
  price,
  web3Modal,
  loadWeb3Modal,
  blockExplorer,
}) {
  const { roundInView, setRoundInView, loggedIn, setLoggedIn } = useContext(Web3Context);
  const navigate = useNavigate();
  // Route user to dashboard when wallet is connected
  useEffect(() => {
    if (!web3Modal?.cachedProvider) {
      navigate("/");
    }
  }, [web3Modal?.cachedProvider]);

  // Logout user if they do not have a passport
  // Route user to dashboard when wallet is connected
  // useEffect(() => {
  //   console.log("wallet changed");
  //   async function getPassport() {
  //     if (userSigner) {
  //       const newAddress = await userSigner.getAddress();
  //       const newPassport = await reader.getPassport(newAddress);
  //       const hasPassport = newPassport && newPassport.expiryDate && newPassport.issuanceDate;
  //       if (!hasPassport) {
  //         navigate("/");
  //         setLoggedIn(false);
  //       }
  //     }
  //   }
  //   getPassport();
  // }, [address]);

  const [start, duration, tvl] = useContractReader(readContracts, "NNNStaking", "fetchRoundMeta", [roundInView]) || [];

  const tokenBalance = ethers.utils.formatUnits(
    useContractReader(readContracts, "Token", "balanceOf", [address]) || zero,
  );
  const tokenSymbol = useContractReader(readContracts, "Token", "symbol");
  const latestRound = (useContractReader(readContracts, "NNNStaking", "latestRound", []) || zero).toNumber();

  const rounds = [...Array(latestRound).keys()].map(i => i + 1).reverse();

  // const mintToken = async () => {
  //   tx(writeContracts.Token.mintAmount(ethers.utils.parseUnits("1000")));
  // };

  // const migrate = async id => {
  //   tx(writeContracts.NNNStaking.migrateStake(id + ""));
  // };

  // Populate Round Data
  const query = gql(`
  query User($address: String!, $round: BigInt!) {
    user(id: $address) {
      xstakeAggregates (where: { round: $round }) {
        id
        total
      },
      stakes(where: { round: $round }) {
        stake
        round {
          id
        }
      },
      xstakeTo(where: { round: $round }) {
        amount,
        to {
          address
        }
      }
    }
  }
`);

  const { loading, data, error } = useQuery(query, {
    pollInterval: 2500,
    variables: {
      address: address.toLowerCase(),
      round: roundInView,
    },
  });

  const roundEndTimestamp = moment.unix((start || zero).add(duration || zero).toString());
  const roundEnded = moment().unix() >= roundEndTimestamp.unix();

  return (
    <>
      <Navbar
        readContracts={readContracts}
        networkOptions={networkOptions}
        selectedNetwork={selectedNetwork}
        setSelectedNetwork={setSelectedNetwork}
        yourLocalBalance={yourLocalBalance}
        USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
        localProvider={localProvider}
        address={address}
        targetNetwork={targetNetwork}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        selectedChainId={selectedChainId}
        localChainId={localChainId}
        NETWORKCHECK={NETWORKCHECK}
        passport={passport}
        userSigner={userSigner}
        mainnetProvider={mainnetProvider}
        price={price}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        blockExplorer={blockExplorer}
      />

      {/* Grants Round Header */}
      <main className="container flex flex-col flex-1 px-8 pb-10 md:mx-auto">
        <div className="mt-8">
          <p className="mb-0 text-3xl text-left">
            NNN Staking Periods 
            {/* {roundInView ? STARTING_GRANTS_ROUND + roundInView : "Not Found"}{" "} */}
            {/*{round} of {latestRound}*/}
          </p>
          {/* {roundInView ? (
            <p className="mb-4 text-base text-left">
              {moment.unix((start || zero).toString()).format("MMMM Do YYYY (h:mm:ss a)")} {" - "}
              {roundEndTimestamp.format("MMMM Do YYYY (h:mm:ss a)")}
            </p>
          ) : (
            <></>
          )} */}
        </div>
        <div className="flex flex-col flex-1 md:flex-row">
          <section className="w-full mb-2 mr-8 border-t">
            <div className="w-full py-2 mt-6">
              <div className="w-full text-gray-600 body-font">
                {roundInView && (
                  <Rounds
                    tx={tx}
                    key={roundInView}
                    round={roundInView}
                    address={address}
                    // migrate={migrate}
                    roundEnded={roundEnded}
                    latestRound={latestRound}
                    tokenSymbol={tokenSymbol}
                    readContracts={readContracts}
                    writeContracts={writeContracts}
                    mainnetProvider={mainnetProvider}
                    userSigner={userSigner}
                    targetNetwork={targetNetwork}
                    roundData={data}
                  />
                )}
              </div>
            </div>
          </section>

          <aside className="w-full md:max-w-aside">
            <div className="px-4 py-6 border rounded-lg border-asideBorder bg-asideBG">
              <div className="flex flex-row items-center">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-10 h-10 text-indigo-500 bg-indigo-100 rounded-full">
                  <UsergroupAddOutlined style={{ fontSize: "25px" }} />
                </div>
                <h2 className="mb-0 ml-4 text-left text-gray-900 text-md">
                  {getAmountStakedOnMe(data)
                    ? "staking instructions here !"
                    : "staking instructions here "}
                </h2>
              </div>

              <div className="flex-grow mt-4">
                {getAmountStakedOnMe(data) ? (
                  <div className="flex flex-col">
                    <p className="text-base leading-relaxed text-left">
                      Staking Instructions here
                    </p>
                    <p className="text-xl text-left text-black">{getAmountStakedOnMe(data)} NNN</p>
                  </div>
                ) : (
                  <p className="text-base leading-relaxed text-left">
                   staking instructions here
                  </p>
                )}

                <div className="mt-2 border-t border-divider">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://passport.gitcoin.co/"
                    className="inline-flex items-center mt-3 text-indigo-500"
                  >
                    More Info
                  </a>
                </div>
              </div>
            </div>
            {/* <div className="px-4 py-6 mt-6 border rounded-lg border-asideBorder bg-asideBG">
              <div className="flex flex-row items-center">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-10 h-10 text-indigo-500 bg-indigo-100 rounded-full">
                  <LockOutlined style={{ fontSize: "25px" }} />
                </div>
                <h2 className="mb-0 ml-4 text-left text-gray-900 text-md">
                  Stakings are locked through the duration of the Round.
                </h2>
              </div>

              <div className="flex-grow mt-4">
                <p className="text-base leading-relaxed text-left">
                  In order to prevent users from sybil attacking through staking their GTC and moving it across multiple
                  passports during a Grants Round, all GTC staked is locked through the duration of Grants Round 15.
                </p>
                <div className="mt-3 border-t border-divider">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://gitcoin.notion.site/About-Staking-on-Grants-Round-15-768f88d430ff4335ba23b17876b6e981"
                    className="inline-flex items-center mt-3 text-indigo-500"
                  >
                    More Info
                  </a>
                </div>
              </div>
            </div> */}
          </aside>
        </div>
      </main>
    </>
  );
}

export default StakeDashboard;
