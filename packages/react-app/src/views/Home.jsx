import React, { useEffect, useState, useContext } from "react";
import { Modal } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { Navbar, Account, AccountHomePage } from "../components";
import { useNavigate } from "react-router-dom";

// --- sdk import
import { PassportReader } from "@gitcoinco/passport-sdk-reader";

import { Web3Context } from "../helpers/Web3Context";

function Home({
  tx,
  readContracts,
  writeContracts,
  mainnetProvider,
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
  networkOptions,
}) {
  const navigate = useNavigate();
  const { address, loggedIn, setLoggedIn } = useContext(Web3Context);

  // Update Passport on address change
  const reader = new PassportReader();

  // Route user to dashboard when wallet is connected
  useEffect(() => {
    async function getPassport() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        const newPassport = await reader.getPassport(newAddress);
        const hasPassport = newPassport && newPassport.expiryDate && newPassport.issuanceDate;
        if (web3Modal?.cachedProvider && hasPassport) {
          navigate("/StakeDashboard");
          setLoggedIn(true);
        } else if (!loggedIn) {
          showModal();
        }
      }
    }
    getPassport();
  }, [userSigner, web3Modal?.cachedProvider]);

  // useEffect(() => {
  //   console.log("no passport check ", passport, web3Modal?.cachedProvider);
  //   if (!passport.expiryDate && !passport.issuanceDate && web3Modal?.cachedProvider) {
  //     showModal();
  //   }
  // }, [userSigner]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    window.location.replace("https://passport.gitcoin.co/");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="text-gray-100 bg-no-repeat bg-cover min-h-max min-h-default bg-landingPageBackground md:bg-center">
      {/* <Modal
        title="Create a Passport to Get Started"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={`Create a Passport`}
        footer={[
          <button
            key="submit"
            className="px-10 py-2 text-white rounded-sm rounded bg-purple-connectPurple"
            onClick={handleOk}
          >
            <ExportOutlined />
            Create Passport
          </button>,
        ]}
      >
        <p>
          Looks like you don’t have a Passport yet! To get started on Identity Staking, create a passport on Gitcoin
          Passport
        </p>
      </Modal> */}
      <Navbar
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
      <div className="container px-5 py-2 mx-auto">
        <div className="flex flex-wrap mx-auto">
          <div className="w-full pb-6 mt-0 text-white md:ml-4 sm:mt-40 sm:w-1/2 md:mt-40 md:w-1/2 md:pt-6">
            <div className="leading-relaxed">
              <p className="text-2xl text-left text-black sm:text-xl md:text-xl">NNN Staking</p>
              <p className="text-2xl text-left text-black sm:text-3xl md:text-3xl">
                Staking NNN Token
              </p>
            </div>
            <div className="mt-0 text-lg text-left text-gray-900 sm:text-xl md:mt-10 md:pr-20 md:text-xl">
            Staking rewards, x % of NNN value in NVM tokens:

            1 year => 5%
            2 years => every year 6%
            5 years => every year 8%
            </div>
            <div className="w-full mt-4 sm:mt-10 sm:w-1/2 md:mt-10 md:block md:w-1/2">
              <AccountHomePage
                passport={passport}
                web3Modal={web3Modal}
                loadWeb3Modal={loadWeb3Modal}
                logoutOfWeb3Modal={logoutOfWeb3Modal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
