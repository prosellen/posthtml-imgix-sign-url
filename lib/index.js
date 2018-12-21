'use strict';

var _imgixJsSignUrl = _interopRequireDefault(require("@prosellen/imgix-js-sign-url"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (options) {
  options = options || {};

  if (!options.imgixDomain) {
    throw new Error('imgix domains must be defined');
  }

  if (!options.secureURLToken) {
    throw new Error('secureURLToken must be defined');
  }

  const tags = options.tags || ['img', 'source'];
  const attributes = options.attributes || ['src', 'srcset'];
  return function posthtmlImgixAutosign(tree) {
    var promises = [];
    tree.walk(node => {
      if (node.attrs) {
        if (tags.indexOf(node.tag) > -1) {
          attributes.forEach(key => {
            if (node.attrs[key]) {
              const mightBySourceSet = node.attrs[key].split(' ');
              const protocolPattern = new RegExp('^https?:\/\/.*', 'i');
              const result = mightBySourceSet.map(element => {
                if (!protocolPattern.test(element)) return element;
                return (0, _imgixJsSignUrl.default)(element, options.secureURLToken, options.imgixDomain);
              });
              node.attrs[key] = result.join(' ');
              promises.push(node.attrs[key]);
            }
          });
        }

        ;
      }

      ;
      return node;
    });
    return Promise.all(promises).then(() => tree);
  };
};