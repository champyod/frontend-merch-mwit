const _Bx31sj1aH8JpDWQcuc0S = require('../dictionary/order-detail.json');
const _z3A9qWYSGFATjSgN0cD6 = require('../dictionary/orders-list.json');
const _TJhjJTqBwKEbd7BnIK13 = require('../dictionary/preorder-form.json');

const dictionaries = {
  "order-detail": _Bx31sj1aH8JpDWQcuc0S,
  "orders-list": _z3A9qWYSGFATjSgN0cD6,
  "preorder-form": _TJhjJTqBwKEbd7BnIK13
};
const getDictionaries = () => dictionaries;

module.exports.getDictionaries = getDictionaries;
module.exports = dictionaries;
