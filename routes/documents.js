//These are the routes for the Documents section of our application.
// Setup  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const
        express                             =   require('express'),     // We have to require express, so we do so.
        router                              =   express.Router(),               // Routing refers to how an application’s endpoints (URIs or paths + an HTTP request method like GET, POST, etc.) respond to client requests. The application “listens” for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function. The Router() middleware is part of express; we need to assign it to a variable title so that we can use it in the application.
        multer                              =   require('multer'),
        path                                =   require('path'),    // Library included with express
        fs                                  =   require('fs'),
        Document                            =   require('../models/document'),
        Employee                           =   require('../models/employee'),       //We need our Employee model, so we can use .find() on it.             
        uploadPath                          =   path.join('public', Document.coverImageBasePath),       // We will use the join() function on our path variable, passing the elements to be joined of our 'public' folder with our variable documentThumbsBasePath, which is (at this typing) set to uploads/documents/thumbnails.
        imageMimeTypes                     =   ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/tiff', 'image/jfif', 'image/bmp'],        //Setting up the media types we will allow to be uploaded to our Thumbnails. This will need to be accompanied later in the build, with another such line accepting PDFs, docx, etc, for the files themselves. 
        // documentScan                            =   document.documentScan,       // Not ready at this point in the build
        upload                              =   multer({
            dest:   uploadPath,      // We set the destination for our upload equal to our uploadPath variable.
            fileFilter: (req, file, callback) => {      // We need to filter which files our server will accept, so we don't get hacked or even just sent junk.
                callback(null, imageMimeTypes.includes(file.mimetype));        //First parameter is an error function; we have no error, so we call that null. The second parameter is a Boolean: true if the file is accepted; false if it is not. We use our imageMimeTypes variable, above, in which we stipulated all the file types we'd accept for this use.
        }
        });

// Routes  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//All Documents  -------------------------------------------------------------------------------------------------------------------------------

router.get('/', async (req, res) => {
    let query = Document.find();
    if (req.query.title != null && req.query.title != '') {
      query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    // if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    //   query = query.lte('publishDate', req.query.publishedBefore)
    // }
    // if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    //   query = query.gte('publishDate', req.query.publishedAfter)
    // }
    try {
      const documents = await query.exec();
      res.render('documents/index', {
        documents: documents,
        searchOptions: req.query
      })
    } catch {
      res.redirect('/');
    };
  });

//New Documents  -------------------------------------------------------------------------------------------------------------------------------
    router.get('/new', async (req, res) => {
        renderNewPage(res, new Document());
    //     try {        // This code block, from an earlier point in the build, was made into the function renderNewPage()
    //         const employees = await Employee.find({});     // We are passing in a list of all the Employee, obtained by using .find() on our list of employee. We assign that list to the variable 'employee'.
    //         const document = new Document();        //This is the new document we are creating. We create this new document so that when the user modifies it, and we send back data saying that they incorrectly entered their data, we also send back the data, populating the fields that they had entered, so they know what to revise.
    //         res.render('documents/new', {
    //             employees: employees,       // We pass in the employees variable that we just created as the value for the "employees" key
    //             document: document,     // We pass in the documents variable that we just created as the value for the "documents" key
    //         });
    // }   catch {
    //     res.redirect('/documents');
    // };
});

//Create Documents  -------------------------------------------------------------------------------------------------------------------------------
router.post('/', upload.single('cover'), async (req, res) => {      
    const   fileName = req.file != null ? req.file.filename : null;        // The 'upload' parameter refers to the file we are uploading to our server when we create the new document. It uses the function single(), and the variable passed in is 'cover', which is the filename of the file being uploaded and is whatever the name you set your <input> to be.
    const   document = new Document({
        employee:                            req.body.employee,
        documentCategory:                    req.body.documentCategory,
        documentDescription:                 req.body.documentDescription,
        documentTags:                        req.body.documentTags,
        documentPages:                       req.body.documentPages,
        documentScan:                        req.body.documentScan,
        documentKeyDate:                     req.body.documentKeyDate,
        documentKeyFunds:                    req.body.documentKeyFunds,
        documentCreatedDate:                 req.body.documentCreatedDate,
        // documentCreatedDate:                 new Date(req.body.documentCreatedDate),        // In an earlier paradigm in this build, the request.body.documentCreatedDate, which comes from the document model, was type: string, However, we need it to be of the Date type, so we convert it by new Date. We decided to make the documentCreatedDate in the model of type Date rather than converting it here.
        documentCreatedBy:                   req.body.documentCreatedBy,
        documentAllianceTrussNetworkPath:    req.body.documentAllianceTrussNetworkPath,
        coverImageName:                      fileName,
    });
    try {
        const newDocument   =   await document.save();      // Provided .save() is successful, we create a newDocument
        // res.redirect(`documents/${newDocument.id}`);        // Not yet ready to use this line at this point in the build
        res.redirect('documents');      // Redirect user to the 'documents' page
    } catch {
        if (document.coverImageName != null) {
            removeDocumentCover(document.coverImageName)
          }
        renderNewPage(res, document, true);
    };
    // res.send('Create Document');
});

function removeDocumentCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
      if (err) console.error(err)
    });
  };

/*async function renderNewPage(res, document, hasError = false) {        //We pass in the response variable; the document variable-- sometimes a new document, sometimes an existing document--
    try {
        const employees = await Employee.find({});     // We are passing in a list of all the Employees, obtained by using .find() on our list of employees. We assign that list to the variable 'employees'.
        //  const document = new Document();        //From an earlier point in the build. This is the new document we are creating. We create this new document so that when the user modifies it, and we send back data saying that they incorrectly entered their data, we also send back the data, populating the fields that they had entered, so they know what to revise.
        console.log("Employee.find({}) = " + employees);
        const params = {
            employees: employees,       // We pass in the employees variable that we just created as the value for the "employees" key
            document: document,     // We pass in the documents variable that we just created as the value for the "documents" key
        };
        if (hasError) params.errorMessage = 'Error creating Document.';
        // if (hasError) params.errorMessage = errorMessage;
        res.render('documents/new', params);
}   catch {
    res.redirect('/documents');
    console.log("Error in catch of async function renderNewPage");
};
} */

async function renderNewPage(res, document, hasError = false) {
    try {
      const employees = await Employee.find({})
      const params = {
        employees: employees,
        document: document
      }
      if (hasError) params.errorMessage = 'Error Creating document'
      res.render('documents/new', params)
    } catch {
      res.redirect('/documents')
    }
  }

/*
// All Documents  -------------------------------------------------------------------------------------------------------------------------------
router.get('/', async (req, res) => {       // We use an asynchronous function as we're interacting with MongoDB, which operates asynchronously. Note that we still use the '/' location, because in the server we are assigning these exported routes to a variable which includes the '/routes/documents' path. So we don't assign those earlier points in the path here in this file.
    let searchOptions = {};    // We establish a new variable to set up our Search for documents. We will then search for all the different request parameters that we set, and add them to our searchOptions.
    if (req.query.title != null && req.query.title !== '') {       //This if statement ensures that we actually do have a title being passed to the server. 
        //A GET request passes information via the query string, in the URL. That's where we need to look for the information we want. (POST requests send through the body.)
    searchOptions.title  =   new RegExp(req.query.title, 'i');    // If we do have a title being passed, we want to add that to our searchOptions. We want to set that to a new Regular Expression. (see below)  The 'i' flag makes it case-insensitive.
    // Regular expressions are patterns used to match character combinations in strings. In JavaScript, regular expressions are also objects. You construct a regular expression in one of two ways: 1) Using a regular expression literal, which consists of a pattern enclosed between slashes, eg. let re = /ab+c/;  2) Calling the constructor function of the RegExp object, eg. let re = new RegExp('ab+c'). Using the constructor function provides runtime compilation of the regular expression. Use the constructor function when you know the regular expression pattern will be changing, or you don't know the pattern and are getting it from another source, such as user input.
    };      
try {
    const documents     =   await Document.find(searchOptions);        // The mongoose model has great functionality included. We're going to use .find. Find takes an object, allowing you to establish conditions, like filters, for your search. We pass in the variable searchOptions, which will allow us to search for the various parameters. At an earlier point in the build, we use .find with an empty object, which says that we have no conditions: we want *all* documents to be found.
    res.render('documents/index', {
        documents: documents,       // We are passing the new variable, documents, that we just declared, above, to our documents/index page, to be rendered there. The documents key will have the value of our documents variable we just created. (key:value) The key, 'documents', comes from the documents/index.ejs page.
        searchOptions: req.query,        // We will also send back, as the searchOptions, the request query itself, to repopulate the search field when the page that shows the results of the search renders.
    });
}   catch {
    res.redirect('/');      // If there's any error, eg. our database is inaccessible, we will redirect to the home page.
} ;
// res.send('This is the All Documents page');
    // res.render('documents/index');
});

//Specific Documents  -------------------------------------------------------------------------------------------------------------------------------
/*router.get('/documents/:id', async (req, res) => {
    let id = req.query.id;
    let document = await Document.find({id});
    res.render('documents/document.ejs', { document })
}

)
//New Documents  -------------------------------------------------------------------------------------------------------------------------------
//Show the Form for Creating New Documents
router.get('/new', (req, res) => {
    res.render('documents/new', {document: new Document});    //The page at this location will show the form for creating New Documents
});


// Create the Document
router.post('/', async (req, res) => {    // This is an asynchronous POST route for actually Creating the New Document. It only Creates, it doesn't actually render anything; the results of the creating that are seen by the user are seen as the result of another route that will render a view of the new Document.
    //res.send('Create route');   // Temporary send so we can check the route during this stage of our build
    const document                          =   new Document({
        title: req.body.title,    // POST requests go through the body, in contrast to GET requests, which use the query string. Our new Document has already has its title inputted by the user; we are using that inputted title. In addition, this explicitly tells the server to only accept the actual title, rather than some erroneous or malicious entry from a user.
    })
    try {       // rather than the clunky callback-heavy code that is commented out, below, we're using an async-await. We use a try-catch block to allow us to handle the error in the catch.
        const newDocument  =   await document.save();     //We save the new document we are just creating under the variable newDocument. We have to await this save to be complete before assigning it to the variable, because everything in MongoDB is asynchronous.
        //res.redirect(`documents/${newDocument.id}`);  [TEMPORARILY COMMENTED OUT, UNTIL A SUBSEQUENT DEVELOPMENT STEP]    // If the operation of Creating a new Document succeeds (no errors), we will redirect to the page showing that new document. For that, we need to get the id for this new document from the database. 
            //We're using string interpolation here; thus the back-ticks (`).String interpolation is replacing placeholders with values in a string literal. The string interpolation in JavaScript is performed by template literals (strings wrapped in backticks `) and ${expression} as a placeholder. In JavaScript, there are 3 ways to create string literals: single quotes, double quotes, and backticks, which permits string interpolation. Such a string is also titled a TEMPLATE STRING. This is the "literal" that supports the string interpolation. The template string supports placeholders. The expression inside the placeholder is evaluated during runtime, and the result is inserted into the string. Thus, string interpolation allows different strings to be used depending on what is all going on in the app at that time, and thus allows the dynamic behaviour we expect from an app. The placeholder has a special format: ${expressionToEvaluate}. The expression inside the placeholder can be of any kind. variables: ${myVar} || operators: ${n1 + n2}, ${cond ? 'val 1' : 'val 2'} || even function calls ${myFunc('argument')}. The placeholder expression result is implicitly converted to a string. If the placeholder contains an object, following the conversion to string rule, the object is converted to a string too. The toString() method of the object is called to get the string representation of the object.  If the placeholder contains an array, the toString() array method executes array.join(',') when the array is converted to string. A backslash \ before the placeholder-like sequence of characters (eg. \${abc} ) allows you to escape Javascript's interpretation of those characters (ie. ${abc}) as a placeholder. Instead, when the backslash \ (no following space) is used, Jaascript just interprets the following characters as a simple sequence of characters. Anytime you wish to simply use a dollar sign and an opening curly bracket together (${) you need to precede them with a backslash or they'll be interpreted by Javascript as a template string. SUMMARY: A template string is defined by wrapping a sequence of characters into a pair of backticks `I'm a template string`. The template string placeholders have the format ${expression}, for example `The number is ${number}`. See this helpful site: https://dmitripavlutin.com/string-interpolation-in-javascript/
            res.redirect('documents');
    } catch {       // If there is an error...
        res.render('documents/new', {     // ...we'll render the New page again...
        document: document,        // ...and we'll pass these parameters to that page. First, the document that we just created, so that the form will be re-populated with that data and the user won't have to enter it again.
        errorMessage:  'Error creating New Document',     // We'll also pass in an error message, so that we can easily let our users know that an error happened at this point.
        })
    };
    /* This commented-out code block was from an earlier point in the build.
    document.save((err, newDocument) => {
        if (err) {      // If there is an error... 
            res.render('documents/new', {     // ...we'll render the New page again...
            document: document,        // ...and we'll pass these parameters to that page. First, the document that we just created, so that the form will be re-populated with that data and the user won't have to enter it again.
            errorMessage:  'Error creating New Document',     // We'll also pass in an error message, so that we can easily let our users know that an error happened at this point.
            })
        } else {
            //res.redirect(`documents/${newDocument.id}`); //See comments, above, re: string interpolation.
            res.redirect('documents');
        };
    });        //We call the .save method on the document object which we created just above this line. It takes the object with the parameters of error (in case there is one) and the new Document we just created.
    //res.send(req.body.title);        //From an earlier point in the build. We were sending the body.title from the request we received (which our form on the New Document route sent to the server) 
    
});
*/


module.exports                              =   router;  // We have to export this router, and import it into our server. This is the former; the latter is done in server.js