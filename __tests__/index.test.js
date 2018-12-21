'use strict';

import posthtml from 'posthtml';
import plugin from '../lib';

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
    
    it('consumes imgix domains in <img />-Tags', async (done) => {
        const htmlIn = `
            <html>
                <header></header>
                <body>
                    <img src="https://foobar.imgix.net/foo/bar/?w=10&h=20" />
                    <img src="https://foobar.imgix.net/foo/bar/baz?w=10&h=20" />
                    <img src="https://foobar.imgix.net/foo/bar/baz.jpg?w=10&h=20" />
                </body>
            </html>
        `;

        const htmlOut = `
            <html>
                <header></header>
                <body>
                    <img src="https://foobar.imgix.net/foo/bar/?w=10&h=20&s=f7d3b024326d708c920ec770249c3fdf" />
                    <img src="https://foobar.imgix.net/foo/bar/baz?w=10&h=20&s=3add97f5a441e1ebfbd4fda73ca9bea5" />
                    <img src="https://foobar.imgix.net/foo/bar/baz.jpg?w=10&h=20&s=1c0ee4f3b0893b4a109c57825c55da98" />
                </body>
            </html>
        `;
        
        posthtml()
            .use(plugin({ imgixDomain: 'foobar.imgix.net', secureURLToken: 't0k3n'}))
            .process(htmlIn, { closingSingleTag: 'slash' })
            .then((result) => {
                expect(result.html).toMatch(htmlOut);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('consumes imgix domains in <source />-Tags', async (done) => {
        const htmlIn = `
            <html>
                <header></header>
                <body>
                    <picture>
                        <source media="(min-width: 992px)" srcset="https://foobar.imgix.net/foo/bar/bar.png?w=20&h=40&dpr=2 2x, https://foobar.imgix.net/foo/bar.png?w=20&h=40&dpr=1" />
                        <source media="(min-width: 720px)" srcset="https://foobar.imgix.net/foo/bar/bar.png?w=10&h=20&dpr=2 2x, https://foobar.imgix.net/foo/bar.png?w=10&h=20&dpr=1" />
                        <img src="https://foobar.imgix.net/foo/bar/baz?w=10&h=20" />
                    </picture>
                </body>
            </html>
        `;

        const htmlOut = `
            <html>
                <header></header>
                <body>
                    <picture>
                        <source media="(min-width: 992px)" srcset="https://foobar.imgix.net/foo/bar/bar.png?w=20&h=40&dpr=2&s=ad1a1aac58a311cf925ad9cf6975d1e8 2x, https://foobar.imgix.net/foo/bar.png?w=20&h=40&dpr=1&s=fed77723b746f3cc493697ab93802298" />
                        <source media="(min-width: 720px)" srcset="https://foobar.imgix.net/foo/bar/bar.png?w=10&h=20&dpr=2&s=5ec6fa0eee82411fc1bf2871e4949607 2x, https://foobar.imgix.net/foo/bar.png?w=10&h=20&dpr=1&s=8fd3ee20299089c93787fa205f7d2f6b" />
                        <img src="https://foobar.imgix.net/foo/bar/baz?w=10&h=20&s=3add97f5a441e1ebfbd4fda73ca9bea5" />
                    </picture>
                </body>
            </html>
        `;
        
        posthtml()
            .use(plugin({ imgixDomain: 'foobar.imgix.net', secureURLToken: 't0k3n'}))
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
        const htmlIn = '<img src="https://example.com/foo/bar/bar.png" />';
        const htmlOut = '<img src="https://example.com/foo/bar/bar.png" />';

        posthtml()
            .use(plugin({ imgixDomain: 'foobar.imgix.net', secureURLToken: 't0k3n'}))
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