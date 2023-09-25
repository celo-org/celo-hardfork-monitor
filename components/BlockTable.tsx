import React from "react";
import { LastPolledProps } from "../utils";

type Props = {
  blocks: LastPolledProps;
};

const BlockTable: React.FC<Props> = ({ blocks }) => {
  return (
    <div className="mt-10 flex flex-col">
      <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow border-b border-gray-200 sm:rounded-lg ">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 font-openSans">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {"Timestamp"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {"Block Number"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {"Hash"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 font-openSans">
                {blocks["Forno"].blocks.map((block) => {
                  return (
                    <tr key={block.number}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {block.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`https://explorer.celo.org/mainnet/block/${block.number}/transactions`}
                          className="text-sm text-lime-800"
                          target={"_blank"}
                          rel="noreferrer"
                        >
                          {block.number}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`https://explorer.celo.org/mainnet/block/${block.hash}/transactions`}
                          className="text-sm text-lime-800"
                          target={"_blank"}
                          rel="noreferrer"
                        >
                          {block.hash.slice(0, 10) +
                            "....." +
                            block.hash.slice(-10)}
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockTable;
