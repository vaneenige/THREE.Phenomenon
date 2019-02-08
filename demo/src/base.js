function base() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.setClearColor(0x212121, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(1);

  document.querySelector('body').appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.set(0, 20 * 1, 35 * 1);
  camera.lookAt(scene.position);
  scene.add(camera);

  const ambientLight = new THREE.AmbientLight('#ffffff', 0.1);
  scene.add(ambientLight);

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshPhongMaterial({
      emissive: '#F694C1',
    })
  );
  plane.receiveShadow = true;
  plane.position.y = -15;
  plane.rotation.x = Math.PI * -0.5;
  scene.add(plane);

  const light = new THREE.SpotLight(0xffffff, 2, 80, Math.PI * 0.25, 1, 2);
  light.position.set(0, 40, 0);
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 31;

  scene.add(light);

  return { renderer, scene, camera };
}

export default base;
