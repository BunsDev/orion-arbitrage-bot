const dotenv = require("dotenv");
dotenv.config();

const { ethers } = require("ethers");

const utils = require("ethers").utils;

const OrionAggregator = require("@orionprotocol/orion-trading-sdk");

const {
  PRIVATE_KEY,
  CHAIN,
  QUOTEASSET,
  VIEWWALLET,
  VIEWCONTRACT,
  DEPOSIT,
  DEPOSITASSET,
  DEPOSITAMOUNT,
  WITHDRAW,
  WITHDRAWASSET,
  WITHDRAWAMOUNT,
  ARBITRAGE,
} = process.env;

if (!CHAIN) throw new Error("CHAINID is required in .env");
if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY is required in .env");
if (!QUOTEASSET) throw new Error("QUOTEASSET is required in .env");

async function main() {
  function normalise(amount, tokenDecimals) {
    var result = utils.formatUnits(amount, tokenDecimals);
    return result;
  }

  function returnTable(json) {
    var result = {};
    var i = 0;
    for (value in json) {
      if (json[value] != 0) {
        result[i] = {
          name: value,
          value: normalise(
            json[value],
            chain._blockchainInfo.assetToDecimals[value]
          ).toString(),
        };
        i++;
      }
    }
    return result;
  }

  function returnBigNumberTable(json) {
    var result = {};
    var i = 0;
    for (value in json) {
      if (json[value].total != 0) {
        result[i] = {
          name: value,
          value: json[value].total.toString(),
        };
        i++;
      }
    }
    return result;
  }

  let chain;
  let exchange;
  let orionAggregator;
  try {
    chain = new OrionAggregator.Chain(
      PRIVATE_KEY,
      OrionAggregator.Constants.NETWORK.MAIN[CHAIN]
    );
    await chain.init();
    exchange = new OrionAggregator.Exchange(chain);
    orionAggregator = new OrionAggregator(chain);
    await orionAggregator.init();
  } catch (error) {
    console.error(error);
  }

  const quoteAssetBalance = await chain.getWalletBalance(QUOTEASSET);

  const quoteAssetContract = await exchange.getContractBalance(QUOTEASSET);

  console.log(" User informations");
  console.table({
    publicKey: chain.signer.address,
    privateKey: "**************************",
    chainName: chain._blockchainInfo.chainName,
    quoteAsset: QUOTEASSET,
    quoteAssetBalance: normalise(
      quoteAssetBalance[QUOTEASSET],
      chain._blockchainInfo.assetToDecimals[QUOTEASSET]
    ).toString(),
    quoteAssetContract: QUOTEASSET,
    quoteAssetContract: quoteAssetContract[QUOTEASSET].total.toString(),
  });

  if (VIEWWALLET == "true") {
    try {
      const balances = await chain.getWalletBalance();
      console.log(" User wallet balances");
      console.table(returnTable(balances));
    } catch (error) {
      console.error(error);
    }
  }

  if (VIEWCONTRACT == "true") {
    try {
      const balances = await exchange.getContractBalance();
      console.log(" User contract balances");
      console.table(returnBigNumberTable(balances));
    } catch (error) {
      console.error(error);
    }
  }

  if (DEPOSIT == "true") {
    try {
      const deposit = await exchange.deposit(DEPOSITASSET, DEPOSITAMOUNT);
      console.log(
        " Deposit " + DEPOSITAMOUNT + " " + DEPOSITASSET + " in contract"
      );
      console.table({
        nonce: deposit["nonce"],
        gasPrice: deposit["gasPrice"].toString(),
        gasLimit: deposit["gasLimit"].toString(),
        to: deposit["to"],
        value: deposit["value"].toString(),
        data: deposit["data"],
        chainId: deposit["chainId"],
        v: deposit["v"],
        r: deposit["r"],
        s: deposit["s"],
        from: deposit["from"],
        hash: deposit["hash"],
        type: deposit["type"],
      });
    } catch (error) {
      console.error(error);
    }
  }

  if (WITHDRAW == "true") {
    try {
      const withdraw = await exchange.withdraw(WITHDRAWASSET, WITHDRAWAMOUNT);
      console.log(
        " Withdraw " + WITHDRAWAMOUNT + " " + WITHDRAWASSET + " from contract"
      );
      console.table({
        nonce: withdraw["nonce"],
        gasPrice: withdraw["gasPrice"].toString(),
        gasLimit: withdraw["gasLimit"].toString(),
        to: withdraw["to"],
        value: withdraw["value"].toString(),
        data: withdraw["data"],
        chainId: withdraw["chainId"],
        v: withdraw["v"],
        r: withdraw["r"],
        s: withdraw["s"],
        from: withdraw["from"],
        hash: withdraw["hash"],
        type: withdraw["type"],
      });
    } catch (error) {
      console.error(error);
    }
  }

  if(ARBITRAGE == "true"){




  }


}

main();
