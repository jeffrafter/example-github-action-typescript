import * as github from '@actions/github'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import nock from 'nock'
import run from '../thanks'

beforeEach(() => {
  jest.resetModules()

  github.context.payload = {
    action: 'opened',
    issue: {
      number: 1,
    },
  } as WebhookPayload
})

describe('thanks action', () => {
  it('adds a thanks comment and heart reaction', async () => {
    process.env['INPUT_THANKS-MESSAGE'] = 'Thanks for opening an issue ❤!'
    process.env['GITHUB_REPOSITORY'] = 'example/repository'
    process.env['GITHUB_TOKEN'] = '12345'

    nock('https://api.github.com')
      .post('/repos/example/repository/issues/1/comments', body => body.body === 'Thanks for opening an issue ❤!')
      .reply(200, {url: 'https://github.com/example/repository/issues/1#comment'})

    nock('https://api.github.com')
      .post('/repos/example/repository/issues/1/reactions', body => body.content === 'heart')
      .reply(200, {content: 'heart'})

    await run()
  })
})
