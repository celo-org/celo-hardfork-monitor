import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { createPublicClient, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { nodes } from "../utils";

const hardForkBlock = 26384000;

const Home: NextPage = () => {
  const [currBlock, setCurrBlock] = useState<number>();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [hardForkTimestamp, setHardForkTimestamp] = useState<Date | null>(null);
  const [hardForkTimeRemainingInSec, sethardForkTimeRemainingInSec] =
    useState(0);

  const fetchCurrentBlockNumber = async () => {
    try {
      const client = createPublicClient({
        chain: celoAlfajores,
        transport: http(nodes[0].url),
      });
      const currentBlockNumber = await client.getBlockNumber();
      setCurrBlock(Number(currentBlockNumber));
      calcTimeRemaining(Number(currentBlockNumber));
      checkForHardFork(Number(currentBlockNumber));
    } catch (error) {
      console.error("Error fetching current block number:", error);
    }
  };

  useEffect(() => {
    fetchCurrentBlockNumber();

    // Interval to update block number every 5 seconds
    const blockInterval = setInterval(() => {
      setCurrBlock((prevBlock) => {
        if (prevBlock !== undefined) {
          const newBlock = prevBlock + 1;
          checkForHardFork(newBlock);
          return newBlock;
        }
        return prevBlock;
      });
    }, 5000); // Update every 5 seconds

    // Interval to update timer every second
    const timerInterval = setInterval(() => {
      sethardForkTimeRemainingInSec((prevTime) => prevTime - 1);
    }, 1000); // Update every second

    return () => {
      clearInterval(blockInterval);
      clearInterval(timerInterval);
    };
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

  const checkForHardFork = async (blockNumber: number) => {
    if (hardForkBlock - blockNumber <= 0) {
      setShowConfetti(true);
      setInterval(() => {
        setShowConfetti(false);
      }, 15000);
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#1E002B",
          color: "white",
          minHeight: "100vh",
        }}
      >
        <Head>
          <title>Alfajores Layer 2 Watch Party</title>
          <meta name="description" content="Celo Migration Monitor" />
          <link rel="icon" href="/celo-logo.png" />
        </Head>

        <main className="mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row justify-between items-center flex-container">
            <h1 className="text-4xl font-semibold mt-10 flex flex-col items-start">
              <Image src="/celo.png" width={40} height={40} alt="Celo Logo" />
            </h1>
            <div className="mt-5 lg:mt-0">
              <span className="text-lg mr-2 font-bold">Current Block</span>
              <span className="text-2xl font-bold text-lime-800 font-orbitron mr-3">
                {currBlock}
              </span>
            </div>
          </div>
          <div className="lg:text-4xl font-bold text-2xl text-center font-openSans mt-8">
            Alfajores Layer 2 Watch Party
          </div>
          <h2 className="text-2xl mt-8 font-openSans text-center px-5">
            Layer 2 Migration is scheduled for 26 Sep 2024 10:00:00 CET
          </h2>

          <h3 className="text-large font-openSans text-center mt-2">
            Read about the Cel2{" "}
            <a
              href="https://docs.celo.org/cel2"
              target={"_blank"}
              rel="noreferrer"
              className="text-lime-800"
            >
              here.
            </a>
          </h3>

          <p className="text-center lg:text-4xl text-2xl mt-8 px-5">
            Countdown:{" "}
            <span className="font-bold text-lime-800 mr-3">
              {Math.floor(hardForkTimeRemainingInSec / 60 / 60) > 0
                ? Math.floor(hardForkTimeRemainingInSec / 60 / 60)
                : 0}{" "}
              hours{" "}
              {Math.floor(hardForkTimeRemainingInSec / 60) % 60 > 0
                ? Math.floor(hardForkTimeRemainingInSec / 60) % 60
                : 0}{" "}
              min{" "}
              {Math.floor(hardForkTimeRemainingInSec) % 60 > 0
                ? Math.floor(hardForkTimeRemainingInSec) % 60
                : 0}{" "}
              seconds
            </span>
          </p>

          {currBlock && hardForkBlock - currBlock > 0 && (
            <section className="mt-16 flex flex-row justify-center items-center">
              <div className="flex flex-col items-center">
                <h1 className="text-xl font-semibold mr-5 font-openSans">
                  Countdown until Migration
                </h1>
                <h2 className="text-2xl font-bold border-2 rounded-lg px-2 py-1 font-openSans mt-2">
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
              </div>
            </section>
          )}

          {currBlock && hardForkBlock - currBlock <= 0 && (
            <section className="text-center font-openSans text-2xl font-bold mt-10">
              🎉 Celo Migration to Ethereum L2 is now LIVE 🎉
            </section>
          )}

          <ul className="list-disc text-start text-sm mt-12 text-white text-opacity-60 px-8">
            <li>Get ready for the Alfajores L2 testnet launch!</li>
            <li>
              The hardfork is set for block 26,383,999/26,384,000 at 10 AM CET
              on 26 Sep 2024.
            </li>
            <li>
              During the migration, there will be downtime between L1 & L2 for
              up to 6 hours, though we aim for &lt;1 hr.
            </li>
          </ul>
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
