const express = require('express');
const rateLimitMiddleware = require('./rateLimiter');

const router = express.Router();

module.exports = (db) => {
  router.get('/', rateLimitMiddleware, (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
      if (err) {
        res.status(500).send('Failed to retrieve categories');
      } else if (results[0]) {
        res.json(results);
      } else {
        res.status(500).send('No data');
      }
    });
  });

  router.post('/', rateLimitMiddleware, (req, res) => {
    const categories = req.body;
    const sql = 'INSERT INTO categories (name, description) VALUES ?';

    const categoryForInsert = categories.map((category) => [
      category.name,
      category.description,
    ]);

    db.query(sql, [categoryForInsert], (err) => {
      if (err) {
        res.status(500).send('Failed to add items');
      } else {
        res.send('Categories added successfully');
      }
    });
  });

  router.get('/:id', rateLimitMiddleware, (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM categories WHERE id = ?', [id], (err, results) => {
      if (err) {
        res.status(500).send('Failed to retrieve category');
      } else if (results[0]) {
        res.json(results[0]);
      } else {
        res.status(500).send('No data');
      }
    });
  });

  router.put('/:id', rateLimitMiddleware, (req, res) => {
    const { id } = req.params;
    const newCategory = req.body;
    const sql = 'UPDATE categories SET name = ?,description = ? WHERE id = ?';

    db.query(sql, [newCategory.name, newCategory.description, id], (err) => {
      if (err) {
        res.status(500).send('Failed to update item');
      } else {
        res.send('Categories updated successfully');
      }
    });
  });

  router.delete('/:id', rateLimitMiddleware, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM categories WHERE id = ?', [id], (error) => {
      if (error) throw error;
      res.send('Record has been deleted!');
    });
  });

  return router;
};
