import '../../src';

import demo1 from './demo-1/instance';
import demo2 from './demo-2/instance';
import demo3 from './demo-3/instance';
import demo4 from './demo-4/instance';

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setClearColor(0x212121, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(1);

document.querySelector('body').appendChild(renderer.domElement);

const s = 2;

function ap(o, i) {
  Object.assign(o, {
    left: (i % s) * (1 / s),
    top: Math.floor(i / s) * (1 / s),
    width: 1 / s,
    height: 1 / s,
  });
  return o;
}

const views = [ap(demo1(), 0), ap(demo2(), 1), ap(demo3(), 2), ap(demo4(), 3)];

function animate() {
  requestAnimationFrame(animate);
  for (let i = 0; i < views.length; i += 1) {
    const view = views[i];

    const left = Math.floor(window.innerWidth * view.left);
    const top = Math.floor(window.innerHeight * view.top);
    const width = Math.floor(window.innerWidth * view.width);
    const height = Math.floor(window.innerHeight * view.height);

    renderer.setViewport(left, top, width, height);
    renderer.setScissor(left, top, width, height);
    renderer.setScissorTest(true);

    view.camera.aspect = width / height;
    view.camera.updateProjectionMatrix();

    view.render();
    renderer.render(view.scene, view.camera);
  }
}

animate();
