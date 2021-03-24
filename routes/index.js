//These are the routes for the Index (default home page) for our application.
// Setup  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const
        express                             =   require('express'),  
        Document                            =   require('../models/document'),           // We have to require express, so we do so.
        router                              =   express.Router();               // Routing refers to how an application’s endpoints (URIs or paths + an HTTP request method like GET, POST, etc.) respond to client requests. The application “listens” for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function. The Router() middleware is part of express; we need to assign it to a variable name so that we can use it in the application.

// Routes  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Get  --------------------------------------------------------------------------------------------------------------------------------------------
router.get('/', async (req, res) => {                 //This will be our app's response to GET requests made to the root of our application. The route takes two parameters: the actual request, and our response.
    // res.send('Hello Woarld');  // While building, our first iteration will simply send this message, which will be rendered as text.
    let documents
    try {
      documents = await Document.find().sort({ createdDate: 'desc' }).limit(10).exec();
    } catch {
      documents = [];
    }
    res.render('index', { documents: documents });
  });        //We send the Response of rendering our routes/index.ejs page





module.exports                              =   router;  // We have to export this router, and import it into our server. This is the former; the latter is done in server.js