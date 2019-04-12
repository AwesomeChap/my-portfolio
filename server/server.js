const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const publicPath = path.join(__dirname,'..','dist');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname,'..', 'dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));

app.get('*',(req,res)=>{
  res.sendFile(path.join(publicPath,'index.html'))
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});