let q = "nirvana unplugged";
let n = 0;
const scrapely = require("../core/v2/scrapely");
const trackers = {}, tracknm = [], torrents = {};

const tracker = function (name, uri, cb) {
    console.log("register tracker", name);
    function _put(f) {
        trackers[name] = f;
        tracknm.push(name);
        return f;
    }
    _put(function () {
        scrapely.dom(uri, (e, $, html) => {
            if (e) {
                console.log(`Tracker Failed: ${name}`, e);
            } else {
                cb($, link => {
                    if (link.seeds > 0 || link.leech > 2) {
                        n++;
                        console.log(name, JSON.stringify(link))
                        if (typeof torrents[name] === 'undefined') {
                            torrents[name] = [link];
                        } else {
                            torrents[name].push(link);
                        }
                    }
                });
            }
        });
    })();
}

{
    tracker("piratebay", `https://thepiratebay10.org/search/${escape(q)}/1/99/0`, ($, keep) => {
        $("#searchResult tr").each((i, element) => {
            if (i > 0) {
                let __seedy = $(element).find(`td[align="right"]`);
                let torrent = {
                    name: $(element).find(".detLink").text(),
                    magnet: $(element).find(`a[href*="magnet:"]`).attr("href"),
                    link: $(element).find(".detLink").attr("href"),
                    seeds: (__seedy.first().text()),
                    leech: (__seedy.last().text())
                };
                keep(torrent);
            }
        })
    });

    // tracker("rarbg", `https://rarbg.to/torrents.php?search=${escape(q)}`, ($, keep) => {
    //
    // })

    tracker("l337x", `https://1337x.to/search/${escape(q)}/1/`, ($, keep) => {
        $("table.table-list tr").each((i, element) => {
            let link = $(element).find(".coll-1.name a[href*='/torrent']");
            let torrent = {
                name: link.text(),
                link: link.attr("href"),
                seeds: $(element).find(".coll-2.seeds").text(),
                leech: $(element).find(".coll-3.leeches").text(),
            };
            keep(torrent);
        });
    })

    tracker("TorrentZ2", `https://torrentzeu.org/v1.php?q=${escape(q)}`, ($, keep) => {
        $("#table tr").each((i,element) => {
            let torrent = {
                name: $(element).find("td[data-title='Name'] span").text(),
                magnet: $(element).find("td[data-title='Magnet'] a").attr("href"),
                seeds: $(element).find("td[data-title='Seeds']").text(),
                leech: $(element).find("td[data-title='Leeches']").text()
            }
            keep(torrent);
        });
    })
}

