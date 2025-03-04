//===========================================================scrape video===============
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
//فى الصفحة الرئيسية انت عامل سكراب لعناصر منهم العنوان فهتاخد العنوان ده وتبعته فى  
// scrape/......
//title= مشاهدة مسلسل كذب أبيض موسم 1 حلقة 4


app.get("/scrape/:title", async (req, res) => {
    const title= req.params.title
    const y = title.replace(/ /g, "-"); 

    const url="https://vbn1.t4ce4ma.shop/watch/"+y
  
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
        });

        const page = await browser.newPage();

        
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");

// ================================================================================================================================

//انتقال الى الصفحة التى بها المسلسل 
      await page.goto
      (url
    , { waitUntil: "domcontentloaded" })//domcontentloaded اسرع ,networkidle2 الصفحة كلها
           
  
      //=======================================================================================================================
    
//==================================================================================================================
await page.waitForSelector('.Inner--WatchServersEmbed iframe');  // انتظر تحميل iframe

const data = await page.evaluate(() => { // ارجاع src الفيديو
    const iframe = document.querySelector('.Inner--WatchServersEmbed iframe');
    return {
        videoSrc: iframe ? iframe.src : null
    };
});

//=======================================================================================================================
        await browser.close();
        res.json({ success: true, data });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





















//=========================================================whole imdb ===============
// const express = require("express");
// const puppeteer = require("puppeteer");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// const PORT = process.env.PORT || 3000;

// app.get("/scrape", async (req, res) => {
//     try {
//         const browser = await puppeteer.launch({
//             headless: "new",
//             args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
//         });

//         const page = await browser.newPage();

        
//         await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");

// // ==============================================================


//       await page.goto("https://www.imdb.com/chart/top/?ref_=nv_mv_250", { waitUntil: "networkidle2" })//domcontentloaded ,networkidle2 الصفحة كلها
           
  
//       //=======================================================================================================================
    
// //==================================================================================================================
//         const data = await page.evaluate(() => {
//             return [...document.querySelectorAll(".ipc-metadata-list-summary-item")].map((el, index)  => {
//                     const text = el.querySelector(".ipc-title__text")?.innerText || "غير متوفر";
//                     const parts = text.split(". ");
//                     const elements = [...el.querySelectorAll(".URyjV")];

//                     return {
//                         year: elements[0]?.innerText.trim() || "غير متوفر",
//                         time: elements[1]?.innerText.trim() || "غير متوفر",
//                         age: elements[2]?.innerText.trim() || "غير متوفر",
//                         rank: parts.length > 1 ? parseInt(parts[0], 10) : null,
//                         title: parts.length > 1 ? parts[1] : text
//                     };
//                 });
//         });

//         await browser.close();
//         res.json({ success: true, data });

//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));









































//==================================================================scraping bbc dynamic js  with deploy on railway 
// //  "scripts": {
// //     "postinstall": "puppeteer install"

// //   },
// const express = require("express");
// const puppeteer = require("puppeteer");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// const PORT = process.env.PORT || 3000;

// app.get("/scrape", async (req, res) => {
//     try {
    
        
//         //==============localy================
//         //puppeteer not core
//         const browser = await puppeteer.launch({
//             headless: "new",
//             args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
//         });
        
//         //==============================

//         const page = await browser.newPage();
//         await page.goto("https://www.bbc.com/news", { waitUntil: "networkidle2" });

//         // تأخير إضافي للسماح بتحميل المحتوى الديناميكي
//         await new Promise(resolve => setTimeout(resolve, 3000));


//         // تجربة طباعة محتوى الصفحة للتحقق من أن البيانات موجودة
//         // const pageContent = await page.content();
//         // console.log(pageContent);

//         // التحقق مما إذا كان العنصر موجودًا بالفعل
//         const exists = await page.$(".sc-530fb3d6-1");
//         if (!exists) {
//             throw new Error("العنصر h3 غير موجود في الصفحة");
//         }

//         // استخراج العناوين
//         const data = await page.evaluate(() => {
//             return Array.from(document.querySelectorAll(".sc-530fb3d6-1")).map(el => ({
//                 title: el.querySelector(".sc-87075214-3")?.innerText || "غير متوفر",
//             }));
//         });

//         await browser.close();
//         res.json({ success: true, data });

//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//==================================================static scrape==============
// const express = require("express");
// const axios = require("axios");
// const cheerio = require("cheerio");
// const cors = require("cors");

// const app = express();
// app.use(cors()); // السماح بالوصول من أي دومين

// const PORT = process.env.PORT || 3000;

// app.get("/scrape", async (req, res) => {
//     try {
//         const url = "https://quotes.toscrape.com/";
//         const response = await axios.get(url);
//         const $ = cheerio.load(response.data);

//         // استخراج البيانات (الاقتباسات)
//         let data = [];
//         $(".quote").each((index, element) => {
//             let quote = $(element).find(".text").text();
//             let author = $(element).find(".author").text();
//             data.push({ quote, author });
//         });

//         res.json({ success: true, data });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
