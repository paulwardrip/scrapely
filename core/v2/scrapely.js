const unirest = require("unirest");
const cheerio = require("cheerio");
const jsdom = require("jsdom").JSDOM;

    const parser_args = {
        xml: {
            normalizeWhitespace: true,
        }
    };

    class Scrapely {

        raw(uri, cb) {
            unirest.get(uri)
                .header("USER_AGENT", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36")
                .then(response => {
                cb(null, response.body);
            });
        }

        dom(uri, cb) {
            this.raw(uri, (e, html) => {
                if (!e) {
                    let $dom = cheerio.load(html, parser_args);
                    cb(null, $dom, html);

                } else {
                    cb(e);
                }
            });
        }

        scripts(url, cb) {

            this.raw(uri, (e, html) => {
                if (!e) {
                    const dom = new jsdom(html, {runScripts: "dangerously"});
                    const $dom = cheerio.load(dom.window.document, parser_args);
                    cb(null, $dom, html);
                } else {
                    cb(e);
                }
            });
        }
    }



module.exports = new Scrapely();