/* eslint-disable import/no-extraneous-dependencies */
require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bn')(require('bn.js')))
    .use(require('chai-string'))
    .use(require('dirty-chai'))
    .expect();
const fs = require('fs');

const Decimal = require('decimal.js');
Decimal.set({ precision: 100, rounding: Decimal.ROUND_DOWN, toExpPos: 40 });

const ganache = require('ganache-core');
/* eslint-enable import/no-extraneous-dependencies */

const mnemonic = fs.readFileSync('../compromised_mnemonic.txt', {
	encoding: 'utf-8',
});

module.exports = {
    networks: {
        test: {
            host: 'localhost',
            port: 7545,
            network_id: '*',
            gasPrice: 20000000000,
            gas: 9500000,
            provider: ganache.provider({
                gasLimit: 9500000,
                gasPrice: 20000000000,
                default_balance_ether: 10000000000000000000
            })
        },
	development: {
      	    provider: () => 
        	new HDWalletProvider(mnemonic, 'http://localhost:8545'),
	    network_id: '8995',
            gasPrice: 1000000000,
            gas: 8000000
	},
	bloxberg: {
            host: 'https://blockexplorer.bloxberg.org/api/eth_rpc',
            port: 443,
      	    network_id: '8995', 
            gasPrice: 1000000000,
            gas: 8000000
        },
	bloxberg_development: {
      		provider: () => 
        		new HDWalletProvider(mnemonic, 'https://blockexplorer.bloxberg.org/api/eth_rpc'),
      		network_id: '8995', 
		gasPrice: 1000000000,
		gas: 8000000
    	},

    },
    plugins: ['solidity-coverage'],
    compilers: {
        solc: {
            version: '0.4.26',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }
    },
    mocha: {
        before_timeout: 600000,
        timeout: 600000,
        useColors: true,
        reporter: 'list'
    }
};
