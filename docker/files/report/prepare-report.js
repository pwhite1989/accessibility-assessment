#!/usr/bin/env node
const pug = require('pug')

const preocessInputData = new Promise((res, rej) => {
    const stdin = process.openStdin();

    let data = "";

    stdin.on('data', function(chunk) {
        data += chunk;
    });

    stdin.on('end', function() {
        res(data)
    });
})

preocessInputData
    .then(JSON.parse)
    .then(data => ({name: data.testSuite}))
    .then(model => pug.renderFile('template.pug', model))
    .then(console.log)
    .catch(e => {
        console.error('Something went wrong when preparing report')
        console.error('error was [%s] with message [%s]', e.type, e.message)
        console.error(e.stack)
        process.exit(1)
    })
