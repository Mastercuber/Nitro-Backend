import { createSignature, verifySignature } from '.'
import Factory from '../../seed/factories'
import { host, login } from '../../jest/helpers'
import { GraphQLClient } from 'graphql-request'
import crypto from 'crypto'
import { expect } from 'chai'
const factory = Factory()

describe('Signature creation and verification', () => {
  let user = null
  let client = null
  const TEST_ALGORITHMS = ['rsa-md4', 'rsa-md5', 'rsa-sha1', 'rsa-sha256', 'rsa-sha512']
  const headers = {
    'Date': '2019-03-08T14:35:45.759Z',
    'Host': 'democracy-app.de',
    'Content-Type': 'application/json'
  }

  beforeEach(async () => {
    await factory.create('User', {
      'slug': 'lea',
      'name': 'lea',
      'email': 'user@example.org',
      'password': 'swordfish'
    })
    const headers = await login({ email: 'user@example.org', password: 'swordfish' })
    client = new GraphQLClient(host, { headers })
    const result = await client.request(`query {
      User(slug: "lea") {
        privateKey
        publicKey
      }
    }`)
    user = result.User[0]
  })

  afterEach(async () => {
    await factory.cleanDatabase()
  })

  describe('Signature creation', () => {
    for (let length = TEST_ALGORITHMS.length, index = 0; length > index; index++) {
      it(`creates a Signature with hashing algorithm -> ${TEST_ALGORITHMS[index]}`, () => {
        const httpSignature = createSignature(user.privateKey, 'https://human-connection.org/activitypub/users/lea#main-key', 'https://democracy-app.de/activitypub/users/max/inbox', headers, TEST_ALGORITHMS[index])
        console.log(`http signature = ${httpSignature}`)
        assertKeys(TEST_ALGORITHMS[index], createSignatureToAssert(TEST_ALGORITHMS[index], user.privateKey), httpSignature)
      })
    }
  })

  describe('Signature verification', () => {
    for (let length = TEST_ALGORITHMS.length, index = 0; length > index; index++) {
      it(`verifies a Signature hashed with algorithm -> ${TEST_ALGORITHMS[index]}`, async () => {
        const signatureB64 = createSignatureToAssert(TEST_ALGORITHMS[index], user.privateKey)
        headers['Signature'] = `keyId="http://localhost:4123/activitypub/users/lea",algorithm="${TEST_ALGORITHMS[index]}",headers="(request-target) date host content-type",signature="${signatureB64}"`
        const isVerified = await verifySignature('https://democracy-app.de/activitypub/users/max/inbox', headers)
        expect(isVerified).to.equal(true)
      })
    }
  })
})

function assertKeys (algorithm, signatureB64, httpSignature) {
  expect(httpSignature).to.contain('keyId="https://human-connection.org/activitypub/users/lea#main-key"')
  expect(httpSignature).to.contain('algorithm="' + algorithm + '"')
  expect(httpSignature).to.contain('headers="(request-target) date host content-type"')
  expect(httpSignature).to.contain('signature="' + signatureB64 + '"')
}

function createSignatureToAssert (algorithm, privateKey) {
  const signer = crypto.createSign(algorithm)
  signer.update('(request-target): post /activitypub/users/max/inbox\ndate: 2019-03-08T14:35:45.759Z\nhost: democracy-app.de\ncontent-type: application/json')
  return signer.sign({ key: privateKey, passphrase: 'a7dsf78sadg87ad87sfagsadg78' }, 'base64')
}
