const contracts = {
    PoaNetworkConsensusAbi: [
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "pendingList",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x03aca792"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getCurrentValidatorsLength",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x0eaba26a"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_newAddress",
                    "type": "address"
                }
            ],
            "name": "setProxyStorage",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x10855269"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_validator",
                    "type": "address"
                },
                {
                    "name": "_shouldFireEvent",
                    "type": "bool"
                }
            ],
            "name": "addValidator",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x21a3fb85"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "isMasterOfCeremonyRemovedPending",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x273cb593"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "isMasterOfCeremonyRemoved",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x379fed9a"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "validatorsState",
            "outputs": [
                {
                    "name": "isValidator",
                    "type": "bool"
                },
                {
                    "name": "isValidatorFinalized",
                    "type": "bool"
                },
                {
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x4110a489"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getPendingList",
            "outputs": [
                {
                    "name": "",
                    "type": "address[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x45199e0a"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "finalizeChange",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x75286211"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_newKey",
                    "type": "address"
                },
                {
                    "name": "_oldKey",
                    "type": "address"
                }
            ],
            "name": "swapValidatorKey",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x879736b2"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_someone",
                    "type": "address"
                }
            ],
            "name": "isValidatorFinalized",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x8f2eabe1"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "currentValidators",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x900eb5a8"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getKeysManager",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x9a573786"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "wasProxyStorageSet",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xa5f8b874"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getCurrentValidatorsLengthWithoutMoC",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xa8756337"
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
            "type": "function",
            "signature": "0xae4b1b5b"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "finalized",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xb3f05b97"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getValidators",
            "outputs": [
                {
                    "name": "",
                    "type": "address[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xb7ab4db5"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "systemAddress",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xd3e848f1"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "masterOfCeremonyPending",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xec7de1e9"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_validator",
                    "type": "address"
                },
                {
                    "name": "_shouldFireEvent",
                    "type": "bool"
                }
            ],
            "name": "removeValidator",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0xf89a77b1"
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
            "type": "function",
            "signature": "0xfa81b200"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_someone",
                    "type": "address"
                }
            ],
            "name": "isValidator",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xfacd743b"
        },
        {
            "inputs": [
                {
                    "name": "_masterOfCeremony",
                    "type": "address"
                },
                {
                    "name": "validators",
                    "type": "address[]"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor",
            "signature": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "parentHash",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "name": "newSet",
                    "type": "address[]"
                }
            ],
            "name": "InitiateChange",
            "type": "event",
            "signature": "0x55252fa6eee4741b4e24a74a70e9c11fd2c2281df8d6ea13126ff845f7825c89"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "newSet",
                    "type": "address[]"
                }
            ],
            "name": "ChangeFinalized",
            "type": "event",
            "signature": "0x8564cd629b15f47dc310d45bcbfc9bcf5420b0d51bf0659a16c67f91d2763253"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "proxyStorage",
                    "type": "address"
                }
            ],
            "name": "MoCInitializedProxyStorage",
            "type": "event",
            "signature": "0x600bcf04a13e752d1e3670a5a9f1c21177ca2a93c6f5391d4f1298d098097c22"
        }
    ],
    KeysManagerAbi: [
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_initialKey",
                    "type": "address"
                }
            ],
            "name": "getInitialKeyStatus",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x17706507"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_previousKeysManager",
                    "type": "address"
                }
            ],
            "name": "init",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x19ab453c"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_miningKey",
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
            "type": "function",
            "signature": "0x1e48e146"
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
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x1e534e71"
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
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x2a968f49"
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
            "type": "function",
            "signature": "0x2befe2e1"
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
            "type": "function",
            "signature": "0x2d260227"
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
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x38949514"
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
            "type": "function",
            "signature": "0x4433418f"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_miningKey",
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
            "type": "function",
            "signature": "0x458779da"
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
            "type": "function",
            "signature": "0x49285b58"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "initDisabled",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x52a36938"
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
            "type": "function",
            "signature": "0x557ed1ba"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_miningKey",
                    "type": "address"
                }
            ],
            "name": "validatorKeys",
            "outputs": [
                {
                    "name": "validatorVotingKey",
                    "type": "address"
                },
                {
                    "name": "validatorPayoutKey",
                    "type": "address"
                },
                {
                    "name": "isValidatorMiningActive",
                    "type": "bool"
                },
                {
                    "name": "isValidatorVotingActive",
                    "type": "bool"
                },
                {
                    "name": "isValidatorPayoutActive",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x5c0569f8"
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
            "type": "function",
            "signature": "0x62907170"
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
            "type": "function",
            "signature": "0x62b46d64"
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
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x651ebb5f"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_currentKey",
                    "type": "address"
                },
                {
                    "name": "_newKey",
                    "type": "address"
                }
            ],
            "name": "checkIfMiningExisted",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x731fcb9a"
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
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x771ae299"
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
            "type": "function",
            "signature": "0x7cded930"
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
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x7ebf43fc"
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
            "stateMutability": "pure",
            "type": "function",
            "signature": "0x81b03427"
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
            "type": "function",
            "signature": "0x85b84ccb"
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
            "type": "function",
            "signature": "0x8743e882"
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
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0x9503ab72"
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
            "type": "function",
            "signature": "0x98943eb6"
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
            "type": "function",
            "signature": "0x9bc91c22"
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
            "type": "function",
            "signature": "0xa5a36dee"
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
            "type": "function",
            "signature": "0xae4b1b5b"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "maxOldMiningKeysDeepCheck",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "pure",
            "type": "function",
            "signature": "0xb9bdaa07"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_payoutKey",
                    "type": "address"
                }
            ],
            "name": "miningKeyByPayout",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xc04455b5"
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
            "type": "function",
            "signature": "0xc6232a15"
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
            "type": "function",
            "signature": "0xd2acbc12"
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
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0xd33eb5ae"
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
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
            "signature": "0xd44379cf"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_miningKey",
                    "type": "address"
                }
            ],
            "name": "isVotingActiveByMiningKey",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xdb7cf00b"
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
            "stateMutability": "pure",
            "type": "function",
            "signature": "0xe7f57c83"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_votingKey",
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
            "type": "function",
            "signature": "0xfa46eacd"
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
            "type": "function",
            "signature": "0xfa81b200"
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
            "type": "function",
            "signature": "0xfee09285"
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
            "type": "event",
            "signature": "0x31511048ccdf9fbe46c149f8f729923c1232debeff658d242292f37365b45718"
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
            "type": "event",
            "signature": "0x3c12ed73d04c6ac636caa62bedf7896dc1452a189bd7fcdbcae6e9765233ca55"
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
            "type": "event",
            "signature": "0x568d585fdb4f8eee3a22e8b798c49e9d6ac5fbfced5bc1b872a74808e3be7c7d"
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
            "type": "event",
            "signature": "0x09b714df46e3a39ff284866b80612984e10c731561c157cd03aca91e436808a5"
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
            "type": "event",
            "signature": "0x8f0993529f6c865998786a88a06fce1f0261f632bf90ee1b50fa640338d5e936"
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
            "type": "event",
            "signature": "0x495f7fdbe153771103489f5c94591c07cd8e655814d1f12739f591b94411ec07"
        }
    ],
    PoaNetworkConsensusAddress: "0x4c6a159659CCcb033F4b2e2Be0C16ACC62b89DDB",
    KeysManagerAddress: "0x3F6BA50D5A6Af3786af656eA76B33EFDEd51a819",
    EmissionFundsAddress: "0x523B6539Ff08d72A6C8Bb598Af95bF50c1EA839C"
};

module.exports = contracts;