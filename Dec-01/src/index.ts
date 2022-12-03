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

async function processLineByLine(): Promise<string[]> {
  const inputFileName =
    Boolean(options.input) && typeof options.input === "string"
      ? options.input
      : "input.txt";
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

type Elf = number[];
type Elves = Elf[];

async function processDataIntoElves(): Promise<Elves> {
  const returnData = await processLineByLine();
  const elves: Elves = [];
  let currentElf: Elf = [];

  //   console.log(returnData);
  returnData.forEach((line) => {
    // console.log(line);
    if (line === "") {
      // done with the current elf; push it
      if (currentElf.length > 0) {
        // console.log(`pushing the current elf to the list of elves`);
        elves.push(currentElf);
        // console.log(`elves is now ${elves}`);
        currentElf = [];
      }
    } else {
      const value = Number.parseInt(line, 10);
      //   console.log(`processing ${line} as ${value}`);
      currentElf.push(value);
      //   console.log(`current elf now is now ${currentElf}`);
    }
  });
  if (currentElf.length > 0) {
    elves.push(currentElf);
  }
  //   console.log(elves);
  return elves;
}

async function main(): Promise<void> {
  const elves = await processDataIntoElves();
  //   console.log(elves);
  const totalCaloriesPerElf = elves.map((elf) => {
    const currentElfTotal = elf.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    return currentElfTotal;
  });
  const singleELfMax = Math.max(...totalCaloriesPerElf);
  console.log(`the elf with the most has ${singleELfMax}`);
  totalCaloriesPerElf.sort((a, b) => b - a);
  console.log(
    `the top three elves have ${totalCaloriesPerElf[0]}, ${totalCaloriesPerElf[1]}, and ${totalCaloriesPerElf[2]}`
  );
  const topThreeTotal =
    totalCaloriesPerElf[0] + totalCaloriesPerElf[1] + totalCaloriesPerElf[2];
  console.log(`which is a total of ${topThreeTotal}`);
}

void main();
