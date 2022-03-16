'use strict'

const mysql = require("mysql");
const utils = require('util')
const util = require('../util')


const db = util.db;

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