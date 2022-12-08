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
function parseTrees(input) {
    const trees = input.map((line) => line.split("").map((char) => ({
        height: Number.parseInt(char, 10),
        isVisible: false,
        scenicScore: 0,
    })));
    return trees;
}
function calculateVisibility(trees) {
    const MIN_TREE_HEIGHT = -1;
    let tallestTreeHeight = MIN_TREE_HEIGHT;
    // check visibility vertically going DOWN each column start at TOP and going to the BOTTOM
    for (let column = 0; column < trees[0].length; column++) {
        tallestTreeHeight = MIN_TREE_HEIGHT;
        for (let row = 0; row < trees.length; row++) {
            const currentTree = trees[row][column];
            if (currentTree.height > tallestTreeHeight) {
                currentTree.isVisible = true;
                tallestTreeHeight = currentTree.height;
            }
        }
    }
    // check visibility vertically going UP each column start at BOTTOM and going to the TOP
    for (let column = 0; column < trees[0].length; column++) {
        tallestTreeHeight = MIN_TREE_HEIGHT;
        for (let row = trees.length - 1; row >= 0; row--) {
            const currentTree = trees[row][column];
            if (currentTree.height > tallestTreeHeight) {
                currentTree.isVisible = true;
                tallestTreeHeight = currentTree.height;
            }
        }
    }
    // check visibility horizontally going LEFT to RIGHT
    for (let row = 0; row < trees.length; row++) {
        tallestTreeHeight = MIN_TREE_HEIGHT;
        for (let column = 0; column < trees[0].length; column++) {
            const currentTree = trees[row][column];
            if (currentTree.height > tallestTreeHeight) {
                currentTree.isVisible = true;
                tallestTreeHeight = currentTree.height;
            }
        }
    }
    // check visibility horizontally going RIGHT to LEFT
    for (let row = 0; row < trees.length; row++) {
        tallestTreeHeight = MIN_TREE_HEIGHT;
        for (let column = trees[0].length - 1; column >= 0; column--) {
            const currentTree = trees[row][column];
            if (currentTree.height > tallestTreeHeight) {
                currentTree.isVisible = true;
                tallestTreeHeight = currentTree.height;
            }
        }
    }
}
function calculateCountOfVisibleTrees(trees) {
    let countOfVisibleTrees = 0;
    for (let row = 0; row < trees.length; row++) {
        for (let column = 0; column < trees[0].length; column++) {
            const tree = trees[row][column];
            if (tree.isVisible)
                countOfVisibleTrees++;
        }
    }
    return countOfVisibleTrees;
}
function calculateScenicScoreOfSingleTree(trees, row, column, logOutput = false) {
    // scenic score if on the edge is zero
    if (row === 0 ||
        row === trees.length - 1 ||
        column === 0 ||
        column === trees[row].length - 1)
        return 0;
    const tree = trees[row][column];
    const treeHeight = tree.height;
    // how many trees to the left can be seen
    let numberOfTreesVisibleLookingToTheLeft = 0;
    for (let columnIndex = column - 1; columnIndex >= 0; columnIndex--) {
        numberOfTreesVisibleLookingToTheLeft++;
        if (trees[row][columnIndex].height >= treeHeight)
            break;
    }
    // how many trees to the right can be seen
    let numberOfTreesVisibleLookingToTheRight = 0;
    for (let columnIndex = column + 1; columnIndex < trees[0].length; columnIndex++) {
        numberOfTreesVisibleLookingToTheRight++;
        if (trees[row][columnIndex].height >= treeHeight)
            break;
    }
    let numberOfTreesVisibleLookingUp = 0;
    // how many trees upwards can be seen
    for (let rowIndex = row - 1; rowIndex >= 0; rowIndex--) {
        numberOfTreesVisibleLookingUp++;
        if (trees[rowIndex][column].height >= treeHeight)
            break;
    }
    // how many trees downwards can be seen
    let numberOfTreesVisibleLookingDown = 0;
    for (let rowIndex = row + 1; rowIndex < trees.length; rowIndex++) {
        numberOfTreesVisibleLookingDown++;
        if (trees[rowIndex][column].height >= treeHeight)
            break;
    }
    if (logOutput) {
        console.log(`scenic score of tree in row ${row} column ${column} with height ${treeHeight}.`);
        console.log(`looking up can see ${numberOfTreesVisibleLookingUp} trees`);
        console.log(`looking to the left can see ${numberOfTreesVisibleLookingToTheLeft}`);
        console.log(`looking to the right can see ${numberOfTreesVisibleLookingToTheRight}`);
        console.log(`looking down can see ${numberOfTreesVisibleLookingDown}`);
    }
    return (numberOfTreesVisibleLookingToTheLeft *
        numberOfTreesVisibleLookingToTheRight *
        numberOfTreesVisibleLookingUp *
        numberOfTreesVisibleLookingDown);
}
function calculateScenicScoreOfAllTrees(trees) {
    for (let row = 0; row < trees.length; row++) {
        for (let column = 0; column < trees[0].length; column++) {
            const tree = trees[row][column];
            tree.scenicScore = calculateScenicScoreOfSingleTree(trees, row, column);
        }
    }
}
function printTrees(trees, whatToPrint) {
    for (let row = 0; row < trees.length; row++) {
        let outputRow = "";
        for (let column = 0; column < trees[0].length; column++) {
            const tree = trees[row][column];
            if (whatToPrint === "height") {
                outputRow = outputRow + tree.height.toString();
            }
            else if (whatToPrint === "scenicScore") {
                outputRow = outputRow + tree.scenicScore.toString();
            }
            else {
                outputRow = outputRow + (tree.isVisible ? "x" : " ");
            }
        }
        console.log(outputRow);
    }
}
async function main() {
    const input = await readInputFile();
    const trees = parseTrees(input);
    calculateVisibility(trees);
    const numberOfVisibleTrees = calculateCountOfVisibleTrees(trees);
    // problem 1
    console.log(`problem 1`);
    console.log(`number of visible trees: ${numberOfVisibleTrees}`);
    // printTrees(trees, "height");
    // console.log();
    // printTrees(trees, "visibility");
    // problem 2
    console.log(`problem 2`);
    calculateScenicScoreOfAllTrees(trees);
    printTrees(trees, "scenicScore");
    calculateScenicScoreOfSingleTree(trees, 1, 2, true);
    const arrayOfArrayOfNumbers = trees.map((row) => row.map((tree) => tree.scenicScore));
    const arrayOfNumbers = arrayOfArrayOfNumbers.flat();
    const highestScenicScore = Math.max(...arrayOfNumbers);
    console.log(`What is the highest scenic score possible for any tree? ${highestScenicScore}`);
}
void main();
//# sourceMappingURL=index.js.map