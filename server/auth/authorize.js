'use strict'

const mysql = require("mysql");
const utils = require('util')

function makeDb() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin', 
        database: 'student_helper'
      });
    return {
      query( sql, args ) {
        return utils.promisify( connection.query )
          .call( connection, sql, args );
      },
      close() {
        return utils.promisify( connection.end ).call( connection );
      }
    };
}
const db = makeDb();

async function authorize(ctx, next) {
    if (!ctx.request.header['authorization']) {
        ctx.status = 401
        ctx.body = {
            data: {
                errMsg: 'You are not authorized'
            }
        }
        return ctx
    }
    const user = db.query("SELECT * FROM users where authToken = ?",
      [authToken],
      (err,result) => {
        console.log(user);
        if(!user) {
            ctx.status = 401
            ctx.body = {
                data: {
                    errMsg: 'You are not authorized'
                }
            }
            return ctx;
        }
        else if(user.length > 0) {
            console.log("Found a valid user with auth token");
            ctx.user = user;
        }
    }
    );
    ctx.user = user
    return await next()
}

module.exports = {
    authorize
}