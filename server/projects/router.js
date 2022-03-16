'use strict'

const {
    wrapHandlerModule
} = require('../util')

const handler = wrapHandlerModule(require('./handler'))
const Router = require('koa-router')

const router = new Router({
    prefix: '/projects'
})
const util = require('../util')
const db = util.db;

router.post('/', handler.createProject)
router.get('/', handler.showAllProjects)
router.get('/searchProjects/:projectName', handler.searchProjects)

module.exports = router