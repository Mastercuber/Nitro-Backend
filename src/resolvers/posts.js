import { neo4jgraphql } from 'neo4j-graphql-js'
import { activityPub } from '../activitypub/ActivityPub'
import uuid from 'uuid/v4'
import as from 'activitystrea.ms'
/*
import as from 'activitystrea.ms'
import request from 'request'
*/

const debug = require('debug')('backend:schema')

export default {
  Mutation: {
    CreatePost: async (object, params, context, resolveInfo) => {
      params.activityId = uuid()
      const result = await neo4jgraphql(object, params, context, resolveInfo, false)

      const session = context.driver.session()

      const author = await session.run(
        'MATCH (author:User {id: $userId}), (post:Post {id: $postId}) ' +
        'MERGE (post)<-[:WROTE]-(author) ' +
        'RETURN author', {
          userId: context.user.id,
          postId: result.id
        }
      )

      debug(`actorId = ${author.records[0]._fields[0].properties.actorId}`)
      if (Array.isArray(author.records) && author.records.length > 0) {
        const actorId = author.records[0]._fields[0].properties.actorId
        const createActivity = await new Promise((resolve, reject) => {
          as.create()
            .id(`${actorId}/status/${params.activityId}`)
            .actor(`${actorId}`)
            .object(
              as.article()
                .id(`${actorId}/status/${result.id}`)
                .content(result.content)
                .to('https://www.w3.org/ns/activitystreams#Public')
                .publishedNow()
                .attributedTo(`${actorId}`)
            ).prettyWrite((err, doc) => {
              if (err) {
                reject(err)
              } else {
                debug(doc)
                const parsedDoc = JSON.parse(doc)
                parsedDoc.send = true
                resolve(JSON.stringify(parsedDoc))
              }
            })
        })
        try {
          await activityPub.sendActivity(createActivity)
        } catch (e) {
          debug(`error sending post activity = ${JSON.stringify(e, null, 2)}`)
        }
      }
      session.close()

      return result
    }
  }
}