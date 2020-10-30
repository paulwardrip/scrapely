class thisvid {
    search(q) {

        let
            scrapely = require("../core/v2/scrapely");

        let thumbs = [];

        scrapely.dom(
            `https://thisvid.com/female-extreme/?q=${q}`, (e, $, html) => {
                //console.log(e);
                //console.log($)
                // console.log(html);
                let entries = $("span.thumb:not(.private)");
                entries.each((i, th) => {
                    console.log( $("<div>").append($(th).parent("a") );

                });

            })


    }
}
new thisvid().search("smear");