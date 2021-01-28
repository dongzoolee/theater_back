const fs = require('fs');
const mysql2 = require('mysql2');
const updateRss = module.exports = {};
const connection = mysql2.createPool({
    host: process.env.MYSQL2_HOST,
    user: process.env.MYSQL2_USER,
    password: process.env.MYSQL2_PW,
    database: process.env.MYSQL2_DB
});
updateRss.write = async (result) => {
    const content = await formatContent(result.content);
    connection.query(`(SELECT mainCategory from mainCategory WHERE mainIdx = ?)
    UNION
    (SELECT subCategory from subCategory WHERE subIdx = ?)`, [result.main, result.sub], (err, res, fields) => {
        fs.readFile(__dirname + '../../react/public/rss.xml', (err, data) => {
            let arr = data.split('\n');
            let ret = arr.slice(0, arr.length - 2).join('\n');
            // req.body.main, req.body.sub, req.body.title, date, req.body.location, req.body.content
            ret += '<item>\n';
            ret += `<title>${result.title}</title>`;
            ret += `<link>https://blog.soga.ng/story/${result.insertId}</link>`;
            ret += `<description>${content}</description>`;
            ret += `<category>${res[0].mainCategory}</category>`;
            ret += `<category>${res[1].mainCategory}</category>`;
            ret += `<author>dongzoolee</author>`;
            ret += `<guid isPermaLink="true">https://blog.soga.ng/story/${result.insertId}</guid>`;
            ret += `<comments>https://blog.soga.ng/story/${result.insertId}#comments</comments>`;
            ret += `<pubDate>${getRssDate()}</pubDate>`;
            ret += `</item>\n</channel>\n</rss>`;
            fs.writeFile(__dirname + '../../react/public/rss.xml', ret, 'utf8', () => { })
        })
    })
}
function getRssDate() {
    // return new Promise((resolve, reject) => {
    const date = new Date().toString();
    const arr = date.split(' ');
    let ret = "";
    ret = arr[0] + ', ' + arr[2] + ' ' + arr[1] + ' ' + arr[3] + ' ' + arr[4] + '+0900';
    return ret;
    // resolve(ret);
    // })
}
function formatContent(data) {
    return new Promise((resolve, reject) => {
        data = data.replace(/<\/br>/g, '<br />');
        data = data.replace(/<br>/g, '<br />');
        data = data.replace(/data-tomark-pass="">/g, 'data-tomark-pass="" />');
        data = data.replace(/&nbsp;/g, ' ');
        resolve(data);
    })
}