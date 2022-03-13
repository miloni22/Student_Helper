'use strict'
const _ = require('ramda')

const util = require('../util')
const utils = require('util')
const mysql = require("mysql");

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

async function getUserDetails({},ctx) {
    
    const userId = ctx.params.userId;
    console.log(userId);
    try {
        const result = await db.query("SELECT * from users where user_id = ?", [userId]);
        if (!result) {
            return util.httpResponse(400, {
                message: 'No user with this userId found'
            })
        }
        else {
            const userDetails = {
                userName: result[0].user_id,
                firstName: result[0].first_name,
                lastName: result[0].last_name,
                email: result[0].email_id
            }
            console.log(userDetails);
            return util.httpResponse(200, {
                result: userDetails
            })
        }
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    getUserDetails
}