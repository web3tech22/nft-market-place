import { ethers } from "ethers";

export const web3Raw = ethers;

export const web3Utils = new ethers.providers.Web3Provider(window.ethereum);

console.log("-====ethers.utils>>>>", ethers.utils);

export function convertEthToWei(price) {
  const priceData = Number(price) * 1000000000000000000;
  return priceData.toString();
  return ethers.utils.formatEther(price.toString(), "ether");
}

export function convertEthFromWei(price) {
  return Number(price) / 1000000000000000000;
}
