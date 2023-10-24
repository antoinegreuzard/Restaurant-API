const express = require('express');
const basicAuth = require('express-basic-auth');
const mysql = require('mysql');
const app = express();
app.use(express.json());
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'restapi'
});

app.listen(port, function () {
    console.log(`Server running at http://localhost:${port}`);
});

db.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + db.threadId);
});

const users = {
    'admin': {password: 'admin', role: 'admin'},
    'client': {password: 'client', role: 'client'}
};

app.use(basicAuth({
    authorizeAsync: true,
    unauthorizedResponse: 'Unauthorized',
    authorizer: (username, password, cb) => {
        const user = users[username];
        if (!user || password !== user.password) {
            return cb(null, false);
        }
        return cb(null, true, user.role);
    }
}));

app.use((req, res, next) => {
    const userRole = req.auth.user;
    if (req.method !== 'GET' && userRole !== 'admin') {
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

app.get('/items', function (req, res) {
    let sql = 'SELECT * FROM items';
    let queryParams = [];

    if (req.query.price) {
        sql += ' WHERE price = ?';
        queryParams.push(req.query.price);
    }

    if (req.query.price_gt) {
        sql += ' WHERE price > ?';
        queryParams.push(req.query.price_gt);
    }

    if (req.query.price_lt) {
        sql += sql.includes('WHERE') ? ' AND' : ' WHERE';
        sql += ' price < ?';
        queryParams.push(req.query.price_lt);
    }

    if (req.query.category) {
        sql += sql.includes('WHERE') ? ' AND' : ' WHERE';
        sql += ' category = ?';
        queryParams.push(req.query.category);
    }

    db.query(sql, queryParams, function (err, results) {
        if (err) {
            console.error(err);
            res.send('Failed to retrieve items');
        } else {
            if (results[0]) {
                res.json(results);
            } else {
                res.send('No data')
            }
        }
    });
});

app.post('/items', function (req, res) {
    const items = req.body;
    let sql = 'INSERT INTO items (name, price, description, categorie) VALUES ?';

    const itemsForInsert = items.map(item => [item.name, item.price, item.description, item.categorie]);

    db.query(sql, [itemsForInsert], function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to add items');
        } else {
            res.send('Items added successfully');
        }
    });
});

app.get('/items/:id', function (req, res) {
    const id = req.params.id;
    db.query('SELECT * FROM items WHERE id = ?', [id], function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to retrieve item');
        } else {
            if (results[0]) {
                res.json(results[0]);
            } else {
                res.send('No data')
            }
        }
    });
});

app.put('/items/:id', function (req, res) {
    const id = req.params.id;
    const newItem = req.body;
    let sql = 'UPDATE items SET name = ?, price = ?, description = ?, categorie = ? WHERE id = ?';

    db.query(sql, [newItem.name, newItem.price, newItem.description, newItem.categorie, id], function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to update item');
        } else {
            res.send('Item updated successfully');
        }
    });
});

app.delete('/items/:id', function (req, res) {
    const id = req.params.id;
    db.query('DELETE FROM items WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        res.send('Record has been deleted!');
    });
});

app.get('/categories', function (req, res) {
    db.query('SELECT * FROM categories', function (err, results) {
        if (err) {
            console.error(err);
            res.send('Failed to retrieve categories');
        } else {
            if (results[0]) {
                res.json(results);
            } else {
                res.send('No data')
            }
        }
    });
})

app.post('/categories', function (req, res) {
    const categories = req.body;
    let sql = 'INSERT INTO categories (name, description) VALUES ?';

    const categoryForInsert = categories.map(category => [category.name, category.description]);

    db.query(sql, [categoryForInsert], function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to add items');
        } else {
            res.send('Categories added successfully');
        }
    });
});

app.get('/categories/:id', function (req, res) {
    const id = req.params.id;
    db.query('SELECT * FROM categories WHERE id = ?', [id], function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to retrieve category');
        } else {
            if (results[0]) {
                res.json(results[0]);
            } else {
                res.send('No data')
            }
        }
    });
});

app.put('/categories/:id', function (req, res) {
    const id = req.params.id;
    const newCategory = req.body;
    let sql = 'UPDATE categories SET name = ?,description = ? WHERE id = ?';

    db.query(sql, [newCategory.name, newCategory.description, id], function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to update item');
        } else {
            res.send('Categories updated successfully');
        }
    });
});

app.delete('/categories/:id', function (req, res) {
    const id = req.params.id;
    db.query('DELETE FROM categories WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        res.send('Record has been deleted!');
    });
});

app.get('/formulas', function (req, res) {
    let sql = 'SELECT * FROM formulas';
    let queryParams = [];

    if (req.query.price) {
        sql += ' WHERE price = ?';
        queryParams.push(req.query.price);
    }

    if (req.query.price_gt) {
        sql += ' WHERE price > ?';
        queryParams.push(req.query.price_gt);
    }

    if (req.query.price_lt) {
        sql += sql.includes('WHERE') ? ' AND' : ' WHERE';
        sql += ' price < ?';
        queryParams.push(req.query.price_lt);
    }

    if (req.query.category) {
        sql += sql.includes('WHERE') ? ' AND' : ' WHERE';
        sql += ' FIND_IN_SET(?, REPLACE(categories, ", ", ","))';
        queryParams.push(req.query.category);
    }

    db.query(sql, queryParams, function (err, results) {
        if (err) {
            console.error(err);
            res.send('Failed to retrieve items');
        } else {
            if (results[0]) {
                res.json(results);
            } else {
                res.send('No data')
            }
        }
    });
});

app.post('/formulas', function (req, res) {
    const formulas = req.body;
    let sql = 'INSERT INTO formulas (name, description, price, categories) VALUES ?';

    const formulasForInsert = formulas.map(formula => [formula.name, formula.description, formula.price, formula.categories]);

    db.query(sql, [formulasForInsert], function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to add formulas');
        } else {
            res.send('Formulas added successfully');
        }
    });
});

app.get('/formulas/:id', function (req, res) {
    const id = req.params.id;
    db.query('SELECT * FROM formulas WHERE id = ?', [id], function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to retrieve formulas');
        } else {
            if (results[0]) {
                res.json(results[0]);
            } else {
                res.send('No data')
            }
        }
    });
});

app.put('/formulas/:id', function (req, res) {
    const id = req.params.id;
    const newFormulas = req.body;
    let sql = 'UPDATE formulas SET name = ?, description = ?, price = ?, categories = ? WHERE id = ?';

    db.query(sql, [newFormulas.name, newFormulas.description, newFormulas.price, newFormulas.categories, id], function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to update item');
        } else {
            res.send('Formulas updated successfully');
        }
    });
});

app.delete('/formulas/:id', function (req, res) {
    const id = req.params.id;
    db.query('DELETE FROM formulas WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        res.send('Record has been deleted!');
    });
});