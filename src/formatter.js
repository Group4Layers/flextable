/**
 * @file FlexTable formatter.
 * @author nozalr <nozalr@group4layers.com> (Group4Layers®).
 * @copyright 2017 nozalr (Group4Layers®).
 * @license MIT
 * @version 0.3.0
 */

const defFmt = {
  header: '%-s',
  float: '%f',
  integer: '%d',
  string: '%-s',
};

function applyFmt(value, fmt, isHeader, i){
  let ret = { };
  let isString = typeof value === 'string';
  let isNumber = typeof value === 'number';
  let fmtcol = fmt.columns && fmt.columns[i];
  let nvalue = value;
  let lfmt;
  if (isHeader && isString && fmt.header){
    lfmt = fmt.header;
  }else if (isString && fmt.string){
    lfmt = fmt.string;
  }else if (isNumber && Number.isInteger(value) && fmt.integer){
    nvalue = String(value);
  }else if (isNumber && fmt.float){
    lfmt = fmt.float;
    if (lfmt.decimal != null){
      nvalue = value.toFixed(lfmt.decimal);
    }else{
      nvalue = String(value);
    }
  }else{
    nvalue = String(value);
  }

  if (!isHeader && fmtcol){ // only for values
    lfmt = fmtcol;
  }

  if (lfmt && lfmt.decimal != null){
    nvalue = value.toFixed(lfmt.decimal);
  }
  if (lfmt && lfmt.left){
    ret.padLeft = false;
  }else{
    ret.padLeft = true;
  }
  ret.value = nvalue;
  return ret;
}

function pad(pad, str, padLeft) {
  if (typeof str === 'undefined')
    return pad;
  if (padLeft) {
    return (pad + str).slice(-pad.length);
  } else {
    return (str + pad).substring(0, pad.length);
  }
}

function parseFmtf(fmtf){
  let ret;
  if (!fmtf){
    return null;
  }
  let m = fmtf.match(/%(-)?(\.(\d?))?(s|d|f)/);
  if (m){
    ret = {};
    if (m[1]){
      ret.left = true;
    }
    let t = m[4];
    if (t !== 's'){
      if (m[3]){
        ret.decimal = Number(m[3]);
      }else if (m[2]){ // no decimal
        ret.decimal = 0;
      }
    }
  }
  return ret;
}

function parseFmt(fmt){
  if (fmt == null){
    fmt = {};
  }
  if (Array.isArray(fmt)){ // columns
    fmt = { columns: fmt };
  }
  for (let k in defFmt){
    if (!fmt[k]){
      fmt[k] = defFmt[k];
    }
  }
  let nfmt = {};
  for (let k in fmt){
    let v = fmt[k];
    if (v){
      if (k === 'columns'){
        let ncols = [];
        for (let col of v){
          let ncol = parseFmtf(col);
          ncols.push(ncol);
        }
        nfmt.columns = ncols;
      }else{
        nfmt[k] = parseFmtf(v);
      }
    }
  }
  return nfmt;
}

function measureLengthsMarkdown(table, fmt){
  let lengths = Array(table._hlength);
  let i=0;
  let headers = table.headers;
  for (let col of headers){
    let value = col;
    if (value.indexOf('|') >= 0){
      value = value.replace(/\|/g, '&#124;');
    }
    lengths[i] = value.length;
    i++;
  }

  let values = table.values;
  for (let row of values){
    let i=0;
    for (let col of row){
      let fmtd = applyFmt(col, fmt, false, i);
      let value = fmtd.value;
      if (value.indexOf('|') >= 0){
        value = value.replace(/\|/g, '&#124;');
      }
      if (value.length > lengths[i]){
        lengths[i] = value.length;
      }
      i++;
    }
  }
  return lengths;
}

function printTableMarkdown(table, fmt){
  let lengths = measureLengthsMarkdown(table, fmt);

  let outLines = []; // '\n'
  let outLine = []; // ''

  let str = [];
  let hl = [];

  let sep = '|';
  let space = ' ';
  let line = '-';

  // print
  str.push(sep);
  let i=0;
  let headers = table.headers;
  for (let col of headers){
    let v = lengths[i];
    let fmtd = applyFmt(col, fmt, true, i);
    let value = fmtd.value;
    if (value.indexOf('|') >= 0){
      value = value.replace(/\|/g, '&#124;');
    }
    let colStr = pad(Array(v + 1).join(' '), value, fmtd.padLeft);
    str.push(colStr);
    str.push(sep);
    hl.push(Array(v + 3).join(line));
    i++;
  }
  outLines.push(str.join(space));
  outLine.push(sep);
  outLine.push(hl.join(sep));
  outLine.push(sep);
  outLines.push(outLine.join(''));

  let values = table.values;
  for (let row of values){
    // outLine = [];
    str = [];
    str.push(sep);
    let i=0;
    for (let col of row){
      let v = lengths[i];
      let fmtd = applyFmt(col, fmt, false, i);
      let value = fmtd.value;
      if (value.indexOf('|') >= 0){
        value = value.replace(/\|/g, '&#124;');
      }
      value = pad(Array(v + 1).join(space), value, fmtd.padLeft);
      str.push(value);
      str.push(sep);
      i++;
    }
    outLines.push(str.join(space));
  }

  return outLines.join('\n') + '\n';
}

function printTableCSV(table, fmt){
  let outLines = []; // '\n'

  let str = [];

  let sep = ',';
  let space = '';
  let comm = '#';
  let esc = '"';

  let i=0;
  let headers = table.headers;
  for (let col of headers){
    let fmtd = applyFmt(col, fmt, true, i);
    let value = fmtd.value;
    if (value.indexOf(sep) >= 0){
      value = `${esc}${value}${esc}`;
    }
    str.push(value);
    str.push(sep);
    i++;
  }
  if (i > 0){
    str.splice(0, 0, comm);
    str.pop();
  }
  outLines.push(str.join(space));

  let values = table.values;
  for (let row of values){
    // outLine = [];
    str = [];
    let i=0;
    for (let col of row){
      let fmtd = applyFmt(col, fmt, false, i);
      let value = fmtd.value;
      if (value.indexOf(sep) >= 0){
        value = `${esc}${value}${esc}`;
      }
      str.push(value);
      str.push(sep);
      i++;
    }
    if (i > 0){
      str.pop();
    }
    outLines.push(str.join(space));
  }

  return outLines.join('\n') + '\n';
}

/**
 * FlexTable formatter module.
 * @module flextable/formatter
 */
module.exports = {
  parseFmt,
  printTableMarkdown,
  printTableCSV,
};
