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

function stringContainsDupes(str: string): boolean {
  for (let index = 0; index < str.length; index++) {
    const charBeingTested = str.charAt(index);
    if (str.split("").filter((char) => char === charBeingTested).length > 1) {
      return true;
    }
  }
  return false;
}

function findStartOfPacketMarker(line: string): number {
  const queue: string[] = [];
  for (let index = 0; index < line.length; index++) {
    const char = line.charAt(index);
    queue.push(char);
    if (queue.length > 4) queue.shift();
    if (queue.length === 4 && !stringContainsDupes(queue.join(""))) {
      return index + 1;
    }
  }
  return 0;
}

function findStartOfMessageMarker(line: string): number {
  const queue: string[] = [];
  for (let index = 0; index < line.length; index++) {
    const char = line.charAt(index);
    queue.push(char);
    if (queue.length > 14) queue.shift();
    if (queue.length === 14 && !stringContainsDupes(queue.join(""))) {
      return index + 1;
    }
  }
  return 0;
}

function processInputLineForProblem1(line: string): void {
  const startOfPacketMarker = findStartOfPacketMarker(line);
  console.log(`${line}: first marker after character ${startOfPacketMarker}`);
}

function processInputLineForProblem2(line: string): void {
  const startOfMessageMarker = findStartOfMessageMarker(line);
  console.log(`${line}: first marker after character ${startOfMessageMarker}`);
}

async function main(): Promise<void> {
  const input = await readInputFile();

  // problem 1
  console.log(`problem 1`);
  input.forEach((line) => {
    processInputLineForProblem1(line);
  });

  // problem 2
  console.log(`problem 2`);
  input.forEach((line) => {
    processInputLineForProblem2(line);
  });
}

void main();
