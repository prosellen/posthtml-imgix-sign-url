'use strict'

import imgixSigner from '@prosellen/imgix-js-sign-url';

/**
 * Schamlos ~kopiert~ inspiriert von:
 * https://github.com/Rebelmail/posthtml-shorten/blob/master/lib/plugin.js
 */
module.exports = function (options) {
    options = options || {}

    // Schränkt die Domains ein, für die signiert werden soll.
    // Damit keine falschen/fremden Domains signiert werden
    if (!options.imgixDomain) {
        throw new Error('imgix domains must be defined');
    }

    // Ohne das secureURLToken kann nichts signiert werden
    if (!options.secureURLToken) {
        throw new Error('secureURLToken must be defined');
    }

    // Tags, in denen nach URLs gesucht werden soll
    const tags = options.tags || ['img', 'source'];

    // Attribute der o.g. Tags, in denen nach URLs gesucht werden soll
    const attributes = options.attributes || ['href', 'src', 'srcset']; 

    return function posthtmlImgixAutosign (tree) {
        var promises = [];

        // tree.walk ist eine Methode, die PostHTML zur Verfügung stellt
        tree.walk((node) => {
            if (node.attrs) { // Nodes ohne Attribute sind irrELEFANT
                if (tags.indexOf(node.tag) > -1) { // Nur Nodes, die o.g. Tags enthalten
                    attributes.forEach((key) => { // Alle o.g. Attribute innerhalb der relevanten Tags abarbeiten
                        if(node.attrs[key]) { // Nur Attribute mit Inhalt verarbeiten
                            node.attrs[key] = imgixSigner(node.attrs[key], options.secureURLToken, options.imgixDomain)

                            promises.push(node.attrs[key]);
                        }
                    })
                };
            };

            return node;
        });

        // Warten, bis alle Elemente abgrearbeitet sind
        return Promise.all(promises).then(() => tree);
    };
};