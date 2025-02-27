import { useAccount, useBalance } from "wagmi";

export const usePublicAccount = () => {
  const { address } = useAccount();
  const { data: dataBalance } = useBalance({
    address,
  });

  return {
    publicBalance: dataBalance?.value,
    publicAddress: address,
  };
};
