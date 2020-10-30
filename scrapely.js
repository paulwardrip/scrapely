"use strict";

/*

 */
const scrapely = (()=>{

    const JSDOM = require('jsdom').JSDOM;
    const request = require('request');
    const cheerio = require('cheerio');
    const https = require('https');
    const http = require('http');
    const fs = require('fs');

    const parser_args = {
        xml: {
            normalizeWhitespace: true,
        }
    };

    let siteroot;

    function connector(url, cb) {
        let u = (siteroot || "") + url;
        console.log("connector:", u);
        return (/^https/.test(u) ? https : http).get(u, cb);
    }

    function getly(url, cb) {

        let u = (siteroot || "") + url;
        console.log("getly:", u);
        request({ url: u, strictSSL: false }, (error, response, data) => {
            if (error) {
                cb (error);
            } else {
                cb (null, data);
            }
        });
    }


    /**
     * Get an html document wrapped to support jQuery-like traversal provided by cheerio.
     * @param url
     * @param cb
     */
    let __document= (url, cb)=> {
        getly(url, (e, o) => {
            if (e) {
                cb(e);
            } else {
                cb (null, cheerio.load(o, parser_args));
            }
        });

        global.$ = cheerio;
    };


    let instance = {
        /**
         * Get raw text response from a URL.
         * @param url
         * @param cb
         */
        raw:  (url, cb)=> {
            getly(url, (e, o) => {
                cb(e,o);
            })
        },


            document: __document,


        /**
         * Get an html document loaded by JSDOM, providing support to execute the scripts on the page...
         * wrapped to support jQuery-like traversal provided by cheerio.
         * @param url
         * @param cb
         */
        scripts: (url, cb) => {
            getly(url, (e, o) => {
                if (e) {
                    cb(e);
                } else {
                    const dom = new JSDOM(o, { runScripts: "dangerously" });
                    cb (null, cheerio.load(dom.window.document, parser_args));
                }
            }) ;
        },

        /**
         * Call a web endpoint that returns JSON
         * @param url
         * @param cb
         */
        json:  (url, cb)=> {
            getly(url, (e, o) => {
                if (e) {
                    cb(e);
                } else {
                    try {
                        cb(null, JSON.parse(o));
                    } catch (e) {
                        cb(e);
                    }
                }
            });
        },

        /**
         * Download the binary file at this URL.
         * @param url
         * @param filename
         * @param cb
         */
        download:  (url, filename, cb)=> {
            let file = fs.createWriteStream(filename);

            connector(url, (res) => {
                const { statusCode } = res;
                console.log ("s:", statusCode);
                if (statusCode !== 200) {
                    cb(new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`));
                } else {
                    res.pipe(file);
                    cb(null, filename);
                }
            });
        },

        /**
         *
         * @param wrapper
         * @param call
         */
        repackage: (wrapper, call)=>{
            __document(wrapper.url, (err,$)=>{
                if (err) {
                    call(err);
                }

                let thismess = [];
                let $list = $(wrapper.collection);
                for (let n = 0; n < $list.length; n++) {
                    var frankenjson = {};
                    for (var kp in wrapper.json) {
                        if (wrapper.json.hasOwnProperty(kp) && typeof wrapper.json[kp] === 'string') {
                            frankenjson[kp] = $(wrapper.json[kp], $list[n]).text();
                        }
                    }
                    thismess.push(frankenjson);
                }

                call (null,thismess);

            })
        }
    };

    Object.defineProperty(instance, "site", {
        set: (s)=> {
            siteroot = s;
        },
        get: ()=> {
            return siteroot;
        }
    });

    return instance;
})();

module.exports = scrapely;