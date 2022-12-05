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

interface StackIdentifier {
  stackNumber: string;
  stackColumnIndex: number;
}
type StackIdentifiers = StackIdentifier[];

interface Stack {
  stackIdentifier: StackIdentifier;
  crates: string[];
}

type Stacks = Stack[];

function printCrates(stacks: Stacks): void {
  const stackHeights = stacks.map((stack) => stack.crates.length);
  const maxStackHeight = Math.max(...stackHeights);
  for (let stackLevel = maxStackHeight - 1; stackLevel >= 0; stackLevel--) {
    let outputLevelString = "";
    stacks.forEach((stack) => {
      // if there is a crate for this stack level & stack then print it
      if (stackLevel < stack.crates.length) {
        outputLevelString = `${outputLevelString}[${stack.crates[stackLevel]}]`;
      } else {
        // otherwise add three spaces
        outputLevelString = outputLevelString + "   ";
      }
      // then add one spacer space
      outputLevelString = outputLevelString + " ";
    });
    outputLevelString.slice(0, outputLevelString.length - 1);
    console.log(outputLevelString);
  }
}

function printStackTops(stacks: Stacks): void {
  let output = "";
  stacks.forEach((stack) => {
    output = output + stack.crates[stack.crates.length - 1];
  });
  console.log(`stack tops = ${output}`);
}

// function printInstructions(instructions: string[]): void {
//   console.log(`instructions:`);
//   for (let index = 0; index < instructions.length; index++) {
//     console.log(instructions[index]);
//   }
// }

function processInstructionLine(command: string, stacks: Stacks): void {
  const instructionParts = command.split(" ");
  const numberToMove = Number.parseInt(instructionParts[1], 10);
  const fromStack = instructionParts[3];
  const toStack = instructionParts[5];
  console.log(`moving ${numberToMove} from ${fromStack} to ${toStack}`);
  const cratesToMove: string[] = [];
  for (let index = 0; index < numberToMove; index++) {
    const crate = stacks
      .find((stack) => stack.stackIdentifier.stackNumber === fromStack)
      ?.crates.pop();
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    if (crate != null && crate !== undefined && typeof crate === "string") {
      cratesToMove.push(crate);
    }
  }
  // cratesToMove.reverse();
  for (let index = 0; index < numberToMove; index++) {
    const crate = cratesToMove.pop();
    if (crate != null && crate !== undefined && typeof crate === "string") {
      stacks
        .find((stack) => stack.stackIdentifier.stackNumber === toStack)
        ?.crates.push(crate);
    }
  }
}

function processInstructions(instructions: string[], stacks: Stacks): void {
  for (let index = 0; index < instructions.length; index++) {
    processInstructionLine(instructions[index], stacks);
  }
}

function processInput(input: string[]): void {
  const instructions: string[] = [];
  const crateStrings: string[] = [];
  let stackIdentifiersLine = "";

  input.forEach((line) => {
    if (line.includes("[")) {
      // crates
      crateStrings.push(line);
    } else if (line.includes("move")) {
      // instructions
      instructions.push(line);
    } else if (line.trim().length === 0) {
      // blank line
    } else {
      // stack identifiers
      stackIdentifiersLine = line;
    }
  });

  const stackIdentifiers: StackIdentifiers = [];
  const stacks: Stacks = [];
  for (let index = 0; index < stackIdentifiersLine.length; index++) {
    const char = stackIdentifiersLine.charAt(index);
    if (char !== "" && char !== " ") {
      const newStackIdentifier: StackIdentifier = {
        stackNumber: char,
        stackColumnIndex: index,
      };
      stackIdentifiers.push(newStackIdentifier);
      const newStack: Stack = {
        stackIdentifier: newStackIdentifier,
        crates: [],
      };
      stacks.push(newStack);
      stackIdentifiers.push();
    }
  }

  // push crates onto the stacks

  for (
    let stackLevel = crateStrings.length - 1;
    stackLevel >= 0;
    stackLevel--
  ) {
    // console.log(`${crateStrings[stackLevel]}`);
    stacks.forEach((stack) => {
      const crate = crateStrings[stackLevel].charAt(
        stack.stackIdentifier.stackColumnIndex
      );
      if (crate.trim().length !== 0) {
        stack.crates.push(crate);
      }
    });
  }

  printCrates(stacks);
  processInstructions(instructions, stacks);
  printCrates(stacks);
  printStackTops(stacks);
}

async function main(): Promise<void> {
  const input = await readInputFile();
  processInput(input);

  // problem 1
  console.log(`problem 1`);

  // problem 2
  console.log(`problem 2`);
}

void main();
