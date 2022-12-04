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

interface NumberRange {
  rangeStart: number;
  rangeEnd: number;
}
interface ElfPair {
  firstElf: NumberRange;
  secondElf: NumberRange;
}

function parseInputLineIntoELfPair(line: string): ElfPair {
  return {
    firstElf: {
      rangeStart: Number.parseInt(line.split(",")[0].split("-")[0], 10),
      rangeEnd: Number.parseInt(line.split(",")[0].split("-")[1], 10),
    },
    secondElf: {
      rangeStart: Number.parseInt(line.split(",")[1].split("-")[0], 10),
      rangeEnd: Number.parseInt(line.split(",")[1].split("-")[1], 10),
    },
  };
}

function isAisFullyContainedByB(a: NumberRange, b: NumberRange): boolean {
  return a.rangeStart >= b.rangeStart && a.rangeEnd <= b.rangeEnd;
}

function IsOneElfRangeFullyContainedByAnotherElfRange(
  elfPair: ElfPair
): boolean {
  return (
    isAisFullyContainedByB(elfPair.firstElf, elfPair.secondElf) ||
    isAisFullyContainedByB(elfPair.secondElf, elfPair.firstElf)
  );
}

function isNumberWithinRange(number: Number, range: NumberRange): boolean {
  return number >= range.rangeStart && number <= range.rangeEnd;
}

function IsElfRangeOverlappingAtAll(elfPair: ElfPair): boolean {
  return (
    isNumberWithinRange(elfPair.firstElf.rangeStart, elfPair.secondElf) ||
    isNumberWithinRange(elfPair.firstElf.rangeEnd, elfPair.secondElf) ||
    isNumberWithinRange(elfPair.secondElf.rangeStart, elfPair.firstElf) ||
    isNumberWithinRange(elfPair.secondElf.rangeEnd, elfPair.firstElf)
  );
}

async function main(): Promise<void> {
  const input = await readInputFile();
  const listOfELfAssignments: ElfPair[] = [];

  let numberOfElfRangesThatAreFullyContained = 0;
  let numberOfPartiallyOverlappingRanges = 0;
  input.forEach((line) => {
    const newElf = parseInputLineIntoELfPair(line);
    listOfELfAssignments.push(newElf);
    if (IsOneElfRangeFullyContainedByAnotherElfRange(newElf)) {
      numberOfElfRangesThatAreFullyContained++;
    }
    if (IsElfRangeOverlappingAtAll(newElf)) {
      numberOfPartiallyOverlappingRanges++;
    }
  });

  // problem 1
  console.log(`problem 1`);
  console.log(
    `number of fully contained elf pairs: ${numberOfElfRangesThatAreFullyContained}`
  );

  // problem 2
  console.log(`problem 1`);
  console.log(
    `number of partially overlapping elf pairs: ${numberOfPartiallyOverlappingRanges}`
  );
}

void main();
