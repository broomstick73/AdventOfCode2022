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

interface ElfFile {
  filename: string;
  size: number;
}
interface ElfFolder {
  folderName: string;
  subFolders: ElfFolder[];
  files: ElfFile[];
  parentFolder: ElfFolder | null;
  size: number;
}

function createNewFolder(
  folderName: string,
  parentFolder: ElfFolder | null
): ElfFolder {
  return {
    folderName,
    subFolders: [],
    files: [],
    parentFolder,
    size: 0,
  };
}

function executeCommand(
  line: string,
  currentDirectory: ElfFolder,
  rootFolder: ElfFolder
): ElfFolder {
  if (line.startsWith("$ cd")) {
    // change directory
    const folderNameToChangeInto = line.split(" ")[2];
    if (folderNameToChangeInto === "/") {
      return rootFolder;
    } else if (folderNameToChangeInto === "..") {
      if (currentDirectory.parentFolder === null) {
        return rootFolder;
      } else {
        return currentDirectory.parentFolder;
      }
    } else {
      return (
        currentDirectory.subFolders.find(
          (folder) => folder.folderName === folderNameToChangeInto
        ) ?? rootFolder
      );
    }
  } else if (line.startsWith("$ ls")) {
    // list directory contents
    // do nothing
    return currentDirectory;
  } else if (line.startsWith("dir ")) {
    // add a directory to the current directory
    const folderName = line.split(" ")[1];
    const folder = createNewFolder(folderName, currentDirectory);
    currentDirectory.subFolders.push(folder);
    return currentDirectory;
  } else {
    // add a file to the current directory
    const filename = line.split(" ")[1];
    const size = Number.parseInt(line.split(" ")[0], 10);
    addFileToCurrentFolderAndUpdateFolderSize(currentDirectory, filename, size);
    return currentDirectory;
  }
}

function addFileToCurrentFolderAndUpdateFolderSize(
  currentFolder: ElfFolder,
  filename: string,
  size: number
): void {
  // console.log(
  //   `adding file ${filename} size ${size} to folder ${currentFolder.folderName}`
  // );
  const newFile: ElfFile = { filename, size };
  currentFolder.files.push(newFile);
  let tempPointer: ElfFolder | null = currentFolder;
  do {
    tempPointer.size = tempPointer.size + size;
    tempPointer = tempPointer.parentFolder;
  } while (tempPointer !== null);
}

interface FolderSizeEntry {
  foldername: string;
  size: number;
}
const folderSizeList: FolderSizeEntry[] = [];
let minFolderSizeToRecord = 100000;

function RecordFolderSizes(folder: ElfFolder): void {
  // record size of current folder
  if (folder.size >= minFolderSizeToRecord) {
    folderSizeList.push({ foldername: folder.folderName, size: folder.size });
  }
  // visit ever sub folder and record their sizes as well
  folder.subFolders.forEach((folder) => {
    RecordFolderSizes(folder);
  });
}

async function main(): Promise<void> {
  const input = await readInputFile();

  // problem 1
  console.log(`problem 1`);
  const rootFolder = createNewFolder("/", null);
  let currentDirectory = rootFolder;
  input.forEach((line) => {
    currentDirectory = executeCommand(line, currentDirectory, rootFolder);
  });
  RecordFolderSizes(rootFolder);
  const sum = folderSizeList.reduce(
    (accumulator, currentValue) => accumulator + currentValue.size,
    0
  );
  console.log(`sum total of folders is ${sum}`);

  // problem 2
  console.log(`problem 2`);
  // clear the folderSizeList
  folderSizeList.length = 0;
  const totalFileSystemSize = 70000000;
  const totalFreeSpaceNeeded = 30000000;
  const spaceUsedByFiles = rootFolder.size;
  const currentFreeSpace = totalFileSystemSize - spaceUsedByFiles;
  if (totalFreeSpaceNeeded > currentFreeSpace) {
    const amountOfAdditionalSpaceNeeded =
      totalFreeSpaceNeeded - currentFreeSpace;
    console.log(`total amount of used space is ${spaceUsedByFiles}`);
    console.log(`size of unused space is ${currentFreeSpace}`);
    console.log(`need at least ${amountOfAdditionalSpaceNeeded} `);
    minFolderSizeToRecord = amountOfAdditionalSpaceNeeded;
    RecordFolderSizes(rootFolder);
    const smallestFolderSize = Math.min(
      ...folderSizeList.map((entry) => entry.size)
    );
    console.log(
      `size of the smallest folder to delete that would free up the necessary space is ${smallestFolderSize}`
    );
  }
}

void main();
