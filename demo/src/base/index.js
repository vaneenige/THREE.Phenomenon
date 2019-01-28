function base(sceneColor) {
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
      emissive: sceneColor,
    })
  );
  plane.receiveShadow = true;
  plane.position.y = -15;
  plane.rotation.x = Math.PI * -0.5;
  scene.add(plane);

  const light = new THREE.SpotLight(0xffffff, 3, 80, Math.PI * 0.25, 1, 2);
  light.position.set(0, 40, 0);
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 31;

  scene.add(light);

  return { scene, camera };
}

export default base;
