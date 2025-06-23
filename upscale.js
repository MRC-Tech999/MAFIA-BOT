const fetch = require("node-fetch");
const FormData = require("form-data");
const {
  cmd
} = require("../command");
cmd({
  'pattern': 'hd',
  'alias': ["remini", "tohd"],
  'desc': "Clean up and enhance photos using our top-tier AI services.", // Mafia-style description
  'category': "tools",
  'filename': __filename,
  'use': ".hd (reply to an image)"
}, async (conn, mek, m, {
  reply
}) => {
  await conn.sendMessage(mek.key.remoteJid, {
    'react': {
      'text': '⏳', // Keeping the hourglass for processing
      'key': mek.key
    }
  });
  try {
    let quotedMsg = mek.quoted || mek;
    let mimetype = (quotedMsg.msg || quotedMsg).mimetype || quotedMsg.mimetype || quotedMsg.mediaType || '';
    if (!mimetype) {
      throw "📸 *Listen up, wise guy!* You gotta send me the "mugshot" you want cleaned up. Reply to an image, capiche?"; // Mafia-style prompt
    }
    if (!/image\/(jpe?g|png)/.test(mimetype)) {
      throw "❌ *Fuggedaboutit!* That ain't the right kind of picture. We only deal with JPEGs or PNGs here."; // Mafia-style format error
    }
    let imageBuffer = await quotedMsg.download?.();
    if (!imageBuffer) {
      throw "❌ *Something went south!* Couldn't get my hands on that image. Looks like a botched job."; // Mafia-style download error
    }
    const catboxUrl = await uploadToCatbox(imageBuffer);
    const apiUrl = "https://zenz.biz.id/tools/remini?url=" + encodeURIComponent(catboxUrl);
    const apiResponse = await fetch(apiUrl);
    if (!apiResponse.ok) {
      throw "❌ *My contacts are busy!* Error reaching the enhancement service."; // Mafia-style API access error
    }
    const apiData = await apiResponse.json();
    if (!apiData.status || !apiData.result?.["result_url"]) {
      throw "❌ *Bad intel!* Got a funny response from the operation. Couldn't enhance the picture."; // Mafia-style invalid API response
    }
    const enhancedImageBuffer = await fetch(apiData.result.result_url).then(res => res.buffer());
    if (!enhancedImageBuffer || enhancedImageBuffer.length === 0x0) {
      throw "❌ *The job got messed up!* Failed to get the cleaned-up image."; // Mafia-style enhanced image fetch error
    }
    await conn.sendMessage(mek.chat, {
      'image': enhancedImageBuffer,
      'caption': "✅ *Mugshot cleaned up! Looking sharp, boss.*\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*" // Mafia-style success message with branding
    }, {
      'quoted': mek
    });
  } catch (error) {
    await conn.sendMessage(mek.chat, {
      'react': {
        'text': '❌',
        'key': mek.key
      }
    });
    console.error(error);
    reply(typeof error === 'string' ? error : "🚨 *Fuggedaboutit! An unexpected problem popped up, boss.* Better try again, or you'll be sleeping with the fishes.\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*"); // Mafia-style general error with branding
  }
});
async function uploadToCatbox(fileBuffer) {
  const formData = new FormData();
  formData.append("reqtype", "fileupload");
  formData.append('fileToUpload', fileBuffer, "image.jpg");
  const uploadResponse = await fetch("https://catbox.moe/user/api.php", {
    'method': "POST",
    'body': formData
  });
  const uploadText = await uploadResponse.text();
  if (!uploadText.startsWith('https://')) {
    throw "❌ *Couldn't hide the evidence!* Error while uploading image to Catbox."; // Mafia-style Catbox upload error
  }
  return uploadText.trim();
}
