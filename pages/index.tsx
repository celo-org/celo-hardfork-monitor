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
import { LastPolledProps, hardForkBlock } from "../utils";
import { ResProp } from "./api/block";

const Home: NextPage = () => {
  // set an interval for 5 sec loop in useEffect
  const [data, setData] = useState<LastPolledProps | null>();
  const [currBlock, setCurrBlock] = useState<number>();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [hardForkTimestamp, setHardForkTimestamp] = useState<Date | null>(null);
  const [hardForkTimeRemainingInSec, sethardForkTimeRemainingInSec] =
    useState(0);

  useEffect(() => {
    fetchBlockData();
    const interval = setInterval(() => {
      // call the function to fetch the data
      fetchBlockData();
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
    sethardForkTimeRemainingInSec(remainingTimeInSec);
  };

  // fetch the data from the API
  const fetchBlockData = async () => {
    const response = await fetch("/api/block");
    const data: ResProp = await response.json();
    setData(null);
    setData(data.blocks);
    setCurrBlock(data.blockNumber ?? 0);
    checkForHardFork(data.blockNumber);
    // if (!hardForkTimestamp) {
    calcTimeRemaining(data.blockNumber);
    // }
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
          <div className="flex flex-col lg:flex-row justify-between items-center flex-container">
            <h1 className="text-4xl font-semibold mt-10 flex flex-col items-start">
              <Image
                src="https://images.ctfassets.net/wr0no19kwov9/5yVbTScDuXaZE0JL0w1kL0/f626c00085927069b473e684148c36f3/Union_1_.svg"
                width={200}
                height={60}
                alt="Celo Logo"
              />
            </h1>
            <a
              className="mt-3 lg:mt-1 flex flex-row items-center cursor-pointer"
              href={`https://explorer.celo.org/mainnet/block/${currBlock}/transactions`}
              target={"_blank"}
              rel="noreferrer"
            >
              <span className="text-lg mr-2 font-bold">Current Block</span>
              <span className="text-2xl font-bold text-lime-800 font-orbitron mr-3">
                {currBlock}
              </span>
            </a>
          </div>
          <div className="lg:text-4xl font-bold text-2xl font-openSans mt-8">
            🍞 Gingerbread Hardfork Monitor (v1.8.0)
          </div>
          <h2 className="text-2xl mt-8 font-openSans">
            Hardfork is scheduled for 26 Sep 2023 17:16:01 UTC
          </h2>

          <h3 className="text-large font-openSans">
            Read about Hardfork{" "}
            <a
              href="https://forum.celo.org/t/mainnet-alfajores-gingerbread-hard-fork-release-sep-26-17-00-utc/6499"
              target={"_blank"}
              rel="noreferrer"
              className="text-lime-800"
            >
              here.
            </a>
            <p>
              <em>
                Validators, if you agree with this hard fork, please upgrade
                both your validator nodes and proxies to v1.8.0.
              </em>
            </p>
          </h3>

          <p>
            Countdown:{" "}
            <span className="font-bold text-lime-800 mr-3">
              {Math.floor(hardForkTimeRemainingInSec / 60 / 60)} hours{" "}
              {Math.floor(hardForkTimeRemainingInSec / 60) % 60} min{" "}
              {Math.floor(hardForkTimeRemainingInSec) % 60} seconds
            </span>
          </p>

          <p>
            Estimated time until hardfork:
            {hardForkTimestamp?.toLocaleDateString()}: <strong>PST</strong>{" "}
            {hardForkTimestamp?.toLocaleTimeString("en-US", {
              timeZone: "PST",
            })}{" "}
            <strong>EST</strong>{" "}
            {hardForkTimestamp?.toLocaleTimeString("en-US", {
              timeZone: "EST",
            })}{" "}
            <strong>UTC</strong>{" "}
            {hardForkTimestamp?.toLocaleTimeString("en-GB", {
              timeZone: "UTC",
            })}{" "}
            <strong>CEST</strong>{" "}
            {hardForkTimestamp?.toLocaleTimeString("en-DE", {
              timeZone: "CET",
            })}
          </p>

          {currBlock && hardForkBlock - currBlock > 0 && (
            <section className="mt-16 flex flex-row justify-start items-center">
              <>
                <h1 className="text-xl font-semibold mr-5 font-openSans">
                  Countdown until Hardfork
                </h1>
                <h2 className="text-2xl font-bold border-2 rounded-lg px-2 py-1 font-openSans">
                  {currBlock ? (
                    <div className="flex flex-row items-center">
                      <span className="text-4xl text-lime-800 font-orbitron mr-3">
                        {hardForkBlock - currBlock}
                      </span>
                      {"  "}
                      <span className="">blocks to go</span>
                    </div>
                  ) : (
                    <span className="text-lg text-gray-700 mt-2">
                      Wait for it...
                    </span>
                  )}
                </h2>
              </>
            </section>
          )}

          {currBlock && hardForkBlock - currBlock <= 0 && (
            <section className="font-openSans text-2xl font-bold mt-5">
              🎉 Celo Hardfork 1.8.0 is now LIVE 🎉
            </section>
          )}

          {data && data["Forno"] && (
            <>
              <section className="">
                <Table
                  blockNumber={data["Forno"].blocks[0].number}
                  blocksHash={data["Forno"].blocks[0].hash}
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
