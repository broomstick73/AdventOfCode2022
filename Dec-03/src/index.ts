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
  .description("Solve Advent of Code Dec 3")
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

interface Sacks {
  sack1: string;
  sack2: string;
}

function splitRuckSack(inputLine: string): Sacks {
  const totalLength = inputLine.length;
  const sackLength = totalLength / 2;
  const sack1 = inputLine.slice(0, sackLength);
  const sack2 = inputLine.slice(sackLength);

  return {
    sack1,
    sack2,
  };
}

function findCommonItem(sacks: Sacks): string {
  const { sack1, sack2 } = sacks;
  for (let index = 0; index < sack1.length; index++) {
    const letterToLookFor = sack1.charAt(index);
    if (sack2.includes(letterToLookFor)) {
      return letterToLookFor;
    }
  }
  return "";
}

function calculateLetterPriority(letter: string): number {
  // Lowercase item types a through z have priorities 1 through 26.
  // Uppercase item types A through Z have priorities 27 through 52.
  if (
    letter.charCodeAt(0) >= "a".charCodeAt(0) &&
    letter.charCodeAt(0) <= "z".charCodeAt(0)
  ) {
    const value = letter.charCodeAt(0) - "a".charCodeAt(0) + 1;
    return value;
  } else {
    const value = letter.charCodeAt(0) - "A".charCodeAt(0) + 27;
    return value;
  }
}

interface GroupSacks {
  sack1: string;
  sack2: string;
  sack3: string;
}
function findGroupRuckSacks(
  listOfSacks: string[],
  groupNumber: number
): GroupSacks {
  const sack1Index = (groupNumber - 1) * 3 + 0;
  const sack2Index = (groupNumber - 1) * 3 + 1;
  const sack3Index = (groupNumber - 1) * 3 + 2;
  const sack1 = listOfSacks[sack1Index];
  const sack2 = listOfSacks[sack2Index];
  const sack3 = listOfSacks[sack3Index];

  return {
    sack1,
    sack2,
    sack3,
  };
}

function findCommonItemInGroupSacks(groupSacks: GroupSacks): string {
  const { sack1, sack2, sack3 } = groupSacks;
  for (let index = 0; index < sack1.length; index++) {
    const letterToLookFor = sack1.charAt(index);
    if (sack2.includes(letterToLookFor) && sack3.includes(letterToLookFor)) {
      return letterToLookFor;
    }
  }
  return "";
}

async function main(): Promise<void> {
  const input = await readInputFile();
  let sumTotal = 0;
  input.forEach((line) => {
    const { sack1, sack2 } = splitRuckSack(line);
    // console.log(`${line} contains sack1: ${sack1} and sack2: ${sack2}`);
    const commonLetter = findCommonItem({ sack1, sack2 });
    // console.log(`the common letter is ${commonLetter}`);
    const letterPriority = calculateLetterPriority(commonLetter);
    // console.log(`${letterPriority} (${commonLetter})`);
    sumTotal = sumTotal + letterPriority;
  });

  // problem 1
  console.log(`problem 1`);
  console.log(`sum total is ${sumTotal}`);

  // problem 2
  sumTotal = 0;
  const totalNumberOfRuckSacks = input.length;
  const totalNumberOfGroups = totalNumberOfRuckSacks / 3;
  for (let groupNumber = 1; groupNumber <= totalNumberOfGroups; groupNumber++) {
    const { sack1, sack2, sack3 } = findGroupRuckSacks(input, groupNumber);
    // console.log(`group ${groupNumber} has sacks`);
    // console.log(sack1);
    // console.log(sack2);
    // console.log(sack3);
    // console.log();
    const commonLetter = findCommonItemInGroupSacks({ sack1, sack2, sack3 });
    const letterPriority = calculateLetterPriority(commonLetter);
    console.log(`${letterPriority} (${commonLetter})`);
    sumTotal = sumTotal + letterPriority;
  }
  console.log(`problem 2`);
  console.log(`sum total is ${sumTotal}`);
}

void main();
