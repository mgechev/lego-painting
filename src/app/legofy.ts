interface Cell {
  data: number[];
  color: number[];
}

interface Grid extends Array<Array<Cell>> {
  [row: number]: Array<Cell>;
}

export const legofy = (data: ImageData): ImageData => {
  const grid = extractGrid(data);
  const result = getImageData(grid, data.width, data.height);
  console.log(data, result);
  return result;
};

const getDistance = (a: number[], b: number[]): number => {
  return Math.sqrt(
    (a[0] - b[0]) * (a[0] - b[0])
  + (a[1] - b[1]) * (a[1] - b[1])
  + (a[2] - b[2]) * (a[2] - b[2])
  + (a[3] - b[3]) * (a[3] - b[3])
  );
};

const pickColor = (color: number[], colors: number[][]): number[] => {
  let bestDistance = Infinity;
  let bestColorIndex = 0;
  for (let i = 0; i < colors.length; i++) {
    const distance = getDistance(color, colors[i]);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestColorIndex = i;
    }
  }
  if (bestColorIndex === 0) {
    totalBlack++;
  }
  return colors[bestColorIndex];
};

let totalBlack = 0;

const averageColor = (data: number[]): number[] => {
  const nums: [number, number, number, number] = [0, 0, 0, 0];
  for (let i = 0; i < data.length; i += 1) {
    nums[i % 4] += data[i];
  }
  const total = Math.floor(data.length / 4);
  return nums.map(num => Math.floor(num / total));
};

const cellWidth = 3;
const cellHeight = 3;
const colors = [
  [0, 0, 0, 255],
  [255, 255, 255, 255]
]

const getCurrentRow = (index: number, width: number): number => {
  return Math.floor(index / (width * 4));
};

const getCurrentColumn = (index: number, width: number): number => {
  const row = getCurrentRow(index, width);
  const dx = index - (row * width * 4);
  return Math.floor(dx / 4)
};

const getCurrentGridRow = (currentRow: number): number => {
  return Math.floor(currentRow / cellWidth);
};

const getCurrentGridColumn = (currentColumn: number): number => {
  return Math.floor(currentColumn / cellHeight);
};

const extractGrid = (data: ImageData): Grid => {
  const result: Grid = [];
  let currentGridRow = 0;
  let currentGridColumn = 0;
  for (let i = 0; i < data.data.length; i += 4) {
    const currentRow = getCurrentRow(i, data.width);
    const currentColumn = getCurrentColumn(i, data.width);
    currentGridRow = getCurrentGridRow(currentRow);
    currentGridColumn = getCurrentGridColumn(currentColumn);
    result[currentGridRow] = result[currentGridRow] ?? [];
    result[currentGridRow][currentGridColumn] = result[currentGridRow][currentGridColumn] ?? {
      data: [],
      color: []
    };
    result[currentGridRow][currentGridColumn].data.push(
      data.data[i],
      data.data[i + 1],
      data.data[i + 2],
      data.data[i + 3],
    );
  }
  let total = 0;
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result[i].length; j++) {
      total++;
      result[i][j].color = pickColor(averageColor(result[i][j].data), colors);
    }
  }
  console.log(total, totalBlack);
  return result;
};

const getColorFromGrid = (grid: Grid, index: number, width: number): Cell => {
  const row = getCurrentRow(index, width);
  const column = getCurrentColumn(index, width);
  return grid[getCurrentGridRow(row)][getCurrentGridColumn(column)];
};

const getImageData = (grid: Grid, width: number, height: number): ImageData => {
  const data: Uint8ClampedArray = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    const {color} = getColorFromGrid(grid, i, width);
    data[i] = color[0];
    data[i + 1] = color[1];
    data[i + 2] = color[2];
    data[i + 3] = color[3];
  }
  return new ImageData(data, width, height);
};