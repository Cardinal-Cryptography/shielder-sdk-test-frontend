import {
  GetPaymasterDataReturnType,
  GetPaymasterStubDataReturnType,
} from "viem/account-abstraction";
import {
  GetPaymasterDataParameters,
  GetPaymasterStubDataParameters,
} from "viem/account-abstraction";
import { Address, Hex } from "viem";

export const PAYMASTER_VALIDATION_GAS_LIMIT = 1861000n;
export const PAYMASTER_GAS_MARKUP_MULITPLIER = 1n;

export const createShielderPaymaster = (
  paymasterAddress: Address,
  paymasterData: Hex,
) => {
  return {
    getPaymasterData(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      parameters: GetPaymasterDataParameters,
    ): Promise<GetPaymasterDataReturnType> {
      return new Promise((resolve) =>
        resolve({
          ...parameters,
          paymaster: paymasterAddress,
          paymasterData,
          paymasterPostOpGasLimit: 1n,
          paymasterVerificationGasLimit: PAYMASTER_VALIDATION_GAS_LIMIT,
        }),
      );
    },
    async getPaymasterStubData(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _parameters: GetPaymasterStubDataParameters,
    ): Promise<GetPaymasterStubDataReturnType & { maxFeePerGas: bigint }> {
      return new Promise((resolve) =>
        resolve({
          paymaster: paymasterAddress,
          paymasterData,
          paymasterVerificationGasLimit: PAYMASTER_VALIDATION_GAS_LIMIT,
          paymasterPostOpGasLimit: 1n,
          // maxFeePerGas: 1n,
        }),
      );
    },
  };
};
