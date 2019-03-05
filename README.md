
# THREE.Phenomenon

[![npm version](https://img.shields.io/npm/v/three.phenomenon.svg)](https://www.npmjs.com/package/three.phenomenon)
[![gzip size](http://img.badgesize.io/https://unpkg.com/three.phenomenon/dist/three.phenomenon.mjs?compression=gzip)](https://unpkg.com/three.phenomenon)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/vaneenige/three.phenomenon/blob/master/LICENSE)
[![dependencies](https://img.shields.io/badge/dependencies-three.js-ff69b4.svg)](https://github.com/mrdoob/three.js/)

THREE.Phenomenon is a tiny wrapper around <a href="https://threejs.org/">three.js</a> built for high-performance WebGL experiences.

With it's simple API a mesh can be created that contains multiple instances of a geometry combined with a material. With access to the vertex shader, attributes per instance and uniforms this mesh can be transformed in any way possible (and on the GPU).

#### Features:
- Below 1kb in size (gzip)
- Custom instanced geometries
- Attributes for every instance
- Support for default materials
- Compatible with three.js <a href="https://github.com/mrdoob/three.js/releases/tag/r102">r102</a>

## Install
```
$ npm install --save three.phenomenon
```

## Usage
```js
// Import the library
import Phenomenon from 'three.phenomenon';

// Create an instance
Phenomenon({ ... });
```

> The wrapper is also available through THREE.Phenomenon.

## API
### Phenomenon(options)

Returns an instance of Phenomenon.

> The instance provides access to the mesh (with the compiled vertex and fragment shader) and uniforms.

#### options.attributes
Type: `Array` <br/>

Values used in the program that are stored once, directly on the GPU. Every item in this array needs to have a:
- `name` for referencing data in the vertex shader.
- `data` function to create the data for each instance.
- `size` so it's clear what comes back from the data.

> The data function receives the index of the current instance and the total number of instances so calculations can be done based on these values.

#### options.uniforms
Type: `Object` <br/>

Variables used in the program that can be adjusted on the fly. These are accessible through the instance variable and can be updated directly.

#### options.vertex
Type: `String` <br/>

The vertex shader of the program which will calculate the position of every instance. This will automatically get merged with the shaders that's created based on the provided geometry.

#### options.fragment
Type: `Array` <br/>

The fragment parameter is optional and can be used to modify specific parts of the provided material's fragment shader. For example: Give every instance a unique color or manually use its position for calculations.

#### options.geometry
Type: `THREE.Geometry` <br/>

The geometry that will be multiplied. See <a href="https://threejs.org/docs/#api/en/core/Geometry">Geometry</a> for more information.

#### options.material
Type: `THREE.Material` <br/>

The material that is used for the geometry. See <a href="https://threejs.org/docs/#api/en/materials/Material">Material</a> for more information.

#### options.multiplier
Type: `Number` <br/>
The amount of instances that will be created.

#### options.castShadow
Type: `Boolean` <br/>
Should the mesh cast a shadow?

## Contribute
Are you excited about this library and have interesting ideas on how to improve it? Please tell me or contribute directly!

```
npm install > npm start > http://localhost:8080
```

## License
MIT © <a href="https://use-the-platform.com">Colin van Eenige</a>