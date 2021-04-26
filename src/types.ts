import {
  HexNumber,
  HexString,
  Script,
  OutPoint,
  CellDep,
  Input,
  WitnessArgs,
  Cell,
  core,
} from "@ckb-lumos/base";
import {
  TransactionSkeleton,
  TransactionSkeletonType,
} from "@ckb-lumos/helpers";
import { normalizers, Reader } from "ckb-js-toolkit";
import { List, Map } from "immutable";

export type CellOutputWithData = [CellOutput, HexString];

export interface GodwokenTransactionSkeleton {
  inputs: InputCellInfo[];
  cell_deps: CellDep[];
  witnesses: WitnessArgs[];
  cell_outputs: CellOutputWithData[];
}

export interface InputCellInfo {
  input: Input;
  cell: CellInfo;
}

export interface CellInfo {
  out_point: OutPoint;
  output: CellOutput;
  data: HexString;
}

export interface CellOutput {
  capacity: HexNumber;
  lock: Script;
  type?: Script;
}

export function godwokenTransactionSkeletonToTxSkeleton(
  skeleton: GodwokenTransactionSkeleton
): TransactionSkeletonType {
  let inputSinces: Map<number, HexNumber> = Map();
  skeleton.inputs.forEach((input, i) => {
    const since = input.input.since;
    if (since !== "0x0") {
      inputSinces = inputSinces.set(i, since);
    }
  });

  let target = TransactionSkeleton({
    cellDeps: List(skeleton.cell_deps),
    inputs: List(skeleton.inputs.map((input) => convertInput(input))),
    outputs: List(
      skeleton.cell_outputs.map((output) => {
        return convertOutput(output);
      })
    ),
    witnesses: List(
      skeleton.witnesses.map((wit) => {
        if (typeof wit === "string") {
          return wit;
        }
        return new Reader(
          core.SerializeWitnessArgs(normalizers.NormalizeWitnessArgs(wit))
        ).serializeJson();
      })
    ),
    inputSinces: inputSinces,
    headerDeps: List([]),
    fixedEntries: List([]),
    signingEntries: List([]),
  });

  // freeze all inputs & outputs
  target.inputs.forEach((_input, i) => {
    target = target.update("fixedEntries", (fixedEntries) => {
      return fixedEntries.push({
        field: "inputs",
        index: i,
      });
    });
  });

  target.outputs.forEach((_output, i) => {
    target = target.update("fixedEntries", (fixedEntries) => {
      return fixedEntries.push({
        field: "outputs",
        index: i,
      });
    });
  });

  return target;
}

function convertInput(input: InputCellInfo): Cell {
  return {
    cell_output: {
      ...input.cell.output,
    },
    out_point: input.input.previous_output,
    data: input.cell.data,
  };
}

function convertOutput(output: CellOutputWithData): Cell {
  return {
    cell_output: {
      ...output[0],
    },
    data: output[1],
  };
}

export function txSkeletonToGodwokenSkeleton(
  txSkeleton: TransactionSkeletonType
): GodwokenTransactionSkeleton {
  const godwokenSkeleton: GodwokenTransactionSkeleton = {
    cell_deps: txSkeleton.get("cellDeps").toJS(),
    inputs: txSkeleton
      .get("inputs")
      .map((input, i) => {
        const since = txSkeleton.get("inputSinces").get(i) || "0x0";
        return {
          input: {
            previous_output: input.out_point!,
            since,
          },
          cell: {
            out_point: input.out_point!,
            output: input.cell_output,
            data: input.data,
          },
        };
      })
      .toJS(),
    cell_outputs: txSkeleton
      .get("outputs")
      .map((output) => {
        const cellOutputWithData: CellOutputWithData = [
          output.cell_output,
          output.data,
        ];
        return cellOutputWithData;
      })
      .toJS(),
    witnesses: txSkeleton
      .get("witnesses")
      .filter((witness) => witness !== "0x")
      .map((witness) => {
        return deserializeWitnessArgs(witness);
      })
      .toJS(),
  };

  return godwokenSkeleton;
}

function deserializeWitnessArgs(witness: string): WitnessArgs {
  const newWitnessArgs: WitnessArgs = {};
  const witnessArgs = new core.WitnessArgs(new Reader(witness));
  const lock = witnessArgs.getLock();
  if (lock.hasValue()) {
    newWitnessArgs.lock = new Reader(lock.value().raw()).serializeJson();
  }

  const inputType = witnessArgs.getInputType();
  if (inputType.hasValue()) {
    newWitnessArgs.input_type = new Reader(
      inputType.value().raw()
    ).serializeJson();
  }
  const outputType = witnessArgs.getOutputType();
  if (outputType.hasValue()) {
    newWitnessArgs.output_type = new Reader(
      outputType.value().raw()
    ).serializeJson();
  }

  return newWitnessArgs;
}
