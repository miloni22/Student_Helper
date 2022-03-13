'use strict'

const {
    wrapHandlerModule
} = require('../util')

const handler = wrapHandlerModule(require('./handler'))
const Router = require('koa-router')

const router = new Router({
    prefix: '/projects'
})

router.post('/', handler.createProject)
router.get('/', handler.showAllProjects)
router.get('/:projectId', handler.fetchProject);
router.get('/:userId', handler.fetchMyProjects);

module.exports = router