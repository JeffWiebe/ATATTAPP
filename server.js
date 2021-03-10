

//Setup  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Check the environment in which the app is running  ---------------------------------------------------------------------------------------------------------
if (process.env.NODE_ENV !== 'production') {  //We tell our application to require the library 'dotenv', and to run the config() function in dotenv, IF we are in a development (aka not-production) environment.  If we are NOT in a production environment, we will use dotenv and the environment variables associated with that in our .env file. If we ARE in a production environment, we won't use dotenv or those variables.
    require('dotenv').config();
  };

// Variables --------------------------------------------------------------------------------------------------------------------------------------------------------
const
        express                             =   require('express'),                     // We need a back end web application framework for Node.js. Frameworks typically set the control flow [the order in which individual statements, instructions or function calls of an imperative program are executed or evaluated] of a program and allow the user of the framework to "hook into" that flow by exposing various events--eg. "middleware" hooks prior to and after HTTP requests. Such a web framework automates much of what we'd have to do manually otherwise, eg. interacting with a database, templating for dynamic content, managing sessions, etc. As the de facto stanard such framework for Node.js, we're using express; therefore we have to require it.
        app                                 =   express(),                              // Our app is express; we run it as a function()
        expressLayouts                      =   require('express-ejs-layouts'),         // Allows layout support for ejs in express. We need to use this library, so we need to require it
        indexRouter                         =   require('./routes/index'),              // We need to require the router(s) we have exported from other files in order for the server to use them. In this case, the index router. We assign a variable name to that router (indexRouter) in order to use it in the app. Then, we require it. It is found by looking at the relative path (using './' rather than the absolute path __dirname we use elsewhere).This will allow the server to look for the export coming from that location.
        employeesRouter                     =   require('./routes/employees'),          // our routes for the Employees section will be assigned to the employeesRouter variable, so that we can use them in the server.
        mongoose                            =   require('mongoose');                    // We're using the library mongoose to connect to our database. It handles MongoDB validation, casting and business logic. Mongoose provides a straight-forward, schema-based solution to model application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.
        

//App  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Set  --------------------------------------------------------------------------------------------------------------------------------------------------------------

        app.set('view engine', 'ejs');                 // Express needs some kind of engine to render *dynamic* pages by inserting dynamic content into an HTML file, versus simply building a static HTML5 page for every conceivable page we'd ever want to show the user. FOr that, we're using ejs
        app.set('views', __dirname + '/views');        //Sets where the views are coming from. We get our current directory name with __dirname, which returns the path of the folder where the current JavaScript file resides. Then append (using '+') the '/views' folder. This will always take us to ATATTAPPV1.0/views. Using ./ would take us to various places depending on when the ./ was read. Sometimes we want that relativity; right now we want an absolute, fixed path, so we use __dirname.
        app.set('layout', 'layouts/layout');          // We use the layouts so we don't have to duplicate the 'boilerplate' html, eg. header and footer.

//Use -------------------------------------------------------------------------------------------------------------------------------------------------------------
        app.use(expressLayouts);                       // We don't just require express-ejs-layouts; we need to use it, via the variable we identified it under
        app.use(express.static('public'));             // static() is an library included in express. It is middleware, used to serve static files: eg. Stylesheets (css), Javascript (js), our images, etc. express.static specifies the root directory from which to serve these assets. Express looks up these files relative to the static directory, so the name of the static directory is not part of the URL. 'public' is commonly used for this purpose.
        app.use('/', indexRouter);  // We now want to *use* the imported router identified by indexRouter. It is found under our root folder, because we used a relative path ('./' -- see the declaration of indexRouter, elsewhere in server.js)
        app.use('/employees', employeesRouter);  // We now want to *use* the imported router identified by employeesRouter. It is also found under our root folder, because we used a relative path ('./' -- see the declaration of employeesRouter, elsewhere in server.js)
//Database Connection  -------------------------------------------------------------------------------------------------------------------------------------------
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})  // We need to tell mongoose what the URL for our connection is. However, we don't want to hard-code our connection; rather, you want it to be dependent on our environment. Ie, when we're testing in localhost:3000, it needs to connect to our local db. However, on (for example) Heroku, we want it to connect to our MongoDB Atlas cluster. So, we'll tell the mongoose connection to process our environment variable called DATABASE_URL. Then, we pass it several uptions. We need to use the new URL parser (not the old one), and unified topology-- a difficult concept in which MongoDB is reimagining what it means to be 'connected' to a database. See https://mongodb.github.io/node-mongodb-native/3.3/reference/unified-topology/#:~:text=The%20unified%20topology%20is%20the,when%20connected%20to%20a%20primary%3F , but only if you're mentally fresh. There be depths.
const 
        db                                  =   mongoose.connection;                    //  We now assign the value of a mongoose connection to our previously-declared variable 'db'.
db.on('error', error => console.error('ATATTAPP has the following error: ' + error + '.'));     // When we attempt to connect, tf our connection has an error, it will show in the console.
db.once('open', () => console.log('ATATTAPP has connected to the database via Mongoose.'));  // '.once' means this will only run one time, when we initially attempt to connect/open our database. If we are successful, this message will show in the console.

//App Listen -------------------------------------------------------------------------------------------------------------------------------------------------------------
        app.listen(process.env.PORT || 3000);                                          // We tell our app to listen for HTML requests and to do so by processing the environment variable we will specify for the PORT, based on (for example) what configuration variables (Config Vars) Heroku tells us to use to connect. OR ('||'), if we haven't specified another location, use port 3000.
//test 6:44 AM 3/10/2021
//test 6:55 AM 3/10/2021
