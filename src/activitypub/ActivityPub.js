import { sendAcceptActivity, sendRejectActivity, extractNameFromId, extractDomainFromUrl } from './utils'
import request from 'request'
import as from 'activitystrea.ms'
import NitroDatasource from './NitroDatasource'
const debug = require('debug')('ea')

export default class ActivityPub {
  constructor (domain, port) {
    if (domain === 'localhost') { this.domain = `${domain}:${port}` } else { this.domain = domain }
    this.port = port
    this.dataSource = new NitroDatasource(this.domain)
  }

  getFollowersCollection (actorId) {
    return this.dataSource.getFollowersCollection(actorId)
  }

  getFollowersCollectionPage (actorId) {
    return this.dataSource.getFollowersCollectionPage(actorId)
  }

  getFollowingCollection (actorId) {
    return this.dataSource.getFollowingCollection(actorId)
  }

  getFollowingCollectionPage (actorId) {
    return this.dataSource.getFollowingCollectionPage(actorId)
  }

  getOutboxCollection (actorId) {
    return this.dataSource.getOutboxCollection(actorId)
  }

  getOutboxCollectionPage (actorId) {
    return this.dataSource.getOutboxCollectionPage(actorId)
  }

  handleFollowActivity (activity) {
    debug(`inside FOLLOW ${activity.actor}`)
    let toActorName = extractNameFromId(activity.object)
    let fromDomain = extractDomainFromUrl(activity.actor)
    const dataSource = this.dataSource

    return new Promise((resolve, reject) => {
      request({
        url: activity.actor,
        headers: {
          'Accept': 'application/activity+json'
        }
      }, async (err, response, toActorObject) => {
        if (err) return reject(err)
        debug(`name = ${toActorName}@${this.domain}`)

        let followersCollectionPage = await this.dataSource.getFollowersCollectionPage(activity.object)

        const followActivity = as.follow()
          .id(activity.id)
          .actor(activity.actor)
          .object(activity.object)

        // add follower if not already in collection
        if (followersCollectionPage.orderedItems.includes(activity.actor)) {
          debug('follower already in collection!')
          debug(`inbox = ${toActorObject.inbox}`)
          resolve(sendRejectActivity(followActivity, toActorName, fromDomain, toActorObject.inbox))
        } else {
          followersCollectionPage.orderedItems.push(activity.actor)
        }
        debug(`toActorObject = ${toActorObject}`)
        toActorObject = typeof toActorObject !== 'object' ? JSON.parse(toActorObject) : toActorObject
        debug(`followers = ${JSON.stringify(followersCollectionPage.orderedItems, null, 2)}`)
        debug(`inbox = ${toActorObject.inbox}`)
        debug(`outbox = ${toActorObject.outbox}`)
        debug(`followers = ${toActorObject.followers}`)
        debug(`following = ${toActorObject.following}`)

        // TODO save after accept activity for the corresponding follow is received
        try {
          await dataSource.saveFollowersCollectionPage(followersCollectionPage)
          debug('follow activity saved')
          resolve(sendAcceptActivity(followActivity, toActorName, fromDomain, toActorObject.inbox))
        } catch (e) {
          debug('followers update error!', e)
          resolve(sendRejectActivity(followActivity, toActorName, fromDomain, toActorObject.inbox))
        }
      })
    })
  }

  handleUndoActivity (activity) {
    debug('inside UNDO')
    switch (activity.object.type) {
    case 'Follow':
      const followActivity = activity.object
      return this.dataSource.undoFollowActivity(followActivity.actor, followActivity.object)
    default:
    }
  }

  handleCreateActivity (activity) {
    debug('inside create')
    switch (activity.object.type) {
    case 'Article':
    case 'Note':
      const articleObject = activity.object
      if (articleObject.inReplyTo) {
        return this.dataSource.createComment(articleObject)
      } else {
        return this.dataSource.createPost(articleObject)
      }
    default:
    }
  }

  handleDeleteActivity (activity) {
    debug('inside delete')
  }
}
