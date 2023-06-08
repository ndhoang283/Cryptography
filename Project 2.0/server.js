const express = require('express');
var app = express();

app.get('/', (req, res, next) => {
    res.json("HOME")
})

app.listen(3000, () => {
    console.log(`Server started on port`);
});