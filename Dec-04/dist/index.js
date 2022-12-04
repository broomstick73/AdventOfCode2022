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
function parseInputLineIntoELfPair(line) {
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
function isAisFullyContainedByB(a, b) {
    return a.rangeStart >= b.rangeStart && a.rangeEnd <= b.rangeEnd;
}
function IsOneElfRangeFullyContainedByAnotherElfRange(elfPair) {
    return (isAisFullyContainedByB(elfPair.firstElf, elfPair.secondElf) ||
        isAisFullyContainedByB(elfPair.secondElf, elfPair.firstElf));
}
function isNumberWithinRange(number, range) {
    return number >= range.rangeStart && number <= range.rangeEnd;
}
function IsElfRangeOverlappingAtAll(elfPair) {
    return (isNumberWithinRange(elfPair.firstElf.rangeStart, elfPair.secondElf) ||
        isNumberWithinRange(elfPair.firstElf.rangeEnd, elfPair.secondElf) ||
        isNumberWithinRange(elfPair.secondElf.rangeStart, elfPair.firstElf) ||
        isNumberWithinRange(elfPair.secondElf.rangeEnd, elfPair.firstElf));
}
async function main() {
    const input = await readInputFile();
    const listOfELfAssignments = [];
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
    console.log(`number of fully contained elf pairs: ${numberOfElfRangesThatAreFullyContained}`);
    // problem 2
    console.log(`problem 1`);
    console.log(`number of partially overlapping elf pairs: ${numberOfPartiallyOverlappingRanges}`);
}
void main();
//# sourceMappingURL=index.js.map