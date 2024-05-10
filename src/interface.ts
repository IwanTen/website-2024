import { _drawCircle, _drawLine } from './utils';

interface Hands {
  left: { x: number; y: number };
  right: { x: number; y: number };
}

export default class InterfaceController {
  canvas!: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  targetHeight = window.innerHeight / 2;
  hands: Hands = {
    left: {
      x: window.innerWidth / 4,
      y: window.innerHeight / 2 + 100,
    },
    right: {
      x: (3 * window.innerWidth) / 4,
      y: window.innerHeight / 2 + 100,
    },
  };

  constructor() {
    this.canvas = document.querySelector('.ui-canvas') as HTMLCanvasElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    if (this.ctx === null) {
      throw new Error('Could not get 2d context from canvas.');
    }

    window.addEventListener('resize', () => {
      this.updateScreenPositions();
      this.drawUI();
    });
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 2;
    this.updateScreenPositions(); //call intitial position update and draw to canvas
    this.drawUI();
  }

  private updateScreenPositions = () => {
    const leftHandX = window.innerWidth / 4;
    const rightHandX = window.innerWidth - leftHandX;
    const handOffsetY = 100;
    const handHeight = window.innerHeight / 2 + handOffsetY;
    this.hands.left = { x: leftHandX, y: handHeight };
    this.hands.right = { x: rightHandX, y: handHeight };
    this.targetHeight = window.innerHeight / 3;
  };

  private drawUI() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 2;
    let centerX = window.innerWidth / 2; // draw center line
    _drawCircle(this.ctx, this.hands.left.x, this.hands.left.y, 10); //draw this.hands
    _drawCircle(this.ctx, this.hands.right.x, this.hands.right.y, 10);
    _drawLine(this.ctx, centerX, 0, centerX, window.innerHeight);
    this.ctx.strokeStyle = 'red';
    _drawCircle(this.ctx, centerX, this.targetHeight, 8);
  }
}
