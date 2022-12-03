// import * as fs from 'fs';
// fs.readFileSync('foo.txt','utf8');
// const figlet = require("figlet");
// console.log(figlet.textSync("Dir Manager"));
// const fs = require("node:fs");
import { createReadStream } from "fs";
import * as readline from "readline";
import { Command } from "commander"; // add this line

const program = new Command();

program
  .version("1.0.0")
  .description("Solve Advent of Code Dec 1")
  .option("-i, --input <value>", "input file")
  .parse(process.argv);

const options = program.opts();
// const readline = require("node:readline");

async function readInputFile(): Promise<string[]> {
  const inputFileName =
    Boolean(options.input) && typeof options.input === "string"
      ? options.input
      : "input.txt";

  console.log(`inputFileName = ${inputFileName}`);

  const fileStream = createReadStream(inputFileName);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  const data: string[] = [];

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    // console.log(`Line from file: ${line}`);
    data.push(line);
  }
  return data;
}

function calculateScore(opponent: string, self: string): number {
  const calculateShapeScore = (shape: string): number => {
    if (shape === "X") {
      // rock
      return 1;
    } else if (shape === "Y") {
      // paper
      return 2;
    } else {
      // shape = "Z"
      // scissors
      return 3;
    }
  };

  // self
  // X for Rock, Y for Paper, and Z for Scissors

  // opponent
  // A for Rock, B for Paper, and C for Scissors.

  // outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won)
  // Rock defeats Scissors, Scissors defeats Paper, and Paper defeats Rock
  const calculateOutcomeScore = (
    opponentShape: string,
    selfShape: string
  ): number => {
    if (opponentShape === "A") {
      // opponent throws rock
      if (selfShape === "X") {
        // self throws rock
        return 3;
      } else if (selfShape === "Y") {
        // self throws paper
        return 6;
      } else if (selfShape === "Z") {
        // self throws scissors
        return 0;
      }
    } else if (opponentShape === "B") {
      // opponent throws paper
      if (selfShape === "X") {
        // self throws rock
        return 0;
      } else if (selfShape === "Y") {
        // self throws paper
        return 3;
      } else if (selfShape === "Z") {
        // self throws scissors
        return 6;
      }
    } else if (opponentShape === "C") {
      // opponent throws scissors
      if (selfShape === "X") {
        // self throws rock
        return 6;
      } else if (selfShape === "Y") {
        // self throws paper
        return 0;
      } else if (selfShape === "Z") {
        // self throws scissors
        return 3;
      }
    }
    return -1;
  };

  const shapeScore = calculateShapeScore(self);
  const outcomeScore = calculateOutcomeScore(opponent, self);
  const totalScore = shapeScore + outcomeScore;
  // console.log(`shapeScore = ${shapeScore}`);
  // console.log(`outcomeScore = ${outcomeScore}`);
  // console.log(`totalScore = ${totalScore}`);
  return totalScore;
}

function calculateSelfShape(
  opponentShape: string,
  outcomeResult: string
): string {
  // opponent
  // A for Rock, B for Paper, and C for Scissors.

  // outcomeResult
  // X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win.

  // output
  // self
  // X for Rock, Y for Paper, and Z for Scissors

  if (opponentShape === "A" && outcomeResult === "X") {
    // opponent rock
    // result lose
    return "Z";
  } else if (opponentShape === "A" && outcomeResult === "Y") {
    // opponent rock
    // result draw
    return "X";
  } else if (opponentShape === "A" && outcomeResult === "Z") {
    // opponent rock
    // result win
    return "Y";
  } else if (opponentShape === "B" && outcomeResult === "X") {
    // opponent paper
    // result lose
    return "X";
  } else if (opponentShape === "B" && outcomeResult === "Y") {
    // opponent paper
    // result draw
    return "Y";
  } else if (opponentShape === "B" && outcomeResult === "Z") {
    // opponent paper
    // result win
    return "Z";
  } else if (opponentShape === "C" && outcomeResult === "X") {
    // opponent scissors
    // result lose
    return "Y";
  } else if (opponentShape === "C" && outcomeResult === "Y") {
    // opponent scissors
    // result draw
    return "Z";
  } else if (opponentShape === "C" && outcomeResult === "Z") {
    // opponent scissors
    // result win
    return "X";
  }
  console.log("error");
  return "";
}

async function main(): Promise<void> {
  const input = await readInputFile();

  // problem 1
  console.log(`problem 1`);
  let totalScore = 0;
  input.forEach((line) => {
    const opponentShape = line.charAt(0);
    const selfShape = line.charAt(2);
    // console.log(`opponent threw ${opponentShape} self threw ${selfShape}`);
    const scoreForThisLine = calculateScore(opponentShape, selfShape);
    totalScore = totalScore + scoreForThisLine;
  });
  console.log(`total score is ${totalScore}`);

  // problem 2
  console.log(`problem 2`);
  totalScore = 0;
  input.forEach((line) => {
    const opponentShape = line.charAt(0);
    const matchResolution = line.charAt(2);
    const selfShape = calculateSelfShape(opponentShape, matchResolution);
    const scoreForThisLine = calculateScore(opponentShape, selfShape);
    totalScore = totalScore + scoreForThisLine;
  });
  console.log(`total score is ${totalScore}`);
}

void main();
