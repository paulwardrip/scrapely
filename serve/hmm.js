let scrapeley = require("../scrapely");

scrapeley.document("http://localhost:8080/", (err, $html) => {
    let entries = $html("#ordersContainer .a-size-base span");

    entries.each((i,div)=>{
        try {
            console.log($html(div).html());
        } catch (e) {}
    });
});

Object.prototype.stringify = function() {
    let __o = this;

    let __strip = (__t)=>{
        try {
            return JSON.stringify(__t, null, 2);

        } catch (e) {
            let tier = {};
            for (let idx in __t) {
                if (__t.hasOwnProperty(idx)) {
                    if (typeof  __t[idx] === 'object'){
                        tier[idx] = JSON.parse(__strip(__t[idx]));

                        if (typeof  __t[idx] === 'function'){
                            tier[idx] = "[@function]"
                        }
                    } else {
                        console.log(idx,__t[idx]);
                        tier[idx] = __t[idx];
                    }
                }
            }
        }
    };

    return __strip(__o);
};