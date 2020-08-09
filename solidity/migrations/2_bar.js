const LiquidTokenConverterFactory = artifacts.require('LiquidTokenConverterFactory');
const LiquidTokenConverter = artifacts.require('LiquidTokenConverter');
const ConverterRegistry = artifacts.require('ConverterRegistry');
const BancorConverterFactory = artifacts.require('ConverterFactory');
const EtherToken = artifacts.require('EtherToken');
const ERC20Token = artifacts.require('ERC20Token');
const SmartToken = artifacts.require('SmartToken');
const BancorNetwork = artifacts.require('BancorNetwork');

const amount_brt_reserve = 1000000000000000000;
const amount_rni_reserve = 2000000000000000000;

module.exports = function(deployer, network, accounts) {
	console.debug('bar');
	deployer.then(async() => {
		const converterFactory = await BancorConverterFactory.deployed();
		const converterRegistry = await ConverterRegistry.deployed();
		const etherToken = await EtherToken.deployed();
		const bancorNetwork = await BancorNetwork.deployed();

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
			250000, {
			from: accounts[2],
		});
		console.debug('reserves', await bertConverter.reserveTokenCount());
		console.debug('bert converter', cs[0], await bertConverter.owner(), await bertConverter.reserveBalance(etherToken.address));
		
		console.debug('bert token', as[0], await bertToken.symbol(), await bertToken.owner(), await bertToken.totalSupply(), await bertToken.balanceOf(accounts[2]));
	});
};
