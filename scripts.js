var player = 1;
var lineColor = "#ddd";

var canvas = document.getElementById("tic-tac-toe-board");
var context = canvas.getContext("2d");

var canvasSize = 500;
var sectionSize = canvasSize / 3;
canvas.width = canvasSize;
canvas.height = canvasSize;
context.translate(0.5, 0.5);

class Node {
  constructor(data) {
    this.data = data;
    this.parent = null;
    this.children = [];
  }
}

class Tree {
  constructor(data) {
    var node = new Node(data);
    this.root = node;
  }
}

Tree.prototype.BFS = function() {
    var currentNode = this.root;
    var queue = new Queue();
    while(currentNode) {

        /* Don´t fucking uncomment dis block
        Unless you want your pc to explode
        console.log(currentNode.data); */

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (currentNode.data[x][y] === null) {
                    const len = currentNode.data.length, child = new Array(len);
                    for(let i = 0; i < len; i++) 
                        child[i] = currentNode.data[i].slice(0);
                    child[x][y] = 0;
                    const node = new Node(child);
                    node.parent = currentNode;
                    currentNode.children.push(node);
                }
            }
        }

        for(let i = 0; i < currentNode.children.length; i++)
            queue.enqueue(currentNode.children[i]);
        currentNode = queue.dequeue();
    }
}

class Queue {
    constructor() {
        this.oldestIndex = 1;
        this.newestIndex = 1;
        this.storage = {};
    }
    enqueue(data) {
        this.storage[this.newestIndex] = data;
        this.newestIndex++;
    }
    dequeue() {
        var deletedData;
        if (this.oldestIndex != this.newestIndex) {
            deletedData = this.storage[this.oldestIndex];
            delete this.storage[this.oldestIndex];
            this.oldestIndex++;
            return deletedData;
        }
    }
    printQ() {
        var size = this.size();
        for (var i = this.oldestIndex; i < this.newestIndex; i++) {
            console.log(this.storage[i]);
        }
        return size;
    }
    size() {
        return this.newestIndex - this.oldestIndex;
    }
}

window.onload = function () {
  Swal.fire({
    icon: "info",
    title: "Who´s going to start?",
    showDenyButton: true,
    confirmButtonText: "Please, you",
    denyButtonText: "Me, obviously",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      player = 2;
    } else if (result.isDenied) {
      player = 1;
    }
  });
};

function getInitialBoard(defaultValue) {
  board = [];

  for (var x = 0; x < 3; x++) {
    board.push([]);

    for (var y = 0; y < 3; y++) {
      board[x].push(defaultValue);
    }
  }

  return board;
}

var board = getInitialBoard(null);

function addPlayingPiece(mouse) {
  var xCoordinate;
  var yCoordinate;

  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      xCoordinate = x * sectionSize;
      yCoordinate = y * sectionSize;

      if (
        mouse.x >= xCoordinate &&
        mouse.x <= xCoordinate + sectionSize &&
        mouse.y >= yCoordinate &&
        mouse.y <= yCoordinate + sectionSize
      ) {
        // clearPlayingArea(xCoordinate, yCoordinate);

        if (
          board[(yCoordinate / 166).toFixed(0)][
            (xCoordinate / 166).toFixed(0)
          ] === null
        ) {
          if (player === 1) {
            drawX(xCoordinate, yCoordinate);
          } else {
            var len = board.length,
              child = new Array(len);
            for (var i = 0; i < len; i++) child[i] = board[i].slice(0);
            var tree = new Tree(child);
            fillThatTree(tree);
            drawO(xCoordinate, yCoordinate);
          }

          if (player === 1) player = 2;
          else player = 1;

          console.log(tree);
        }
      }
    }
  }
}

function fillThatTree(tree) {
  tree.BFS();
}

function clearPlayingArea(xCoordinate, yCoordinate) {
  context.fillStyle = "#fff";
  context.fillRect(xCoordinate, yCoordinate, sectionSize, sectionSize);
}

function drawO(xCoordinate, yCoordinate) {
  var halfSectionSize = 0.5 * sectionSize;
  var centerX = xCoordinate + halfSectionSize;
  var centerY = yCoordinate + halfSectionSize;
  var radius = (sectionSize - 100) / 2;
  var startAngle = 0 * Math.PI;
  var endAngle = 2 * Math.PI;

  context.lineWidth = 10;
  context.strokeStyle = "#01bBC2";
  context.beginPath();
  context.arc(centerX, centerY, radius, startAngle, endAngle);
  context.stroke();

  board[(yCoordinate / 166).toFixed(0)][(xCoordinate / 166).toFixed(0)] = 0;
}

function drawX(xCoordinate, yCoordinate) {
  context.strokeStyle = "#f1be32";

  context.beginPath();

  var offset = 50;
  context.moveTo(xCoordinate + offset, yCoordinate + offset);
  context.lineTo(
    xCoordinate + sectionSize - offset,
    yCoordinate + sectionSize - offset
  );

  context.moveTo(xCoordinate + offset, yCoordinate + sectionSize - offset);
  context.lineTo(xCoordinate + sectionSize - offset, yCoordinate + offset);

  context.stroke();

  board[(yCoordinate / 166).toFixed(0)][(xCoordinate / 166).toFixed(0)] = 1;
}

function drawLines(lineWidth, strokeStyle) {
  var lineStart = 4;
  var lineLenght = canvasSize - 5;
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.strokeStyle = strokeStyle;
  context.beginPath();

  /*
   * Horizontal lines
   */
  for (var y = 1; y <= 2; y++) {
    context.moveTo(lineStart, y * sectionSize);
    context.lineTo(lineLenght, y * sectionSize);
  }

  /*
   * Vertical lines
   */
  for (var x = 1; x <= 2; x++) {
    context.moveTo(x * sectionSize, lineStart);
    context.lineTo(x * sectionSize, lineLenght);
  }

  context.stroke();
}

drawLines(10, lineColor);

function getCanvasMousePosition(event) {
  var rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

canvas.addEventListener("mouseup", function (event) {
  var canvasMousePosition = getCanvasMousePosition(event);
  addPlayingPiece(canvasMousePosition);
  drawLines(10, lineColor);
});
