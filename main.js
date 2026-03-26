const {crawlPage} = require("./crawl")

const main =  async () => {

    if(process.argv.length < 3){
        console.log("No Website Provided!")
        process.exit(1)
    }
    if(process.argv.length > 3){
        console.log("To Many Arguments are Given!")
        process.exit(1)
    }

    const baseURL = process.argv[2]


    console.log(`Starting The Crawl on Website ~ ${baseURL}`)

    const pages = await crawlPage(baseURL, baseURL, {})

    for(const page of Object.entries(pages)){
        console.log(page)
    }

}

main()