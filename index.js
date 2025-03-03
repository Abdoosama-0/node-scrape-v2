// apt-get update && apt-get install -y libnss3 libatk1.0-0 libx11-xcb1

const express = require("express");
const puppeteer = require("puppeteer-core");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/scrape", async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome",
            headless: true, // تأكد من أنه يعمل بدون واجهة رسومية
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--single-process"
            ],
        });
        
        //==============localy================
        ////puppeteer not core
        // const browser = await puppeteer.launch({
        //     headless: "new",
        //     args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
        // });
        
        //==============================

        const page = await browser.newPage();
        await page.goto("https://www.bbc.com/news", { waitUntil: "networkidle2" });

        // تأخير إضافي للسماح بتحميل المحتوى الديناميكي
        await new Promise(resolve => setTimeout(resolve, 3000));


        // تجربة طباعة محتوى الصفحة للتحقق من أن البيانات موجودة
        // const pageContent = await page.content();
        // console.log(pageContent);

        // التحقق مما إذا كان العنصر موجودًا بالفعل
        const exists = await page.$(".sc-530fb3d6-1");
        if (!exists) {
            throw new Error("العنصر h3 غير موجود في الصفحة");
        }

        // استخراج العناوين
        const data = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".sc-530fb3d6-1")).map(el => ({
                title: el.querySelector(".sc-87075214-3")?.innerText || "غير متوفر",
            }));
        });

        await browser.close();
        res.json({ success: true, data });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//==================================================================scraping js
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
//             args: ["--no-sandbox", "--disable-setuid-sandbox"],
//         });

//         const page = await browser.newPage();
//         await page.goto("https://www.bbc.com/news", { waitUntil: "networkidle2" });

//         // تأخير إضافي للسماح بتحميل المحتوى الديناميكي
//         await new Promise(resolve => setTimeout(resolve, 3000));


//         // تجربة طباعة محتوى الصفحة للتحقق من أن البيانات موجودة
//         // const pageContent = await page.content();
//         // console.log(pageContent);

//         // التحقق مما إذا كان العنصر موجودًا بالفعل
//         const exists = await page.$("span");
//         if (!exists) {
//             throw new Error("العنصر h3 غير موجود في الصفحة");
//         }

//         // استخراج العناوين
//         const data = await page.evaluate(() => {
//             return Array.from(document.querySelectorAll("span")).map(el => ({
//                 title: el.innerText,
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
