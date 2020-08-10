let ContractRegistry = artifacts.require('ContractRegistry');
let BancorNetwork = artifacts.require('BancorNetwork');
let BancorNetworkPathFinder = artifacts.require('ConversionPathFinder');
let BancorConverterFactory = artifacts.require('ConverterFactory');
let BancorConverterRegistry = artifacts.require('ConverterRegistry');
let BancorConverterRegistryData = artifacts.require('ConverterRegistryData');
let BancorFormula = artifacts.require('BancorFormula');
let EtherToken = artifacts.require('EtherToken');
let SmartToken = artifacts.require('SmartToken');

let w3 = require('web3');

module.exports = function(deployer, network, accounts) {
	deployer.then(async () => {
		let registry = await deployer.deploy(ContractRegistry);
		deployer.link(ContractRegistry, [BancorConverterRegistry, BancorConverterRegistryData]);
		let etherToken = await deployer.deploy(EtherToken, "Reserve Token", "RSV", {
			from: accounts[1],
		});
		let converterRegistry = await deployer.deploy(BancorConverterRegistry, registry.address);
		let converterRegistryData = await deployer.deploy(BancorConverterRegistryData, registry.address);
		let converterNetwork = await deployer.deploy(BancorNetwork, registry.address);
		let converterFactory = await deployer.deploy(BancorConverterFactory);
		let formula = await deployer.deploy(BancorFormula);
		let converterNetworkPathFinder = await deployer.deploy(BancorNetworkPathFinder, registry.address);

		// set up the registry
		name = w3.utils.asciiToHex('ContractRegistry')
		await registry.registerAddress(name, registry.address);
		name = w3.utils.asciiToHex('BancorNetwork')
		await registry.registerAddress(name, converterNetwork.address);
		name = w3.utils.asciiToHex('BancorConverterRegistry')
		await registry.registerAddress(name, converterRegistry.address);
		name = w3.utils.asciiToHex('ConverterFactory')
		await registry.registerAddress(name, converterFactory.address);
		name = w3.utils.asciiToHex('BancorConverterRegistryData')
		await registry.registerAddress(name, converterRegistryData.address);
		name = w3.utils.asciiToHex('ConversionPathFinder')
		await registry.registerAddress(name, converterNetworkPathFinder.address);
		name = w3.utils.asciiToHex('BancorFormula')
		await registry.registerAddress(name, formula.address);
		name = w3.utils.asciiToHex('BNTToken')
		address = await registry.registerAddress(name, etherToken.address);

		await formula.init();
	});
}
