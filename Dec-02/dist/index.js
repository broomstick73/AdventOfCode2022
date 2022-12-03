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
    .description("Solve Advent of Code Dec 1")
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
function calculateScore(opponent, self) {
    const calculateShapeScore = (shape) => {
        if (shape === "X") {
            // rock
            return 1;
        }
        else if (shape === "Y") {
            // paper
            return 2;
        }
        else {
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
    const calculateOutcomeScore = (opponentShape, selfShape) => {
        if (opponentShape === "A") {
            // opponent throws rock
            if (selfShape === "X") {
                // self throws rock
                return 3;
            }
            else if (selfShape === "Y") {
                // self throws paper
                return 6;
            }
            else if (selfShape === "Z") {
                // self throws scissors
                return 0;
            }
        }
        else if (opponentShape === "B") {
            // opponent throws paper
            if (selfShape === "X") {
                // self throws rock
                return 0;
            }
            else if (selfShape === "Y") {
                // self throws paper
                return 3;
            }
            else if (selfShape === "Z") {
                // self throws scissors
                return 6;
            }
        }
        else if (opponentShape === "C") {
            // opponent throws scissors
            if (selfShape === "X") {
                // self throws rock
                return 6;
            }
            else if (selfShape === "Y") {
                // self throws paper
                return 0;
            }
            else if (selfShape === "Z") {
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
function calculateSelfShape(opponentShape, outcomeResult) {
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
    }
    else if (opponentShape === "A" && outcomeResult === "Y") {
        // opponent rock
        // result draw
        return "X";
    }
    else if (opponentShape === "A" && outcomeResult === "Z") {
        // opponent rock
        // result win
        return "Y";
    }
    else if (opponentShape === "B" && outcomeResult === "X") {
        // opponent paper
        // result lose
        return "X";
    }
    else if (opponentShape === "B" && outcomeResult === "Y") {
        // opponent paper
        // result draw
        return "Y";
    }
    else if (opponentShape === "B" && outcomeResult === "Z") {
        // opponent paper
        // result win
        return "Z";
    }
    else if (opponentShape === "C" && outcomeResult === "X") {
        // opponent scissors
        // result lose
        return "Y";
    }
    else if (opponentShape === "C" && outcomeResult === "Y") {
        // opponent scissors
        // result draw
        return "Z";
    }
    else if (opponentShape === "C" && outcomeResult === "Z") {
        // opponent scissors
        // result win
        return "X";
    }
    console.log("error");
    return "";
}
async function main() {
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
//# sourceMappingURL=index.js.map