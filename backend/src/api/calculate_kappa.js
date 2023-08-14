var Cohen = require('./cohens_kappa.js');

function calcCohenKappa(codeA, codeB) {
  blank_dic = []
  listA = {}
  listB = {}
  categories = []
  i = 0
  j = 0
  k = 0
  while (i < codeA.length) {
    if (!blank_dic.includes(codeA[i])) {
      blank_dic.push(codeA[i])
    }
    listA[i] = blank_dic.indexOf(codeA[i])

    i++;
  }
  while (j < codeB.length) {
    if (!blank_dic.includes(codeB[j])) {
      blank_dic.push(codeB[j])
    }
    listB[j] = blank_dic.indexOf(codeB[j])
    j++;
  }
  while (k < blank_dic.length) {
    categories.push(k.toString())
    k++
  }

  var numericA = Cohen.nominalConversion(categories, listA);
  var numericB = Cohen.nominalConversion(categories, listB);
  var kappaUnweighted = Cohen.kappa(numericA, numericB, blank_dic.length, 'none');

  return kappaUnweighted
}

module.exports = calcCohenKappa
