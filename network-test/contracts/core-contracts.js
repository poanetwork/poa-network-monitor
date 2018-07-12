const contracts = {
    PoaNetworkConsensusAbi: [{
        "constant": true,
        "inputs": [{"name": "", "type": "uint256"}],
        "name": "pendingList",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "getCurrentValidatorsLength",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_newAddress", "type": "address"}],
        "name": "setProxyStorage",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_validator", "type": "address"}, {"name": "_shouldFireEvent", "type": "bool"}],
        "name": "addValidator",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "currentValidatorsLength",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "", "type": "address"}],
        "name": "validatorsState",
        "outputs": [{"name": "isValidator", "type": "bool"}, {"name": "index", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "getPendingList",
        "outputs": [{"name": "", "type": "address[]"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "getVotingToChangeKeys",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [],
        "name": "finalizeChange",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_newKey", "type": "address"}, {"name": "_oldKey", "type": "address"}],
        "name": "swapValidatorKey",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "", "type": "uint256"}],
        "name": "currentValidators",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "getKeysManager",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "isMasterOfCeremonyInitialized",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "proxyStorage",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "finalized",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "getValidators",
        "outputs": [{"name": "", "type": "address[]"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "systemAddress",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_validator", "type": "address"}, {"name": "_shouldFireEvent", "type": "bool"}],
        "name": "removeValidator",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "masterOfCeremony",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_someone", "type": "address"}],
        "name": "isValidator",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"name": "_masterOfCeremony", "type": "address"}, {"name": "validators", "type": "address[]"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "parentHash", "type": "bytes32"}, {
            "indexed": false,
            "name": "newSet",
            "type": "address[]"
        }],
        "name": "InitiateChange",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "name": "newSet", "type": "address[]"}],
        "name": "ChangeFinalized",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "name": "nameOfContract", "type": "string"}, {
            "indexed": false,
            "name": "newAddress",
            "type": "address"
        }],
        "name": "ChangeReference",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "name": "proxyStorage", "type": "address"}],
        "name": "MoCInitializedProxyStorage",
        "type": "event"
    }],
    KeysManagerAbi: [
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "successfulValidatorClone",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_miningKey",
                    "type": "address"
                }
            ],
            "name": "removePayoutKey",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_miningKey",
                    "type": "address"
                }
            ],
            "name": "removeVotingKey",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_miningKey",
                    "type": "address"
                }
            ],
            "name": "getVotingByMining",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_votingKey",
                    "type": "address"
                }
            ],
            "name": "getMiningKeyByVoting",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_key",
                    "type": "address"
                }
            ],
            "name": "addMiningKey",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "poaNetworkConsensus",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "miningKeyHistory",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getVotingToChangeKeys",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getTime",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "validatorKeys",
            "outputs": [
                {
                    "name": "votingKey",
                    "type": "address"
                },
                {
                    "name": "payoutKey",
                    "type": "address"
                },
                {
                    "name": "isMiningActive",
                    "type": "bool"
                },
                {
                    "name": "isVotingActive",
                    "type": "bool"
                },
                {
                    "name": "isPayoutActive",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "previousKeysManager",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_votingKey",
                    "type": "address"
                }
            ],
            "name": "isVotingActive",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_key",
                    "type": "address"
                },
                {
                    "name": "_miningKey",
                    "type": "address"
                }
            ],
            "name": "addPayoutKey",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "initialKeys",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_key",
                    "type": "address"
                },
                {
                    "name": "_miningKey",
                    "type": "address"
                }
            ],
            "name": "swapPayoutKey",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_miningKey",
                    "type": "address"
                }
            ],
            "name": "getPayoutByMining",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_key",
                    "type": "address"
                }
            ],
            "name": "removeMiningKey",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "maxLimitValidators",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_miningKey",
                    "type": "address"
                }
            ],
            "name": "migrateMiningKey",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_initialKey",
                    "type": "address"
                }
            ],
            "name": "initiateKeys",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_key",
                    "type": "address"
                },
                {
                    "name": "_miningKey",
                    "type": "address"
                }
            ],
            "name": "addVotingKey",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_initialKey",
                    "type": "address"
                }
            ],
            "name": "migrateInitialKey",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_key",
                    "type": "address"
                }
            ],
            "name": "isMiningActive",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "contractVersion",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_miningKey",
                    "type": "address"
                }
            ],
            "name": "getMiningKeyHistory",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "proxyStorage",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_initialKey",
                    "type": "address"
                }
            ],
            "name": "getInitialKey",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_miningKey",
                    "type": "address"
                },
                {
                    "name": "_votingKey",
                    "type": "address"
                },
                {
                    "name": "_payoutKey",
                    "type": "address"
                }
            ],
            "name": "createKeys",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "initialKeysCount",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_key",
                    "type": "address"
                },
                {
                    "name": "_miningKey",
                    "type": "address"
                }
            ],
            "name": "swapVotingKey",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_key",
                    "type": "address"
                },
                {
                    "name": "_oldMiningKey",
                    "type": "address"
                }
            ],
            "name": "swapMiningKey",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "maxNumberOfInitialKeys",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "miningKeyByVoting",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "masterOfCeremony",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_miningKey",
                    "type": "address"
                }
            ],
            "name": "isPayoutActive",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "_proxyStorage",
                    "type": "address"
                },
                {
                    "name": "_poaConsensus",
                    "type": "address"
                },
                {
                    "name": "_masterOfCeremony",
                    "type": "address"
                },
                {
                    "name": "_previousKeysManager",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "key",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "miningKey",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "action",
                    "type": "string"
                }
            ],
            "name": "PayoutKeyChanged",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "key",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "miningKey",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "action",
                    "type": "string"
                }
            ],
            "name": "VotingKeyChanged",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "key",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "action",
                    "type": "string"
                }
            ],
            "name": "MiningKeyChanged",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "miningKey",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "votingKey",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "payoutKey",
                    "type": "address"
                }
            ],
            "name": "ValidatorInitialized",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "initialKey",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "time",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "initialKeysCount",
                    "type": "uint256"
                }
            ],
            "name": "InitialKeyCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "name",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "name": "key",
                    "type": "address"
                }
            ],
            "name": "Migrated",
            "type": "event"
        }
    ],
    KeysManagerAddress: "0x2b1dbc7390a65dc40f7d64d67ea11b4d627dd1bf",
    PoaNetworkConsensusAddress: "0x83451c8bc04d4ee9745ccc58edfab88037bc48cc"
};

module.exports = contracts;