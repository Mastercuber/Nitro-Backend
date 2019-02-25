import ActivityPub from './ActivityPub'
import express from 'express'
import router from './routes'
import dotenv from 'dotenv'
import http from 'http'
import { resolve } from 'path'
const debug = require('debug')('ea')

dotenv.config({ path: resolve('src', 'activitypub', '.env') })
let server = null
let activityPub = null
if (!activityPub) {
  activityPub = () => { // eslint-disable-line
    const app = express()
    const activityPub = new ActivityPub(process.env.ACTIVITYPUB_DOMAIN || 'localhost', process.env.ACTIVITYPUB_PORT || 4100)
    app.set('ap', activityPub)
    app.use(router)
    server = http.createServer(app)
    server.listen(process.env.ACTIVITYPUB_PORT || 4100, function () {
      debug(`ActivityPub service listening on port: ${process.env.ACTIVITYPUB_PORT}`)
    })
    return activityPub
  }
}

process.on(['SIGINT', 'SIGTERM', 'exit'], () => {
  server.close()
})

export default activityPub
