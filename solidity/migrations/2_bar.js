const fs = require('fs');

const LiquidTokenConverterFactory = artifacts.require('LiquidTokenConverterFactory');
const LiquidTokenConverter = artifacts.require('LiquidTokenConverter');
const ConverterRegistry = artifacts.require('ConverterRegistry');
const ContractRegistry = artifacts.require('ContractRegistry');
const BancorConverterFactory = artifacts.require('ConverterFactory');
const EtherToken = artifacts.require('EtherToken');
const ERC20Token = artifacts.require('ERC20Token');
const SmartToken = artifacts.require('SmartToken');
const BancorNetwork = artifacts.require('BancorNetwork');

const amount_brt_reserve = 1000000000000000000;
const amount_rni_reserve = 2000000000000000000;

let token_output = {}

module.exports = function(deployer, network, accounts) {
	deployer.then(async() => {
		const converterFactory = await BancorConverterFactory.deployed();
		const converterRegistry = await ConverterRegistry.deployed();
		const etherToken = await EtherToken.deployed();
		const bancorNetwork = await BancorNetwork.deployed();
		const contractRegistry = await ContractRegistry.deployed();

		const liquidFactory = await deployer.deploy(LiquidTokenConverterFactory);
		let r = await converterFactory.registerTypedConverterFactory(liquidFactory.address);


		console.debug('registry', converterRegistry.address);
		console.debug('eth', etherToken.address);

		console.debug('token before', await converterRegistry.getAnchors());

		r = await web3.eth.sendTransaction({
			from: accounts[2],
			to: etherToken.address,
			value: amount_brt_reserve,
		});
		r = await web3.eth.sendTransaction({
			from: accounts[3],
			to: etherToken.address,
			value: amount_rni_reserve,
		});
		console.debug('account 2', accounts[2], await etherToken.balanceOf(accounts[2]));
		console.debug('account 3', accounts[3], await etherToken.balanceOf(accounts[3]));

		await converterRegistry.newConverter(
			0,
			'Bert Token',
			'BRT',
			18,
			100000,
			[etherToken.address],
			[250000],
			{
				from: accounts[2],
			}
		);
		let l = await converterRegistry.newConverter(
			0,
			'Ernie Token',
			'RNI',
			18,
			100000,
			[etherToken.address],
			[250000],
			{
				from: accounts[3],
			}
		);

		// smart token objects
		const as = await converterRegistry.getAnchors()

		const bertToken = await SmartToken.at(as[0]);
		console.debug('bert token', as[0], await bertToken.symbol(), await bertToken.owner(), await bertToken.totalSupply());
		const ernieToken = await SmartToken.at(as[1]);
		console.debug('ernie token', as[1], await ernieToken.symbol(), await ernieToken.owner(), await ernieToken.totalSupply());

		// converter objects
		const cs = await converterRegistry.getConvertersByAnchors(as);

		const bertConverter = await LiquidTokenConverter.at(cs[0]);
		console.debug('bert converter', cs[0], await bertConverter.owner(), await bertConverter.reserveBalance(etherToken.address));

		const ernieConverter = await LiquidTokenConverter.at(cs[1]);
		console.debug('ernie converter', cs[1], await ernieConverter.owner());

		const reserveToken = await ERC20Token.at(etherToken.address);
		await reserveToken.approve(bancorNetwork.address, 3000000, {
			from: accounts[2],
		});
		await bancorNetwork.convert([
			etherToken.address,
			bertToken.address,
			bertToken.address,
		],
			300000,
			300000, {
			from: accounts[2],
		});

		// expect balance 1:4 but 0.6.8 always does initial supply 1:1 to reserve.
		// we need to wait for next version
		reserve_balance = await bertConverter.reserveBalance(etherToken.address);
		reserve_weight = await bertConverter.reserveWeight(etherToken.address);
		console.debug('bert converter', cs[0], await bertConverter.owner(), reserve_balance.toString(), reserve_weight.toString());
	
		supply = await bertToken.totalSupply();
		balance = await bertToken.balanceOf(accounts[2])
		console.debug('bert token', as[0], await bertToken.symbol(), await bertToken.owner(), supply.toNumber(), balance.toNumber());
		reserve_balance_bert = await reserveToken.balanceOf(accounts[2]);
		reserve_balance_ernie = await reserveToken.balanceOf(accounts[3]);
		console.debug('reserves', reserve_balance_bert.toString(), reserve_balance_ernie.toString());

		token_output = {
			registry: {
				address: contractRegistry.address,
				deployer: accounts[0],
			},
			reserve: {
				name: await reserveToken.name(),
				symbol: await reserveToken.symbol(),
				decimals: await reserveToken.decimals(),
				address: await reserveToken.address,
				deployer: accounts[1],
			},
			tokens: [
				{
					converter: await bertConverter.address,
					weight: 250000,
					name: await bertToken.name(),
					symbol: await bertToken.symbol(),
					decimals: await bertToken.decimals(),
					address: await bertToken.address,
					deployer: accounts[2],
				},
				{
					converter: await ernieConverter.address,
					weight: 250000,
					name: await ernieToken.name(),
					symbol: await ernieToken.symbol(),
					decimals: await ernieToken.decimals(),
					address: await ernieToken.address,
					deployer: accounts[3],
				},
			],
		};

		fs.writeFileSync('tokens.json', JSON.stringify(token_output));
	});
};
