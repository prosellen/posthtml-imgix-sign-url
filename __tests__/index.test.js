'use strict';

import posthtml from 'posthtml';
import plugin from '../lib';

const htmlIn = '<img href="pradd2.imgix.net"></img>';

describe('basics', ()=> {
    const transform = (options) => {
        return posthtml()
        .use(plugin(options))
        .process(htmlIn);
    };

    it('throws error if imgixDomain is missing', () => {
        expect(() => {
            transform({ imgixDomain: 'pradd2.imgix.net' })
        }).toThrow();        
    }) 

    it('throws error if secureURLToken is missing', () => {
        expect(() => {
            result({ secureURLToken: 't0k3n' })
        }).toThrow();        
    }) 

    it('consumes imgix domains', async (done) => {
        const htmlIn = `
            <html>
                <header></header>
                <body>
                    <img href="https://pradd2.imgix.net/foo/bar/?w=10&h=20" />
                    <img href="https://pradd2.imgix.net/foo/bar/baz?w=10&h=20" />
                    <img href="https://pradd2.imgix.net/foo/bar/baz.jpg?w=10&h=20" />
                </body>
            </html>
        `;

        const htmlOut = `
            <html>
                <header></header>
                <body>
                    <img href="https://pradd2.imgix.net/foo/bar/?w=10&h=20&s=f7d3b024326d708c920ec770249c3fdf" />
                    <img href="https://pradd2.imgix.net/foo/bar/baz?w=10&h=20&s=3add97f5a441e1ebfbd4fda73ca9bea5" />
                    <img href="https://pradd2.imgix.net/foo/bar/baz.jpg?w=10&h=20&s=1c0ee4f3b0893b4a109c57825c55da98" />
                </body>
            </html>
        `;
        
        posthtml()
            .use(plugin({ imgixDomain: 'pradd2.imgix.net', secureURLToken: 'abcdefg'}))
            .process(htmlIn, { closingSingleTag: 'slash' })
            .then((result) => {
                expect(result.html).toMatch(htmlOut);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('leaves non-imgix domains alone', async (done) => {
        const htmlIn = '<img href="https://pradd2.add2.net" />';
        const htmlOut = '<img href="https://pradd2.add2.net" />';

        posthtml()
            .use(plugin({ imgixDomain: 'pradd2.imgix.net', secureURLToken: 'abcdefg'}))
            .process(htmlIn, { closingSingleTag: 'slash' })
            .then((result) => {
                console.log(result.html);
                expect(result.html).toMatch(htmlOut);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});