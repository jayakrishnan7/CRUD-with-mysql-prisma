import mysql from 'mysql';
import * as util from '../../util.json';
    

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "crud",
});

  var mysqldbconnection = {
    query: function () {
      var sql_args: any = [];
      var args: any = [];
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      var callback = args[args.length - 1]; //last arg is callback
      console.log('inside mysqldbconnection.......');

      pool.getConnection(function (err: any, connection: any) {
        if (err) {
          console.log(err);
          return callback(err);
        }
        if (args.length > 2) {
          sql_args = args[1];  
        }
        connection.query(args[0], sql_args, function (err: any, results: any) {
          connection.release(); // always put connection back in pool after last query
          if (err) {
            console.log(err);
            return callback(err);
          }
          callback(null, results);
        });
      });
    },
  };
  

  var execQuery = (query: string, params: Array<any>) => {
    return new Promise((resolve, reject) => {
      console.log("reached in execQuery...");

      (mysqldbconnection as any).query(
        query,
        params,
        (error: any, result: any) => {
          if (error) {
            console.log(error);
            reject(util.errorOccured);
          } else {
            resolve(result);
          }
        }
      );
    });
  };


export default execQuery;
