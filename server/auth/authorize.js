'use strict'

const { createDecipheriv } = require("crypto");
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
    console.log("authorized");
    if (!ctx.request.header['authorization']) {
        ctx.status = 401
        ctx.body = {
            data: {
                errMsg: 'You are not authorized'
            }
        }
        return ctx
    }
    const authToken = ctx.request.header['authorization'];
    try {
        const user = await db.query("SELECT * FROM users where auth_token = ?", [authToken]);
        
        if(!user[0]) {
            ctx.status = 401
            ctx.body = {
                data: {
                    errMsg: 'You are not authorized'
                }
            }
            return ctx;
        }
        else {
            console.log("Found a valid user with auth token");
            ctx.user = user[0];
            return await next()
        }
    }
    catch(err) {
        console.log(err);
        throw err;
    }
}

module.exports = {
    authorize
}