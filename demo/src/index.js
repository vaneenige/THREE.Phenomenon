import './../../src';

import base from './base';
import instance from './instance';

const { renderer, scene, camera } = base();
const { mesh, uniforms } = instance();

scene.add(mesh);

function animate() {
  requestAnimationFrame(animate);
  uniforms.uProgress.value += uniforms.uProgress.value >= 1 ? -1 : 0.004;
  renderer.render(scene, camera);
}

animate();
