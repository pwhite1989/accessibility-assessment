#!/usr/bin/env node
const pug = require('pug')
const sass = require('node-sass')
const fs = require('fs')
const path = require('path')

const preocessInputData = new Promise((res, rej) => {
    const stdin = process.openStdin();

    let data = "";

    stdin.on('data', function (chunk) {
        data += chunk;
    });

    stdin.on('end', function () {
        res(data)
    });
})

const prepareModel = original => {
    let errorCountReducer = (acc, cur) => acc + cur.summary.errorCount;
    const tools = original.tools.map(x => ({
        total: x.summary.errorCount,
        pageCount: x.summary.pageCount,
        techName: x.tool,
        version: x.version,
        name: x.name,
        paths: x.paths
    }))
    const totalErrorCount = original.tools.reduce(errorCountReducer, 0)

    return Object.assign({}, {original, totalErrorCount, tools})
}

const includeJs = model => (new Promise((res, rej) => {
    fs.readFile(path.join(__dirname, 'assets', 'report.js'), 'utf8', (err, contents) => {
        if (err) {
            rej(err)
        } else {
            const updatedModel = Object.assign({}, model);
            updatedModel.assets = Object.assign({}, model.assets, {javascript: contents})
            res(updatedModel)
        }
    })
}))

const includeSass = model => (new Promise((res, rej) => {
    sass.render({
            file: 'assets/style.scss'
        },
        (err, result) => {
            if (err) {
                rej(err)
            } else {
                res(result.css.toString().split('\n').join(''))
            }
        })
}))
    .then(stylesheet => Object.assign(
        {},
        model,

        {
            assets: Object.assign(
                {},
                model.assets,
                {stylesheet}
            )
        }))

preocessInputData
    .then(JSON.parse)
    .then(prepareModel)
    .then(includeSass)
    .then(includeJs)
    .then(model => pug.renderFile('template.pug', model))
    .then(console.log)
    .catch(e => {
        console.error('Something went wrong when preparing report')
        console.error('error was [%s] with message [%s]', e.name, e.message)
        console.error(e.stack)
        process.exit(1)
    })
