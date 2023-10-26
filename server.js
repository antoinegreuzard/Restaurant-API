const express = require('express');
const basicAuth = require('express-basic-auth');
const bcrypt = require('bcrypt');
require('dotenv').config();
const app = express();
app.use(express.json());
const port = 3000;

const db = require('./db');

const items = require('./items')(db);
const categories = require('./categories')(db);
const formulas = require('./formulas')(db);

const users = {
    'admin': {password: bcrypt.hashSync(process.env.ADMIN_PASS, 10), role: 'admin'},
    'client': {password: bcrypt.hashSync(process.env.CLIENT_PASS, 10), role: 'client'}
};

app.use(basicAuth({
    authorizeAsync: true,
    unauthorizedResponse: 'Unauthorized',
    authorizer: (username, password, cb) => {
        const user = users[username];
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return cb(null, false);
        }
        return cb(null, true, user.role);
    }
}), (req, res, next) => {
    if (!req.auth) {
        return res.status(401).send('Unauthorized');
    }
    const user = req.auth.user;

    if (req.method !== 'GET' && user !== 'admin') {
        res.status(403).send('Forbidden')
    } else {
        next();
    }
});

app.get('/', function (req, res) {
    db.query('SELECT 1', function (err) {
        if (err) {
            console.error(err);
            res.send('Database connection failed');
        } else {
            res.send(`Database connection is OK!<br><br>http://localhost:${port}/items<br>http://localhost:${port}/categories<br>http://localhost:${port}/formulas`);
        }
    });
});

app.use('/items', items);
app.use('/categories', categories);
app.use('/formulas', formulas);

app.listen(port, function () {
    console.log(`Server running at http://localhost:${port}`);
});