const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const { default: makeWASocket, useMultiFileAuthState, delay, Browsers, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');

const { upload } = require('./mega');

// Newsletter query ID
const FOLLOW_QUERY_ID = "7871414976211147";

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

// Newsletter follow function
async function FollowNewsletter(sock, jid) {
    try {
        await sock.query({
            tag: 'iq',
            attrs: {
                id: sock.generateMessageTag(),
                type: 'get',
                xmlns: 'w:mex',
                to: 's.whatsapp.net',
            },
            content: [{
                tag: 'query',
                attrs: { 'query_id': FOLLOW_QUERY_ID },
                content: Buffer.from(JSON.stringify({
                    variables: {
                        '120363403004432866@newsletter': jid
                    }
                }))
            }]
        });
        console.log('Successfully followed newsletter:', jid);
    } catch (error) {
        console.error('Error following newsletter:', error);
    }
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    
    async function JAWAD_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: ["Ubuntu", "Chrome", "20.0.04"]
            });
            
            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            sock.ev.on('creds.update', saveCreds);
            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                
                if (connection == "open") {
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    let rf = __dirname + `/temp/${id}/creds.json`;
                    
                    function generateRandomText() {
                        const prefix = "3EB";
                        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        let randomText = prefix;
                        for (let i = prefix.length; i < 22; i++) {
                            const randomIndex = Math.floor(Math.random() * characters.length);
                            randomText += characters.charAt(randomIndex);
                        }
                        return randomText;
                    }
                    
                    const randomText = generateRandomText();
                    try {
                        const { upload } = require('./mega');
                        const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
                        const string_session = mega_url.replace('https://mega.nz/file/', '');
                        let md = "IK~" + string_session;
                        
                        // 1. First send session ID
                        let codeMsg = await sock.sendMessage(sock.user.id, { text: md });
                        
                        // 2. Then send welcome message
                        await sock.sendMessage(
                            sock.user.id,
                            {
                                text: ' *𝛃ɑᥣ๏cɧ-ϻ𝛛 𝛅𝛆𝛅𝛅i๏𝛈 i𝛛 * \n  \n  *ʈɧi𝛅 𝛅𝛆𝛅𝛅i๏𝛈 i𝛛 i𝛅 𝞄𝛈iq𝛍𝛆 & C๏𝛈fi𝛛𝛆𝛈ʈiɑᥣ!*  \n  *𝛈𝛆𝛎𝛆ɽ 𝛅ɧɑɽe iʈ wiʈɧ ɑ𝛈ɣ๏𝛈𝛆, 𝛈๏ʈ 𝛆𝛎𝛆𝛈 fɽi𝛆𝛈𝛛𝛅.*  \n *𝞄𝛅𝛆 ๏𝛈ᥣɣ f๏ɽ 𝛛𝛆pᥣ๏ɣi𝛈g ɣ๏𝛍ɽ 𝛃ɑᥣ๏cɧ-ϻ𝛛 𝛃๏ʈ.*\n  \n *Cɧɑ𝛈𝛈𝛆ᥣ:*  \n   https://whatsapp.com/channel/0029Vb7B2PMDZ4LUrhrNBa3A\n│  \n *𝛃ɑᥣ๏cɧ-ϻ𝛛 giʈɧ𝛍𝛃 ɽ𝛆p๏:*  \n   https://github.com/powerseventel3-ai/GHAFFAR-MD\n  \n *Powered by GhaffarTech *'
                            },
                            { quoted: codeMsg }
                        );
                        
                        // 3. Follow only one channel
                        const channelJid = '120363403004432866@newsletter'; // <-- only one JID
                        await FollowNewsletter(sock, channelJid);
                        
                    } catch (e) {
                        let errorMsg = await sock.sendMessage(sock.user.id, { text: e.toString() });
                        let desc = `*Don't Share with anyone this code use for deploying JAWAD MD*\n\n ◦ *Github:* https://github.com/JawadTechXD/KHAN-MD`;
                        await sock.sendMessage(sock.user.id, { text: desc }, { quoted: errorMsg });
                    }
                    
                    await delay(10);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`👤 ${sock.user.id} 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 ✅ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...`);
                    await delay(10);
                    process.exit();
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10);
                    JAWAD_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restarted", err);
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "❗ Service Unavailable" });
            }
        }
    }
    return await JAWAD_MD_PAIR_CODE();
});

module.exports = router;
