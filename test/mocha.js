/* global: describe, it */

// var assert = require('assert');
var assert = require('chai').assert;

// var tests = require('./tests.defs');

var FlexTable = require('../').FlexTable;

// let cfgTest = {
//   fail: function(m){
//     return {
//       fail: m,
//     };
//   }
// };

function createAst(){
  const ast = {
    'exec': new FlexTable(
      ['ts', 'time'],
      [
        [123, 12.98],
        [124, 10.98],
      ]),
    'event': new FlexTable(
      ['ts', 'evname', 'time'],
      [
        [123, 'begin', 0.0],
        [123, 'start', 3.1],
        [123, 'end', 4.44],
        [124, 'begin', 0.0],
        [124, 'start', 2.5],
        [124, 'end', 4.1],
      ]),
  };
  return ast;
}

function assertArrays(a, b){
  assert.sameOrderedMembers(a, b);
}
function assertArraysOfArrays(a, b){
  let i=0;
  for (let array of a){
    assertArrays(array, b[i]);
    i++;
  }
}

describe('FlexTable', function() {

  let ast;

  beforeEach(function(){
    ast = createAst();
  });

  describe('Rows', function(){

    it('append rows at the end', function(){
      let expected;
      ast.exec.appendRow([125, 10.03]);
      expected = {
        headers: ['ts', 'time'],
        _hlength: 2,
        values: [
          [123, 12.98],
          [124, 10.98],
          [125, 10.03],
        ],
        _vlength: 3,
        idx: { 'ts': 0, 'time': 1 }
      };
      assert.deepEqual(ast.exec, expected);
      assertArrays(ast.exec.headers, expected.headers);
      assertArraysOfArrays(ast.exec.values, expected.values);
    });

    it('insert rows at the middle', function(){
      let expected;
      ast.exec.setRow(-1, [125, 10.03], false);
      expected = {
        headers: ['ts', 'time'],
        _hlength: 2,
        values: [
          [123, 12.98],
          [125, 10.03],
          [124, 10.98],
        ],
        _vlength: 3,
        idx: { 'ts': 0, 'time': 1 }
      };
      assert.deepEqual(ast.exec, expected);
      assertArrays(ast.exec.headers, expected.headers);
      assertArraysOfArrays(ast.exec.values, expected.values);
    });

    it('insert rows at the beginning', function(){
      let expected;
      ast.exec.setRow(0, [125, 10.03], false);
      expected = {
        headers: ['ts', 'time'],
        _hlength: 2,
        values: [
          [125, 10.03],
          [123, 12.98],
          [124, 10.98],
        ],
        _vlength: 3,
        idx: { 'ts': 0, 'time': 1 }
      };
      assert.deepEqual(ast.exec, expected);
      assertArrays(ast.exec.headers, expected.headers);
      assertArraysOfArrays(ast.exec.values, expected.values);
    });

    it('remove rows at the beginning', function(){
      let expected;
      ast.exec.setRow(0, null, true);
      // FlexTable.setRow(ast.exec, 0, null); // the same
      expected = {
        headers: ['ts', 'time'],
        _hlength: 2,
        values: [
          [124, 10.98],
        ],
        _vlength: 1,
        idx: { 'ts': 0, 'time': 1 }
      };
      assert.deepEqual(ast.exec, expected);
      assertArrays(ast.exec.headers, expected.headers);
      assertArraysOfArrays(ast.exec.values, expected.values);
    });

    it('remove rows at the middle', function(){
      let expected;
      ast.exec.setRow(1, null);
      expected = {
        headers: ['ts', 'time'],
        _hlength: 2,
        values: [
          [123, 12.98],
          // [124, 10.98],
        ],
        _vlength: 1,
        idx: { 'ts': 0, 'time': 1 }
      };
      assert.deepEqual(ast.exec, expected);
      assertArrays(ast.exec.headers, expected.headers);
      assertArraysOfArrays(ast.exec.values, expected.values);
    });

    it('remove rows at the end', function(){
      let expected;
      ast.exec.setRow(-1, null);
      expected = {
        headers: ['ts', 'time'],
        _hlength: 2,
        values: [
          [123, 12.98],
          // [124, 10.98],
        ],
        _vlength: 1,
        idx: { 'ts': 0, 'time': 1 }
      };
      assert.deepEqual(ast.exec, expected);
      assertArrays(ast.exec.headers, expected.headers);
      assertArraysOfArrays(ast.exec.values, expected.values);

      ast.exec.setRow(-1, null);
      expected = {
        headers: ['ts', 'time'],
        _hlength: 2,
        values: [
        ],
        _vlength: 0,
        idx: { 'ts': 0, 'time': 1 }
      };
      assert.deepEqual(ast.exec, expected);
      assertArrays(ast.exec.headers, expected.headers);
      assertArraysOfArrays(ast.exec.values, expected.values);
    });

    it('replace rows at the beginning', function(){
      let expected;
      ast.exec.setRow(0, [125, 0.34], true);
      expected = {
        headers: ['ts', 'time'],
        _hlength: 2,
        values: [
          [125, 0.34],
          // [123, 12.98],
          [124, 10.98],
        ],
        _vlength: 2,
        idx: { 'ts': 0, 'time': 1 }
      };
      assert.deepEqual(ast.exec, expected);
      assertArrays(ast.exec.headers, expected.headers);
      assertArraysOfArrays(ast.exec.values, expected.values);
    });

    it('replace rows at the middle', function(){
      let expected;
      ast.exec.setRow(1, [125, 0.34], true);
      expected = {
        headers: ['ts', 'time'],
        _hlength: 2,
        values: [
          // [125, 0.34],
          [123, 12.98],
          [125, 0.34],
          // [124, 10.98],
        ],
        _vlength: 2,
        idx: { 'ts': 0, 'time': 1 }
      };
      assert.deepEqual(ast.exec, expected);
      assertArrays(ast.exec.headers, expected.headers);
      assertArraysOfArrays(ast.exec.values, expected.values);
    });

    it('replace rows at the end', function(){
      let expected;
      ast.exec.setRow(-1, [125, 0.34], true);
      expected = {
        headers: ['ts', 'time'],
        _hlength: 2,
        values: [
          // [125, 0.34],
          [123, 12.98],
          [125, 0.34],
          // [124, 10.98],
        ],
        _vlength: 2,
        idx: { 'ts': 0, 'time': 1 }
      };
      assert.deepEqual(ast.exec, expected);
      assertArrays(ast.exec.headers, expected.headers);
      assertArraysOfArrays(ast.exec.values, expected.values);
    });

    it('remove rows by a custom function (not true leaves unchanged)', function(){
      let expected;
      ast.event.modifyRows(true, function(row, i){

      });
      expected = {
        headers: ['ts', 'evname', 'time'],
        _hlength: 3,
        values: [
          [123, 'begin', 0.0],
          [123, 'start', 3.1],
          [123, 'end', 4.44],
          [124, 'begin', 0.0],
          [124, 'start', 2.5],
          [124, 'end', 4.1],
        ],
        _vlength: 6,
        idx: { 'ts': 0, 'evname': 1, 'time': 2 }
      };
      assert.deepEqual(ast.event, expected);
      assertArrays(ast.event.headers, expected.headers);
      assertArraysOfArrays(ast.event.values, expected.values);
    });

    it('remove rows by a custom function (true removes)', function(){
      let expected;
      ast.event.modifyRows(true, function(row, i){
        if (row[2] > 2.4){
          return true;
        }
      });
      expected = {
        headers: ['ts', 'evname', 'time'],
        _hlength: 3,
        values: [
          [123, 'begin', 0.0],
          [124, 'begin', 0.0],
        ],
        _vlength: 2,
        idx: { 'ts': 0, evname: 1, 'time': 2 }
      };
      assert.deepEqual(ast.event, expected);
      assertArrays(ast.event.headers, expected.headers);
      assertArraysOfArrays(ast.event.values, expected.values);
    });

    it('modify rows by a custom function (null leaves unchanged)', function(){
      let expected;
      ast.event.modifyRows(false, function(row, i){

      });
      expected = {
        headers: ['ts', 'evname', 'time'],
        _hlength: 3,
        values: [
          [123, 'begin', 0.0],
          [123, 'start', 3.1],
          [123, 'end', 4.44],
          [124, 'begin', 0.0],
          [124, 'start', 2.5],
          [124, 'end', 4.1],
        ],
        _vlength: 6,
        idx: { 'ts': 0, evname: 1, 'time': 2 }
      };
      assert.deepEqual(ast.event, expected);
      assertArrays(ast.event.headers, expected.headers);
      assertArraysOfArrays(ast.event.values, expected.values);
    });

    it('modify rows by a custom function (not null modifies the row)', function(){
      let expected;
      ast.event.modifyRows(false, function(row, i){
        if (row[1] == 'begin'){
          return [100, 'xxx', row[2]];
        }
      });
      expected = {
        headers: ['ts', 'evname', 'time'],
        _hlength: 3,
        values: [
          [100, 'xxx', 0],
          [123, 'start', 3.1],
          [123, 'end', 4.44],
          [100, 'xxx', 0],
          [124, 'start', 2.5],
          [124, 'end', 4.1],
        ],
        _vlength: 6,
        idx: { 'ts': 0, evname: 1, 'time': 2 }
      };
      assert.deepEqual(ast.event, expected);
      assertArrays(ast.event.headers, expected.headers);
      assertArraysOfArrays(ast.event.values, expected.values);
    });
  });

  describe('Columns', function(){

    it('setHeadersIndex (is private)', function(){
      let expected;
      ast.exec._setHeadersIndex();
      expected = {ts: 0, time: 1};
      assert.deepEqual(ast.exec.idx, expected);

      ast.event._setHeadersIndex();
      expected = {ts: 0, evname: 1, time: 2};
      assert.deepEqual(ast.event.idx, expected);
    });

    // it('setHeadersIndexAll', function(){
    //   let expected;
    //   FlexTable.setHeadersIndexAll(ast);
    //   expected = {
    //     exec: {ts: 0, time: 1},
    //     event: {ts: 0, evname: 1, time: 2},
    //   };
    //   assert.deepEqual(ast.exec.idx, expected.exec);
    //   assert.deepEqual(ast.event.idx, expected.event);
    // });

    it('setColumn triggers setHeadersIndex', function(){
      let expected;
      ast.exec.setColumn('no-exists', null);
      expected = {ts: 0, time: 1};
      assert.deepEqual(ast.exec.idx, expected);
    });

    it('setColumn can remove a column that exists', function(){
      let expected;
      ast.exec.setColumn('time', null);
      expected = ['ts'];
      assert.deepEqual(ast.exec.headers, expected);
      assertArrays(ast.exec.headers, expected);
      expected = [[123], [124]];
      assert.deepEqual(ast.exec.values, expected);
      assertArraysOfArrays(ast.exec.values, expected);

      ast.event.setColumn('evname', null);
      expected = ['ts', 'time'];
      assert.deepEqual(ast.event.headers, expected);
      assertArrays(ast.event.headers, expected);
      expected = [
        [123, 0.0],
        [123, 3.1],
        [123, 4.44],
        [124, 0.0],
        [124, 2.5],
        [124, 4.1],
      ];
      assert.deepEqual(ast.event.values, expected);
      assertArraysOfArrays(ast.event.values, expected);
    });

    it('setColumn cannot remove a column that doesn\'t exist', function(){
      let expected;
      ast.exec.setColumn('timex', null);
      expected = ['ts', 'time'];
      assert.deepEqual(ast.exec.headers, expected);
      assertArrays(ast.exec.headers, expected);
      expected = [[123, 12.98], [124, 10.98]];
      assert.deepEqual(ast.exec.values, expected);
      assertArraysOfArrays(ast.exec.values, expected);
    });

    it('setColumns can remove columns', function(){
      let expected;
      ast.exec.setColumns(['ts', 'time'], [null, null]);
      expected = [];
      assert.deepEqual(ast.exec.headers, expected);
      assertArrays(ast.exec.headers, expected);
      expected = [];
      assert.deepEqual(ast.exec.values, expected);
      assertArraysOfArrays(ast.exec.values, expected);

      ast.event.setColumns(['ts', 'evnamex'], [null, null]);
      expected = ['evname', 'time'];
      assert.deepEqual(ast.event.headers, expected);
      assertArrays(ast.event.headers, expected);
      expected = [
        ['begin', 0.0],
        ['start', 3.1],
        ['end', 4.44],
        ['begin', 0.0],
        ['start', 2.5],
        ['end', 4.1],
      ];
      assert.deepEqual(ast.event.values, expected);
      assertArraysOfArrays(ast.event.values, expected);
    });

    it('setColumn can replace a column that exists', function(){
      let expected;
      ast.event.setColumn('evname', ['xxx', 'zzz', 'xxx', 'xxx', 'xxx', 'yyy']);
      expected = ['ts', 'evname', 'time'];
      assert.deepEqual(ast.event.headers, expected);
      assertArrays(ast.event.headers, expected);
      expected = [
        [123, 'xxx', 0.0],
        [123, 'zzz', 3.1],
        [123, 'xxx', 4.44],
        [124, 'xxx', 0.0],
        [124, 'xxx', 2.5],
        [124, 'yyy', 4.1],
      ];
      assert.deepEqual(ast.event.values, expected);
      assertArraysOfArrays(ast.event.values, expected);
    });

    it('setColumn can add a column that doesn\'t exist', function(){
      let expected;
      ast.event.setColumn('evnamex', ['xxx', 'zzz', 'xxx', 'xxx', 'xxx', 'yyy']);
      expected = ['ts', 'evname', 'time', 'evnamex'];
      assert.deepEqual(ast.event.headers, expected);
      assertArrays(ast.event.headers, expected);
      expected = [
        [123,'begin',0.0 ,'xxx'],
        [123,'start',3.1 ,'zzz'],
        [123,'end',  4.44,'xxx'],
        [124,'begin',0.0 ,'xxx'],
        [124,'start',2.5 ,'xxx'],
        [124,'end',  4.1 ,'yyy'],
      ];
      assert.deepEqual(ast.event.values, expected);
      assertArraysOfArrays(ast.event.values, expected);
    });

    it('setColumns can replace and add columns', function(){
      let expected;
      ast.event.setColumns(['ts', 'other'], [null, ['xxx', 'zzz', 'xxx', 'xxx', 'xxx', 'yyy']]);
      expected = ['evname', 'time', 'other'];
      assert.deepEqual(ast.event.headers, expected);
      assertArrays(ast.event.headers, expected);
      expected = [
        ['begin',0.0 ,'xxx'],
        ['start',3.1 ,'zzz'],
        ['end',  4.44,'xxx'],
        ['begin',0.0 ,'xxx'],
        ['start',2.5 ,'xxx'],
        ['end',  4.1 ,'yyy'],
      ];
      assert.deepEqual(ast.event.values, expected);
      assertArraysOfArrays(ast.event.values, expected);
    });

    it('setColumn can use a custom function to modify values (cast)', function(){
      let expected;

      // let eventChain = ['>num', 'skip', '<num'];
      // let eventMapchain = {ts: '>num', time: '<num'};

      expected = {
        headers: [ 'ts', 'evname', 'time' ],
        _hlength: 3,
        idx: { ts: 0, 'evname': 1, 'time': 2, },
        values: [
          [ 123, 'begin', '0' ],
          [ 123, 'start', '3.1' ],
          [ 123, 'end', '4.44' ],
          [ 124, 'begin', '0' ],
          [ 124, 'start', '2.5' ],
          [ 124, 'end', '4.1' ],
        ],
        _vlength: 6
      };

      // i = row index
      ast.event.setColumn('time', function(value, row, i){
        if (typeof value === 'number'){
          return String(value);
        }
      });
      assert.deepEqual(ast.event, expected);
      assertArrays(ast.event.headers, expected.headers);
      assertArraysOfArrays(ast.event.values, expected.values);

    });

    it('setColumn can use a custom function to insert values (based on the row)', function(){
      let expected;

      // let eventChain = ['>num', 'skip', '<num'];
      // let eventMapchain = {ts: '>num', time: '<num'};

      expected = {
        headers: [ 'ts', 'evname', 'time', 'ts-1' ],
        _hlength: 4,
        idx: { ts: 0, 'evname': 1, 'time': 2, 'ts-1': 3 },
        values: [
          [123, 'begin', 0.0, 122 ],
          [123, 'start', 3.1, 122 ],
          [123, 'end', 4.44 , 122 ],
          [124, 'begin', 0.0, 123 ],
          [124, 'start', 2.5, 123 ],
          [124, 'end', 4.1  , 123 ],
        ],
        _vlength: 6,
      };

      // i = row index
      // ast.event._setHeadersIndex();
      let idx = ast.event.idx;
      let iTs = idx['ts'];
      ast.event.setColumn('ts-1', function(value, row, i){
        return row[iTs] - 1;
      });
      assert.deepEqual(ast.event, expected);
      assertArrays(ast.event.headers, expected.headers);
      assertArraysOfArrays(ast.event.values, expected.values);

    });
  });

  describe('Create', function(){

    it('create an empty table, append a row and insert a row', function(){
      let expected;
      let table = new FlexTable(['ts', 'time']);
      table.appendRow([125, 0.34]);
      // FlexTable.setRow(table, 0, [125, 0.34], false);
      expected = {
        headers: ['ts', 'time'],
        _hlength: 2,
        values: [
          // [125, 0.34],
          // [123, 12.98],
          [125, 0.34],
          // [124, 10.98],
        ],
        _vlength: 1,
        idx: { 'ts': 0, 'time': 1 }
      };
      assert.deepEqual(table, expected);
      assertArrays(table.headers, expected.headers);
      assertArraysOfArrays(table.values, expected.values);

      table.setRow(0, [123, 0.34], false);
      expected = {
        headers: ['ts', 'time'],
        _hlength: 2,
        values: [
          [123, 0.34],
          [125, 0.34],
        ],
        _vlength: 2,
        idx: { 'ts': 0, 'time': 1 }
      };
      assert.deepEqual(table, expected);
      assertArrays(table.headers, expected.headers);
      assertArraysOfArrays(table.values, expected.values);
    });

    it('create an empty table and append rows', function(){
      let expected;
      let table = new FlexTable(['ts', 'time']);
      table.appendRows([[125, 0.34], [123, 0.34], [1, 2]]);
      expected = {
        headers: ['ts', 'time'],
        _hlength: 2,
        values: [
          [125, 0.34],
          [123, 0.34],
          [1, 2],
        ],
        _vlength: 3,
        idx: { 'ts': 0, 'time': 1 }
      };
      assert.deepEqual(table, expected);
      assertArrays(table.headers, expected.headers);
      assertArraysOfArrays(table.values, expected.values);
    });

    it('create an empty table without headers and with rows throws', function(){
      let expected;
      assert.throws(() => {
        let table = new FlexTable();
        table.appendRows([[125, 0.34], [123, 0.34], [1, 2]]);
      }, /row \d+ length .* is not equal to headers length/);

      assert.throws(() => {
        let table = new FlexTable({ headers: [], values: [[125, 0.34], [123, 0.34], [1, 2]]});
      }, /row \d+ length .* is not equal to headers length/);
    });

    it('create a table with rows', function(){
      let expected;
      let table = new FlexTable(['ts', 'time'],
                                [[125, 0.34], [123, 0.34], [1, 2]]);
      expected = {
        headers: ['ts', 'time'],
        _hlength: 2,
        values: [
          [125, 0.34],
          [123, 0.34],
          [1, 2],
        ],
        _vlength: 3,
        idx: { 'ts': 0, 'time': 1 }
      };
      assert.deepEqual(table, expected);
      assertArrays(table.headers, expected.headers);
      assertArraysOfArrays(table.values, expected.values);
    });
  });

  describe('Sort', function(){

    it('can sort rows using mapchains and sorters (<num, skip)', function(){

      let expected;
      let mapchain;

      // let eventChain = ['>num', 'skip', '<num'];
      // let eventMapchain = {ts: '>num', time: '<num'};

      expected = {
        headers: [ 'ts', 'time' ],
        _hlength: 2,
        idx: { ts: 0, 'time': 1, },
        values: [ [ 123, 12.98 ], [ 124, 10.98 ] ],
        _vlength: 2,
      };
      mapchain = ['ts', '<num'];
      ast.exec.sort(mapchain);
      assert.deepEqual(ast.exec, expected);
      assertArrays(ast.exec.headers, expected.headers);
      assertArraysOfArrays(ast.exec.values, expected.values);

      mapchain = [['ts', '<num'], ['time', 'skip']];
      ast.exec.sort(mapchain);
      assert.deepEqual(ast.exec, expected);
      assertArrays(ast.exec.headers, expected.headers);
      assertArraysOfArrays(ast.exec.values, expected.values);

    });

    it('can sort rows using mapchains and sorters (>num, skip, <num)', function(){

      let expected;
      let mapchain;

      // let eventChain = ['>num', 'skip', '<num'];
      // let eventMapchain = {ts: '>num', time: '<num'};

      expected = {
        headers: [ 'ts', 'time' ],
        _hlength: 2,
        idx: { ts: 0, 'time': 1, },
        values: [
          [ 124, 10.98 ],
          [ 123, 12.98 ],
        ],
        _vlength: 2
      };
      mapchain = ['ts', '>num'];
      ast.exec.sort(mapchain);
      assert.deepEqual(ast.exec, expected);
      assertArrays(ast.exec.headers, expected.headers);
      assertArraysOfArrays(ast.exec.values, expected.values);

      mapchain = [['ts', 'skip'], ['time', '<num']];
      ast.exec.sort(mapchain);
      assert.deepEqual(ast.exec, expected);
      assertArrays(ast.exec.headers, expected.headers);
      assertArraysOfArrays(ast.exec.values, expected.values);

    });

    it('can sort rows using mapchains and sorters (custom funcs)', function(){

      let expected;
      let mapchain;

      // let eventChain = ['>num', 'skip', '<num'];
      // let eventMapchain = {ts: '>num', time: '<num'};

      expected = {
        headers: [ 'ts', 'evname', 'time' ],
        _hlength: 3,
        idx: { ts: 0, 'evname': 1, 'time': 2, },
        values: [
          [ 123, 'end', 4.44 ],
          [ 123, 'start', 3.1 ],
          [ 123, 'begin', 0 ],
          [ 124, 'end', 4.1 ],
          [ 124, 'start', 2.5 ],
          [ 124, 'begin', 0 ]
        ],
        _vlength: 6
      };
      mapchain = [
        ['ts', function(a, b, i){ // like <num in this case
          let ai = a[i];
          let bi = b[i];
          let less = ai < bi;
          let eq = ai === bi;
          if (eq){
            return 0;
          }else{
            return less ? -1 : 1;
          }
        }],
        ['time', '>num'],
      ];
      ast.event.sort(mapchain);
      assert.deepEqual(ast.event, expected);
      assertArrays(ast.event.headers, expected.headers);
      assertArraysOfArrays(ast.event.values, expected.values);
    });

  });

  describe('Format', function(){

    it('as markdown (default fmt)', function(){
      let expected;
      let ret;
      expected = `
| ts  | time  |
|-----|-------|
| 123 | 12.98 |
| 124 | 10.98 |
`.trim() + '\n';

      ret = ast.exec.format('markdown');
      assert.equal(ret, expected);

      expected = `
| ts  | evname | time |
|-----|--------|------|
| 123 | begin  |    0 |
| 123 | start  |  3.1 |
| 123 | end    | 4.44 |
| 124 | begin  |    0 |
| 124 | start  |  2.5 |
| 124 | end    |  4.1 |
`.trim() + '\n';

      ret = ast.event.format('markdown');
      assert.equal(ret, expected);
    });

    it('as markdown (custom fmt)', function(){
      let expected;
      let ret;

      expected = `
|  ts | time |
|-----|------|
| 123 | 13.0 |
| 124 | 11.0 |
`.trim() + '\n';

      ret = ast.exec.format('markdown', { header: '%s', float: '%.1f'});
      assert.equal(ret, expected);

      expected = `
|  ts | evname | time |
|-----|--------|------|
| 123 |  begin |    0 |
| 123 |  start |  3.1 |
| 123 |    end | 4.44 |
| 124 |  begin |    0 |
| 124 |  start |  2.5 |
| 124 |    end |  4.1 |
`.trim() + '\n';

      ret = ast.event.format('markdown', { header: '%s', string: '%s' });
      assert.equal(ret, expected);
    });

    it('as markdown (by column fmt)', function(){
      let expected;
      let ret;

      expected = `
|  ts |   time |
|-----|--------|
| 123 | 12.980 |
| 124 | 10.980 |
`.trim() + '\n';

      ret = ast.exec.format('markdown', { header: '%s', float: '%.1f', columns: [null, '%.3f']});
      assert.equal(ret, expected);

      expected = `
|  ts | evname |   time |
|-----|--------|--------|
| 123 | begin  | 0.0000 |
| 123 | start  | 3.1000 |
| 123 | end    | 4.4400 |
| 124 | begin  | 0.0000 |
| 124 | start  | 2.5000 |
| 124 | end    | 4.1000 |
`.trim() + '\n';

      ret = ast.event.format('markdown', { header: '%s', string: '%s', columns: [null, '%-s', '%.4f'] });
      assert.equal(ret, expected);

      expected = `
| ts  | evname | time   |
|-----|--------|--------|
| 123 | begin  | 0.0000 |
| 123 | start  | 3.1000 |
| 123 | end    | 4.4400 |
| 124 | begin  | 0.0000 |
| 124 | start  | 2.5000 |
| 124 | end    | 4.1000 |
`.trim() + '\n';

      ret = ast.event.format('markdown', [null, '%-s', '%.4f']);
      assert.equal(ret, expected);
    });

    it('as markdown (escaping)', function(){
      let expected;
      let ret;
      expected = `
| code            | de&#124;sc |
|-----------------|------------|
| one             | two        |
| object&#124;any |            |
| other           |       1.34 |
`.trim() + '\n';

      let tbl = new FlexTable({ headers: ['code', 'de|sc'], values: [['one', 'two'], ['object|any', ''], ['other', 1.34]]});
      ret = tbl.format('md');
      assert.equal(ret, expected);
    });

    it('as csv (default fmt)', function(){
      let expected;
      let ret;
      expected = `
#ts,time
123,12.98
124,10.98
`.trim() + '\n';

      ret = ast.exec.format('csv');
      assert.equal(ret, expected);

      expected = `
#ts,evname,time
123,begin,0
123,start,3.1
123,end,4.44
124,begin,0
124,start,2.5
124,end,4.1
`.trim() + '\n';

      ret = ast.event.format('csv');
      assert.equal(ret, expected);
    });

    it('as csv (custom fmt)', function(){
      let expected;
      let ret;
      expected = `
#ts,time
123,13.0
124,11.0
`.trim() + '\n';

      ret = ast.exec.format('csv', { header: '%s', float: '%.1f'});
      assert.equal(ret, expected);

      expected = `
#ts,evname,time
123,begin,0
123,start,3.1
123,end,4.44
124,begin,0
124,start,2.5
124,end,4.1
`.trim() + '\n';

      ret = ast.event.format('csv', { header: '%s', string: '%s' });
      assert.equal(ret, expected);
    });

    it('as csv (by column fmt)', function(){
      let expected;
      let ret;
      expected = `
#ts,time
123,12.980
124,10.980
`.trim() + '\n';

      ret = ast.exec.format('csv', { header: '%s', float: '%.1f', columns: [null, '%.3f']});
      assert.equal(ret, expected);

      expected = `
#ts,evname,time
123,begin,0.0000
123,start,3.1000
123,end,4.4400
124,begin,0.0000
124,start,2.5000
124,end,4.1000
`.trim() + '\n';

      ret = ast.event.format('csv', { header: '%s', string: '%s', columns: [null, '%-s', '%.4f'] });
      assert.equal(ret, expected);
    });

    it('as csv (escaping)', function(){
      let expected;
      let ret;
      expected = `
#code,"de,sc"
one,two
"object,any",
,1.34
`.trim() + '\n';

      let tbl = new FlexTable({ headers: ['code', 'de,sc'], values: [['one', 'two'], ['object,any', ''], ['', 1.34]]});
      ret = tbl.format('csv');
      assert.equal(ret, expected);
    });
  });

  describe('clone', function(){

    it('supports cloning (not shared references)', function(){
      let expected;
      expected = ast.exec.clone();
      assert.deepEqual(ast.exec, expected);
      assertArrays(ast.exec.headers, expected.headers);
      assertArraysOfArrays(ast.exec.values, expected.values);
      assert.deepEqual(ast.exec.values[0], expected.values[0]);
      assert.equal(ast.exec.values[0], ast.exec.values[0]); // same ref
      assert.notEqual(ast.exec.values[0], expected.values[0]); // diff ref
    });

  });
});
