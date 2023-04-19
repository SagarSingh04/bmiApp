const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

//Importing BMI route
const bmiRoute = require("./api/routes/bmi");

app.use(morgan('dev'));
//Implementing body-parser for http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Implementing cors
app.use(cors());

app.use('/bmi', bmiRoute)

//For no routes found
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//For sending error generated for the routes
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;