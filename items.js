const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/', function (req, res) {
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

    router.post('/', function (req, res) {
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

    router.get('/:id', function (req, res) {
        const id = req.params.id;
        db.query('SELECT * FROM items WHERE id = ?', [id], function (err, results) {
            if (err) {
                console.log(err);
                res.status(500).send('Failed to retrieve item');
            } else {
                if (results[0]) {
                    res.json(results[0]);
                } else {
                    res.status(500).send('No data')
                }
            }
        });
    });

    router.put('/:id', function (req, res) {
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

    router.delete('/:id', function (req, res) {
        const id = req.params.id;
        db.query('DELETE FROM items WHERE id = ?', [id], function (error, results, fields) {
            if (error) throw error;
            res.send('Record has been deleted!');
        });
    });

    return router;
}