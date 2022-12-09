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

interface Position {
  x: number;
  y: number;
}

type Direction = "U" | "D" | "L" | "R";
const STARTING_POSITION: Position = { x: 0, y: 0 };
function moveItem(initialPosition: Position, direction: Direction): Position {
  if (direction === "U") {
    // up
    return { x: initialPosition.x, y: initialPosition.y + 1 };
  } else if (direction === "R") {
    // right
    return { x: initialPosition.x + 1, y: initialPosition.y };
  } else if (direction === "L") {
    // left
    return { x: initialPosition.x - 1, y: initialPosition.y };
  } else {
    // down
    return { x: initialPosition.x, y: initialPosition.y - 1 };
  }
}

function calculateNewTailPosition(head: Position, tail: Position): Position {
  if (isHeadAndTailTouching(head, tail)) {
    // do nothing
    return tail;
  } else {
    if (head.y === tail.y && head.x > tail.x) {
      // along the same row to the right
      return moveItem(tail, "R");
    } else if (head.y === tail.y && head.x < tail.x) {
      // along the same row to the left
      return moveItem(tail, "L");
    } else if (head.x === tail.x && head.y > tail.y) {
      // vertically above tail
      return moveItem(tail, "U");
    } else if (head.x === tail.x && head.y < tail.y) {
      // vertically below tail
      return moveItem(tail, "D");
    } else if (head.x > tail.x && head.y > tail.y) {
      // up and to the right of tail
      return moveItem(moveItem(tail, "U"), "R");
    } else if (head.x > tail.x && head.y < tail.y) {
      // down and to the right of tail
      return moveItem(moveItem(tail, "D"), "R");
    } else if (head.x < tail.x && head.y > tail.y) {
      // up and to the left of tail
      return moveItem(moveItem(tail, "U"), "L");
    } else if (head.x < tail.x && head.y < tail.y) {
      // down and to the left of tail
      return moveItem(moveItem(tail, "D"), "L");
    } else {
      // should never happen
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw "got to unreachable option";
    }
  }
}

const tailPositionHistory: Position[] = [];
function pushTailPosition(tail: Position): void {
  if (
    tailPositionHistory.some(
      (position) => position.x === tail.x && position.y === tail.y
    )
  ) {
    // new position is already in history - do not add
  } else {
    tailPositionHistory.push(tail);
  }
}

function SolveProblem1(input: string[]): void {
  console.log(`== Initial State ==`);
  console.log();

  const NAMED_STARTING_POSITION: NamedPosition = {
    name: "s",
    position: STARTING_POSITION,
  };

  const listOfPositions: ListOfNamedPositions = [
    { name: "H", position: STARTING_POSITION },
    { name: "T", position: STARTING_POSITION },
  ];

  drawHeadTailPositionMap([...listOfPositions, NAMED_STARTING_POSITION]);

  console.log();

  input.forEach((line) => {
    const direction = line.split(" ")[0];
    const numberOfMoves = Number.parseInt(line.split(" ")[1], 10);
    console.log();
    console.log(`== ${line} ==`);
    console.log();
    for (let index = 0; index < numberOfMoves; index++) {
      listOfPositions[0].position = moveItem(
        listOfPositions[0].position,
        direction as Direction
      );
      listOfPositions[1].position = calculateNewTailPosition(
        listOfPositions[0].position,
        listOfPositions[1].position
      );
      pushTailPosition(listOfPositions[1].position);
      drawHeadTailPositionMap([...listOfPositions, NAMED_STARTING_POSITION]);
      console.log();
    }
  });
  drawTailPositionHistoryMap();
  console.log(`problem 1`);
  console.log(
    `there are ${tailPositionHistory.length.toString()} positions the tail visited at least once`
  );
}

function SolveProblem2(input: string[]): void {
  tailPositionHistory.length = 0;
  console.log(`== Initial State ==`);
  console.log();

  const NAMED_STARTING_POSITION: NamedPosition = {
    name: "s",
    position: STARTING_POSITION,
  };

  const listOfPositions: ListOfNamedPositions = [
    { name: "H", position: STARTING_POSITION },
    { name: "1", position: STARTING_POSITION },
    { name: "2", position: STARTING_POSITION },
    { name: "3", position: STARTING_POSITION },
    { name: "4", position: STARTING_POSITION },
    { name: "5", position: STARTING_POSITION },
    { name: "6", position: STARTING_POSITION },
    { name: "7", position: STARTING_POSITION },
    { name: "8", position: STARTING_POSITION },
    { name: "9", position: STARTING_POSITION },
  ];

  drawHeadTailPositionMap([...listOfPositions, NAMED_STARTING_POSITION]);

  console.log();

  input.forEach((line) => {
    const direction = line.split(" ")[0];
    const numberOfMoves = Number.parseInt(line.split(" ")[1], 10);
    console.log();
    console.log(`== ${line} ==`);
    console.log();
    for (let index = 0; index < numberOfMoves; index++) {
      // move head
      listOfPositions[0].position = moveItem(
        listOfPositions[0].position,
        direction as Direction
      );

      // move 1
      listOfPositions[1].position = calculateNewTailPosition(
        listOfPositions[0].position,
        listOfPositions[1].position
      );

      // move 2
      listOfPositions[2].position = calculateNewTailPosition(
        listOfPositions[1].position,
        listOfPositions[2].position
      );

      // move 3
      listOfPositions[3].position = calculateNewTailPosition(
        listOfPositions[2].position,
        listOfPositions[3].position
      );

      // move 4
      listOfPositions[4].position = calculateNewTailPosition(
        listOfPositions[3].position,
        listOfPositions[4].position
      );

      // move 5
      listOfPositions[5].position = calculateNewTailPosition(
        listOfPositions[4].position,
        listOfPositions[5].position
      );

      // move 6
      listOfPositions[6].position = calculateNewTailPosition(
        listOfPositions[5].position,
        listOfPositions[6].position
      );

      // move 7
      listOfPositions[7].position = calculateNewTailPosition(
        listOfPositions[6].position,
        listOfPositions[7].position
      );

      // move 8
      listOfPositions[8].position = calculateNewTailPosition(
        listOfPositions[7].position,
        listOfPositions[8].position
      );

      // move 9
      listOfPositions[9].position = calculateNewTailPosition(
        listOfPositions[8].position,
        listOfPositions[9].position
      );

      pushTailPosition(listOfPositions[9].position);
      drawHeadTailPositionMap([...listOfPositions, NAMED_STARTING_POSITION]);
      console.log();
    }
  });
  drawTailPositionHistoryMap();
  console.log(
    `there are ${tailPositionHistory.length.toString()} positions the tail visited at least once`
  );
}

function isSamePosition(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

function isHeadAndTailTouching(head: Position, tail: Position): boolean {
  return (
    tail.x >= head.x - 1 &&
    tail.x <= head.x + 1 &&
    tail.y >= head.y - 1 &&
    tail.y <= head.y + 1
  );
}
interface NamedPosition {
  name: string;
  position: Position;
}
type ListOfNamedPositions = NamedPosition[];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function drawHeadTailPositionMap(
  listOfPositions: ListOfNamedPositions,
  columnMin: number = 0,
  columnMax: number = 5,
  rowMinimum: number = 0,
  rowMaximum: number = 4
): void {
  for (let row = rowMaximum; row >= rowMinimum; row--) {
    let output = "";
    for (let column = columnMin; column <= columnMax; column++) {
      const currentPosition: Position = { x: column, y: row };
      output =
        output +
        (listOfPositions.find((itemInTheList) =>
          isSamePosition(itemInTheList.position, currentPosition)
        )?.name ?? ".");
    }
    console.log(output);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function drawTailPositionHistoryMap(): void {
  const minimumYPosition = Math.min(
    ...tailPositionHistory.map((position) => position.y)
  );
  const maxYPosition = Math.max(
    ...tailPositionHistory.map((position) => position.y)
  );

  const minimumXPosition = Math.min(
    ...tailPositionHistory.map((position) => position.x)
  );
  const maxXPosition = Math.max(
    ...tailPositionHistory.map((position) => position.x)
  );
  for (let row = maxYPosition; row >= minimumYPosition; row--) {
    let output = "";
    for (let column = minimumXPosition; column <= maxXPosition; column++) {
      if (STARTING_POSITION.x === column && STARTING_POSITION.y === row) {
        output = output + "s";
      } else if (
        tailPositionHistory.some(
          (position) => position.x === column && position.y === row
        )
      ) {
        output = output + "#";
      } else {
        output = output + ".";
      }
    }
    console.log(output);
  }
}

async function main(): Promise<void> {
  const input = await readInputFile();

  // problem 1
  SolveProblem1(input);

  // problem 2
  console.log(`problem 2`);
  SolveProblem2(input);
}

void main();
