import * as core from '@actions/core'
import run from '../debug'
import fs from 'fs'
import yaml from 'js-yaml'

beforeEach(() => {
  jest.resetModules()
  const doc = yaml.safeLoad(fs.readFileSync(__dirname + '/../action.yml', 'utf8'))
  Object.keys(doc.inputs).forEach(name => {
    const envVar = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`
    process.env[envVar] = doc.inputs[name]['default']
  })
})

afterEach(() => {
  const doc = yaml.safeLoad(fs.readFileSync(__dirname + '/../action.yml', 'utf8'))
  Object.keys(doc.inputs).forEach(name => {
    const envVar = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`
    delete process.env[envVar]
  })
})

describe('debug action debug messages', () => {
  it('outputs a debug message', async () => {
    const debugMock = jest.spyOn(core, 'debug')
    await run()
    expect(debugMock).toHaveBeenCalledWith('👋 Hello! You are an amazing person! 🙌')
  })
})

describe('debug action output', () => {
  it('sets the action output', async () => {
    const setOutputMock = jest.spyOn(core, 'setOutput')
    await run()
    expect(setOutputMock).toHaveBeenCalledWith('amazing-message', '👋 Hello! You are an amazing person! 🙌')
  })
})
