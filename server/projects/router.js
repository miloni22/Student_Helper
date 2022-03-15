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

module.exports = router