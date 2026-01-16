import { Injectable, ServiceUnavailableException, InternalServerErrorException } from "@nestjs/common";
import { createPublicClient, http, PublicClient } from "viem";
import { avalancheFuji } from "viem/chains";
import SIMPLE_STORAGE from "./simple-storage.json";

@Injectable()
export class BlockchainService {
  private client: PublicClient;
  private contractAddress: `0x${string}`;

  constructor() {
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http("https://api.avax-test.network/ext/bc/C/rpc"),
    });
    this.contractAddress = "0x3fa731B5499253942737c2AD452Edc08bfa1c35f" as `0x${string}`;
  }

  async getLatestValue() {
    try {
      const value = await this.client.readContract({
        address: this.contractAddress,
        abi: SIMPLE_STORAGE.abi,
        functionName: "getValue",
      }) as bigint;
      return { success: true, value: value.toString() };
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  async getValueUpdatedEvents(fromBlock: any, toBlock: any) {
    try {
      const startBlock = BigInt(Number(fromBlock));
      const endBlock = BigInt(Number(toBlock));

      const events = await this.client.getLogs({
        address: this.contractAddress,
        event: {
          type: "event",
          name: "ValueUpdated",
          inputs: [{ name: "newValue", type: "uint256", indexed: false }],
        },
        fromBlock: startBlock,
        toBlock: endBlock,
      });

      return events.map((event: any) => ({
        blockNumber: event.blockNumber?.toString(),
        value: event.args.newValue?.toString(),
        txHash: event.transactionHash,
      }));
    } catch (error) {
      console.error("RPC Error:", error.message);
      this.handleRpcError(error);
    } 
  }

  private handleRpcError(error: unknown): never {
    const message = error instanceof Error ? error.message : String(error);
    throw new InternalServerErrorException(`Blockchain Error: ${message}`);
  }
}