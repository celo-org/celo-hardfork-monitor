import { BlockTransactionString } from "./node_modules/web3-eth/types/index.d";

export const hardForkBlock = 16048500;

export type NodeProps = {
  url: string;
  explorer: string;
  name: string;
};

export type LastPolledProps = {
  [key: string]: {
    timestamp: number;
    blocks: BlockTransactionString[];
  };
};

export const nodes: NodeProps[] = [
  {
    url: "https://forno.celo.org",
    explorer: "https://explorer.celo.org/blocks/%s",
    name: "Ferno",
  },
];
