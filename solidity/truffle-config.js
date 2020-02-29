// See <http://truffleframework.com/docs/advanced/configuration>
module.exports = {
    networks: {
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
            port:       7545,            // Also in .solcover.js
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
