import express from 'express'
import { verifySignature } from '../security'
const debug = require('debug')('ea:inbox')

const router = express.Router()

// Shared Inbox endpoint (federated Server)
// For now its only able to handle Note Activities!!
router.post('/', async function (req, res, next) {
  debug(`Content-Type = ${req.get('Content-Type')}`)
  debug(`body = ${JSON.stringify(req.body, null, 2)}`)
  debug(`Request headers = ${JSON.stringify(req.headers, null, 2)}`)
  debug(`verify = ${await verifySignature(`${req.protocol}://${req.hostname}:${req.port}${req.originalUrl}`, req.headers)}`)
  switch (req.body.type) {
  case 'Create':
    if (req.body.send) {
      await req.app.get('ap').sendActivity(req.body).catch(next)
      break
    }
    await req.app.get('ap').handleCreateActivity(req.body).catch(next)
    break
  case 'Undo':
    await req.app.get('ap').handleUndoActivity(req.body).catch(next)
    break
  case 'Follow':
    debug('handleFollow')
    await req.app.get('ap').handleFollowActivity(req.body)
    debug('handledFollow')
    break
  case 'Delete':
    await req.app.get('ap').handleDeleteActivity(req.body).catch(next)
    break
    /* eslint-disable */
  case 'Update':

  case 'Accept':

  case 'Reject':

  case 'Add':

  case 'Remove':

  case 'Like':

  case 'Announce':
    debug('else!!')
    debug(JSON.stringify(req.body, null, 2))
  }
  /* eslint-enable */
  res.status(200).end()
})

export default router