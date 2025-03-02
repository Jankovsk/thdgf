const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.db", (err) => {
    if (err) {
        console.error("Chyba připojení k databázi:", err.message);
    } else {
        console.log("Připojeno k SQLite databázi.");
    }
});

db.run(

);

module.exports = db;