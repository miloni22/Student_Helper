'use strict'

const {
    wrapHandlerModule
} = require('../util')

const handler = wrapHandlerModule(require('./handler'))
const Router = require('koa-router')

const router = new Router({
    prefix: '/users'
})
router.get('/:userId', handler.getUserDetails)

module.exports = router