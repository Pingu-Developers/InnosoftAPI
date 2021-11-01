var mysql = require("mysql");

const dbConnection = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'innosoft',
    database: process.env.DB_NAME || 'innosoft'
};

var pool = mysql.createPool(dbConnection);

var _getDBConnection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err);
            else resolve(connection);
        });
    });  
};

exports.query = (sql, params) => {
    return new Promise((resolve, reject) => {
        _getDBConnection().then(connection => {
            connection.query(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        }).catch(dberr => {
            reject(dberr);
        });
    });
}