const puppeteer=require("puppeteer");
const urlFile=require("./json/Washing_Machine.json");
async function urlScreenshot(){
    const urlFile=require("./json/Washing_Machine.json");
    //const browser=await puppeteer.launch({headless:false});
    for(var i=0;i<urlFile.length;i++)
    {
        //console.log(urlFile[i]);
        const browser=await puppeteer.launch();
        const page=await browser.newPage();
        await page.goto(urlFile[i]);
        await page.screenshot({path:"./amazon_screenshot/"+(i+3737)+".jpg"});
        await browser.close();
    }
}
urlScreenshot();
