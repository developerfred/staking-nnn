import React, { useContext } from "react";
import { Account } from "../components";

import { Web3Context } from "../helpers/Web3Context";

export default function Navbar({
  networkOptions,
  readContracts,
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
  mainnetProvider,
  price,
  web3Modal,
  loadWeb3Modal,
  blockExplorer,
}) {
  const { address, setAddress, currentNetwork } = useContext(Web3Context);
  return (
    <nav className="flex flex-col App md:pb-4 sm:pb-20">
      <div className="flex items-center w-full p-4 mx-auto">
        <div className="flex flex-wrap md:flex-row">
          <div className="flex flex-row items-center float-right font-medium text-gray-900">
            <img src="/novem-gold-token.png" alt="Novem Gold Token" class="mr-2 h-12" />
            <img className="ml-6 mr-6" src="/logoLine.svg" alt="Logo Line" />
            <span className="hidden ml-6 text-lg text-grey-500 md:inline-flex">NNN STAKING</span>
          </div>
        </div>
        <div className="ml-auto">
          <Account
            passport={passport}
            address={address}
            readContracts={readContracts}
            localProvider={localProvider}
            userSigner={userSigner}
            mainnetProvider={mainnetProvider}
            price={price}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            blockExplorer={blockExplorer}
            minimized={undefined}
            isContract={undefined}
            networkOptions={networkOptions}
            NETWORKCHECK={NETWORKCHECK}
            localChainId={localChainId}
            selectedChainId={selectedChainId}
            targetNetwork={targetNetwork}
            USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
            networkDisplay={undefined}
            selectedNetwork={undefined}
            setSelectedNetwork={undefined}
          />
        </div>
      </div>
    </nav>
  );
}
