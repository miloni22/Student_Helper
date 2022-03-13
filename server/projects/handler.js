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

async function createProject({
    studentId, groupId, projectName, domain, description, status, githubLink, videoLink, goFundMeLink
}, ctx) {
    console.log("createProject handler");
    const userId = ctx.params.userId;
    console.log(userId);
    const projectId = util.generateRandomString(5)
    try {

        const result = await db.query("INSERT INTO projects (user_id,student_id,project_id, group_id, project_name, domain, description, status, github_link, video_link, gofundme_link) VALUES (?,?,?,?, ?, ?, ?, ?, ?,?,?)",
            [userId, studentId, projectId, groupId, projectName, domain, description, status, githubLink, videoLink, goFundMeLink]);
    } catch ( err ) {
        throw err;
    }
    return util.httpResponse(200, {
            message: 'created project successfully'
    })
}

async function showAllProjects() {
    console.log("Show All projects api handler");
}

async function fetchMyProjects({userId}, ctx) {
    console.log("Fectchign users projects handler");
   
}

async function fetchProject({projectId
}, ctx) {
    const userId = ctx.params.userId;
    console.log(userId);
    try {
        const result = await db.query("SELECT * from projects where project_id = ? AND user_id = ?",
        [projectId,userId]);
    } catch(err) {
        throw err;
    }
    if(result) {
        return util.httpResponse(200, result[0]);
    }
    else {
        return util.httpResponse(404, {
            message: 'Project not found'
        });
    }
}

module.exports = {
    createProject,
    showAllProjects,
    fetchProject,
    fetchMyProjects
}