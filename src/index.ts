import * as three from 'three';

declare global {
  var THREE: typeof three;
}

interface Attribute {
  name: string;
  data: (i: number, total: number) => void;
  size: number;
}

class Geometry extends THREE.BufferGeometry {
  constructor(geometry: three.Geometry, multiplier: number, attributes: Array<Attribute>) {
    super();

    // Assign settings to variables
    const { faces, vertices } = geometry;

    const vertexCount = vertices.length;
    const indexes = faces.length * 3;

    // Create array to put face coordinates in
    const bufferIndexes = [];
    for (let i = 0; i < faces.length; i += 1) {
      bufferIndexes.push(faces[i].a, faces[i].b, faces[i].c);
    }

    // Create array with length of multiplier times indexes
    const indexBuffer = new Uint32Array(multiplier * indexes);

    // Loop over the multiplier
    for (let i = 0; i < multiplier; i += 1) {
      // Loop over the indexes of the baseGeometry
      for (let j = 0; j < indexes; j += 1) {
        // Repeat over the indexes and add them to the buffer
        indexBuffer[i * indexes + j] = bufferIndexes[j] + i * vertexCount;
      }
    }

    // Set the index with the data
    this.setIndex(new THREE.BufferAttribute(indexBuffer, 1));

    // Create a new attribute to store data in
    const attributeData = new Float32Array(multiplier * vertexCount * 3);

    // Value to hold position used in the loop for the array positions
    let offset = 0;
    // Loop over the multiplier
    for (let i = 0; i < multiplier; i += 1) {
      // Loop over the vertexCount of the baseGeometry
      for (let j = 0; j < vertexCount; j += 1, offset += 3) {
        // Repeat over the vertices and add them to the buffer
        const vertex = vertices[j];
        attributeData[offset] = vertex.x;
        attributeData[offset + 1] = vertex.y;
        attributeData[offset + 2] = vertex.z;
      }
    }

    const attribute = new THREE.BufferAttribute(attributeData, 3);
    this.addAttribute('position', attribute);

    // Loop over the attributes
    for (let i = 0; i < attributes.length; i += 1) {
      // Create array with length of multiplier times vertexCount times attribute size
      const bufferArray = new Float32Array(multiplier * vertexCount * attributes[i].size);
      // Create a buffer attribute where the data will be stored in
      const bufferAttribute = new THREE.BufferAttribute(bufferArray, attributes[i].size);
      // Add the attribute by it's name
      this.addAttribute(attributes[i].name, bufferAttribute);
      // Loop over the multiplier
      for (let j = 0; j < multiplier; j += 1) {
        // Get data from the attribute function for every instance
        const data = attributes[i].data(j, multiplier);
        // Calculate offset based on vertexCount and attribute size
        offset = j * vertexCount * bufferAttribute.itemSize;
        // Loop over the vertexCount of the instance
        for (let k = 0; k < vertexCount; k += 1) {
          // Loop over the item size of the attribute
          for (let l = 0; l < bufferAttribute.itemSize; l += 1) {
            // Assign the buffer data to the right position
            bufferArray[offset] = data[l];
            offset += 1;
          }
        }
      }
    }

    return this;
  }
}

class Phenomenon {
  constructor(
    geometry: three.Geometry,
    material: three.Material,
    multiplier: number,
    attributes: Array<Attribute>,
    uniforms: object,
    vertex: string,
    castShadow?: boolean,
    fragment?: Array<Array<string>>
  ) {
    // Create the custom geometry
    const customGeometry = new Geometry(geometry, multiplier, attributes);

    // Create a combined mesh
    const mesh = new THREE.Mesh(customGeometry, material);

    // Compute vertex normals
    mesh.geometry.computeVertexNormals();

    // Set callback to modify our shaders
    material.onBeforeCompile = shader => {
      // @ts-ignore - Reference shader for debugging
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

      for (let i = 0; i < fragment.length; i += 1) {
        shader.fragmentShader = shader.fragmentShader.replace(fragment[i][0], fragment[i][1]);
      }

      // @ts-ignore - Hack to randomize function
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
        // @ts-ignore - Set custom depth material
        mesh.customDepthMaterial = customMaterial;
        // @ts-ignore - Set custom distance material
        mesh.customDistanceMaterial = customMaterial;
      }
    };

    return { mesh, uniforms };
  }
}

// @ts-ignore - Make it available through THREE
THREE.Phenomenon = Phenomenon;

export default Phenomenon;
