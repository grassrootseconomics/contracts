let ContractRegistry = artifacts.require('ContractRegistry');
let BancorNetwork = artifacts.require('BancorNetwork');
let BancorNetworkPathFinder = artifacts.require('ConversionPathFinder');
let BancorConverterFactory = artifacts.require('ConverterFactory');
let BancorConverterRegistry = artifacts.require('ConverterRegistry');
let BancorConverterRegistryData = artifacts.require('ConverterRegistryData');
let BancorFormula = artifacts.require('BancorFormula');

let w3 = require('web3');

module.exports = function(deployer, network, accounts) {
	console.debug('foo', deployer, network, accounts);
	deployer.then(async () => {
		let registry = await deployer.deploy(ContractRegistry);
		console.debug('registry', registry);
		deployer.link(ContractRegistry, [BancorConverterRegistry, BancorConverterRegistryData]);
		let converterRegistry = await deployer.deploy(BancorConverterRegistry, registry.address);
		let converterRegistryData = await deployer.deploy(BancorConverterRegistryData, registry.address);
		let converterNetwork = await deployer.deploy(BancorNetwork, registry.address);
		let converterFactory = await deployer.deploy(BancorConverterFactory);
		let formula = await deployer.deploy(BancorFormula);
		let converterNetworkPathFinder = await deployer.deploy(BancorNetworkPathFinder, registry.address);

		// set up the registry
		name = w3.utils.asciiToHex('ContractRegistry')
		await registry.registerAddress(name, registry.address);
		console.log("contractregistry has " + name);
		name = w3.utils.asciiToHex('BancorNetwork')
		await registry.registerAddress(name, converterNetwork.address);
		name = w3.utils.asciiToHex('BancorConverterRegistry')
		await registry.registerAddress(name, converterRegistry.address);
		name = w3.utils.asciiToHex('BancorConverterFactory')
		await registry.registerAddress(name, converterFactory.address);
		name = w3.utils.asciiToHex('BancorConverterRegistryData')
		await registry.registerAddress(name, converterRegistryData.address);
		name = w3.utils.asciiToHex('BancorNetworkPathFinder')
		await registry.registerAddress(name, converterNetworkPathFinder.address);
		name = w3.utils.asciiToHex('BancorFormula')
		await registry.registerAddress(name, formula.address);

	});
}
