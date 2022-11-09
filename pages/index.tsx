/* eslint-disable react/jsx-key */
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import BlockTable from "../components/BlockTable";
import Table from "../components/Table";
import styles from "../styles/Home.module.css";
import { hardForkBlock, LastPolledProps } from "../utils";
import { ResProp } from "./api/block";

const Home: NextPage = () => {
  // set an interval for 5 sec loop in useEffect
  const [data, setData] = useState<LastPolledProps | null>();
  const [currBlock, setCurrBlock] = useState<number>();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [hardForkTimestamp, setHardForkTimestamp] = useState<Date | null>(null);

  useEffect(() => {
    fetchBlockData();
    const interval = setInterval(() => {
      // call the function to fetch the data
      fetchBlockData();
      console.log("hardForkTimestamp :>> ", hardForkTimestamp);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const calcTimeRemaining = (currentBlockNumber: number) => {
    var remainingTimeInSec = (hardForkBlock - currentBlockNumber!) * 5;
    console.log("remainingTimeInSec :>> ", remainingTimeInSec);
    var hardForkTimestampTemp = new Date();
    hardForkTimestampTemp.setSeconds(
      hardForkTimestampTemp.getSeconds() + remainingTimeInSec
    );
    setHardForkTimestamp(hardForkTimestampTemp);
  };

  // fetch the data from the API
  const fetchBlockData = async () => {
    const response = await fetch("/api/block");
    const data: ResProp = await response.json();
    setData(null);
    setData(data.blocks);
    setCurrBlock(data.blockNumber ?? 0);
    checkForHardFork(data.blockNumber);
    if (!hardForkTimestamp) {
      calcTimeRemaining(data.blockNumber);
    }
  };

  const checkForHardFork = async (blockNumber: number) => {
    if (blockNumber - hardForkBlock == 0) {
      setShowConfetti(true);
      setInterval(() => {
        setShowConfetti(false);
      }, 15000);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Celo Hardfork Watch Party</title>
          <meta name="description" content="Celo Hardfork Monitor" />
          <link rel="icon" href="/celo-logo.png" />
        </Head>

        <main className="mx-auto max-w-5xl">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-4xl font-semibold mt-10 flex flex-row items-center">
              <Image
                src="/celo-logo-2.png"
                width={200}
                height={60}
                alt="Celo Logo"
              />
              <span className="font-openSans">
                🍮 Flan Hardfork Monitor (v1.7.0)
              </span>
            </h1>
            <a
              className="flex flex-row items-center cursor-pointer"
              href={`https://explorer.celo.org/mainnet/block/${currBlock}/transactions`}
              target={"_blank"}
              rel="noreferrer"
            >
              <span className="text-lg mr-2 font-bold">Block</span>
              <span className="text-2xl font-bold text-red-500 font-orbitron mr-3">
                {currBlock}
              </span>
            </a>
          </div>
          <h2 className="text-lg font-semibold mt-2 font-openSans">
            <i>
              Hardfork is scheduled for November 9th 2022, around 16:30 - 17:00
              UTC (8:30 - 9:00am PDT))
            </i>
          </h2>
          <h3 className="text-md font-openSans">
            Read about Hardfork{" "}
            <a
              href="https://forum.celo.org/t/flan-hard-fork-proposal-nov-9th-16-30-utc/4644"
              target={"_blank"}
              rel="noreferrer"
              className="text-blue-500"
            >
              here.
            </a>
            <p>
              Validators, if you agree with this hard fork, please upgrade both
              your validator nodes and proxies to v1.7.0 and fill out{" "}
              <a
                href="https://forms.gle/jJ64hQ9DST77VnzX7"
                target={"_blank"}
                rel="noreferrer"
                className="text-blue-500"
              >
                this{" "}
              </a>
              form to help us keep track of who has upgraded.
            </p>
          </h3>

          <section className="mt-16 flex flex-row justify-start items-center">
            <h1 className="text-xl font-semibold mr-5 font-openSans">
              Countdown until Hardfork
            </h1>
            <h2 className="text-2xl font-bold border-2 rounded-lg px-2 py-1 font-openSans">
              {currBlock ? (
                <div className="flex flex-row items-center">
                  <span className="text-4xl text-red-500 font-orbitron mr-3">
                    {hardForkBlock - currBlock}
                  </span>
                  {"  "}
                  <span className="">Blocks</span>
                </div>
              ) : (
                <span className="text-lg text-gray-700 mt-2">
                  Wait for itttt
                </span>
              )}
            </h2>
          </section>
          <p className="font-openSans font-lg font-semibold mt-5">
            Estimated time for Hardfork - {hardForkTimestamp?.toUTCString()}
          </p>
          {currBlock && hardForkBlock - currBlock < 0 && (
            <section className="font-openSans text-2xl font-bold mt-5">
              🎉 Celo Hardfork 1.7.0 is LIVE 🎉
            </section>
          )}

          {data && data["Ferno"] && (
            <>
              <section className="">
                <Table
                  blockNumber={data["Ferno"].blocks[0].number}
                  blocksHash={data["Ferno"].blocks[0].hash}
                />
              </section>
              <section>
                <BlockTable blocks={data} />
              </section>
            </>
          )}
        </main>
      </div>
      {showConfetti && (
        <Confetti
          gravity={0.05}
          run={true}
          numberOfPieces={400}
          width={width}
          height={height}
        />
      )}
    </>
  );
};

export default Home;
