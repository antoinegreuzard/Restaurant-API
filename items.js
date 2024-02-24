const express = require('express');
const RateLimit = require('express-rate-limit');

const router = express.Router();

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.use(limiter);

module.exports = (db) => {
  router.get('/', (req, res) => {
    let sql = 'SELECT * FROM items';
    const queryParams = [];

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

    db.query(sql, queryParams, (err, results) => {
      if (err) {
        res.send('Failed to retrieve items');
      } else if (results[0]) {
        res.json(results);
      } else {
        res.send('No data');
      }
    });
  });

  router.post('/', (req, res) => {
    const items = req.body;
    const sql =
      'INSERT INTO items (name, price, description, categorie) VALUES ?';

    const itemsForInsert = items.map((item) => [
      item.name,
      item.price,
      item.description,
      item.categorie,
    ]);

    db.query(sql, [itemsForInsert], (err) => {
      if (err) {
        res.status(500).send('Failed to add items');
      } else {
        res.send('Items added successfully');
      }
    });
  });

  router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM items WHERE id = ?', [id], (err, results) => {
      if (err) {
        res.status(500).send('Failed to retrieve item');
      } else if (results[0]) {
        res.json(results[0]);
      } else {
        res.status(500).send('No data');
      }
    });
  });

  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const newItem = req.body;
    const sql =
      'UPDATE items SET name = ?, price = ?, description = ?, categorie = ? WHERE id = ?';

    db.query(
      sql,
      [newItem.name, newItem.price, newItem.description, newItem.categorie, id],
      (err) => {
        if (err) {
          res.status(500).send('Failed to update item');
        } else {
          res.send('Item updated successfully');
        }
      }
    );
  });

  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM items WHERE id = ?', [id], (error) => {
      if (error) throw error;
      res.send('Record has been deleted!');
    });
  });

  return router;
};
