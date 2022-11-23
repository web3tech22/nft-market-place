import _ from "lodash";
import ABI from "./NFT.json";
import Address from "./Address";
import { web3Utils, web3Raw } from "../utils/web3Util";
import { ethers } from "ethers";

window?.ethereum?.request({
  method: "eth_requestAccounts",
});

// console.log("=============={{{{{{{{>", web3Utils);

export const getcurrentNetworkId = async () => {
  let networkId;
  try {
    let network = await web3Utils?.getNetwork();
    networkId = network?.chainId;
  } catch (err) {
    networkId = undefined;
    console.error("___web3 not found___", err);
  }

  return networkId;
};

export const getContractAddress = (networkID) => {
  switch (networkID?.toString()) {
    case "80001":
      return Address.polygon;
    case "5":
      return Address.goerli;
    case "4":
      return Address.rinkeby;
    case "14333":
      return Address.pwcPrivetNetwork;
    default:
    // code block
  }
};

const getContract = async () => {
  let network = await web3Utils?.getNetwork();
  const signer = web3Utils.getSigner();

  const networkId = network?.chainId;
  sessionStorage.setItem("currentyNetwork", networkId);
  const ADDRESS = getContractAddress(networkId);
  const contract = ADDRESS && new ethers.Contract(ADDRESS, ABI, signer);
  return contract;
};

export const _transction = async (service, ...props) => {
  const contract = await getContract();
  const callService = _.get(contract, [service]);
  const responseData = await callService(...props)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      const errorData = { error };
      return { error: errorData.error };
    });

  return responseData;
};

export const _paid_transction = async (cost, service, ...props) => {
  const contract = await getContract();
  const callService = _.get(contract, [service]);
  const responseData = await callService(...props, {
    gasPrice: 839996565107,
    value: cost,
  })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      const errorData = { error };
      return { error: errorData.error };
    });

  return responseData;
};

export const _account = async () => {
  const accounts = await web3Utils.listAccounts();
  return accounts[0];
};

export const _fetch = async (service, ...props) => {
  const contract = await getContract();
  const callService = _.get(contract, [service]);
  let data;
  if (props) {
    data = await callService(...props);
  } else {
    data = await callService();
  }
  return data;
};
