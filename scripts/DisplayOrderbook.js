require('dotenv').config()
const Web3 = require('web3')
const Web3Utils = require('web3-utils')
const assert = require('assert');
const { sendTx, sendRawTx, getReceipt } = require('../helper/sendTx')

const Exchange = require('../abis/Exchange.abi')

const {
  USER_ADDRESS,
  USER_ADDRESS_PRIVATE_KEY,
  EXCHANGE_ADDRESS,
  RPC_URL,
  GAS_PRICE
} = process.env

const web3Provider = new Web3.providers.HttpProvider(RPC_URL)
const web3Instance = new Web3(web3Provider)

const exchange = new web3Instance.eth.Contract(Exchange, EXCHANGE_ADDRESS)

const BASE_TOKEN = '0xbF52fc7861856c8A32f4C05463b5F468728D2470'
const TRADE_TOKEN = '0x0000000000000000000000000000000000000000'

async function main() {
  const chainId = await sendRawTx({
    url: RPC_URL,
    params: [],
    method: 'net_version'
  })

  let nonce = await sendRawTx({
    url: RPC_URL,
    method: 'eth_getTransactionCount',
    params: [USER_ADDRESS, 'latest']
  })
  nonce = Web3Utils.hexToNumber(nonce)

  try {
    const asks = await exchange.methods.getAsks(BASE_TOKEN, TRADE_TOKEN).call()
    console.log("asks size: ", asks[0].length)
    // console.log(asks)

    const bids = await exchange.methods.getBids(BASE_TOKEN, TRADE_TOKEN).call()
    console.log("bids size: ", bids[0].length)
    // console.log(bids)
  } catch (e) {
    console.log(e)
  }

}

main()