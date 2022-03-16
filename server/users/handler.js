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
    console.log("GetUserDetails API handler");
    const userId = ctx.user.user_id;
    console.log(userId);
    try {
        const result = await db.query("SELECT * from users where user_id = ?", [userId]);
        if (result.length == 0) {
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

async function fetchMyProjects({email}, ctx) {
    console.log("Fetching users projects API handler");

    try {
        const results = await db.query("SELECT * from projects LIKE emails = ?", [email]);
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

async function fetchProject({userId, projectId
},ctx) {
    try {
        console.log("Fetch project by ID API handler");
        const result = await db.query("SELECT * from projects where project_id = ? AND user_id = ?",
        [ctx.params.projectId, ctx.params.userId]);
        if (result.length == 0) {
            return util.httpResponse(404, {
                message: 'Project not found'
            });
        }
        const project = {
            projectName: result[0].project_name,
            description: result[0].description,
            domain: result[0].domain,
            status: result[0].status,
            github: result[0].github_link,
            video: result[0].video_link,
            owner: result[0].user_id,
            studentId: result[0].student_id,
            group: result[0].group_id,
            funding: result[0].gofundme_link
        }

        return util.httpResponse(200, {
            result: project
        })

    } catch(err) {
        throw err;
    }
}


module.exports = {
    getUserDetails, 
    fetchMyProjects,
    fetchProject
}