const _tONPQrnbFNOsSavZx8I0 = require('../unmerged_dictionary/order-detail.json');
const _qSGgLsQAeA9GGkq5Yi0b = require('../unmerged_dictionary/orders-list.json');
const _TrBtqDjSemAJVqoNrYf5 = require('../unmerged_dictionary/preorder-form.json');

const dictionaries = {
  "order-detail": _tONPQrnbFNOsSavZx8I0,
  "orders-list": _qSGgLsQAeA9GGkq5Yi0b,
  "preorder-form": _TrBtqDjSemAJVqoNrYf5
};
const getUnmergedDictionaries = () => dictionaries;

module.exports.getUnmergedDictionaries = getUnmergedDictionaries;
module.exports = dictionaries;
