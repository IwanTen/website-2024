//simple code to offset geometry

const position = sphereGeometry.attributes.position;
const vertex = new THREE.Vector3();

const VERTEX_OFFSET = 0.05;
for (let i = 0, l = position.count; i < l; i++) {
  vertex.fromBufferAttribute(position, i);
  sphereGeometry.attributes.position.setXYZ(
    i,
    vertex.x + Math.random() * VERTEX_OFFSET,
    vertex.y + Math.random() * VERTEX_OFFSET,
    vertex.z + Math.random() * VERTEX_OFFSET
  );
}