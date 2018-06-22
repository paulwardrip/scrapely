"use strict";

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

    let instance = {
        raw:  (url, cb)=> {
            getly(url, (e, o) => {
                cb(e,o);
            })
        },

        document:  (url, cb)=> {
            getly(url, (e, o) => {
                if (e) {
                    cb(e);
                } else {
                    cb (null, cheerio.load(o, parser_args));
                }
            });
        },

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