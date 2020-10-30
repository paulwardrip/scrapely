(()=>{
    const express = require('express');

    let app = express();
    app.post("/scraproxi/", (req, res)=>{
        console.log("scraproxi:" + req.params("url"));
    });

    app.use(express.static("interactive"));

    app.listen(8666);
})();