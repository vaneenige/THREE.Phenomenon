class Geometry extends THREE.BufferGeometry {
  /**
   * Creates an instance of Geometry.
   * @param {object} settings - Options used when creating a custom geometry.
   */
  constructor(settings) {
    super();

    // Assign settings to variables
    const { geometry, multiplier, attributes } = settings;

    const vertices = geometry.vertices.length;
    const indexes = geometry.faces.length * 3;

    // Create array to put face coordinates in
    const bufferIndexes = geometry.faces.map(face => [face.a, face.b, face.c]);

    // Create array with length of multiplier times indexes
    const indexBuffer = new Uint32Array(multiplier * indexes);

    // Loop over the multiplier
    for (let i = 0; i < multiplier; i += 1) {
      // Loop over the indexes of the baseGeometry
      for (let j = 0; j < indexes; j += 1) {
        // Repeat over the indexes and add them to the buffer
        indexBuffer[i * indexes + j] = bufferIndexes[j] + i * vertices;
      }
    }

    // Set the index with the data
    this.setIndex(new THREE.BufferAttribute(indexBuffer, 1));

    // Create a new attribute to store data in
    const attribute = new THREE.BufferAttribute(new Float32Array(multiplier * vertices * 3), 3);
    this.addAttribute('position', attribute);

    // Value to hold position used in the loop for the array positions
    let offset = 0;
    // Loop over the multiplier
    for (let i = 0; i < multiplier; i += 1) {
      // Loop over the vertices count of the baseGeometry
      for (let j = 0; j < vertices; j += 1, offset += 3) {
        // Repeat over the vertices and add them to the buffer
        const vertex = geometry.vertices[j];
        attribute.array[offset] = vertex.x;
        attribute.array[offset + 1] = vertex.y;
        attribute.array[offset + 2] = vertex.z;
      }
    }

    // Loop over the attributes
    for (let i = 0; i < attributes.length; i += 1) {
      // Create array with length of multiplier times vertices times attribute size
      const bufferArray = new Float32Array(multiplier * vertices * attributes[i].size);
      // Create a buffer attribute where the data will be stored in
      const bufferAttribute = new THREE.BufferAttribute(bufferArray, attributes[i].size);
      // Add the attribute by it's name
      this.addAttribute(attributes[i].name, bufferAttribute);
      // Loop over the multiplier
      for (let j = 0; j < multiplier; j += 1) {
        // Get data from the attribute function for every instance
        const data = attributes[i].data(j, multiplier);
        // Calculate offset based on vertices and attribute size
        offset = j * vertices * bufferAttribute.itemSize;
        // Loop over the vertices of the instance
        for (let k = 0; k < vertices; k += 1) {
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
