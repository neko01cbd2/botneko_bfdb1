let axios = require('axios');
let fs = require('fs');

let is_url = url=>/^http(s|):\/\//.test(url);
let stream_url = (url, type)=>axios.get(url, {
  responseType: 'arraybuffer'
}).then(res=> {
  let path = __dirname+'/cache/'+Date.now()+'.'+type;

  fs.writeFileSync(path, res.data);
  setTimeout(p=>fs.unlinkSync(p), 1000*60, path);

  return fs.createReadStream(path);
});

exports.config = {
  name: 'autodown3',
  version: '0.0.1',
  hasPermssion: 2,
  credits: 'DC-Nam',
  description: '.',
  commandCategory: 'Hệ thống support-bot',
  usages: 'autodown3',
  cooldowns: 3
};
exports.run = function(o) {};
exports.handleEvent = async function(o) {
  try {
    let a = o.event.args[0];
    let send = (msg, callback)=>o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
    let head = app=>`━━━〈 𝗔𝗨𝗧𝗢 𝗗𝗢𝗪𝗡 ${app.toUpperCase()} 〉━━━\n\n`;

    if (!is_url(a))return;
    if (/tiktok\.com/.test(a)) {
      let res = await axios.post(`https://www.tikwm.com/api/`, {
        url: a
      });
      if (res.data.code != 0)throw res;

      let tiktok = res.data.data;
      let attachment = [];

      if (typeof tiktok.images == 'object')for (let image_url of tiktok.images)attachment.push(await stream_url(image_url, 'jpg')); else attachment.push(await stream_url(tiktok.play, 'mp4'));

      send({
        body: `${head('𝗧𝗜𝗞𝗧𝗢𝗞')}➜ Tiêu Đề: ${tiktok.title}\n➜ Lượt Thích: ${tiktok.digg_count}\n➜ Thời Lượng: ${(tiktok.duration)} Giây\n➜ Tác Giả: ${tiktok.author.nickname} (${tiktok.author.unique_id})`,
        attachment,
      });
    } else
      if (/(facebook\.com|fb\.watch)/.test(a)) {
      let res = await axios.get(`https://goatbot.tk/api/facebook/dlvideo?url=${a}&apikey=HVr5vehjmllEncaK2guOAXPQ5IsFLn0A`);
        console.log(res.data.quality);
      send({
        body: `${head('𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞')}➜ Chất lượng: ${res.quality}`,
        attachment: await stream_url(res.url, 'mp4')
      });
        
    };
  }catch {};
};