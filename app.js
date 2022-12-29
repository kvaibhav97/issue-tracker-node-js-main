const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const issueTrackerRoutes = require('./routes/issue-tracker');
const issuesRoutes = require('./routes/issues');
const errorController = require('./controllers/error');

// Support receiving data in json format.
app.use(express.json());
// Support parsing of application/x-www-form-urlencoded post data.
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/issues', issuesRoutes);
app.use(issueTrackerRoutes);

app.use(errorController.get404);

app.listen(3000);
