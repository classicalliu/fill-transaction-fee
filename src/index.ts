import { initializeConfig } from "@ckb-lumos/config-manager";
import { Indexer } from "@ckb-lumos/indexer";
import jayson from "jayson";
import path from "path";
import { payFeeInterface } from "./pay-fee";

if (process.env.LUMOS_CONFIG_FILE) {
  process.env.LUMOS_CONFIG_FILE = path.resolve(process.env.LUMOS_CONFIG_FILE);
}
console.log("LUMOS_CONFIG_FILE:", process.env.LUMOS_CONFIG_FILE);
initializeConfig();

const ckbRPC = process.env.CKB_RPC || "http://localhost:8114";
const indexerDataPath = process.env.INDEXER_DATA || "./indexer-data";
const indexer = new Indexer(ckbRPC, indexerDataPath);

const server = (jayson as any).server({
  pay_fee: async (args: any[], callback: any) => {
    try {
      const godwokenTransactionSkeleton = args[0];
      const lockScript = args[1];
      const feeRate = BigInt(args[2]);

      const result = await payFeeInterface(
        indexer,
        godwokenTransactionSkeleton,
        lockScript,
        feeRate
      );

      callback(null, result);
    } catch (err) {
      console.log("JSON RPC server error:", err);
      callback(err);
    }
  },
});

server.http().listen(process.env.PORT || 8888);
