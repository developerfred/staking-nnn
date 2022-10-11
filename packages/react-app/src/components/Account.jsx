import React, { useContext, useState } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { Menu, Dropdown, Space, Drawer } from "antd";
import { DownOutlined, LogoutOutlined } from "@ant-design/icons";

import Address from "./Address";
import AddressDropDown from "./AddressDropDown";
import Balance from "./Balance";
import Wallet from "./Wallet";
import TokenBalance from "./TokenBalance";
import NetworkDisplay from "./NetworkDisplay";

import { Web3Context } from "../helpers/Web3Context";

export default function Account({
  passport,
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
  isContract,
  readContracts,
  networkDisplay,
  NETWORKCHECK,
  localChainId,
  selectedChainId,
  targetNetwork,
  USE_NETWORK_SELECTOR,
  selectedNetwork,
  setSelectedNetwork,
  networkOptions,
}) {
  const { currentNetwork, loggedIn } = useContext(Web3Context);
  const { currentTheme } = useThemeSwitcher();
  const [openNavDrawer, setOpenNavDrawer] = useState(false);
  let accountButtonInfo;
  if (web3Modal?.cachedProvider && passport.expiryDate && passport.issuanceDate) {
    accountButtonInfo = { name: "Logout", action: logoutOfWeb3Modal };
  } else {
    accountButtonInfo = { name: "Connect Wallet", action: loadWeb3Modal };
  }

  const menu = (
    <Menu>
      <Menu.ItemGroup key="2">
        <a key="logoutbutton" size="medium" style={{ color: "red" }} onClick={logoutOfWeb3Modal}>
          <LogoutOutlined style={{ color: "red" }} />
          {` Logout`}
        </a>
      </Menu.ItemGroup>
    </Menu>
  );

  const addressComponent = (
    <Space>
      <AddressDropDown address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} blockieSize={10} />
      <div className="inline-flex">
        <DownOutlined className="inline-flex" />
      </div>
    </Space>
  );

  return (
    <div className="flex">
      {!web3Modal?.cachedProvider && (
        <button className="px-10 py-4 text-white rounded-sm bg-purple-connectPurple" onClick={accountButtonInfo.action}>
          {accountButtonInfo.name}
        </button>
      )}
      {web3Modal?.cachedProvider && (
        <>
          <div className="flex items-center justify-center text-base">
            <>
              <span className="mr-5 hover:text-gray-900">
                <TokenBalance
                  contracts={readContracts}
                  img={"./novem-gold-token.png"}
                  name={"NNN"}
                  address={address}
                  dollarMultiplier={null}
                />
              </span>
              <div className="hidden md:inline-flex">
                {/* <a
                  className="flex flex-row mr-5 hover:text-gray-900"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://passport.gitcoin.co/"
                >
                  <img src={"./passportLogo.svg"} alt={"Passport Navbar Badge"} className="h-6 mr-2" /> Gitcoin Passport{" "}
                  <img
                    src={passport?.expiryDate && passport?.issuanceDate ? "./greenEllipse.svg" : "./redEllipse.svg"}
                    alt="passport status dot"
                    className="ml-2"
                  />
                </a> */}
                <span className="flex flex-row mr-5 capitalize hover:text-gray-900">
                  {" "}
                  <img className="h-5 mr-2" src={"./ethDiamondBlackIcon.svg"} alt="eth icon" />{" "}
                  <span className="text-black">{currentNetwork?.name}</span>
                </span>
              </div>
              <div>
                {
                  <NetworkDisplay
                    NETWORKCHECK={NETWORKCHECK}
                    localChainId={localChainId}
                    selectedChainId={selectedChainId}
                    targetNetwork={targetNetwork}
                    USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
                  />
                }
              </div>
            </>
            <div className="inline-flex md:hidden">
              <div
                onClick={e => {
                  e.preventDefault();

                  console.log("Open sidebar");

                  setOpenNavDrawer(true);
                }}
              >
                {addressComponent}
              </div>
              <Drawer
                title={null}
                placement="right"
                width="70%"
                closable={false}
                onClose={() => setOpenNavDrawer(false)}
                visible={openNavDrawer}
              >
                <div className="flex flex-col items-center justify-center flex-1 mt-8">
                  <div className="mb-10">
                    <AddressDropDown
                      address={address}
                      ensProvider={mainnetProvider}
                      blockExplorer={blockExplorer}
                      blockieSize={10}
                    />
                  </div>
                  <div className="mb-10">
                    <a
                      className="flex flex-row hover:text-gray-900"
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://passport.gitcoin.co/"
                    >
                      <img src={"./passportLogo.svg"} alt={"Passport Navbar Badge"} className="h-6 mr-2" /> Gitcoin
                      Passport{" "}
                      <img
                        src={passport?.expiryDate && passport?.issuanceDate ? "./greenEllipse.svg" : "./redEllipse.svg"}
                        alt="passport status dot"
                        className="ml-2"
                      />
                    </a>
                  </div>
                  <div className="mt-4">
                    <a
                      href="/"
                      onClick={e => {
                        e.preventDefault();

                        logoutOfWeb3Modal();
                      }}
                      className="text-signout"
                    >
                      Sign Out
                    </a>
                  </div>
                </div>
              </Drawer>
            </div>
            <div className="hidden md:inline-flex">
              <Dropdown overlay={menu} icon={<DownOutlined />} trigger={["click"]}>
                {addressComponent}
              </Dropdown>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
