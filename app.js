//Add static file serving

const express = require('express');


//express app
const app = express();

//listen for requests
app.listen(3003);

// uses the `express.static` middleware to serve the files in the `views` directory
app.use(express.static('views'));

//defines routes for index.html  
app.get('/', (req, res) => {
    res.sendFile('./views/index.html',{root: __dirname});
});
//defines routes for `myscript.js` 
app.get('/myscript.js', (req, res) =>{
    res.setHeader('Content-Type', 'application/javascript');
    // Your code to serve the script file here
    res.sendFile('./views/myscript.js',{root: __dirname});
  });

  //defines routes for `reset.css`
  app.get('/reset.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile('./views/reset.css',{root: __dirname});
  });
  //sets up an error handler
  app.on('error', function(err) {
    console.error('Server error:', err);
  });

