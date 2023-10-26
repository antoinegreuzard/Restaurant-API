const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/', function (req, res) {
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

    router.post('/', function (req, res) {
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

    router.get('/:id', function (req, res) {
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

    router.put('/:id', function (req, res) {
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

    router.delete('/:id', function (req, res) {
        const id = req.params.id;
        db.query('DELETE FROM formulas WHERE id = ?', [id], function (error, results, fields) {
            if (error) throw error;
            res.send('Record has been deleted!');
        });
    });

    return router;
}