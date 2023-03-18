

const express = require('express');

// require('dotenv').config();


//express app
const app = express();

//listen for requests
app.listen(3003);

app.use(express.static('views'));

app.get('/', (req, res) => {
    res.sendFile('./views/index.html',{root: __dirname});
});

app.get('/myscript.js', (req, res) =>{
    res.setHeader('Content-Type', 'application/javascript');
    // Your code to serve the script file here
    res.sendFile('./views/myscript.js',{root: __dirname});
  });

  app.get('/reset.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    // Your code to serve the script file here
    res.sendFile('./views/reset.css',{root: __dirname});
  });
  
  app.on('error', function(err) {
    console.error('Server error:', err);
  });

