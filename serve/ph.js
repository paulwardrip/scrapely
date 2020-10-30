//const uri = "https://www.pornhub.com/view_video.php?viewkey=ph59cb617fdb6b7";
const uri = "https://thisvid.com/";
//const uri = "http://cnn.com/";
const scrapeley = require("../core/v2/scrapely");
scrapeley.raw(uri, (err, html) => {
    console.log(err, html);
    // let entries = $html("video");
    //
    // console.log(entries.length);
    //
    // entries.each((i,div)=>{
    //     try {
    //         console.log($html(div).html());
    //     } catch (e) {}
    // });
});