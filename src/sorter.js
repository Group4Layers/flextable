/**
 * @file FlexTable sorter.
 * @author nozalr <nozalr@group4layers.com> (Group4Layers®).
 * @copyright 2017 nozalr (Group4Layers®).
 * @license MIT
 * @version 0.3.0
 */

const sorters = {
  'skip': null,
  '>num': function(a, b, i){
    let ai = a[i];
    let bi = b[i];
    let less = ai > bi;
    let eq = ai === bi;
    if (eq){
      return 0;
    }else{
      return less ? -1 : 1;
    }
  },
  '<num': function(a, b, i){
    let ai = a[i];
    let bi = b[i];
    let less = ai < bi;
    let eq = ai === bi;
    if (eq){
      return 0;
    }else{
      return less ? -1 : 1;
    }
  },
};

/**
 * @private
 * @param {} idx idx spec of flextable
 * @param {} mapchain object of {[headername]: sorter}
 * @returns [] chain array of sorters
 */
function chainHeaderToIdx(idx, mapchain){
  let chain = [];
  for (let pair of mapchain){
    chain.push([idx[pair[0]], pair[1]]);
  }
  return chain;
}

/**
 * @private
 * @param {} a element
 * @param {} b element
 * @param [] chain array of sorters
 * @returns Num -1, 0 or 1 (sorting)
 */
function sortChain(a, b, chain){
  let ret = 0;
  for (let pair of chain){
    let fname = pair[1];
    let fn;
    if (typeof fname === 'function'){
      fn = fname;
    }else{
      fn = sorters[fname];
    }
    if (fn != null){ // not skip
      ret = fn(a, b, pair[0]);
      if (ret !== 0){
        break;
      }
    }
  }
  return ret;
}

/**
 * FlexTable sorter module.
 * @module flextable/sorter
 */
module.exports = {
  sorters,
  sortChain,
  chainHeaderToIdx,
};
