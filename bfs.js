'use-strict';

//Create queue
let queue = [];
import { launch } from 'puppeteer';

const url = 'http://portaldatransparencia.publicsoft.com.br/sistemas/ContabilidadePublica/views/views_control/index.php?cidade=O5w=&uf=PB';

const run = async (url) => {
    const browser = await launch({args: ['--no-sandbox', '--start-fullscreen'], headless: false});
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080});
    await page.goto(url);

    return browser.close();
};


//Maintains list of visited pages
let visited_list = [];


// Crawl the page and populate the queue with newly found URLs
function crawl(url) {
    visited_list.push(url);

    if (queue.length > 99) {
        return;
    }
    let urls = [];

    // extract urls and components proccess
    //for (let index = 0; index < 3; index++) {
      //  urls.push("www.facebook" + index + ".net");
    //}



    for (let index = 0; index < urls.length; index++) {
        let flag = 0;
        // Complete relative URLs and strip trailing slash
        let completeUrl = urls[index]; //urljoin(url, i["href"]).rstrip('/')

        // Check if the URL already exists in the queue
        for (let j in queue) {
            if (j == completeUrl) {
                flag = 1;
                break;
            }
        }

        // If not found in queue
        if (flag == 0) {
            if (queue.length > 99) {
                return;
            }

            if (!visited_list.includes(completeUrl)) {
                queue.push(completeUrl);
            }
        }
    }

    //Pop one URL from the queue from the left side so that it can be crawled
    let current = queue.shift();

    //Recursive call to crawl until the queue is populated with 100 URLs
    crawl(current);

}


crawl("www.google.com.br");

// Print queue
for(let j in queue){
    console.log(j);
}

console.log();
console.log("==============");
console.log( "Pages crawled:");
console.log("==============");
console.log();

// Print list of visited pages
for(let j in visited_list){
    console.log(j);

}
