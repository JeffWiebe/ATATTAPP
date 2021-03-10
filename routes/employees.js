//These are the routes for the Employees section of our application.
// Setup  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const
        express                             =   require('express'),             // We have to require express, so we do so.
        router                              =   express.Router();               // Routing refers to how an application’s endpoints (URIs or paths + an HTTP request method like GET, POST, etc.) respond to client requests. The application “listens” for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function. The Router() middleware is part of express; we need to assign it to a variable name so that we can use it in the application.

// Routes  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// All Employees  -------------------------------------------------------------------------------------------------------------------------------
router.get('/', (req, res) => { //Note that we still use the '/' location, because in the server we are assigning these exported routes to a variable which includes the '/routes/employees' path. So we don't assign those earlier points in the path here in this file.
    // res.send('This is the All Employees page');
    res.render('employees/index');
});

//New Employees  -------------------------------------------------------------------------------------------------------------------------------
//Show the Form for Creating New Employees
router.get('/new', (req, res) => {
    res.render('employees/new');    //The page at this location will show the form for creating New Employees
});


// Create the Employee
router.post('/', (req, res) => {    // This is a POST route for actually Creating the New Employee. It only Creates, it doesn't actually render anything; the results of the creating that are seen by the user are seen as the result of another route that will render a view of the new Employee.
    res.send('Create route');   // Temporary send so we can check the route during this stage of our build
});



module.exports                              =   router;  // We have to export this router, and import it into our server. This is the former; the latter is done in server.js