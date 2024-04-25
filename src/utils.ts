//canvas utils
import * as THREE from 'three';
export function _drawCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
}
export function _drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

export function _drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number
) {
  ctx.fillText(text, x, y);
}

//physics utils
export function _applyForce(
  force: THREE.Vector3,
  velocity: THREE.Vector3,
  mass: number,
  acceleration: THREE.Vector3
) {
  velocity.set(0, 0, 0);
  acceleration.add(force.clone().divideScalar(mass));
}

export function _calculateKinematicPosition(
  initialPosition: THREE.Vector3,
  initialVelocity: THREE.Vector3,
  acceleration: THREE.Vector3,
  time: number
): THREE.Vector3 {
  return initialPosition
    .clone()
    .add(initialVelocity.clone().multiplyScalar(time))
    .add(acceleration.clone().multiplyScalar(0.5 * time * time));
}
