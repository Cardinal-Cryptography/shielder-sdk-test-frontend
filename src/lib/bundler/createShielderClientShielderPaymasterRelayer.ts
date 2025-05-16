import {
  ShielderClient,
  ShielderClientConfig,
} from "@cardinal-cryptography/shielder-sdk";
import { DepositAction } from "@cardinal-cryptography/shielder-sdk/dist/actions/deposit";
import { NewAccountAction } from "@cardinal-cryptography/shielder-sdk/dist/actions/newAccount";
import { WithdrawAction } from "@cardinal-cryptography/shielder-sdk/dist/actions/withdraw";
import { Contract } from "@cardinal-cryptography/shielder-sdk/dist/chain/contract";
import { IRelayer } from "@cardinal-cryptography/shielder-sdk/dist/chain/relayer";
import { ShielderActions } from "@cardinal-cryptography/shielder-sdk/dist/client/actions";
import { AccountFactory } from "@cardinal-cryptography/shielder-sdk/dist/state/accountFactory";
import { AccountRegistry } from "@cardinal-cryptography/shielder-sdk/dist/state/accountRegistry";
import { AccountStateSerde } from "@cardinal-cryptography/shielder-sdk/dist/state/accountStateSerde";
import { IdManager } from "@cardinal-cryptography/shielder-sdk/dist/state/idManager";
import { LocalStateTransition } from "@cardinal-cryptography/shielder-sdk/dist/state/localStateTransition";
import { ChainStateTransition } from "@cardinal-cryptography/shielder-sdk/dist/state/sync/chainStateTransition";
import { HistoryFetcher } from "@cardinal-cryptography/shielder-sdk/dist/state/sync/historyFetcher";
import { StateSynchronizer } from "@cardinal-cryptography/shielder-sdk/dist/state/sync/synchronizer";
import { TokenAccountFinder } from "@cardinal-cryptography/shielder-sdk/dist/state/sync/tokenAccountFinder";
import { StorageManager } from "@cardinal-cryptography/shielder-sdk/dist/storage/storageManager";
import { createStorage } from "@cardinal-cryptography/shielder-sdk/dist/storage/storageSchema";
import { BundlerRelayer } from "./ShielderPaymasterRelayer";
import { Address } from "viem";

export const createShielderClientWithShielderPaymasterRelayer = (
  config: ShielderClientConfig & {
    paymasterAddress: Address;
  },
): ShielderClient => {
  const contract = new Contract(config.publicClient, config.contractAddress);
  const relayer = new BundlerRelayer(
    config.publicClient,
    config.contractAddress,
    config.relayerUrl,
    config.paymasterAddress,
  );
  const components = createShielderComponents({
    ...config,
    contract,
    relayer,
  });
  return new ShielderClient(components, config.callbacks || {});
};
function createShielderComponents(
  config: ShielderClientConfig & {
    contract: Contract;
    relayer: IRelayer;
  },
) {
  const identityComponents = createIdentityComponents(config);
  const storageComponents = createStorageComponents({
    ...config,
    ...identityComponents,
  });
  const actionComponents = createActionComponents(config);
  const syncComponents = createSyncComponents({
    ...config,
    ...actionComponents,
    ...storageComponents,
    ...identityComponents,
  });
  const shielderActions = new ShielderActions(
    storageComponents.accountRegistry,
    syncComponents.stateSynchronizer,
    config.relayer,
    actionComponents.newAccountAction,
    actionComponents.depositAction,
    actionComponents.withdrawAction,
    config.publicClient,
    config.callbacks || {},
  );
  return {
    accountRegistry: storageComponents.accountRegistry,
    stateSynchronizer: syncComponents.stateSynchronizer,
    historyFetcher: syncComponents.historyFetcher,
    shielderActions,
  };
}
function createIdentityComponents(config: ShielderClientConfig) {
  const idManager = new IdManager(
    config.shielderSeedPrivateKey,
    config.chainId,
    config.cryptoClient,
  );
  const accountFactory = new AccountFactory(idManager);
  return { idManager, accountFactory };
}
function createStorageComponents(
  config: ShielderClientConfig & {
    idManager: IdManager;
    accountFactory: AccountFactory;
  },
) {
  const internalStorage = createStorage(config.storage);
  const storageManager = new StorageManager(internalStorage);
  const accountStateSerde = new AccountStateSerde(config.idManager);
  const accountRegistry = new AccountRegistry(
    storageManager,
    config.accountFactory,
    accountStateSerde,
  );
  return { internalStorage, accountRegistry };
}
function createActionComponents(
  config: ShielderClientConfig & {
    contract: Contract;
    relayer: IRelayer;
  },
) {
  const newAccountAction = new NewAccountAction(
    config.contract,
    config.cryptoClient,
  );
  const depositAction = new DepositAction(config.contract, config.cryptoClient);
  const withdrawAction = new WithdrawAction(
    config.contract,
    config.relayer,
    config.cryptoClient,
    config.chainId,
  );
  const localStateTransition = new LocalStateTransition(
    newAccountAction,
    depositAction,
    withdrawAction,
  );
  return {
    newAccountAction,
    depositAction,
    withdrawAction,
    localStateTransition,
  };
}
function createSyncComponents(
  config: ShielderClientConfig & {
    contract: Contract;
    relayer: IRelayer;
    idManager: IdManager;
    accountFactory: AccountFactory;
    accountRegistry: AccountRegistry;
    localStateTransition: LocalStateTransition;
  },
) {
  const chainStateTransition = new ChainStateTransition(
    config.contract,
    config.cryptoClient,
    config.localStateTransition,
  );
  const tokenAccountFinder = new TokenAccountFinder(
    config.contract,
    config.cryptoClient,
    config.idManager,
  );
  const stateSynchronizer = new StateSynchronizer(
    config.accountRegistry,
    chainStateTransition,
    tokenAccountFinder,
    config.callbacks?.onNewTransaction,
  );
  const historyFetcher = new HistoryFetcher(
    tokenAccountFinder,
    config.accountFactory,
    chainStateTransition,
  );
  return {
    chainStateTransition,
    tokenAccountFinder,
    stateSynchronizer,
    historyFetcher,
  };
}
