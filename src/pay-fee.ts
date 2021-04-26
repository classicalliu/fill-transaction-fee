import { Address, core, Indexer, Script, WitnessArgs } from "@ckb-lumos/base";
import { generateAddress, TransactionSkeletonType } from "@ckb-lumos/helpers";
import { common } from "@ckb-lumos/common-scripts";
import { normalizers, Reader } from "ckb-js-toolkit";
import {
  GodwokenTransactionSkeleton,
  godwokenTransactionSkeletonToTxSkeleton,
  txSkeletonToGodwokenSkeleton,
} from "./types";

export async function payFeeInterface(
  indexer: Indexer,
  godwokenSkeleton: GodwokenTransactionSkeleton,
  fromLockScript: Script,
  feeRate: bigint
): Promise<GodwokenTransactionSkeleton> {
  let txSkeleton = godwokenTransactionSkeletonToTxSkeleton(godwokenSkeleton);
  const fromAddress = generateAddress(fromLockScript);

  txSkeleton = await payFee(indexer, txSkeleton, fromAddress, feeRate);

  return txSkeletonToGodwokenSkeleton(txSkeleton);
}

export async function payFee(
  indexer: Indexer,
  txSkeleton: TransactionSkeletonType,
  fromAddress: Address,
  feeRate: bigint
): Promise<TransactionSkeletonType> {
  txSkeleton = txSkeleton.set("cellProvider", indexer);

  const witnessesSize: number = txSkeleton.witnesses.size;
  const inputsSize: number = txSkeleton.inputs.size;
  if (witnessesSize < inputsSize) {
    txSkeleton = txSkeleton.update("witnesses", (witnesses) => {
      return witnesses.concat(new Array(inputsSize - witnessesSize).fill("0x"));
    });
  }

  txSkeleton = await common.payFeeByFeeRate(txSkeleton, [fromAddress], feeRate);

  const filledInputSize = txSkeleton.inputs.size;

  if (filledInputSize > inputsSize) {
    const witnessArgs: WitnessArgs = {
      lock: "0x" + "0".repeat(130),
    };

    const witness = new Reader(
      core.SerializeWitnessArgs(normalizers.NormalizeWitnessArgs(witnessArgs))
    ).serializeJson();

    txSkeleton = txSkeleton.update("witnesses", (witnesses) => {
      return witnesses
        .push(witness)
        .concat(new Array(filledInputSize - inputsSize - 1).fill("0x"));
    });
  }

  return txSkeleton;
}
