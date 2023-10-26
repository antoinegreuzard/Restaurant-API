const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/', function (req, res) {
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

    router.post('/', function (req, res) {
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

    router.get('/:id', function (req, res) {
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

    router.put('/:id', function (req, res) {
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

    router.delete('/:id', function (req, res) {
        const id = req.params.id;
        db.query('DELETE FROM categories WHERE id = ?', [id], function (error, results, fields) {
            if (error) throw error;
            res.send('Record has been deleted!');
        });
    });

    return router;
}