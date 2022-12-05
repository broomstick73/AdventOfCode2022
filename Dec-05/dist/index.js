"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as fs from 'fs';
// fs.readFileSync('foo.txt','utf8');
// const figlet = require("figlet");
// console.log(figlet.textSync("Dir Manager"));
// const fs = require("node:fs");
const fs_1 = require("fs");
const readline = __importStar(require("readline"));
const commander_1 = require("commander"); // add this line
const program = new commander_1.Command();
program
    .version("1.0.0")
    .description("Solve Advent of Code Dec 3")
    .option("-i, --input <value>", "input file")
    .parse(process.argv);
const options = program.opts();
// const readline = require("node:readline");
async function readInputFile() {
    var _a, e_1, _b, _c;
    const inputFileName = Boolean(options.input) && typeof options.input === "string"
        ? options.input
        : "input.txt";
    console.log(`inputFileName = ${inputFileName}`);
    const fileStream = (0, fs_1.createReadStream)(inputFileName);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    const data = [];
    try {
        for (var _d = true, rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = await rl_1.next(), _a = rl_1_1.done, !_a;) {
            _c = rl_1_1.value;
            _d = false;
            try {
                const line = _c;
                // Each line in input.txt will be successively available here as `line`.
                // console.log(`Line from file: ${line}`);
                data.push(line);
            }
            finally {
                _d = true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = rl_1.return)) await _b.call(rl_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return data;
}
function printCrates(stacks) {
    const stackHeights = stacks.map((stack) => stack.crates.length);
    const maxStackHeight = Math.max(...stackHeights);
    for (let stackLevel = maxStackHeight - 1; stackLevel >= 0; stackLevel--) {
        let outputLevelString = "";
        stacks.forEach((stack) => {
            // if there is a crate for this stack level & stack then print it
            if (stackLevel < stack.crates.length) {
                outputLevelString = `${outputLevelString}[${stack.crates[stackLevel]}]`;
            }
            else {
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
function printStackTops(stacks) {
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
function processInstructionLine(command, stacks) {
    var _a, _b;
    const instructionParts = command.split(" ");
    const numberToMove = Number.parseInt(instructionParts[1], 10);
    const fromStack = instructionParts[3];
    const toStack = instructionParts[5];
    console.log(`moving ${numberToMove} from ${fromStack} to ${toStack}`);
    const cratesToMove = [];
    for (let index = 0; index < numberToMove; index++) {
        const crate = (_a = stacks
            .find((stack) => stack.stackIdentifier.stackNumber === fromStack)) === null || _a === void 0 ? void 0 : _a.crates.pop();
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        if (crate != null && crate !== undefined && typeof crate === "string") {
            cratesToMove.push(crate);
        }
    }
    // cratesToMove.reverse();
    for (let index = 0; index < numberToMove; index++) {
        const crate = cratesToMove.pop();
        if (crate != null && crate !== undefined && typeof crate === "string") {
            (_b = stacks
                .find((stack) => stack.stackIdentifier.stackNumber === toStack)) === null || _b === void 0 ? void 0 : _b.crates.push(crate);
        }
    }
}
function processInstructions(instructions, stacks) {
    for (let index = 0; index < instructions.length; index++) {
        processInstructionLine(instructions[index], stacks);
    }
}
function processInput(input) {
    const instructions = [];
    const crateStrings = [];
    let stackIdentifiersLine = "";
    input.forEach((line) => {
        if (line.includes("[")) {
            // crates
            crateStrings.push(line);
        }
        else if (line.includes("move")) {
            // instructions
            instructions.push(line);
        }
        else if (line.trim().length === 0) {
            // blank line
        }
        else {
            // stack identifiers
            stackIdentifiersLine = line;
        }
    });
    const stackIdentifiers = [];
    const stacks = [];
    for (let index = 0; index < stackIdentifiersLine.length; index++) {
        const char = stackIdentifiersLine.charAt(index);
        if (char !== "" && char !== " ") {
            const newStackIdentifier = {
                stackNumber: char,
                stackColumnIndex: index,
            };
            stackIdentifiers.push(newStackIdentifier);
            const newStack = {
                stackIdentifier: newStackIdentifier,
                crates: [],
            };
            stacks.push(newStack);
            stackIdentifiers.push();
        }
    }
    // push crates onto the stacks
    for (let stackLevel = crateStrings.length - 1; stackLevel >= 0; stackLevel--) {
        // console.log(`${crateStrings[stackLevel]}`);
        stacks.forEach((stack) => {
            const crate = crateStrings[stackLevel].charAt(stack.stackIdentifier.stackColumnIndex);
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
async function main() {
    const input = await readInputFile();
    processInput(input);
    // problem 1
    console.log(`problem 1`);
    // problem 2
    console.log(`problem 2`);
}
void main();
//# sourceMappingURL=index.js.map