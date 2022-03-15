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
    email, studentId, groupId, projectName, domain, description, status, githubLink, videoLink, goFundMeLink
}) {
    if (!email || !studentId || !projectName)
    {
        console.log("Insufficient Info");
        return util.httpResponse(400, {
            message: 'Insufficient Info!'
        })    
    }
    try {
        const result = await db.query("SELECT * from users where email_id = ?", [email]);
        if (result.length == 0) {
            return util.httpResponse(400, {
                message: 'No user with this email found!'
            })
        }
        const projectId = util.generateRandomString(5)
    
        try {
            await db.query("INSERT INTO projects (user_id,student_id,project_id, group_id, project_name, domain, description, status, github_link, video_link, gofundme_link) VALUES (?,?,?,?, ?, ?, ?, ?, ?,?,?)",
                [result[0].user_id, studentId, projectId, groupId, projectName, domain, description, status, githubLink, videoLink, goFundMeLink]);
            console.log("Query");
        } catch ( err ) {
            console.log(err);
            throw err;
        }
        return util.httpResponse(200, {
            message: 'created project successfully'
        })
    }
    catch(err) {
        throw err;
    }
    
}

async function showAllProjects({}) {
    console.log("Show All projects API handler");
    try {
        const results = await db.query("SELECT * from projects");
        if (results.length == 0) {
            return util.httpResponse(404, {
                message: 'No projects found!'
            })
        }
        const projectArray = [];
        for (var result of results) {
           const project = {
                projectName: result.project_name,
                description: result.description,
                domain: result.domain,
                status: result.status,
                github: result.github_link,
                video: result.video_link,
                owner: result.user_id,
                studentId: result.student_id,
                group: result.group_id,
                funding: result.gofundme_link
            }
            projectArray.push(project); 
        }
        return util.httpResponse(200, {
            result: projectArray
        })

    }
    catch (err) {
        console.log(err);
        throw err;
    }
}


module.exports = {
    createProject,
    showAllProjects
}