const puppeteer=require("puppeteer");
function run(pagesToScrape){
    return new Promise(async(resolve,reject)=>{
        const browser=await puppeteer.launch({headless:false});
        const page=await browser.newPage();
        await page.goto("https://www.amazon.in/s?k=earphones&ref=nb_sb_noss_2",{
            waitUntil:'networkidle2'
        });
        let currentPage=1;
        let urls=[];
        while(currentPage<=pagesToScrape){
            let newUrls=await page.evaluate(()=>{
                let results=[];
                let nodeList=document.querySelectorAll(`h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2>a.a-link-normal.a-text-normal`);
                for(var i=0;i<nodeList.length;i++)
                    {
                        results.push({
                            url:nodeList[i].getAttribute('href'),
                            product:nodeList.innerText,
                        });
                    }
                    return(results);
                });
                urls=urls.concat(newUrls);
                if(currentPage<pagesToScrape){
                    await Promise.all([
                        await page.click('li.a-last>a'),
                        await page.waitForSelector('h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2>a.a-link-normal.a-text-normal')
                    ])
                }
                currentPage++;
            }
            await browser.close();
            return(resolve(urls));
        })
    }
run(5).then(console.log);