let express = require('express');
let path = require('path');

let app = express();

app.use(express.static(path.join(__dirname)));
app.listen(8080,()=> console.log('Listening on port 8080'));