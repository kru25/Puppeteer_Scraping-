const puppeteer=require("puppeteer");
const fs=require("fs");
async function searchItem(){
        const browser=await puppeteer.launch({headless:false});
        const page=await browser.newPage();
        await page.goto("https://www.amazon.in/",{
            waitUntil:'networkidle2'
        });
        const searchList=["Washing Machine","Dresses","Purse","Earphones"];
        await page.waitForSelector('input[name=field-keywords]');
        let allUrls=[];
        for(var i=0;i<searchList.length;i++)
        {
            await page.type('input[name=field-keywords]', searchList[i]);
            await page.click('input[type="submit"]');
            await page.waitForSelector('h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2>a.a-link-normal.a-text-normal');
            let urlList=scrape(5,page);
            allUrls=allUrls.concat(urlList);
        }
        await browser.close();
        fs.writeFile("./json/allurls.json",JSON.stringify(allUrls,null,2),
        (err)=>err?console.error("Data not written",err):console.log("Data written!!"));
    }
    searchItem();

async function scrape(pagesToScrape,page){
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
                    product:nodeList[i].innerText,
                });
            }
        });
        urls=urls.concat(newUrls);
        if(currentPage<pagesToScrape){
            await Promise.all([
                await page.click('li.a-last>a'),
                await page.waitForSelector('li.a-last>a')
             ])
            }
            currentPage++;
            }
            return(urls);
        }
