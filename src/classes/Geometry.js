class Geometry extends THREE.BufferGeometry {
  /**
   * Creates an instance of Geometry.
   * @param {object} settings - Options used when creating a custom geometry.
   */
  constructor(settings) {
    super();

    // Assign settings to variables
    const { geometry, multiplier, attributes } = settings;
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
    const attribute = new THREE.BufferAttribute(new Float32Array(multiplier * vertexCount * 3), 3);
    this.addAttribute('position', attribute);

    // Value to hold position used in the loop for the array positions
    let offset = 0;
    // Loop over the multiplier
    for (let i = 0; i < multiplier; i += 1) {
      // Loop over the vertexCount of the baseGeometry
      for (let j = 0; j < vertexCount; j += 1, offset += 3) {
        // Repeat over the vertices and add them to the buffer
        const vertex = vertices[j];
        attribute.array[offset] = vertex.x;
        attribute.array[offset + 1] = vertex.y;
        attribute.array[offset + 2] = vertex.z;
      }
    }

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
            bufferAttribute.array[offset] = data[l];
            offset += 1;
          }
        }
      }
    }

    return this;
  }
}

export default Geometry;
