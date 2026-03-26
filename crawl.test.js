const { getuid } = require('node:process')
const {normalizeURL, getURLsFromHTML} = require('./crawl')
const {test, expect} = require('@jest/globals')

test('normalizeURL strip protocol', ()=>{
    const inp = 'https://google.com/'
    const actual = normalizeURL(inp)
    const expectedOutput = 'google.com'
    expect(actual).toEqual(expectedOutput)
})

test('normalizeURL strip traling slash', ()=>{
    const inp = 'https://google.com/'
    const actual = normalizeURL(inp)
    const expectedOutput = 'google.com'
    expect(actual).toEqual(expectedOutput)
})

test('normalizeURL capitals', ()=>{
    const inp = 'https://GOOGLE.com/'
    const actual = normalizeURL(inp)
    const expectedOutput = 'google.com'
    expect(actual).toEqual(expectedOutput)
})

test('getURLFromHTML absolute url', ()=>{
    const inp = `
    <html>
        <head>
            <title>Hello There!</title>
        </head>
        <body>
            <h1>URLs</h1>
            <a id='link' href='https://mail.google.com/path'>Click Here</a>
        </body>
    </html>
    `
    const baseURL = `https://mail.google.com`
    const actual = getURLsFromHTML(inp, baseURL)
    const expectedOutput = ["https://mail.google.com/path"]
    expect(actual).toEqual(expectedOutput)

})

test('getURLFromHTML relative url', ()=>{
    const inp = `
    <html>
        <head>
            <title>Hello There!</title>
        </head>
        <body>
            <h1>URLs</h1>
            <a id='link' href='/path/'>Click Here</a>
        </body>
    </html>
    `
    const baseURL = `https://mail.google.com`
    const actual = getURLsFromHTML(inp, baseURL)
    const expectedOutput = ["https://mail.google.com/path/"]
    expect(actual).toEqual(expectedOutput)

})

test('getURLFromHTML multiple url', ()=>{
    const inp = `
    <html>
        <head>
            <title>Hello There!</title>
        </head>
        <body>
            <h1>URLs</h1>
            <a id='link' href='https://mail.google.com/path/'>Click Here</a>
            <a id='link' href='/path/'>Click Here</a>
            <a id='link' href='https://hotmail.com/index/'>Click Here</a>
            <a id='link' href='/views/images/'>Click Here</a>
        </body>
    </html>
    `
    const baseURL = `https://mail.google.com`
    const actual = getURLsFromHTML(inp, baseURL)
    const expectedOutput = ["https://mail.google.com/path/", "https://mail.google.com/path/", "https://hotmail.com/index/", "https://mail.google.com/views/images/"]
    expect(actual).toEqual(expectedOutput)

})


test('getURLFromHTML invalid url', ()=>{
    const inp = `
    <html>
        <head>
            <title>Hello There!</title>
        </head>
        <body>
            <h1>URLs</h1>
            <a id='link' href='invalid'>Click Here</a>
        </body>
    </html>
    `
    const baseURL = `https://mail.google.com`
    const actual = getURLsFromHTML(inp, baseURL)
    const expectedOutput = []
    expect(actual).toEqual(expectedOutput)

})