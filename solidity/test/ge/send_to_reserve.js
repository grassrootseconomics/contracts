let assert = require('assert');
let BancorNetwork = artifacts.require('BancorNetwork');
let EtherToken = artifacts.require('EtherToken');
let SmartToken = artifacts.require('SmartToken');
let ContractRegistry = artifacts.require('ContractRegistry');
let BancorConverterRegistry = artifacts.require('BancorConverterRegistry');
let contract_network = undefined;

describe('convert', accounts => {
	it('smart to reserve', async () => {
		contract_network = await BancorNetwork.deployed();
		contract_registry = await ContractRegistry.deployed();
		bancor_converter_registry = await BancorConverterRegistry.deployed();
		etherToken = await EtherToken.deployed();
		console.log("contact reserve", contract_registry.address, contract_network.address);
		let bal = await web3.eth.getBalance(etherToken.address);
		console.log("balance", bal);
	});
});
