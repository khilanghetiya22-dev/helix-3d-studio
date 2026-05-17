const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'public', 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

function writeCubeSTL(filePath, size) {
  const content = `solid cube
  facet normal 0 0 -1
    outer loop
      vertex 0 0 0
      vertex ${size} 0 0
      vertex ${size} ${size} 0
    endloop
  endfacet
  facet normal 0 0 -1
    outer loop
      vertex 0 0 0
      vertex ${size} ${size} 0
      vertex 0 ${size} 0
    endloop
  endfacet
  facet normal 0 0 1
    outer loop
      vertex 0 0 ${size}
      vertex ${size} ${size} ${size}
      vertex ${size} 0 ${size}
    endloop
  endfacet
  facet normal 0 0 1
    outer loop
      vertex 0 0 ${size}
      vertex 0 ${size} ${size}
      vertex ${size} ${size} ${size}
    endloop
  endfacet
  facet normal 0 -1 0
    outer loop
      vertex 0 0 0
      vertex 0 0 ${size}
      vertex ${size} 0 ${size}
    endloop
  endfacet
  facet normal 0 -1 0
    outer loop
      vertex 0 0 0
      vertex ${size} 0 ${size}
      vertex ${size} 0 0
    endloop
  endfacet
  facet normal 0 1 0
    outer loop
      vertex 0 ${size} 0
      vertex ${size} ${size} 0
      vertex ${size} ${size} ${size}
    endloop
  endfacet
  facet normal 0 1 0
    outer loop
      vertex 0 ${size} 0
      vertex ${size} ${size} ${size}
      vertex 0 ${size} ${size}
    endloop
  endfacet
  facet normal -1 0 0
    outer loop
      vertex 0 0 0
      vertex 0 ${size} 0
      vertex 0 ${size} ${size}
    endloop
  endfacet
  facet normal -1 0 0
    outer loop
      vertex 0 0 0
      vertex 0 ${size} ${size}
      vertex 0 0 ${size}
    endloop
  endfacet
  facet normal 1 0 0
    outer loop
      vertex ${size} 0 0
      vertex ${size} 0 ${size}
      vertex ${size} ${size} ${size}
    endloop
  endfacet
  facet normal 1 0 0
    outer loop
      vertex ${size} 0 0
      vertex ${size} ${size} ${size}
      vertex ${size} ${size} 0
    endloop
  endfacet
endsolid cube
`;
  fs.writeFileSync(filePath, content);
}

writeCubeSTL(path.join(modelsDir, 'calibration_cube_20mm.stl'), 20);
writeCubeSTL(path.join(modelsDir, 'precision_block_50mm.stl'), 50);

console.log('STLs generated.');
