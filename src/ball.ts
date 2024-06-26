import * as THREE from 'three';

enum BallState {
  Idle,
  Active,
}
export default class JugglingBall extends THREE.Mesh {
  acceleration = new THREE.Vector3(0, 0, 0);
  velocity = new THREE.Vector3(0, 0, 0);
  state: BallState = BallState.Idle;
  mass: number = 1;
  leftHand: boolean = false;
  constructor(
    sphereGeometry: THREE.SphereGeometry,
    material: THREE.MeshToonMaterial | THREE.MeshLambertMaterial,
    startPos: number[],
    leftHand: boolean
  ) {
    super(sphereGeometry, material);
    this.position.set(startPos[0], startPos[1], startPos[2]);
  }

  updatePhysics(deltaTime: number) {
    if (this.state === BallState.Idle) return;
    this.acceleration.add(new THREE.Vector3(0, -9.8, 0));
    this.velocity.add(this.acceleration.clone().multiplyScalar(deltaTime));
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    this.acceleration.set(0, 0, 0);
    // console.log(this.velocity);
  }

  //* (This is simply an apply force function)
  applyForce(force: THREE.Vector3) {
    this.velocity.set(0, 0, 0);
    this.velocity.add(force.clone());
    console.log(this.acceleration);
  }

  setVelocity(velocity: THREE.Vector3) {
    this.velocity = velocity;
  }

  getPosition() {
    return this.position;
  }

  setState(state: string) {
    this.state = BallState[state as keyof typeof BallState];
  }

  // Check if ball is offscreen;
}
