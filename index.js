//  "scripts": {
//     "postinstall": "puppeteer install"

//   },
//===============
// "scripts": {
//     "test": "echo \"Error: no test specified\" && exit 1",
//     "dev": "nodemon index.js",
//     "postinstall": "puppeteer install"

//   },
//==============
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/scrape", async (req, res) => {
    try {
    
        
        //==============localy================
        //puppeteer not core
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
        });
        
        //==============================

        const page = await browser.newPage();
        await page.setUserAgent(//اعمل نفسك يوسر
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        );
        
        await page.goto("https://www.imdb.com/chart/toptv/?ref_=nv_tvv_250", { waitUntil: "networkidle2" });

        // تأخير إضافي للسماح بتحميل المحتوى الديناميكي
        await new Promise(resolve => setTimeout(resolve, 3000));


        // تجربة طباعة محتوى الصفحة للتحقق من أن البيانات موجودة
        // const pageContent = await page.content();
        // console.log(pageContent);

        // التحقق مما إذا كان العنصر موجودًا بالفعل
        // const exists = await page.$(".ipc-metadata-list-summary-item");
        // if (!exists) {
        //     throw new Error("العنصر h3 غير موجود في الصفحة");
        // }

        // استخراج العناوين
        const data = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".ipc-metadata-list-summary-item")).map(el => 

                {
                  // استخراج النص من العنصر
                  const text = el.querySelector(".ipc-title__text")?.innerText || "غير متوفر";
        
                  // تقسيم النص إلى رقم وعنوان إذا كان يحتوي على ". "
                  const parts = text.split(". ");
                //   const elements = [...el.querySelectorAll(".URyjV")];
          
                  // إنشاء كائن بالبيانات المستخرجة
                  return {
                    // year: elements[0]?.innerText.trim() || "غير متوفر", // أول عنصر
                    // time: elements[1]?.innerText.trim() || "غير متوفر", // ثاني عنصر
                    // age: elements[2]?.innerText.trim() || "غير متوفر", // ثالث
                      rank: parts.length > 1 ? parseInt(parts[0], 10) : null, // استخراج الرقم إذا وجد
                      title: parts.length > 1 ? parts[1] : text // استخراج العنوان إذا كان النمط صحيحًا
                  };
                
            }
        );
        });

        await browser.close();
        res.json({ success: true, data });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



//==================================================================scraping dynamic js  with deploy on railway
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
