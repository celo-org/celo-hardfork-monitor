export const hardForkBlock = 26384000;

export type NodeProps = {
  url: string;
  name: string;
};

export const nodes: NodeProps[] = [
  {
    url: "https://alfajores-forno.celo-testnet.org",
    name: "Forno",
  },
];
