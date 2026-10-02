import test from 'node:test';
import assert from 'node:assert/strict';
import { asciiModels, asciiSets, renderAsciiModel } from '../components/ascii/ascii-engine';

test('all engineering models rasterize within the fixed character grid across orientations', () => {
  for (let index=0; index<asciiModels.length; index++) {
    for (const [yaw,pitch] of [[0,0],[1.2,-.7],[3,.8]]) {
      const image=renderAsciiModel(index,1200,yaw,pitch,asciiSets[0].glyphs,64,25);
      const rows=image.split('\n');
      assert.equal(rows.length,25);
      assert.ok(rows.every(row=>row.length===64));
      assert.ok(image.replace(/\s/g,'').length>15, asciiModels[index].label);
    }
  }
});
