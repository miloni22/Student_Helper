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
    emails, studentId, groupId, projectName, domain, description, status, githubLink, videoLink, goFundMeLink
}) {
    console.log("Create Project Handler");
    if (!emails || !studentId || !projectName)
    {
        console.log("Insufficient Info");
        return util.httpResponse(400, {
            message: 'Insufficient Info!'
        })    
    }
    
    const projectId = util.generateRandomString(5)
    const emailArray = []
    for (var email of emails) {
        emailArray.push(email);
    }
    
    try {
        await db.query("INSERT INTO projects (emails,student_id,project_id, group_id, project_name, domain, description, status, github_link, video_link, gofundme_link) VALUES (?,?,?,?, ?, ?, ?, ?, ?,?,?)",
                [JSON.stringify(emails), studentId, projectId, groupId, projectName, domain, description, status, githubLink, videoLink, goFundMeLink]);
            console.log("Query");

    } catch ( err ) {
            console.log(err);
            throw err;
    }
    return util.httpResponse(200, {
            message: 'created project successfully'
    })
    
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
                owners: result.emails,
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