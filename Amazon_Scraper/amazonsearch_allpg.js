const puppeteer=require("puppeteer");
const fs=require("fs");
async function searchItem(){
        const browser=await puppeteer.launch({headless:false});
        const page=await browser.newPage();
        await page.goto("https://www.amazon.in/",{
            waitUntil:'networkidle2'
        });
        const searchList=["Laptops"];
        await page.waitForSelector('input[name=field-keywords]');
        let allUrls=[];
        for(var i=0;i<searchList.length;i++)
        {
            await page.type('input[name=field-keywords]', searchList[i]);
            await page.click('input[type="submit"]');
            await page.waitForSelector('h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2>a.a-link-normal.a-text-normal');
            let urlList=await scrape(page);
            allUrls=allUrls.concat(urlList);
            await page.goto("https://www.amazon.in/",{
                waitUntil:'networkidle2'});
        }
        await browser.close();
        console.log(allUrls);
        fs.writeFile("./json/laptop.json",JSON.stringify(allUrls,null,2),
        (err)=>err?console.error("Data not written",err):console.log("Data written!!"));
    }
    searchItem();

 async function scrape(page){
     await page.waitForSelector('li.a-last>a');
     await page.waitForSelector('h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2>a.a-link-normal.a-text-normal');
     let pageNo=await page.evaluate(()=>{
         let totalPg=document.querySelector("li[aria-disabled='true']").innerText;
         return(totalPg);
     });
      let urls=[];
      let currentPage=1;
       while(currentPage<=pageNo){
           let newUrls=await page.evaluate(()=>{
               let results=[];
               let nodeList=document.querySelectorAll(`h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2>a.a-link-normal.a-text-normal`);
               for(var i=0;i<nodeList.length;i++)
               {
                results.push(nodeList[i].getAttribute("href"));
            }
            return(results);
        });
        urls=urls.concat(newUrls);
        if(currentPage<pageNo-1){
            await Promise.all([
                //await page.waitForSelector('li.a-last>a'),
                await page.click('li.a-last>a'),
                await page.waitForSelector('li.a-last>a'),
             ]);
            }
            currentPage++;
            await page.waitFor(1000);
            await page.waitForSelector("h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2>a.a-link-normal.a-text-normal");
            }
            let amazonUrl=[];
            const amazon="www.amazon.in";
            for(var i=0;i<urls.length;i++)
            {
              amazonUrl.push(amazon.concat(urls[i]));
            }
            return(amazonUrl);
        }
