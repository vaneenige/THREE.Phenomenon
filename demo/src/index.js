import './../../dist/three.phenomenon';

import base from './base';
import instance from './instance';

const { renderer, scene, camera } = base();
const { mesh, uniforms } = instance();

scene.add(mesh);

let progress = 0;

uot(
  p => {
    progress = p;
  },
  3000,
  Infinity
);

function animate() {
  requestAnimationFrame(animate);
  uniforms.uProgress.value = progress;
  renderer.render(scene, camera);
}

animate();
