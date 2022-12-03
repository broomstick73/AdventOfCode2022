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
function splitRuckSack(inputLine) {
    const totalLength = inputLine.length;
    const sackLength = totalLength / 2;
    const sack1 = inputLine.slice(0, sackLength);
    const sack2 = inputLine.slice(sackLength);
    return {
        sack1,
        sack2,
    };
}
function findCommonItem(sacks) {
    const { sack1, sack2 } = sacks;
    for (let index = 0; index < sack1.length; index++) {
        const letterToLookFor = sack1.charAt(index);
        if (sack2.includes(letterToLookFor)) {
            return letterToLookFor;
        }
    }
    return "";
}
function calculateLetterPriority(letter) {
    // Lowercase item types a through z have priorities 1 through 26.
    // Uppercase item types A through Z have priorities 27 through 52.
    if (letter.charCodeAt(0) >= "a".charCodeAt(0) &&
        letter.charCodeAt(0) <= "z".charCodeAt(0)) {
        const value = letter.charCodeAt(0) - "a".charCodeAt(0) + 1;
        return value;
    }
    else {
        const value = letter.charCodeAt(0) - "A".charCodeAt(0) + 27;
        return value;
    }
}
function findGroupRuckSacks(listOfSacks, groupNumber) {
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
function findCommonItemInGroupSacks(groupSacks) {
    const { sack1, sack2, sack3 } = groupSacks;
    for (let index = 0; index < sack1.length; index++) {
        const letterToLookFor = sack1.charAt(index);
        if (sack2.includes(letterToLookFor) && sack3.includes(letterToLookFor)) {
            return letterToLookFor;
        }
    }
    return "";
}
async function main() {
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
//# sourceMappingURL=index.js.map