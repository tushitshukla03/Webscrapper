const axios = require('axios');
const cheerio = require("cheerio");
let { response } = require('express');
const express = require('express');

const app = express();
app.use(express.static("../public"));

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
})


async function getAsin(serach_query_url) {
    const { data: html } = await axios.get(serach_query_url, {
        headers: {
            'authority': 'www.amazon.in',
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
        }

    });
    const $ = cheerio.load(html);
    let asin_id = $('div[data-index="4"]').attr('data-asin');
    // console.log(html);
    console.log(asin_id);
    console.log("hello")
    // return Promise.resolve(asin_id);
    return asin_id
}


async function getPrices(serach_query_url) {
    const product_id = await getAsin(serach_query_url)
    const getProductUrl = (product_id) => `https://www.amazon.in/gp/product/ajax/ref=dp_aod_NEW_mbc?asin=${product_id}&m=&qid=1663327247&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=8-3&pc=dp&experienceId=aodAjaxMain`;
    // console.log(getProductUrl(product_id));
    const productUrl = getProductUrl(product_id);
    const { data: html } = await axios.get(productUrl, {
        headers: {
            'authority': 'www.amazon.in',
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
        }

    });
    // console.log(html);
    const $ = cheerio.load(html);
    let name = $('#aod-asin-title-text');
    best_price = $('.a-offscreen', '#pinned-offer-scroll-id')
    best_price = best_price.html()

    name = name.html()

    result = {
        name,
        best_price,
        offer: [],
    };
    console.log(result);
}


app.get('/process_get', function (req, res) {
        // trial = {
        //     search: `req.query.search`
        // };
        let user_query = req.query.search;
        console.log(user_query)
        const prefix = ""

        const serach_query_url = `https://www.amazon.in/s?k=${user_query}&crid=30DWC8PVFKOYM&sprefix=${prefix}%2Caps%2C220&ref=nb_sb_noss_1`

            
        // console.log(serach_query_url)
        getPrices(serach_query_url);
        res.end




        //     console.log(result)
        // }



});


var server = app.listen(3000, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("listen:3000");
    }

})


// let user_query = trial.search;
// console.log(user_query)
// const prefix = ""



// const serach_query_url = `https://www.amazon.in/s?k=${user_query}&crid=30DWC8PVFKOYM&sprefix=${prefix}%2Caps%2C220&ref=nb_sb_noss_1`

// const getProductUrl = (product_id) => `https://www.amazon.in/gp/product/ajax/ref=dp_aod_NEW_mbc?asin=${product_id}&m=&qid=1663327247&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=8-3&pc=dp&experienceId=aodAjaxMain`;

// async function getPrices(product_id) {
//     const productUrl = getProductUrl(product_id);
//     const { data: html } = await axios.get(productUrl, {
//         headers: {
//             'authority': 'www.amazon.in',
//             accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//             'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
//             'cache-control': 'no-cache',
//             pragma: 'no-cache',
//         }
//     });
//     // console.log(html);
//     const $ = cheerio.load(html);
//     let name = $('#aod-asin-title-text');
//     best_price = $('.a-offscreen', '#pinned-offer-scroll-id')
//     best_price = best_price.html()

//     name = name.html()

//     result = {
//         name,
//         best_price,
//         offer: [],
//     };

//     console.log(result)

