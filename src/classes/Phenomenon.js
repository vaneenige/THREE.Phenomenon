import Geometry from './Geometry';

/**
 * Class representing a Phenomenon.
 */
class Phenomenon {
  /**
   * Create an instance.
   * @param {object} settings - Options used when creating an instance.
   */
  constructor(settings) {
    // Assign settings to variables
    const { material, uniforms, vertex, castShadow } = settings;

    // Create the custom geometry
    const geometry = new Geometry(settings);

    // Create a combined mesh
    const mesh = new THREE.Mesh(geometry, material);

    // Compute vertex normals
    mesh.geometry.computeVertexNormals();

    // Set callback to modify our shaders
    material.onBeforeCompile = shader => {
      // Reference shader for debugging
      mesh.shader = shader;

      // Combine the uniforms
      Object.assign(shader.uniforms, uniforms);

      // Trim the provided vertex shader
      const vertexShader = vertex.replace(/(\r\n|\n|\r)/gm, '');

      // Get shader attributes
      const attributes = vertexShader.match(/.+?(?=void)/)[0];

      // Get shader main function
      const main = vertexShader.match(/main\(\){(.*?)}/)[1];

      // Construct the final vertex shader
      shader.vertexShader = `${attributes} \n ${shader.vertexShader}`;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        main.replace('gl_Position =', 'vec3 transformed =')
      );

      // Hack to randomize function
      material.onBeforeCompile = `${material.onBeforeCompile
        .toString()
        .slice(0, -1)}/* ${Math.random()} */}`;

      if (castShadow) {
        // Create custom material for shadows
        const customMaterial = new THREE.ShaderMaterial({
          vertexShader: shader.vertexShader,
          fragmentShader: THREE.ShaderLib.shadow.fragmentShader,
          uniforms,
        });
        // Turn on shadows
        mesh.castShadow = true;
        mesh.customDepthMaterial = customMaterial;
        mesh.customDistanceMaterial = customMaterial;
      }
    };

    return { mesh, uniforms };
  }
}

THREE.Phenomenon = Phenomenon;

export default Phenomenon;
