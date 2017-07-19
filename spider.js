require('babel-core/register')
const process = require('process')

const [cmd, ...args] = process.argv.slice(2)
require(`./spider/${cmd}-ds`)(args)