const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '[s@mu3lt1]',
      database: 'employee_tracker'
    }
  );

  db.connect(function(err){
      if (err) throw (err)
  });

  module.exports=db;