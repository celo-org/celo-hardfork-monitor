import { LastPolledProps } from "./../../utils";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Web3 from "web3";
import { NodeProps, nodes } from "../../utils";

export type ResProp = {
  blocks: LastPolledProps;
  blockNumber: number;
};

const lastPolled: LastPolledProps = {};
let lastPolledBlock: number = 0;

const getLatestBlock = async (node: NodeProps) => {
  const url = "https://forno.celo.org";
  const web3 = new Web3(new Web3.providers.HttpProvider(url));
  var block = await web3.eth.getBlock("latest");
  return block;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResProp>
) {
  await Promise.all(
    nodes.map(async (node, index) => {
      if (!lastPolled[node.name]) {
        lastPolled[node.name] = {
          timestamp: 0,
          blocks: [],
        };
      }
      if (!lastPolledBlock) {
        lastPolledBlock = (await getLatestBlock(node)).number;
      }
      // Wait for 3 seconds before polling again
      if (lastPolled[node.name].timestamp + 3000 < Date.now()) {
        var block = await getLatestBlock(node);
        lastPolledBlock = block.number;
        lastPolled[node.name].timestamp = Date.now();
        // add block to the list and limit the blocks to latest 30 blocks
        lastPolled[node.name].blocks.unshift(block);
        // only keep top 30 blocks in lastpolled
        if (lastPolled[node.name].blocks.length > 30) {
          lastPolled[node.name].blocks.splice(
            30,
            lastPolled[node.name].blocks.length
          );
        }
      }
    })
  );
  res.status(200).json({ blocks: lastPolled, blockNumber: lastPolledBlock });
}
