const { cmd } = require('../command'); // Original: _0x68584f(0x260,0x23f,0x252,0x28a)
const fetch = require('node-fetch'); // Original: _0xad656(-0x19b,-0x180,-0x1c0,-0x1ac)

cmd({
    pattern: "lyric", // Original: _0x24cc91[_0xad656(-0x1b3,-0x197,-0x196,-0x193)]=_0x68584f(0x215,0x22a,0x22c,0x1f5)
    alias: ["song"], // Original: _0x24cc91[_0x68584f(0x22f,0x22c,0x226,0x21e)]=[_0xad656(-0x183,-0x173,-0x160,-0x1a9)]
    desc: "Get song lyrics. Try again later.", // Original: _0x24cc91[_0xad656(-0x1c2,-0x1a8,-0x1c7,-0x1e7)]=_0xad656(-0x1a7,-0x198,-0x1cb,-0x17d)+_0xad656(-0x190,-0x190,-0x192,-0x179)+_0x68584f(0x25c,0x25f,0x256,0x260)
    category: "download", // Original: _0x24cc91[_0x68584f(0x235,0x223,0x216,0x254)]=_0x68584f(0x255,0x25d,0x225,0x246)
    use: '.lyric <song title>\nExample: *.lyric robbery*', // Original: _0x24cc91['use']=_0xad656(-0x1b0,-0x1ce,-0x185,-0x1cd)+'e>'
    filename: __filename
}, async (conn, mek, m, { text: query, prefix, command, reply }) => {
    try {
        if (!query) {
            // Original prompt combined from multiple obfuscated strings
            return reply(`Please provide a song title.\nExample: *${prefix}${command} robbery*`);
        }

        const encodedQuery = encodeURIComponent(query);
        const apiUrl = `https://zenz.biz.id/tools/genius?query=${encodedQuery}`; // Original URL construction

        const response = await fetch(apiUrl);
        const apiData = await response.json();

        // Original condition check: !apiData.result || !apiData.result.info || apiData.result.lyrics.length === 0
        if (!apiData.result || !apiData.result.info || apiData.result.lyrics.length === 0) {
            // Original: '❌ Lyrics not found.' or '❌ Failed to fetch lyrics. Try again later.'
            return reply("❌ Lyrics not found. Please try again with a different song title or later.");
        }

        const { title, artist, album, url, lyrics } = apiData.result;

        let lyricsMessage = `🎵 *${title}*\n👤 Artist: ${artist}\n💿 Album: ${album}\n🔗 ${url}\n\n📄 *Lyrics:*\n`;

        for (const line of lyrics) {
            // This part checks if the line is a section header or a regular lyric line
            if (line.type === 'header') { // Original: line[_0x5f4bb7(0x5d3,0x599,0x5be,0x594)] === _0x4f1afd['KKZxs']
                lyricsMessage += `\n\n*${line.text}*\n`; // Original: *'+_0x5b3d7d[_0x5f4bb7(0x5d0,0x5a0,0x5a7,0x5c8)]+'*\x0a
            } else {
                lyricsMessage += `${line.text}\n`; // Original: _0x5b3d7d[_0x52e038(0x4ae,0x49e,0x4a2,0x489)]+'\x0a
            }
        }

        lyricsMessage += `\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ MAFIA EMPEROR\n\n`; // Original powered by line

        await reply(lyricsMessage.trim());

    } catch (error) {
        console.error(error); // Original: console['error'](_0x23abdc)
        // Original error message complex, defaulting to common one.
        reply("❌ An error occurred while fetching the lyrics. Please try again later.");
    }
});
