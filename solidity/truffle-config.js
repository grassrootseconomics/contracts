let HDWalletProvider = require('@truffle/hdwallet-provider');

let mnemonic = 'history stumble mystery avoid embark arrive mom foil pledge keep grain dice';

// See <http://truffleframework.com/docs/advanced/configuration>
module.exports = {
    networks: {
	xdai: {

      		provider: () => 
        		new HDWalletProvider(mnemonic, 'https://dai.poa.network'),
      		network_id: '100', // Match any network id
		gasPrice: 1000000000,
		gas: 5000000
    	},
	bloxberg_development: {
      		provider: () => 
        		new HDWalletProvider(mnemonic, 'https://blockexplorer.bloxberg.org/api/eth_rpc'),
      		network_id: '8995', 
		gasPrice: 1000000000,
		gas: 8000000
    	},

        development: {
            host:       "127.0.0.1",
            port:       7545,
            network_id: "*",         // Match any network id
            gasPrice:   20000000000, // Gas price used for deploys
            gas:        6721975      // Gas limit used for deploys
        },
        production: {
            host:       "localhost",
            port:       7545,
            network_id: "*",         // Match any network id
            gasPrice:   20000000000, // Gas price used for deploys
            gas:        6721975      // Gas limit used for deploys
        },
        coverage: {     // See <https://www.npmjs.com/package/solidity-coverage#network-configuration>
            host:       "localhost",
            port:       7555,            // Also in .solcover.js
            network_id: "*",             // Match any network id
            gasPrice:   0x1,             // Gas price used for deploys
            gas:        0x1fffffffffffff // Gas limit used for deploys
        },
	grassroots: {     // See <https://www.npmjs.com/package/solidity-coverage#network-configuration>
            host:       "localhost",
            port:       8545,            // Also in .solcover.js
            network_id: "*",             // Match any network id
            gasPrice:   0x1,             // Gas price used for deploys
            gas:        6721975,
        },
	grassroots_development: {     // See <https://www.npmjs.com/package/solidity-coverage#network-configuration>
            host:       "localhost",
            port:       8545,            // Also in .solcover.js
            network_id: "*",             // Match any network id
            gasPrice:   0x1,             // Gas price used for deploys
            gas:        6721975,
        },
    },
    mocha: {
        enableTimeouts: false,
        useColors:      true,
        bail:           true,
        reporter:       "list" // See <https://mochajs.org/#reporters>
    },
    solc: {
        optimizer: {
            enabled: true,
            runs:    200
        }
    },
    compilers: {
	solc: {
		version: "0.4.26"
	}
    }
};
