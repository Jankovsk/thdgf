const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/records", (req, res) => {
    const { category, text } = req.body;
    if (!category || !text) {
        return res.status(400).json({ error: "Kategorie a text jsou povinné." });
    }

    const sql = "INSERT INTO records (category, text) VALUES (?, ?)";
    db.run(sql, [category, text], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, category, text });
    });
});

app.get("/records", (req, res) => {
    const { category, search } = req.query;
    let sql = "SELECT * FROM records WHERE 1=1";
    let params = [];

    if (category) {
        sql += " AND category = ?";
        params.push(category);
    }

    if (search) {
        sql += " AND text LIKE ?";
        params.push(`%${search}%`);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.delete("/records/:id", (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM records WHERE id = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Záznam nenalezen." });
        }
        res.json({ message: "Záznam smazán." });
    });
});

app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});
