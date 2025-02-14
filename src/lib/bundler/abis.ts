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
      type: "function",
      name: "withdrawNative",
      inputs: [
        {
          name: "expectedContractVersion",
          type: "bytes3",
          internalType: "bytes3",
        },
        {
          name: "idHiding",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "amount",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "withdrawAddress",
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
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
  ];
  