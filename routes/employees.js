//These are the routes for the Employees section of our application.
// Setup  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const
        express                             =   require('express'),             // We have to require express, so we do so.
        router                              =   express.Router()               // Routing refers to how an application’s endpoints (URIs or paths + an HTTP request method like GET, POST, etc.) respond to client requests. The application “listens” for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function. The Router() middleware is part of express; we need to assign it to a variable name so that we can use it in the application.
        Employee                            =   require('../models/employee');

// Routes  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// All Employees  -------------------------------------------------------------------------------------------------------------------------------
router.get('/', async (req, res) => {       // We use an asynchronous function as we're interacting with MongoDB, which operates asynchronously. Note that we still use the '/' location, because in the server we are assigning these exported routes to a variable which includes the '/routes/employees' path. So we don't assign those earlier points in the path here in this file.
    let searchOptions = {};    // We establish a new variable to set up our Search for employees. We will then search for all the different request parameters that we set, and add them to our searchOptions.
    if (req.query.name != null && req.query.name !== '') {       //This if statement ensures that we actually do have a name being passed to the server. 
        //A GET request passes information via the query string, in the URL. That's where we need to look for the information we want. (POST requests send through the body.)
    searchOptions.name  =   new RegExp(req.query.name, 'i');    // If we do have a name being passed, we want to add that to our searchOptions. We want to set that to a new Regular Expression. (see below)  The 'i' flag makes it case-insensitive.
    // Regular expressions are patterns used to match character combinations in strings. In JavaScript, regular expressions are also objects. You construct a regular expression in one of two ways: 1) Using a regular expression literal, which consists of a pattern enclosed between slashes, eg. let re = /ab+c/;  2) Calling the constructor function of the RegExp object, eg. let re = new RegExp('ab+c'). Using the constructor function provides runtime compilation of the regular expression. Use the constructor function when you know the regular expression pattern will be changing, or you don't know the pattern and are getting it from another source, such as user input.
    };      
try {
    const employees     =   await Employee.find(searchOptions);        // The mongoose model has great functionality included. We're going to use .find. Find takes an object, allowing you to establish conditions, like filters, for your search. We pass in the variable searchOptions, which will allow us to search for the various parameters. At an earlier point in the build, we use .find with an empty object, which says that we have no conditions: we want *all* employees to be found.
    res.render('employees/index', {
        employees: employees,       // We are passing the new variable, employees, that we just declared, above, to our employees/index page, to be rendered there. The employees key will have the value of our employees variable we just created. (key:value) The key, 'employees', comes from the employees/index.ejs page.
        searchOptions: req.query,        // We will also send back, as the searchOptions, the request query itself, to repopulate the search field when the page that shows the results of the search renders.
    });
}   catch {
    res.redirect('/');      // If there's any error, eg. our database is inaccessible, we will redirect to the home page.
} ;
// res.send('This is the All Employees page');
    // res.render('employees/index');
});

//Specific Employees  -------------------------------------------------------------------------------------------------------------------------------
/*router.get('/employees/:id', async (req, res) => {
    let id = req.query.id;
    let employee = await Employee.find({id});
    res.render('employees/employee.ejs', { employee })
}

)*/
//New Employees  -------------------------------------------------------------------------------------------------------------------------------
//Show the Form for Creating New Employees
router.get('/new', (req, res) => {
    res.render('employees/new', {employee: new Employee});    //The page at this location will show the form for creating New Employees
});


// Create the Employee
router.post('/', async (req, res) => {    // This is an asynchronous POST route for actually Creating the New Employee. It only Creates, it doesn't actually render anything; the results of the creating that are seen by the user are seen as the result of another route that will render a view of the new Employee.
    //res.send('Create route');   // Temporary send so we can check the route during this stage of our build
    const employee                          =   new Employee({
        name: req.body.name,    // POST requests go through the body, in contrast to GET requests, which use the query string. Our new Employee has already has its name inputted by the user; we are using that inputted name. In addition, this explicitly tells the server to only accept the actual name, rather than some erroneous or malicious entry from a user.
    })
    try {       // rather than the clunky callback-heavy code that is commented out, below, we're using an async-await. We use a try-catch block to allow us to handle the error in the catch.
        const newEmployee  =   await employee.save();     //We save the new employee we are just creating under the variable newEmployee. We have to await this save to be complete before assigning it to the variable, because everything in MongoDB is asynchronous.
        //res.redirect(`employees/${newEmployee.id}`);  [TEMPORARILY COMMENTED OUT, UNTIL A SUBSEQUENT DEVELOPMENT STEP]    // If the operation of Creating a new Employee succeeds (no errors), we will redirect to the page showing that new employee. For that, we need to get the id for this new employee from the database. 
            //We're using string interpolation here; thus the back-ticks (`).String interpolation is replacing placeholders with values in a string literal. The string interpolation in JavaScript is performed by template literals (strings wrapped in backticks `) and ${expression} as a placeholder. In JavaScript, there are 3 ways to create string literals: single quotes, double quotes, and backticks, which permits string interpolation. Such a string is also named a TEMPLATE STRING. This is the "literal" that supports the string interpolation. The template string supports placeholders. The expression inside the placeholder is evaluated during runtime, and the result is inserted into the string. Thus, string interpolation allows different strings to be used depending on what is all going on in the app at that time, and thus allows the dynamic behaviour we expect from an app. The placeholder has a special format: ${expressionToEvaluate}. The expression inside the placeholder can be of any kind. variables: ${myVar} || operators: ${n1 + n2}, ${cond ? 'val 1' : 'val 2'} || even function calls ${myFunc('argument')}. The placeholder expression result is implicitly converted to a string. If the placeholder contains an object, following the conversion to string rule, the object is converted to a string too. The toString() method of the object is called to get the string representation of the object.  If the placeholder contains an array, the toString() array method executes array.join(',') when the array is converted to string. A backslash \ before the placeholder-like sequence of characters (eg. \${abc} ) allows you to escape Javascript's interpretation of those characters (ie. ${abc}) as a placeholder. Instead, when the backslash \ (no following space) is used, Jaascript just interprets the following characters as a simple sequence of characters. Anytime you wish to simply use a dollar sign and an opening curly bracket together (${) you need to precede them with a backslash or they'll be interpreted by Javascript as a template string. SUMMARY: A template string is defined by wrapping a sequence of characters into a pair of backticks `I'm a template string`. The template string placeholders have the format ${expression}, for example `The number is ${number}`. See this helpful site: https://dmitripavlutin.com/string-interpolation-in-javascript/
            res.redirect('employees');
    } catch {       // If there is an error...
        res.render('employees/new', {     // ...we'll render the New page again...
        employee: employee,        // ...and we'll pass these parameters to that page. First, the employee that we just created, so that the form will be re-populated with that data and the user won't have to enter it again.
        errorMessage:  'Error creating New Employee',     // We'll also pass in an error message, so that we can easily let our users know that an error happened at this point.
        })
    };
    /* This commented-out code block was from an earlier point in the build.
    employee.save((err, newEmployee) => {
        if (err) {      // If there is an error... 
            res.render('employees/new', {     // ...we'll render the New page again...
            employee: employee,        // ...and we'll pass these parameters to that page. First, the employee that we just created, so that the form will be re-populated with that data and the user won't have to enter it again.
            errorMessage:  'Error creating New Employee',     // We'll also pass in an error message, so that we can easily let our users know that an error happened at this point.
            })
        } else {
            //res.redirect(`employees/${newEmployee.id}`); //See comments, above, re: string interpolation.
            res.redirect('employees');
        };
    });        //We call the .save method on the employee object which we created just above this line. It takes the object with the parameters of error (in case there is one) and the new Employee we just created.
    //res.send(req.body.name);        //From an earlier point in the build. We were sending the body.name from the request we received (which our form on the New Employee route sent to the server) 
    */
});



module.exports                              =   router;  // We have to export this router, and import it into our server. This is the former; the latter is done in server.js