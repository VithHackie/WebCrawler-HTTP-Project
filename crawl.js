const {JSDOM} = require('jsdom')

const crawlPage = async (currentURL, baseURL, pages)=>{
    
    const currURL = new URL(currentURL)
    const bURL = new URL(baseURL)

    if(currURL.hostname !== bURL.hostname){
        return pages
    }

    const normalizedCurrURL = normalizeURL(currentURL)
    
    if(pages[normalizedCurrURL] > 0){
        pages[normalizedCurrURL]++;
        return pages
    }
    else{
        pages[normalizedCurrURL] = 1;
    }

    console.log(`Actively Crawling ${normalizedCurrURL}`)

    try{
        const resp = await fetch(currentURL, {
            method : "GET",
            mode : "cors"
        })
        const contentType = resp.headers.get("content-type")
        if(resp.status > 399 || resp.status < 200){
            console.log(`The Website ${currentURL} can't be accessed, With an Error of Status Code ${resp.status}`)
            return pages
        }else if(!contentType.includes("text/html")){
            console.log(`Non HTML Response with Content Type ~ ${contentType} on the Page ${currentURL}`)
            return pages
        }
        
        const resHTML = await resp.text()

        const nextURLs = getURLsFromHTML(resHTML, baseURL)

        for(const nextURL of nextURLs){
            pages = await crawlPage(nextURL, baseURL, pages)
        }

    }catch(e){
        console.log(e.message)
    }
    return pages
}

function getURLsFromHTML(htmlBody, baseURL){

    URLarr = []
    const domObj = new JSDOM(htmlBody)
    const links = domObj.window.document.querySelectorAll("a")
    
    for(const link of links){
        try{
            
            if(link.href.slice(0, 1) !== '/'){
                new URL(link.href)
                URLarr.push(link.href)
            }else{
                const newURL = new URL(link.href, baseURL)
                URLarr.push(newURL.href)
            }
        }catch(e){
            console.log(e.message)
        }
    }
    
    return URLarr
}


function normalizeURL(urlStr){
    
    const urlObj = new URL(urlStr)
    if(urlObj.pathname == '/'){
        return `${urlObj.hostname}`
    }
    return `${urlObj.hostname}/${urlObj.pathname}`
}

module.exports = {normalizeURL, getURLsFromHTML, crawlPage}