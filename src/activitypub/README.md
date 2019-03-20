The ActivityPub service has the following abilities:
* receiving public addressed __*Article*__ and __*Note*__ Objects
* receiving __*Like*__ and __*Follow*__ Activities
* receiving __*Undo*__ and __*Delete*__ Activities for Articles and Notes
* serving __*Webfinger*__ records and __*Actor*__ Objects
* serving __*Followers*__, __*Following*__ and __*Outbox*__ collections

**->** *It is not differed between a "users" inbox and a "sharedInbox" by invoking service logic!*

## Explanation
**->** This explanation assumes you are using the __*NitroDataSource*__!
  
### Like and Follow

When a __*Like*__ activity is received, it get translated into a GraphQL query to shout a post or up vote a comment.  
The __*Follow*__ activity first creates a user for the sending actor, when no user exists, and then adds a *followedBy* relationship to indicate friendship 

### Article and Note

__*Article's*__ and __*Note's*__ both get translated into a `Post` node. The wrapped create activity ID's are saved along the posts to recreate the activity for serving the outbox etc.

### Undo and Delete

When receiving an __*Undo*__ activity with a follow object, then the follow relationship is removed and with this the follow activity undone.
  
When receiving a __*Delete*__ activity with a Note or Article Object, the `Post` node will be deleted.

### Serving Webfinger and Actor Object

In the `webfinger.feature` you can see how the Webfinger and also the Actor Object response looks like

### Serving Collections

Taking a look into `collections.feature` will show you how, for now, empty collections look like


## Testing
Cucumber features are used to test the acceptance of the API against the Standard.
To run the Acceptance tests just execute:
```sh
yarn test:cucumber
```

## Debugging

This repository uses [**debug**](https://www.npmjs.com/package/debug) as logging tool. Just take a look at the imports of a file and search for e.g. `require('debug')('ea:utils')`. If you  want to see the debugging output for this specific file, run one of the above commands prefixed with `DEBUG=ea:utils`.  

You can also __*see*__ all debugging output available by prefixing with `DEBUG=ea*`.


## ToDo's:
### General
- [ ] Make all tests run
- [ ] Add Block activity for blocking users to interact with my content
- [ ] Up vote instead of shout for a comment
- [x] Add Signature verification test
- [ ] Send an Article via ActivityPub when a Post is created
- [x] Improve README

### Testing
- [ ] Shared inbox test
- [ ] Collections tests with non empty collection (maybe other test order)

## License

See the [LICENSE](LICENSE-MIT.md) file for license rights and limitations
(MIT).

## Credit

This repository is based on [Darius Kazemi's](https://github.com/dariusk)
[repsitory "express-activitypub"](https://github.com/dariusk/express-activitypub).

