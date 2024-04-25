/*
//*TODO: Make hands global variables
*/

import { _drawCircle, _drawLine } from './utils';

const Hands = {
  left: {
    x: window.innerWidth / 4,
    y: window.innerHeight / 2 + 100,
  },
  right: {
    x: (3 * window.innerWidth) / 4,
    y: window.innerHeight / 2 + 100,
  },
};

const updateHandPositions = () => {
  const leftHandX = window.innerWidth / 4;
  const rightHandX = window.innerWidth - leftHandX;
  const handOffsetY = 100;
  const handHeight = window.innerHeight / 2 + handOffsetY;
  Hands.left = { x: leftHandX, y: handHeight };
  Hands.right = { x: rightHandX, y: handHeight };
};
updateHandPositions();

const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
if (canvas === null) {
  throw new Error('No canvas element found in the document.');
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas!.getContext('2d');
if (ctx === null) {
  throw new Error('Could not get 2d context from canvas.');
}
ctx.fillStyle = 'white';
ctx.strokeStyle = 'white';

function drawUI() {
  ctx!.lineWidth = 2;
  ctx!.strokeStyle = 'white';
  ctx!.fillStyle = 'white';
  _drawCircle(ctx!, Hands.left.x, Hands.left.y, 5); //draw hands
  _drawCircle(ctx!, Hands.right.x, Hands.right.y, 5);
  let centerX = window.innerWidth / 2; // draw center line
  _drawLine(ctx!, centerX, 0, centerX, window.innerHeight);
}
drawUI();

function handleResize() {
  updateHandPositions();
  if (canvas === null) {
    throw new Error('No canvas element found in the document.');
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx!.clearRect(0, 0, canvas.width, canvas.height);
  drawUI();
  console.log(Hands.left.x, Hands.left.y);
}
window.addEventListener('resize', handleResize);
