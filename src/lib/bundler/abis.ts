export const SMART_ACCOUNT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "dest", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "bytes", name: "func", type: "bytes" },
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "execute",
  },
  {
    inputs: [
      { internalType: "address[]", name: "dest", type: "address[]" },
      { internalType: "uint256[]", name: "value", type: "uint256[]" },
      { internalType: "bytes[]", name: "func", type: "bytes[]" },
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "executeBatch",
  },
];

export const SHIELDER_ABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "ARITY",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "CONTRACT_VERSION",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes3",
        internalType: "bytes3",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "GAS_LIMIT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MAX_CONTRACT_BALANCE",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MAX_TRANSACTION_AMOUNT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "TREE_HEIGHT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "UPGRADE_INTERFACE_VERSION",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "acceptOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addressToUInt256",
    inputs: [
      {
        name: "addr",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "anonymityRevokerPubkey",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "depositERC20",
    inputs: [
      {
        name: "expectedContractVersion",
        type: "bytes3",
        internalType: "bytes3",
      },
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "oldNullifierHash",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "newNote",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "merkleRoot",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "macSalt",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "macCommitment",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "proof",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "depositNative",
    inputs: [
      {
        name: "expectedContractVersion",
        type: "bytes3",
        internalType: "bytes3",
      },
      {
        name: "oldNullifierHash",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "newNote",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "merkleRoot",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "macSalt",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "macCommitment",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "proof",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getMerklePath",
    inputs: [
      {
        name: "index",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      {
        name: "initialOwner",
        type: "address",
        internalType: "address",
      },
      {
        name: "_anonymityRevokerPublicKeyX",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_anonymityRevokerPublicKeyY",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_isArbitrumChain",
        type: "bool",
        internalType: "bool",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "merkleTree",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "newAccountERC20",
    inputs: [
      {
        name: "expectedContractVersion",
        type: "bytes3",
        internalType: "bytes3",
      },
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "newNote",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "prenullifier",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "symKeyEncryptionC1X",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "symKeyEncryptionC1Y",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "symKeyEncryptionC2X",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "symKeyEncryptionC2Y",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "macSalt",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "macCommitment",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "proof",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "newAccountNative",
    inputs: [
      {
        name: "expectedContractVersion",
        type: "bytes3",
        internalType: "bytes3",
      },
      {
        name: "newNote",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "prenullifier",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "symKeyEncryptionC1X",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "symKeyEncryptionC1Y",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "symKeyEncryptionC2X",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "symKeyEncryptionC2Y",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "macSalt",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "macCommitment",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "proof",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "nullifiers",
    inputs: [
      {
        name: "nullifier",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "paused",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pendingOwner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proxiableUUID",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setAnonymityRevokerPubkey",
    inputs: [
      {
        name: "anonymityRevokerPubkeyX",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "anonymityRevokerPubkeyY",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unpause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "upgradeToAndCall",
    inputs: [
      {
        name: "newImplementation",
        type: "address",
        internalType: "address",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "withdrawERC20",
    inputs: [
      {
        name: "expectedContractVersion",
        type: "bytes3",
        internalType: "bytes3",
      },
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "withdrawalAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "merkleRoot",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "oldNullifierHash",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "newNote",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "proof",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "relayerAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "relayerFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "macSalt",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "macCommitment",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "withdrawNative",
    inputs: [
      {
        name: "expectedContractVersion",
        type: "bytes3",
        internalType: "bytes3",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "withdrawalAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "merkleRoot",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "oldNullifierHash",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "newNote",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "proof",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "relayerAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "relayerFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "macSalt",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "macCommitment",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Deposit",
    inputs: [
      {
        name: "contractVersion",
        type: "bytes3",
        indexed: false,
        internalType: "bytes3",
      },
      {
        name: "tokenAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newNote",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newNoteIndex",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "macSalt",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "macCommitment",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "NewAccount",
    inputs: [
      {
        name: "contractVersion",
        type: "bytes3",
        indexed: false,
        internalType: "bytes3",
      },
      {
        name: "prenullifier",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "tokenAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newNote",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newNoteIndex",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "macSalt",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "macCommitment",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferStarted",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Paused",
    inputs: [
      {
        name: "account",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Unpaused",
    inputs: [
      {
        name: "account",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Upgraded",
    inputs: [
      {
        name: "implementation",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Withdraw",
    inputs: [
      {
        name: "contractVersion",
        type: "bytes3",
        indexed: false,
        internalType: "bytes3",
      },
      {
        name: "tokenAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "withdrawalAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "newNote",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newNoteIndex",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "relayerAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "fee",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "macSalt",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "macCommitment",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "pocketMoney",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AddressEmptyCode",
    inputs: [
      {
        name: "target",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "AddressInsufficientBalance",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "AmountTooHigh",
    inputs: [],
  },
  {
    type: "error",
    name: "ContractBalanceLimitReached",
    inputs: [],
  },
  {
    type: "error",
    name: "DepositVerificationFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "DuplicatedNullifier",
    inputs: [],
  },
  {
    type: "error",
    name: "ERC1967InvalidImplementation",
    inputs: [
      {
        name: "implementation",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ERC1967NonPayable",
    inputs: [],
  },
  {
    type: "error",
    name: "EnforcedPause",
    inputs: [],
  },
  {
    type: "error",
    name: "ExpectedPause",
    inputs: [],
  },
  {
    type: "error",
    name: "FailedInnerCall",
    inputs: [],
  },
  {
    type: "error",
    name: "FeeHigherThanAmount",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidGrumpkinPoint",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidInitialization",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidTreeHeight",
    inputs: [],
  },
  {
    type: "error",
    name: "LeafNotExisting",
    inputs: [],
  },
  {
    type: "error",
    name: "MaxTreeSizeExceeded",
    inputs: [],
  },
  {
    type: "error",
    name: "MerkleRootDoesNotExist",
    inputs: [],
  },
  {
    type: "error",
    name: "NativeTransferFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "NewAccountVerificationFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "NotAFieldElement",
    inputs: [],
  },
  {
    type: "error",
    name: "NotInitializing",
    inputs: [],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "UUPSUnauthorizedCallContext",
    inputs: [],
  },
  {
    type: "error",
    name: "UUPSUnsupportedProxiableUUID",
    inputs: [
      {
        name: "slot",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
  {
    type: "error",
    name: "WithdrawVerificationFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "WrongContractVersion",
    inputs: [
      {
        name: "actual",
        type: "bytes3",
        internalType: "bytes3",
      },
      {
        name: "expectedByCaller",
        type: "bytes3",
        internalType: "bytes3",
      },
    ],
  },
  {
    type: "error",
    name: "ZeroAmount",
    inputs: [],
  },
];
