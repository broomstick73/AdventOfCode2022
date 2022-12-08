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

interface Tree {
  height: number;
  isVisible: boolean;
  scenicScore: number;
}

function parseTrees(input: string[]): Tree[][] {
  const trees: Tree[][] = input.map((line): Tree[] =>
    line.split("").map(
      (char): Tree => ({
        height: Number.parseInt(char, 10),
        isVisible: false,
        scenicScore: 0,
      })
    )
  );
  return trees;
}

function calculateVisibility(trees: Tree[][]): void {
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

function calculateCountOfVisibleTrees(trees: Tree[][]): number {
  let countOfVisibleTrees = 0;
  for (let row = 0; row < trees.length; row++) {
    for (let column = 0; column < trees[0].length; column++) {
      const tree = trees[row][column];
      if (tree.isVisible) countOfVisibleTrees++;
    }
  }
  return countOfVisibleTrees;
}

function calculateScenicScoreOfSingleTree(
  trees: Tree[][],
  row: number,
  column: number,
  logOutput: boolean = false
): number {
  // scenic score if on the edge is zero
  if (
    row === 0 ||
    row === trees.length - 1 ||
    column === 0 ||
    column === trees[row].length - 1
  )
    return 0;

  const tree = trees[row][column];
  const treeHeight = tree.height;

  // how many trees to the left can be seen
  let numberOfTreesVisibleLookingToTheLeft = 0;
  for (let columnIndex = column - 1; columnIndex >= 0; columnIndex--) {
    numberOfTreesVisibleLookingToTheLeft++;
    if (trees[row][columnIndex].height >= treeHeight) break;
  }

  // how many trees to the right can be seen
  let numberOfTreesVisibleLookingToTheRight = 0;
  for (
    let columnIndex = column + 1;
    columnIndex < trees[0].length;
    columnIndex++
  ) {
    numberOfTreesVisibleLookingToTheRight++;
    if (trees[row][columnIndex].height >= treeHeight) break;
  }

  let numberOfTreesVisibleLookingUp = 0;
  // how many trees upwards can be seen
  for (let rowIndex = row - 1; rowIndex >= 0; rowIndex--) {
    numberOfTreesVisibleLookingUp++;
    if (trees[rowIndex][column].height >= treeHeight) break;
  }

  // how many trees downwards can be seen
  let numberOfTreesVisibleLookingDown = 0;
  for (let rowIndex = row + 1; rowIndex < trees.length; rowIndex++) {
    numberOfTreesVisibleLookingDown++;
    if (trees[rowIndex][column].height >= treeHeight) break;
  }

  if (logOutput) {
    console.log(
      `scenic score of tree in row ${row} column ${column} with height ${treeHeight}.`
    );
    console.log(`looking up can see ${numberOfTreesVisibleLookingUp} trees`);
    console.log(
      `looking to the left can see ${numberOfTreesVisibleLookingToTheLeft}`
    );
    console.log(
      `looking to the right can see ${numberOfTreesVisibleLookingToTheRight}`
    );
    console.log(`looking down can see ${numberOfTreesVisibleLookingDown}`);
  }
  return (
    numberOfTreesVisibleLookingToTheLeft *
    numberOfTreesVisibleLookingToTheRight *
    numberOfTreesVisibleLookingUp *
    numberOfTreesVisibleLookingDown
  );
}

function calculateScenicScoreOfAllTrees(trees: Tree[][]): void {
  for (let row = 0; row < trees.length; row++) {
    for (let column = 0; column < trees[0].length; column++) {
      const tree = trees[row][column];
      tree.scenicScore = calculateScenicScoreOfSingleTree(trees, row, column);
    }
  }
}

function printTrees(
  trees: Tree[][],
  whatToPrint: "height" | "visibility" | "scenicScore"
): void {
  for (let row = 0; row < trees.length; row++) {
    let outputRow = "";
    for (let column = 0; column < trees[0].length; column++) {
      const tree = trees[row][column];
      if (whatToPrint === "height") {
        outputRow = outputRow + tree.height.toString();
      } else if (whatToPrint === "scenicScore") {
        outputRow = outputRow + tree.scenicScore.toString();
      } else {
        outputRow = outputRow + (tree.isVisible ? "x" : " ");
      }
    }
    console.log(outputRow);
  }
}

async function main(): Promise<void> {
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
  const arrayOfArrayOfNumbers = trees.map((row): number[] =>
    row.map((tree): number => tree.scenicScore)
  );
  const arrayOfNumbers = arrayOfArrayOfNumbers.flat();
  const highestScenicScore = Math.max(...arrayOfNumbers);

  console.log(
    `What is the highest scenic score possible for any tree? ${highestScenicScore}`
  );
}

void main();
