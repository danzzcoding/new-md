require('./set.js')

/**
* THANKS TO...
* Adiwajshing (Created Baileys)
* Danzz Coding (My Self)
*/

// Module
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
var fs = require('fs')
var axios = require('axios')
var path = require('path')
var util = require('util')
var chalk = require('chalk')
var os = require('os')
var ms = require('ms')
var timeZone = require('moment-timezone')
var speedtest = require('performance-now')
var ffmpeg = require('fluent-ffmpeg')
var { Primbon } = require('scrape-primbon')
var primbon = new Primbon()
var { performance } = require('perf_hooks')
var { JSDOM } = require('jsdom')
var { spawn, exec, execSync } = require("child_process")

// lib
var { smsg, formatp, tanggal, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom, getGroupAdmins } = require('./lib/myfunc')

// Time
var time = timeZone.tz('Asia/Jakarta')
.format('HH:mm:ss')
/*.format2('mm:ss:HH')*/

module.exports = danzz = async (danzz, m, store, chatUpdate) => {
	try {
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
        var budy = (typeof m.text == 'string' ? m.text : '')
        var prefix = prefa ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : prefa ?? global.prefix
        const isCmd = body.startsWith(prefix)
        const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const text = q = url = args.join(" ")
        const fatkuns = (m.quoted || m)
        const quoted = (fatkuns.mtype == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]] : (fatkuns.mtype == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] : (fatkuns.mtype == 'product') ? fatkuns[Object.keys(fatkuns)[0]] : m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ''
        const qmsg = (quoted.msg || quoted)
        const from = m.chat
        const isMedia = /image|video|sticker|audio/.test(m.quoted ? m.quoted.mtype : m.mtype)
        const isVideo = (m.quoted ? m.quoted.mtype : m.mtype) == 'videoMessage'
        const isImage = (m.quoted ? m.quoted.mtype : m.mtype) == 'imageMessage'
        const pushname = m.pushName || "No Name"
        const botNumber = await danzz.decodeJid(danzz.user.id)
        const isOwner = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const myNumber = m.sender == botNumber ? true : false
        
        // Group
        const groupMetadata = m.isGroup ? await danzz.groupMetadata(m.chat).catch(e => {}) : ''
        const groupName = m.isGroup ? groupMetadata.subject : ''
        const participants = m.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
    	const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
    	const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
    	const isPremium = isOwner || global.premium.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || false
    	
    	// Limit
    	try {
            let isNumber = x => typeof x === 'number' && !isNaN(x)
            let limitUser = isPremium ? global.limitawal.premium : global.limitawal.free
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object') global.db.data.users[m.sender] = {}
            
            // Afk
            if (user) {
                if (!isNumber(user.afkTime)) user.afkTime = -1
                if (!('afkReason' in user)) user.afkReason = ''
                if (!isNumber(user.limit)) user.limit = limitUser
            } else global.db.data.users[m.sender] = {
                afkTime: -1,
                afkReason: '',
                limit: limitUser,
            }
    
            let chats = global.db.data.chats[m.chat]
            if (typeof chats !== 'object') global.db.data.chats[m.chat] = {}
            if (chats) {
                if (!('mute' in chats)) chats.mute = false
                if (!('antilink' in chats)) chats.antilink = true
            } else global.db.data.chats[m.chat] = {
                mute: false,
                antilink: true,
            }
            
            //reset limit
        	let cron = require('node-cron')
        	cron.schedule('00 12 * * *', () => {
            let user = Object.keys(global.db.data.users)
            let limitUser = isPremium ? global.limitawal.premium : global.limitawal.free
            for (let jid of user) global.db.data.users[jid].limit = limitUser
            console.log('Reseted Limit')
        	}, {
            scheduled: true,
            timezone: "Asia/Jakarta"
        })
		
	    let setting = global.db.data.settings[botNumber]
        if (typeof setting !== 'object') global.db.data.settings[botNumber] = {}
	    if (setting) {
		if (!isNumber(setting.status)) setting.status = 0
		if (!('autobio' in setting)) setting.autobio = true
		if (!('templateImage' in setting)) setting.templateImage = true
		if (!('templateVideo' in setting)) setting.templateVideo = false
		if (!('templateGif' in setting)) setting.templateGif = false
		if (!('templateMsg' in setting)) setting.templateMsg = false
		if (!('templateLocation' in setting)) setting.templateLocation = false
	    } else global.db.data.settings[botNumber] = {
		status: 0,
		autobio: true,
		templateImage: true,
		templateVideo: false,
		templateGif: false,
		templateMsg: false,
		templateLocation: false,
	    }
	    
        } catch (err) {
            console.error(err)
        }
        
        // Anti Link
        if (db.data.chats[m.chat].antilink) {
        if (budy.match(`chat.whatsapp.com`)) {
        if (!isBotAdmins) return m.reply(`Ehh bot gak admin`)
        let gclink = (`https://chat.whatsapp.com/`+await danzz.groupInviteCode(m.chat))
        let isLinkThisGc = new RegExp(gclink, 'i')
        let isgclink = isLinkThisGc.test(m.text)
        if (isgclink) return m.reply(`Ngapain Lu Ngirim Link Group Ini?`)
        if (isAdmins) return m.reply(`Admin Mah Bebas Yakan?`)
        if (isOwner) return m.reply(`Owner Bot Mah Bebas Yakan?`)
        m.reply(`[ *ANTI LINK* ]\n\nKamu Terdeteksi Mengirim Link Grup, Kamu Akan Di Kick!!!`)
        danzz.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
        }
        
        // Sayying time
        const Clock = timeZone().tz('Asia/Jakarta').format('HH:mm:ss')
        if(Clock < "23:59:00"){
        var sayyingTime = 'Selamat Malam 🌃'
}
        if(Clock < "19:00:00"){
        var sayyingTime = 'Selamat Petang 🌆'
}
        if(Clock < "18:00:00"){
        var sayyingTime = 'Selamat Sore 🏙'
}
        if(Clock < "15:00:00"){
        var sayyingTime = 'Selamat Siang 🌁'
}
        if(Clock < "10:00:00"){
        var sayyingTime = 'Selamat Pagi 🌄'
}
        if(Clock < "05:00:00"){
        var sayyingTime = 'Selamat Subuh 🌉'
}
        if(Clock < "03:00:00"){
        var sayyingTime = 'Selamat Tengah Malam 🌌'
}
	// auto set bio
	if (db.data.settings[botNumber].autobio) {
	    let setting = global.db.data.settings[botNumber]
	    if (new Date() * 1 - setting.status > 1000) {
		let uptime = await runtime(process.uptime())
		await danzz.setStatus(`${'©Danzz-MD'} | Runtime : ${runtime(process.uptime())}`)
		setting.status = new Date() * 1
	    }
	}
	
	// Respon Cmd with media
        if (isMedia && m.msg.fileSha256 && (m.msg.fileSha256.toString('base64') in global.db.data.sticker)) {
        let hash = global.db.data.sticker[m.msg.fileSha256.toString('base64')]
        let { text, mentionedJid } = hash
        let messages = await generateWAMessage(m.chat, { text: text, mentions: mentionedJid }, {
            userJid: danzz.user.id,
            quoted: m.quoted && m.quoted.fakeObj
        })
        messages.key.fromMe = areJidsSameUser(m.sender, danzz.user.id)
        messages.key.id = m.key.id
        messages.pushName = m.pushName
        if (m.isGroup) messages.participant = m.sender
        let msg = {
            ...chatUpdate,
            messages: [proto.WebMessageInfo.fromObject(messages)],
            type: 'append'
        }
        danzz.ev.emit('messages.upsert', msg)
        }
        
        // Public & Self
        if (!danzz.public) {
            if (!m.key.fromMe) return
        }

        // Push Message To Console && Auto Read
        if (m.message) {
            danzz.readMessages([m.key])
            console.log(chalk.black(chalk.bgGreen('[ Chat ]')), chalk.black(chalk.blueBright(new Date)), chalk.black(chalk.greenBright(budy || m.mtype)) + '\n' + chalk.magentaBright('- from'), chalk.blueBright(pushname), chalk.greenBright(m.sender) + '\n' + chalk.blueBright('- in'), chalk.cyanBright(m.isGroup ? pushname : 'Private Chat', m.chat))
        }
        
        // End
		switch(command) {
		
		// Start Case                        
            case 'menu': case 'help': case 'm': {
            let menu = `
*Hai Kak ${pushname}, ${sayyingTime}*

*Downloader*
- play (query)
- ytmp3 (url)
- ytmp4 (url)
- tiktok (url)
- tiktoknowm (url)
- tiktokmp3 (url)
- instagram (url)
- twitter (url)
- twittermp3
- facebook (url)
- pinteredDl (url)
- soundcloud (url)

*Asupan*
- randomasupan
- santuy
- bocil
- hijaber
- ukhty

*Cecan*
- randomcecan
- hijaber
- china
- indonesia
- korea
- japan
- thailand
- vietnam

*Cogan*
- randomcogan

*Search*
- youtube (query)
- google (query)
- gimage (query)
- playstore (query)
- gsmarena (merk hp)
- wallpaper (query)
- wikimedia (query)
- pinterest (query)

*Convert*
- toimg (sticker)
- tourl (media)
- sticker (media)
- stickerwm (media)
- smeme (media)
- ttp (text)
- attp (text)

*Random*
- couple
- coffe

*Text Pro*
- 3dchristmas (text)
- 3ddeepsea (text)
- americanflag (text)
- 3dscifi (text)
- 3drainbow (text)
- 3dwaterpipe (text)
- halloweenskeleton (text)
- sketch (text)
- bluecircuit (text)
- space (text)
- metallic (text)
- fiction (text)
- greenhorror (text)
- transformer (text)
- berry (text)
- thunder (text)
- magma (text)
- 3dcrackedstone (text)
- 3dneonlight (text)
- impressiveglitch (text)
- naturalleaves (text)
- fireworksparkle (text)
- matrix (text)
- dropwater (text)
- harrypotter (text)
- foggywindow (text)
- neondevils (text)
- christmasholiday (text)
- 3dgradient (text)
- blackpink (text)
- gluetext (text)

*Photo Oxy*
- shadow (text)
- romantic (text)
- smoke (text)
- burnpapper (text)
- naruto (text)
- lovemsg (text)
- grassmsg (text)
- lovetext (text)
- coffecup (text)
- butterfly (text)
- harrypotter (text)
- retrolol (text)

*Ephoto*
- ffcover (text)
- crossfire (text)
- galaxy (text)
- glass (text)
- neon (text)
- beach (text)
- blackpink (text)
- igcertificate (text)
- ytcertificate (text)

*Primbon*
- nomorhoki (text)
- artimimpi (text)
- artinama (text)
- ramaljodoh (text) | (text)
- ramaljodohbali (text)
- suamiistri (text)
- ramalcinta (text)
- cocoknama (text)
- pasangan (text)
- jadiannikah (text)
- sifatusaha (text)
- rezeki (text)
- pekerjaan (text)
- nasib (text)
- penyakit (text)
- tarot (text)
- fengshui (text)
- haribaik (text)
- harisangar (text)
- harisial (text)
- nagahari (text)
- arahrezeki (text)
- peruntungan (text)
- weton (text)
- karakter (text)
- keberuntungan (text)
- memancing (text)
- masasubur (text)
- zodiak (text)
- shio (text)

*Islamic*
- iqra (number)
- hadits (hadits)
- alquran (surah) (ayat)
- tafsirsurah (surah)

*Owner*
- self
- public
- delete (chats)
- broadcast (text)
`
      	  let buttons = [
                    {buttonId: `rules`, buttonText: {displayText: 'Rules'}, type: 1},
                    {buttonId: `donasi`, buttonText: {displayText: 'Donasi'}, type: 1},
                    {buttonId: `owner`, buttonText: {displayText: 'Owner'}, type: 1}
                ]
                let buttonMessage = {
                    image: { url: 'https://telegra.ph/file/6d3a9d6f88c9d5bbb0330.jpg' },
                    caption: `${menu}`,
                    footer: `${global.wm}`,
                    buttons: buttons,
                    headerType: 4
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
        }
        break
            
            // Owner
            case 'author': case 'owner': case 'creator': {
                danzz.sendContact(m.chat, global.owner, m)
            }
            break
            
            case 'tqto': case 'thanksto': case 'contributor': {
            let tqto = `
*THANKS TO*
@Adiwajshing
@Dika Ardnt
@Saipul Anuar
@Danzz (me)

*Penyedia Rest Api*
https://danzzapi.xyz (danzz)
https://zenzapis.xyz (zhwzein)
`
      	  let buttons = [
                    {buttonId: `rules`, buttonText: {displayText: 'Rules'}, type: 1},
                    {buttonId: `donasi`, buttonText: {displayText: 'Donasi'}, type: 1},
                    {buttonId: `owner`, buttonText: {displayText: 'Owner'}, type: 1}
                ]
                let buttonMessage = {
                    image: { url: 'https://telegra.ph/file/6d3a9d6f88c9d5bbb0330.jpg' },
                    caption: `${tqto}`,
                    footer: `${global.wm}`,
                    buttons: buttons,
                    headerType: 4
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
        }
        break
        
	    	case 'rules': {
            let rules = `
*RULES*
1. Jangan Pernah Spam Bot
2. Jangan Call Nomer Bot
3. Jangan Mengeksploitasi Bot

Sanksi : *Warn/Soft Block*

*About Questions*

You : Bot nya Slow Respon
Bot : Mohon Bersabar, Mungkin
Kendala Dari Jaringan, Signal,
Atau Bahkan Terbanned Dari
Pihak WhatsApp

You : Scriptnya Beli Dimana?
Bot: Wa.me/6289512545999

You : Boleh Masukin Ke Grup Saia
Tidak?
Bot : Untuk Masalah Memasukkan
Bot Ke Dalam Grup Bisa
Menghubungi Owner

You: Apakah Bot Ini Masih
Menyimpan File Yang Saya Kirim?
Bot : Data WhatsApp Anda Hanya
Tersimpan Saat Bot Aktif, Dan Bot
Tidak Pernah Menyimpan File-file
Yang Anda Kirim

You : Min, Ada Fitur Yang Error
Bot : Jika Menemukan Bug/Error
Silahkan Langsung Hubungi
Owner/Creator Agar Segera Di Fix

Tetap Patuhi Rules Agar Tetap
Bisa Menikmati Bot

*Note* : Segala Ketentuan Dan
Kebijakan Yang Berlaku Di Pegang
Oleh Owner Bot, Sewaktu-Waktu
Owner Berhak Memakai Ataupun
Mengubah Kebijakan Dan
Ketentuan Yang Berlaku

*Thanks* Buat Kalian
User-User Yang Sudah Memakai Bot,
Yang Sudah Mau Mematuhi
Rules, Serta Para Constributor
Yang Sudah Membantu Dalam
Pembuatan Bot Ini
Ini
`
      	  let buttons = [
                    {buttonId: `menu`, buttonText: {displayText: 'Menu'}, type: 1},
                    {buttonId: `donasi`, buttonText: {displayText: 'Donasi'}, type: 1},
                    {buttonId: `owner`, buttonText: {displayText: 'Owner'}, type: 1}
                ]
                let buttonMessage = {
                    image: { url: 'https://telegra.ph/file/6d3a9d6f88c9d5bbb0330.jpg' },
                    caption: `${rules}`,
                    footer: `${global.wm}`,
                    buttons: buttons,
                    headerType: 4
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
        }
        break
           
       case 'donasi': case 'donate': {
let payment = `
*Hai Kak ${pushname}, ${sayyingTime}*

donate to me so that the bot can develop more.

*e-wallet*
Dana: 089512545999
Gopay: 089512545999
`
let buttons = [
                    {buttonId: `rules`, buttonText: {displayText: 'Rules'}, type: 1},
                    {buttonId: `menu`, buttonText: {displayText: 'Menu'}, type: 1},
                    {buttonId: `owner`, buttonText: {displayText: 'Owner'}, type: 1}
                ]
                let buttonMessage = {
                    image: { url: 'https://telegra.ph/file/6d3a9d6f88c9d5bbb0330.jpg' },
                    caption: `${payment}`,
                    footer: `${global.wm}`,
                    buttons: buttons,
                    headerType: 4
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
        }
        break
                        
            // Downloader
            case 'play': case 'ytplay': {
                if (!text) throw `Example : ${prefix + command} dj 30 detik`
                m.reply(mess.wait)
                let yts = require("yt-search")
                let search = await yts(text)
                let anu = search.videos[Math.floor(Math.random() * search.videos.length)]
                let buttons = [
                    {buttonId: `ytmp3 ${anu.url}`, buttonText: {displayText: ' Audio'}, type: 1},
                    {buttonId: `ytmp4 ${anu.url}`, buttonText: {displayText: ' Video'}, type: 1}
                ]
                let buttonMessage = {
                    image: { url: anu.thumbnail },
                    caption: `
Title : ${anu.title}
Ext : Search
ID : ${anu.videoId}
Duration : ${anu.timestamp}
Viewers : ${anu.views}
Upload At : ${anu.ago}
Author : ${anu.author.name}
Channel : ${anu.author.url}
Description : ${anu.description}
Url : ${anu.url}`,
                    footer: danzz.user.name,
                    buttons: buttons,
                    headerType: 4
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
            }
            break
            
            case 'ytmp3': case 'ytaudio': {
                let { yta } = require('./lib/y2mate')
                if (!text) throw `Example : ${prefix + command} https://youtube.com/watch?v=PtFMh6Tccag%27 128kbps`
                m.reply(mess.wait)
                let quality = args[1] ? args[1] : '128kbps'
                let media = await yta(text, quality)
                if (media.filesize >= 100000) return m.reply('File Melebihi Batas '+util.format(media))
                danzz.sendImage(m.chat, media.thumb, ` Title : ${media.title}\n File Size : ${media.filesizeF}\n Url : ${isUrl(text)}\n Ext : MP3\n Resolusi : ${args[1] || '128kbps'}`, m)
                danzz.sendMessage(m.chat, { audio: { url: media.dl_link }, mimetype: 'audio/mpeg', fileName: `${media.title}.mp3` }, { quoted: m })
            }
            break
            
            case 'ytmp4': case 'ytvideo': {
                let { ytv } = require('./lib/y2mate')
                if (!text) throw `Example : ${prefix + command} https://youtube.com/watch?v=PtFMh6Tccag%27 360p`
                m.reply(mess.wait)
                let quality = args[1] ? args[1] : '360p'
                let media = await ytv(text, quality)
                if (media.filesize >= 100000) return m.reply('File Melebihi Batas '+util.format(media))
                danzz.sendMessage(m.chat, { video: { url: media.dl_link }, mimetype: 'video/mp4', fileName: `${media.title}.mp4`, caption: ` Title : ${media.title}\n File Size : ${media.filesizeF}\n Url : ${isUrl(text)}\n Ext : MP3\n Resolusi : ${args[1] || '360p'}` }, { quoted: m })
            }
            break
            
            case 'tiktoknowm': case 'tiktoknowatermark': {
                if (!text) throw 'Masukkan Query Link!'
                m.reply(mess.wait)
                let anu = await fetchJson(api('zenz', '/downloader/tiktok', { url: text }, 'apikey'))
                let buttons = [
                    {buttonId: `tiktokwm ${text}`, buttonText: {displayText: ' With Watermark'}, type: 1},
                    {buttonId: `tiktokmp3 ${text}`, buttonText: {displayText: ' Audio'}, type: 1}
                ]
                let buttonMessage = {
                    video: { url: anu.result.nowatermark },
                    caption: `Download From ${text}`,
                    footer: 'Press The Button Below',
                    buttons: buttons,
                    headerType: 5
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
            }
            break
            
            case 'tiktok': case 'tiktokwm': case 'tiktokwatermark': {
                if (!text) throw 'Masukkan Query Link!'
                m.reply(mess.wait)
                let anu = await fetchJson(api('zenz', '/downloader/tiktok', { url: text }, 'apikey'))
                let buttons = [
                    {buttonId: `tiktoknowm ${text}`, buttonText: {displayText: ' No Watermark'}, type: 1},
                    {buttonId: `tiktokmp3 ${text}`, buttonText: {displayText: ' Audio'}, type: 1}
                ]
                let buttonMessage = {
                    video: { url: anu.result.watermark },
                    caption: `Download From ${text}`,
                    footer: 'Press The Button Below',
                    buttons: buttons,
                    headerType: 5
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
            }
            break
            
            case 'tiktokmp3': case 'tiktokaudio': {
                if (!text) throw 'Masukkan Query Link!'
                m.reply(mess.wait)
                let anu = await fetchJson(api('zenz', '/downloader/musically', { url: text }, 'apikey'))
                let buttons = [
                    {buttonId: `tiktoknowm ${text}`, buttonText: {displayText: ' No Watermark'}, type: 1},
                    {buttonId: `tiktokwm ${text}`, buttonText: {displayText: ' With Watermark'}, type: 1}
                ]
                let buttonMessage = {
                    text: `Download From ${text}`,
                    footer: 'Press The Button Below',
                    buttons: buttons,
                    headerType: 2
                }
                let msg = await danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
                danzz.sendMessage(m.chat, { audio: { url: anu.result.audio }, mimetype: 'audio/mpeg'}, { quoted: msg })
            }
            break
            
	        case 'instagram': case 'ig': case 'igdl': {
                if (!text) throw 'No Query Url!'
                m.reply(mess.wait)
                if (/(?:\/p\/|\/reel\/|\/tv\/)([^\s&]+)/.test(isUrl(text)[0])) {
                    let anu = await fetchJson(api('zenz', '/downloader/instagram2', { url: isUrl(text)[0] }, 'apikey'))
                    for (let media of anu.data) danzz.sendFileUrl(m.chat, media, `Download Url Instagram From ${isUrl(text)[0]}`, m)
                } else if (/\/stories\/([^\s&]+)/.test(isUrl(text)[0])) {
                    let anu = await fetchJson(api('zenz', '/downloader/instastory', { url: isUrl(text)[0] }, 'apikey'))
                    danzz.sendFileUrl(m.chat, anu.media[0].url, `Download Url Instagram From ${isUrl(text)[0]}`, m)
                }
            }
            break
            
            case 'twitdl': case 'twitter': {
                if (!text) throw 'Masukkan Query Link!'
                m.reply(mess.wait)
                let anu = await fetchJson(api('zenz', '/api/downloader/twitter', { url: text }, 'apikey'))
                let buttons = [
                    {buttonId: `twittermp3 ${text}`, buttonText: {displayText: ' Audio'}, type: 1}
                ]
                let buttonMessage = {
                    video: { url: anu.result.HD || anu.result.SD },
                    caption: util.format(anu.result),
                    footer: 'Press The Button Below',
                    buttons: buttons,
                    headerType: 5
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
            }
            break
            
            case 'twittermp3': case 'twitteraudio': {
                if (!text) throw 'Masukkan Query Link!'
                m.reply(mess.wait)
                let anu = await fetchJson(api('zenz', '/api/downloader/twitter', { url: text }, 'apikey'))
                let buttons = [
                    {buttonId: `twitter ${text}`, buttonText: {displayText: ' Video'}, type: 1}
                ]
                let buttonMessage = {
		    image: { url: anu.result.thumb },
                    caption: util.format(anu.result),
                    footer: 'Press The Button Below',
                    buttons: buttons,
                    headerType: 4
                }
                let msg = await danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
                danzz.sendMessage(m.chat, { audio: { url: anu.result.audio } }, { quoted: msg })
            }
            break
            
	        case 'fbdl': case 'fb': case 'facebook': {
                if (!text) throw 'Masukkan Query Link!'
                m.reply(mess.wait)
                let anu = await fetchJson(api('zenz', '/api/downloader/facebook', { url: text }, 'apikey'))
                danzz.sendMessage(m.chat, { video: { url: anu.result.url }, caption: ` Title : ${anu.result.title}`}, { quoted: m })
            }
            break
            
	        case 'pindl': case 'pinterestdl': {
                if (!text) throw 'Masukkan Query Link!'
                m.reply(mess.wait)
                let anu = await fetchJson(api('zenz', '/api/downloader/pinterestdl', { url: text }, 'apikey'))
                danzz.sendMessage(m.chat, { video: { url: anu.result }, caption: `Download From ${text}` }, { quoted: m })
            }
            break
                      
            case 'soundcloud': case 'scdl': {
                if (!text) throw 'No Query Title'
                m.reply(mess.wait)
                let anu = await fetchJson(api('zenz', '/downloader/soundcloud', { url: isUrl(text)[0] }, 'apikey'))
                let msg = await danzz.sendImage(m.chat, anu.result.thumb, ` Title : ${anu.result.title}\n Url : ${isUrl(text)[0]}`)
                danzz.sendMessage(m.chat, { audio: { url: anu.result.url }, mimetype: 'audio/mpeg', fileName: anu.result.title+'.m4a' }, { quoted: msg })
            }
            break
            
            // Asupan
            case 'randomasupan': {
            m.reply(mess.wait)
			yy = await getBuffer(`https://danzzapi.xyz/api/asupan/random?apikey=danzzprem`)
			danzz.sendMessage(m.chat, {video: yy, mimetype: 'video/mp4'}, {quoted:m})
			}
			break
			
			case 'santuy': {
			m.reply(mess.wait)
			yy = await getBuffer(`https://danzzapi.xyz/api/asupan/santuy?apikey=danzz`)
			danzz.sendMessage(m.chat, {video: yy, mimetype: 'video/mp4'}, {quoted:m})
			}
			break
			
			case 'bocil': {
			m.reply(mess.wait)
			yy = await getBuffer(`https://danzzapi.xyz/api/asupan/bocil?apikey=danzz`)
			danzz.sendMessage(m.chat, {video: yy, mimetype: 'video/mp4'}, {quoted:m})
			}
			break
			
			case 'hijaber': {
			m.reply(mess.wait)
			yy = await getBuffer(`https://danzzapi.xyz/api/asupan/hijaber?apikey=danzz`)
			danzz.sendMessage(m.chat, {video: yy, mimetype: 'video/mp4'}, {quoted:m})
			}
			break
			
			case 'ukhty': {
			m.reply(mess.wait)
			yy = await getBuffer(`https://danzzapi.xyz/api/asupan/ukhty?apikey=danzz`)
			danzz.sendMessage(m.chat, {video: yy, mimetype: 'video/mp4'}, {quoted:m})
			}
			break
			
			// Cecan
			case 'randomcecan': {
			m.reply(mess.wait)
			yy = await getBuffer(`https://danzzapi.xyz/api/cecan/random?apikey=danzzprem`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			case 'hijaber': {
			m.reply(mess.wait)
			yy = await getBuffer(`https://danzzapi.xyz/api/cecan/hijaber?apikey=danzz`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			case 'china': {
			m.reply(mess.wait)
			yy = await getBuffer(`https://danzzapi.xyz/api/cecan/china?apikey=danzzprem`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			case 'indonesia': {
			m.reply(mess.wait)
			yy = await getBuffer(`https://danzzapi.xyz/api/cecan/indonesia?apikey=danzz`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			case 'korea': {
			m.reply(mess.wait)
			yy = await getBuffer(`https://danzzapi.xyz/api/cecan/korea?apikey=danzz`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			case 'japan': {
			m.reply(mess.wait)
			yy = await getBuffer(`https://danzzapi.xyz/api/cecan/japan?apikey=danzz`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			case 'thailand': {
			m.reply(mess.wait)
			yy = await getBuffer(`https://danzzapi.xyz/api/cecan/thailand?apikey=danzzprem`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			case 'vietnam': {
			m.reply(mess.wait)
			yy = await getBuffer(`https://danzzapi.xyz/api/cecan/vietnam?apikey=danzzprem`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			// Cogan
			case 'randomcogan': {
			m.reply(mess.wait)
			yy = await getBuffer(`https://danzzapi.xyz/api/cogan/random?apikey=danzz`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			// search
			case 'yts': case 'ytsearch': {
                if (!text) throw `Example : ${prefix + command} story wa programmer`
                m.reply(mess.wait)
                let yts = require("yt-search")
                let search = await yts(text)
                let teks = 'YouTube Search\n\n Result From '+text+'\n\n'
                let no = 1
                for (let i of search.all) {
                    teks += ` No : ${no++}\n Type : ${i.type}\n Video ID : ${i.videoId}\n Title : ${i.title}\n Views : ${i.views}\n Duration : ${i.timestamp}\n Upload At : ${i.ago}\n Author : ${i.author.name}\n Url : ${i.url}\n\n\n\n`
                }
                danzz.sendMessage(m.chat, { image: { url: search.all[0].thumbnail },  caption: teks }, { quoted: m })
            }
            break
            
        case 'google': {
                if (!text) throw `Example : ${prefix + command} Danzz Coding`
                m.reply(mess.wait)
                let google = require('google-it')
                google({'query': text}).then(res => {
                let teks = `Google Search From : ${text}\n\n`
                for (let g of res) {
                teks += ` *Title* : ${g.title}\n`
                teks += ` *Description* : ${g.snippet}\n`
                teks += ` *Link* : ${g.link}\n\n\n\n`
                } 
                m.reply(teks)
                })
                }
                break
                
        case 'gimage': {
        if (!text) throw `Example : ${prefix + command} kaori cicak`
        m.reply(mess.wait)
        let gis = require('g-i-s')
        gis(text, async (error, result) => {
        n = result
        images = n[Math.floor(Math.random() * n.length)].url
        let buttons = [
                    {buttonId: `gimage ${text}`, buttonText: {displayText: 'Next Image'}, type: 1}
                ]
                let buttonMessage = {
                    image: { url: images },
                    caption: `*------- GIMAGE SEARCH -------*
 *Query* : ${text}
 *Media Url* : ${images}`,
                    footer: danzz.user.name,
                    buttons: buttons,
                    headerType: 4
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
        })
        }
        break
        
			case 'playstore': {
            if (!text) throw `Example : ${prefix + command} pou`
            m.reply(mess.wait)
            let res = await fetchJson(api('zenz', '/webzone/playstore', { query: text }, 'apikey'))
            let teks = ` Playstore Search From : ${text}\n\n`
            for (let i of res.result) {
            teks += ` Name : ${i.name}\n`
            teks += ` Link : ${i.link}\n`
            teks += ` Developer : ${i.developer}\n`
            teks += ` Link Developer : ${i.link_dev}\n\n\n`
            }
            m.reply(teks)
            }
            break
            
            case 'gsmarena': {
            if (!text) throw `Example : ${prefix + command} samsung j4+`
            m.reply(mess.wait)
            let res = await fetchJson(api('zenz', '/webzone/gsmarena', { query: text }, 'apikey'))
            let { judul, rilis, thumb, ukuran, type, storage, display, inchi, pixel, videoPixel, ram, chipset, batrai, merek_batre, detail } = res.result
let capt = ` Title: ${judul}
 Realease: ${rilis}
 Size: ${ukuran}
 Type: ${type}
 Storage: ${storage}
 Display: ${display}
 Inchi: ${inchi}
 Pixel: ${pixel}
 Video Pixel: ${videoPixel}
 Ram: ${ram}
 Chipset: ${chipset}
 Battery: ${batrai}
 Battery Brand: ${merek_batre}
 Detail: ${detail}`
            danzz.sendImage(m.chat, thumb, capt, m)
            }
            break
            
            case 'wallpaper': {
                if (!text) throw 'Masukkan Query Title'
                m.reply(mess.wait)
				let { wallpaper } = require('./lib/scraper')
                anu = await wallpaper(text)
                result = anu[Math.floor(Math.random() * anu.length)]
				let buttons = [
                    {buttonId: `wallpaper ${text}`, buttonText: {displayText: 'Next Image'}, type: 1}
                ]
                let buttonMessage = {
                    image: { url: result.image[0] },
                    caption: ` Title : ${result.title}\n Category : ${result.type}\n Detail : ${result.source}\n Media Url : ${result.image[2] || result.image[1] || result.image[0]}`,
                    footer: danzz.user.name,
                    buttons: buttons,
                    headerType: 4
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
    	        }
           	 break
            
            case 'wikimedia': {
                if (!text) throw 'Masukkan Query Title'
                m.reply(mess.wait)
				let { wikimedia } = require('./lib/scraper')
                anu = await wikimedia(text)
                result = anu[Math.floor(Math.random() * anu.length)]
                let buttons = [
                    {buttonId: `wikimedia ${text}`, buttonText: {displayText: 'Next Image'}, type: 1}
                ]
                let buttonMessage = {
                    image: { url: result.image },
                    caption: ` Title : ${result.title}\n Source : ${result.source}\n Media Url : ${result.image}`,
                    footer: danzz.user.name,
                    buttons: buttons,
                    headerType: 4
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
            }
            break
            
            case 'pinterest': {
            	if (!text) throw `Example : ${prefix + command} cecan`
                m.reply(mess.wait)
		let { pinterest } = require('./lib/scraper')
                anu = await pinterest(text)
                result = anu[Math.floor(Math.random() * anu.length)]
                danzz.sendMessage(m.chat, { image: { url: result }, caption: ' Media Url : '+result }, { quoted: m })
            }
            break
            
        // Convert       
		case 'toimage': case 'toimg': {
                if (!/webp/.test(mime)) throw `Reply sticker dengan caption *${prefix + command}*`
                m.reply(mess.wait)
                let media = await danzz.downloadAndSaveMediaMessage(qmsg)
                let ran = await getRandom('.png')
                exec(`ffmpeg -i ${media} ${ran}`, (err) => {
                    fs.unlinkSync(media)
                    if (err) throw err
                    let buffer = fs.readFileSync(ran)
                    danzz.sendMessage(m.chat, { image: buffer }, { quoted: m })
                    fs.unlinkSync(ran)
                })
            }
            break
            
            case 'tourl': {
                m.reply(mess.wait)
		let { UploadFileUgu, webp2mp4File, TelegraPh } = require('./lib/uploader')
                let media = await danzz.downloadAndSaveMediaMessage(qmsg)
                if (/image/.test(mime)) {
                    let anu = await TelegraPh(media)
                    m.reply(util.format(anu))
                } else if (!/image/.test(mime)) {
                    let anu = await UploadFileUgu(media)
                    m.reply(util.format(anu))
                }
                await fs.unlinkSync(media)
            }
            break
            
            case 'sticker': case 's': case 'stickergif': case 'sgif': {
           if (/image/.test(mime)) {
           m.reply(mess.wait)
                let media = await danzz.downloadMediaMessage(qmsg)
                let encmedia = await danzz.sendImageAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
                await fs.unlinkSync(encmedia)
            } else if (/video/.test(mime)) {
            m.reply(mess.wait)
                if (qmsg.seconds > 11) return m.reply('Maksimal 10 detik!')
                let media = await danzz.downloadMediaMessage(qmsg)
                let encmedia = await danzz.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
                await fs.unlinkSync(encmedia)
            } else {
                m.reply(`Kirim/reply gambar/video/gif dengan caption ${prefix + command}\nDurasi Video/Gif 1-9 Detik`)
                }
            }
            break
            
            case 'stickerwm': case 'swm': case 'stickergifwm': case 'sgifwm': {
                let [teks1, teks2] = text.split`|`
                if (!teks1) throw `Kirim/reply image/video dengan caption ${prefix + command} teks1|teks2`
                if (!teks2) throw `Kirim/reply image/video dengan caption ${prefix + command} teks1|teks2`
            	m.reply(mess.wait)
                if (/image/.test(mime)) {
                    let media = await danzz.downloadMediaMessage(qmsg)
                    let encmedia = await danzz.sendImageAsSticker(m.chat, media, m, { packname: teks1, author: teks2 })
                    await fs.unlinkSync(encmedia)
                } else if (/video/.test(mime)) {
                    if ((quoted.msg || quoted).seconds > 11) return m.reply('Maksimal 10 detik!')
                    let media = await danzz.downloadMediaMessage(qmsg)
                    let encmedia = await danzz.sendVideoAsSticker(m.chat, media, m, { packname: teks1, author: teks2 })
                    await fs.unlinkSync(encmedia)
                } else {
                    throw `Kirim Gambar/Video Dengan Caption ${prefix + command}\nDurasi Video 1-9 Detik`
                }
            }
            break
            
            case 'smeme': case 'stickmeme': case 'stikmeme': case 'stickermeme': case 'stikermeme': {
	        let respond = `Kirim/reply image/sticker dengan caption ${prefix + command} text1|text2`
	        if (!/image/.test(mime)) throw respond
            if (!text) throw respond
	        m.reply(mess.wait)
            atas = text.split('|')[0] ? text.split('|')[0] : '-'
            bawah = text.split('|')[1] ? text.split('|')[1] : '-'
	        let dwnld = await danzz.downloadMediaMessage(qmsg)
	        let { floNime } = require('./lib/uploader')
	        let fatGans = await floNime(dwnld)
	        let smeme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${fatGans.result.url}`
	        let daniganteng = await danzz.sendImageAsSticker(m.chat, smeme, m, { packname: global.packname, author: global.auhor })
	        await fs.unlinkSync(daniganteng)
            }
	       break
            
		case 'attp': case 'ttp': {
			m.reply(mess.wait)
            if (!text) throw `Example : ${prefix + command} text`
            await danzz.sendMedia(m.chat, `https://danzzapi.xyz/api/maker/${command}?text=${text}&apikey=danzz`, 'danzz', 'coding', m, {asSticker: true})
            }
            break
            
            // Random
            case 'couple': {
                m.reply(mess.wait)
                let anu = await fetchJson('https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json')
                let random = anu[Math.floor(Math.random() * anu.length)]
                danzz.sendMessage(m.chat, { image: { url: random.male }, caption: `Couple Male` }, { quoted: m })
                danzz.sendMessage(m.chat, { image: { url: random.female }, caption: `Couple Female` }, { quoted: m })
            }
	    break
        case 'coffe': case 'kopi': {
            m.reply(mess.wait)
            let buttons = [
                    {buttonId: `coffe`, buttonText: {displayText: 'Next Image'}, type: 1}
                ]
                let buttonMessage = {
                    image: { url: 'https://coffee.alexflipnote.dev/random' },
                    caption: `Random Coffe`,
                    footer: danzz.user.name,
                    buttons: buttons,
                    headerType: 4
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
            }
            break
            
            // Text Pro
            case '3dchristmas': case '3ddeepsea': case 'americanflag': case '3dscifi': case '3drainbow': case '3dwaterpipe': case 'halloweenskeleton': case 'sketch': case 'bluecircuit': case 'space': case 'metallic': case 'fiction': case 'greenhorror': case 'transformer': case 'berry': case 'thunder': case 'magma': case '3dcrackedstone': case '3dneonlight': case 'impressiveglitch': case 'naturalleaves': case 'fireworksparkle': case 'matrix': case 'dropwater':  case 'harrypotter': case 'foggywindow': case 'neondevils': case 'christmasholiday': case '3dgradient': case 'blackpink': case 'gluetext': {
                if (!text) throw `Example : ${prefix + command} text`
                m.reply(mess.wait)
                danzz.sendMessage(m.chat, { image: { url: api('zenz', '/textpro/' + command, { text: text }, 'apikey') }, caption: `Text Pro ${command}` }, { quoted: m})
	    }
            break
            
            // Photo Oxy
            case 'shadow': case 'romantic': case 'smoke': case 'burnpapper': case 'naruto': case 'lovemsg': case 'grassmsg': case 'lovetext': case 'coffecup': case 'butterfly': case 'harrypotter': case 'retrolol': {
                if (!text) throw `Example : ${prefix + command} text`
                m.reply(mess.wait)
                danzz.sendMessage(m.chat, { image: { url: api('zenz', '/photooxy/' + command, { text: text }, 'apikey') }, caption: `Photo Oxy ${command}` }, { quoted: m })
            }
            break

            // Ephoto
            case 'ffcover': case 'crossfire': case 'galaxy': case 'glass': case 'neon': case 'beach': case 'blackpink': case 'igcertificate': case 'ytcertificate': {
                if (!text) throw `Example : ${prefix + command} text`
                m.reply(mess.wait)
                danzz.sendMessage(m.chat, { image: { url: api('zenz', '/ephoto/' + command, { text: text }, 'apikey') }, caption: `Ephoto ${command}` }, { quoted: m })
            }
            break
            
            // Primbon
            case 'nomerhoki': case 'nomorhoki': {
                if (!Number(text)) throw `Example : ${prefix + command} 6288292024190`
                let anu = await primbon.nomer_hoki(Number(text))
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Nomor HP :* ${anu.message.nomer_hp}\n *Angka Shuzi :* ${anu.message.angka_shuzi}\n *Energi Positif :*\n- Kekayaan : ${anu.message.energi_positif.kekayaan}\n- Kesehatan : ${anu.message.energi_positif.kesehatan}\n- Cinta : ${anu.message.energi_positif.cinta}\n- Kestabilan : ${anu.message.energi_positif.kestabilan}\n- Persentase : ${anu.message.energi_positif.persentase}\n *Energi Negatif :*\n- Perselisihan : ${anu.message.energi_negatif.perselisihan}\n- Kehilangan : ${anu.message.energi_negatif.kehilangan}\n- Malapetaka : ${anu.message.energi_negatif.malapetaka}\n- Kehancuran : ${anu.message.energi_negatif.kehancuran}\n- Persentase : ${anu.message.energi_negatif.persentase}`, m)
            }
            break
            case 'artimimpi': case 'tafsirmimpi': {
                if (!text) throw `Example : ${prefix + command} belanja`
                let anu = await primbon.tafsir_mimpi(text)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Mimpi :* ${anu.message.mimpi}\n *Arti :* ${anu.message.arti}\n *Solusi :* ${anu.message.solusi}`, m)
            }
            break
            case 'ramalanjodoh': case 'ramaljodoh': {
                if (!text) throw `Example : ${prefix + command} Dani, 31, 8, 2006, Nia, 1, 5, 2008`
                let [nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2] = text.split`,`
                let anu = await primbon.ramalan_jodoh(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Nama Anda :* ${anu.message.nama_anda.nama}\n *Lahir Anda :* ${anu.message.nama_anda.tgl_lahir}\n *Nama Pasangan :* ${anu.message.nama_pasangan.nama}\n *Lahir Pasangan :* ${anu.message.nama_pasangan.tgl_lahir}\n *Hasil :* ${anu.message.result}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'ramalanjodohbali': case 'ramaljodohbali': {
                if (!text) throw `Example : ${prefix + command} Dani, 31, 8, 2006, Nia, 1, 5, 2008`
                let [nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2] = text.split`,`
                let anu = await primbon.ramalan_jodoh_bali(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Nama Anda :* ${anu.message.nama_anda.nama}\n *Lahir Anda :* ${anu.message.nama_anda.tgl_lahir}\n *Nama Pasangan :* ${anu.message.nama_pasangan.nama}\n *Lahir Pasangan :* ${anu.message.nama_pasangan.tgl_lahir}\n *Hasil :* ${anu.message.result}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'suamiistri': {
                if (!text) throw `Example : ${prefix + command} Dani, 31, 8, 2006, Nia, 1, 5, 2008`
                let [nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2] = text.split`,`
                let anu = await primbon.suami_istri(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Nama Suami :* ${anu.message.suami.nama}\n *Lahir Suami :* ${anu.message.suami.tgl_lahir}\n *Nama Istri :* ${anu.message.istri.nama}\n *Lahir Istri :* ${anu.message.istri.tgl_lahir}\n *Hasil :* ${anu.message.result}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'ramalancinta': case 'ramalcinta': {
                if (!text) throw `Example : ${prefix + command} Dani, 31, 8, 2006, Nia, 1, 5, 2008`
                let [nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2] = text.split`,`
                let anu = await primbon.ramalan_cinta(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Nama Anda :* ${anu.message.nama_anda.nama}\n *Lahir Anda :* ${anu.message.nama_anda.tgl_lahir}\n *Nama Pasangan :* ${anu.message.nama_pasangan.nama}\n *Lahir Pasangan :* ${anu.message.nama_pasangan.tgl_lahir}\n *Sisi Positif :* ${anu.message.sisi_positif}\n *Sisi Negatif :* ${anu.message.sisi_negatif}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'artinama': {
                if (!text) throw `Example : ${prefix + command} Dika Ardianta`
                let anu = await primbon.arti_nama(text)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Nama :* ${anu.message.nama}\n *Arti :* ${anu.message.arti}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'kecocokannama': case 'cocoknama': {
                if (!text) throw `Example : ${prefix + command} Dani, 31, 8, 2006`
                let [nama, tgl, bln, thn] = text.split`,`
                let anu = await primbon.kecocokan_nama(nama, tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Nama :* ${anu.message.nama}\n *Lahir :* ${anu.message.tgl_lahir}\n *Life Path :* ${anu.message.life_path}\n *Destiny :* ${anu.message.destiny}\n *Destiny Desire :* ${anu.message.destiny_desire}\n *Personality :* ${anu.message.personality}\n *Persentase :* ${anu.message.persentase_kecocokan}`, m)
            }
            break
            case 'kecocokanpasangan': case 'cocokpasangan': case 'pasangan': {
                if (!text) throw `Example : ${prefix + command} Dani|Nia`
                let [nama1, nama2] = text.split`|`
                let anu = await primbon.kecocokan_nama_pasangan(nama1, nama2)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendImage(m.chat,  anu.message.gambar, ` *Nama Anda :* ${anu.message.nama_anda}\n *Nama Pasangan :* ${anu.message.nama_pasangan}\n *Sisi Positif :* ${anu.message.sisi_positif}\n *Sisi Negatif :* ${anu.message.sisi_negatif}`, m)
            }
            break
            case 'jadianpernikahan': case 'jadiannikah': {
                if (!text) throw `Example : ${prefix + command} 6, 12, 2020`
                let [tgl, bln, thn] = text.split`,`
                let anu = await primbon.tanggal_jadian_pernikahan(tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Tanggal Pernikahan :* ${anu.message.tanggal}\n *karakteristik :* ${anu.message.karakteristik}`, m)
            }
            break
            case 'sifatusaha': {
                if (!ext)throw `Example : ${prefix+ command} 28, 12, 2021`
                let [tgl, bln, thn] = text.split`,`
                let anu = await primbon.sifat_usaha_bisnis(tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Lahir :* ${anu.message.hari_lahir}\n *Usaha :* ${anu.message.usaha}`, m)
            }
            break
            case 'rejeki': case 'rezeki': {
                if (!text) throw `Example : ${prefix + command} 31, 8, 2006`
                let [tgl, bln, thn] = text.split`,`
                let anu = await primbon.rejeki_hoki_weton(tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Lahir :* ${anu.message.hari_lahir}\n *Rezeki :* ${anu.message.rejeki}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'pekerjaan': case 'kerja': {
                if (!text) throw `Example : ${prefix + command} 31, 8, 2006`
                let [tgl, bln, thn] = text.split`,`
                let anu = await primbon.pekerjaan_weton_lahir(tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Lahir :* ${anu.message.hari_lahir}\n *Pekerjaan :* ${anu.message.pekerjaan}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'ramalannasib': case 'ramalnasib': case 'nasib': {
                if (!text) throw `Example : 31, 8, 2006`
                let [tgl, bln, thn] = text.split`,`
                let anu = await primbon.ramalan_nasib(tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Analisa :* ${anu.message.analisa}\n *Angka Akar :* ${anu.message.angka_akar}\n *Sifat :* ${anu.message.sifat}\n *Elemen :* ${anu.message.elemen}\n *Angka Keberuntungan :* ${anu.message.angka_keberuntungan}`, m)
            }
            break
            case 'potensipenyakit': case 'penyakit': {
                if (!text) throw `Example : ${prefix + command} 31, 8, 2006`
                let [tgl, bln, thn] = text.split`,`
                let anu = await primbon.cek_potensi_penyakit(tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Analisa :* ${anu.message.analisa}\n *Sektor :* ${anu.message.sektor}\n *Elemen :* ${anu.message.elemen}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'artitarot': case 'tarot': {
                if (!text) throw `Example : ${prefix + command} 31, 8, 2006`
                let [tgl, bln, thn] = text.split`,`
                let anu = await primbon.arti_kartu_tarot(tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendImage(m.chat, anu.message.image, ` *Lahir :* ${anu.message.tgl_lahir}\n *Simbol Tarot :* ${anu.message.simbol_tarot}\n *Arti :* ${anu.message.arti}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'fengshui': {
                if (!text) throw `Example : ${prefix + command} Dika, 1, 2005\n\nNote : ${prefix + command} Nama, gender, tahun lahir\nGender : 1 untuk laki-laki & 2 untuk perempuan`
                let [nama, gender, tahun] = text.split`,`
                let anu = await primbon.perhitungan_feng_shui(nama, gender, tahun)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Nama :* ${anu.message.nama}\n *Lahir :* ${anu.message.tahun_lahir}\n *Gender :* ${anu.message.jenis_kelamin}\n *Angka Kua :* ${anu.message.angka_kua}\n *Kelompok :* ${anu.message.kelompok}\n *Karakter :* ${anu.message.karakter}\n *Sektor Baik :* ${anu.message.sektor_baik}\n *Sektor Buruk :* ${anu.message.sektor_buruk}`, m)
            }
            break
            case 'haribaik': {
                if (!text) throw `Example : ${prefix + command} 31, 8, 2006`
                let [tgl, bln, thn] = text.split`,`
                let anu = await primbon.petung_hari_baik(tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Lahir :* ${anu.message.tgl_lahir}\n *Kala Tinantang :* ${anu.message.kala_tinantang}\n *Info :* ${anu.message.info}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'harisangar': case 'taliwangke': {
                if (!text) throw `Example : ${prefix + command} 31, 8, 2006`
                let [tgl, bln, thn] = text.split`,`
                let anu = await primbon.hari_sangar_taliwangke(tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Lahir :* ${anu.message.tgl_lahir}\n *Hasil :* ${anu.message.result}\n *Info :* ${anu.message.info}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'harinaas': case 'harisial': {
                if (!text) throw `Example : ${prefix + command} 31, 8, 2006`
                let [tgl, bln, thn] = text.split`,`
                let anu = await primbon.primbon_hari_naas(tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Hari Lahir :* ${anu.message.hari_lahir}\n *Tanggal Lahir :* ${anu.message.tgl_lahir}\n *Hari Naas :* ${anu.message.hari_naas}\n *Info :* ${anu.message.catatan}\n *Catatan :* ${anu.message.info}`, m)
            }
            break
            case 'nagahari': case 'harinaga': {
                if (!text) throw `Example : ${prefix + command} 31, 8, 2006`
                let [tgl, bln, thn] = text.split`,`
                let anu = await primbon.rahasia_naga_hari(tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Hari Lahir :* ${anu.message.hari_lahir}\n *Tanggal Lahir :* ${anu.message.tgl_lahir}\n *Arah Naga Hari :* ${anu.message.arah_naga_hari}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'arahrejeki': case 'arahrezeki': {
                if (!text) throw `Example : ${prefix + command} 31, 8, 2006`
                let [tgl, bln, thn] = text.split`,`
                let anu = await primbon.primbon_arah_rejeki(tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Hari Lahir :* ${anu.message.hari_lahir}\n *tanggal Lahir :* ${anu.message.tgl_lahir}\n *Arah Rezeki :* ${anu.message.arah_rejeki}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'peruntungan': {
                if (!text) throw `Example : ${prefix + command} Dani, 31, 8, 2006, 2022\n\nNote : ${prefix + command} Nama, tanggal lahir, bulan lahir, tahun lahir, untuk tahun`
                let [nama, tgl, bln, thn, untuk] = text.split`,`
                let anu = await primbon.ramalan_peruntungan(nama, tgl, bln, thn, untuk)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Nama :* ${anu.message.nama}\n *Lahir :* ${anu.message.tgl_lahir}\n *Peruntungan Tahun :* ${anu.message.peruntungan_tahun}\n *Hasil :* ${anu.message.result}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'weton': case 'wetonjawa': {
                if (!text) throw `Example : ${prefix + command} 31, 8, 2006`
                let [tgl, bln, thn] = text.split`,`
                let anu = await primbon.weton_jawa(tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Tanggal :* ${anu.message.tanggal}\n *Jumlah Neptu :* ${anu.message.jumlah_neptu}\n *Watak Hari :* ${anu.message.watak_hari}\n *Naga Hari :* ${anu.message.naga_hari}\n *Jam Baik :* ${anu.message.jam_baik}\n *Watak Kelahiran :* ${anu.message.watak_kelahiran}`, m)
            }
            break
            case 'sifat': case 'karakter': {
                if (!text) throw `Example : ${prefix + command} Dani, 31, 8, 2006`
                let [nama, tgl, bln, thn] = text.split`,`
                let anu = await primbon.sifat_karakter_tanggal_lahir(nama, tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Nama :* ${anu.message.nama}\n *Lahir :* ${anu.message.tgl_lahir}\n *Garis Hidup :* ${anu.message.garis_hidup}`, m)
            }
            break
            case 'keberuntungan': {
                if (!text) throw `Example : ${prefix + command} Dani, 31, 8, 2006`
                let [nama, tgl, bln, thn] = text.split`,`
                let anu = await primbon.potensi_keberuntungan(nama, tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Nama :* ${anu.message.nama}\n *Lahir :* ${anu.message.tgl_lahir}\n *Hasil :* ${anu.message.result}`, m)
            }
            break
            case 'memancing': {
                if (!text) throw `Example : ${prefix + command} 10, 10, 2022`
                let [tgl, bln, thn] = text.split`,`
                let anu = await primbon.primbon_memancing_ikan(tgl, bln, thn)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Tanggal :* ${anu.message.tgl_memancing}\n *Hasil :* ${anu.message.result}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'masasubur': {
                if (!text) throw `Example : ${prefix + command} 10, 10, 2022, 28\n\nNote : ${prefix + command} hari pertama menstruasi, siklus`
                let [tgl, bln, thn, siklus] = text.split`,`
                let anu = await primbon.masa_subur(tgl, bln, thn, siklus)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Hasil :* ${anu.message.result}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'zodiak': case 'zodiac': {
                if (!text) throw `Example : ${prefix+ command} 31 8 2006`
                let zodiak = [
                    ["capricorn", new Date(1970, 0, 1)],
                    ["aquarius", new Date(1970, 0, 20)],
                    ["pisces", new Date(1970, 1, 19)],
                    ["aries", new Date(1970, 2, 21)],
                    ["taurus", new Date(1970, 3, 21)],
                    ["gemini", new Date(1970, 4, 21)],
                    ["cancer", new Date(1970, 5, 22)],
                    ["leo", new Date(1970, 6, 23)],
                    ["virgo", new Date(1970, 7, 23)],
                    ["libra", new Date(1970, 8, 23)],
                    ["scorpio", new Date(1970, 9, 23)],
                    ["sagittarius", new Date(1970, 10, 22)],
                    ["capricorn", new Date(1970, 11, 22)]
                ].reverse()

                function getZodiac(month, day) {
                    let d = new Date(1970, month - 1, day)
                    return zodiak.find(([_,_d]) => d >= _d)[0]
                }
                let date = new Date(text)
                if (date == 'Invalid Date') throw date
                let d = new Date()
                let [tahun, bulan, tanggal] = [d.getFullYear(), d.getMonth() + 1, d.getDate()]
                let birth = [date.getFullYear(), date.getMonth() + 1, date.getDate()]

                let zodiac = await getZodiac(birth[1], birth[2])
                
                let anu = await primbon.zodiak(zodiac)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Zodiak :* ${anu.message.zodiak}\n *Nomor :* ${anu.message.nomor_keberuntungan}\n *Aroma :* ${anu.message.aroma_keberuntungan}\n *Planet :* ${anu.message.planet_yang_mengitari}\n *Bunga :* ${anu.message.bunga_keberuntungan}\n *Warna :* ${anu.message.warna_keberuntungan}\n *Batu :* ${anu.message.batu_keberuntungan}\n *Elemen :* ${anu.message.elemen_keberuntungan}\n *Pasangan Zodiak :* ${anu.message.pasangan_zodiak}\n *Catatan :* ${anu.message.catatan}`, m)
            }
            break
            case 'shio': {
                if (!text) throw `Example : ${prefix + command} tikus\n\nNote : For Detail https://primbon.com/shio.htm`
                let anu = await primbon.shio(text)
                if (anu.status == false) return m.reply(anu.message)
                danzz.sendText(m.chat, ` *Hasil :* ${anu.message}`, m)
            }
            break
            
            // Islamic
            case 'iqra': {
		oh = `Example : ${prefix + command} 3\n\nIQRA Yang tersedia : 1,2,3,4,5,6`
		if (!text) throw oh
		m.reply(mess.wait)
		yy = await getBuffer(`https://islamic-api-indonesia.herokuapp.com/api/data/pdf/iqra${text}`)
		danzz.sendMessage(m.chat, {document: yy, mimetype: 'application/pdf', fileName: `iqra${text}.pdf`}, {quoted:m}).catch ((err) => m.reply(oh))
		}
		break
		
		case 'hadits': case 'hadis': case 'hadist': {
		if (!args[0]) throw `Contoh:
${prefix + command} bukhari 1
${prefix + command} abu-daud 1

Pilihan tersedia:
abu-daud
1 - 4590
ahmad
1 - 26363
bukhari
1 - 7008
darimi
1 - 3367
tirmidzi
1 - 3891
ibnu-majah
1 - 4331
nasai
1 - 5662
malik
1 - 1594
muslim
1 - 5362`
		if (!args[1]) throw `Hadis yang ke berapa?\n\ncontoh:\n${prefix + command} muslim 1`
		m.reply(mess.wait)
		try {
		let res = await fetchJson(`https://fatiharridho.herokuapp.com/api/islamic/hadits?list=${args[0]}`)
		let { number, arab, id } = res.result.find(v => v.number == args[1])
		m.reply(`No. ${number}

${arab}

${id}`)
		} catch (e) {
		m.reply(`Hadis tidak ditemukan !`)
		}
		}
		break
		
		case 'alquran': {
		if (!args[0]) throw `Contoh penggunaan:\n${prefix + command} 1 2\n\nmaka hasilnya adalah surah Al-Fatihah ayat 2 beserta audionya, dan ayatnya 1 aja`
		if (!args[1]) throw `Contoh penggunaan:\n${prefix + command} 1 2\n\nmaka hasilnya adalah surah Al-Fatihah ayat 2 beserta audionya, dan ayatnya 1 aja`
		m.reply(mess.wait)
		let res = await fetchJson(`https://islamic-api-indonesia.herokuapp.com/api/data/quran?surah=${args[0]}&ayat=${args[1]}`)
		let txt = `*Arab* : ${res.result.data.text.arab}
*English* : ${res.result.data.translation.en}
*Indonesia* : ${res.result.data.translation.id}

( Q.S ${res.result.data.surah.name.transliteration.id} : ${res.result.data.number.inSurah} )`
		m.reply(txt)
		danzz.sendMessage(m.chat, {audio: { url: res.result.data.audio.primary }, mimetype: 'audio/mpeg'}, { quoted : m })
		}
		break
		
		case 'tafsirsurah': {
		if (!args[0]) throw `Contoh penggunaan:\n${prefix + command} 1 2\n\nmaka hasilnya adalah tafsir surah Al-Fatihah ayat 2`
		if (!args[1]) throw `Contoh penggunaan:\n${prefix + command} 1 2\n\nmaka hasilnya adalah tafsir surah Al-Fatihah ayat 2`
		m.reply(mess.wait)
		let res = await fetchJson(`https://islamic-api-indonesia.herokuapp.com/api/data/quran?surah=${args[0]}&ayat=${args[1]}`)
		let txt = ` *Tafsir Surah*  

*Pendek* : ${res.result.data.tafsir.id.short}

*Panjang* : ${res.result.data.tafsir.id.long}

( Q.S ${res.result.data.surah.name.transliteration.id} : ${res.result.data.number.inSurah} )`
		m.reply(txt)
		}
		break
		
		// Owner
		case 'self': {
                if (!isOwner) throw mess.owner
                danzz.public = false
                m.reply('Self Mode Activate')
            }
            break
            
            case 'public': {
                if (!isOwner) throw mess.owner
                danzz.public = true
                m.reply('Public Mode Activate')
            }
            break
            
            case 'delete': case 'del': {
                if (!m.quoted) throw false
                let { chat, fromMe, id, isBaileys } = m.quoted
                if (!isBaileys) throw 'Pesan tersebut bukan dikirim oleh bot!'
                danzz.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: true, id: m.quoted.id, participant: m.quoted.sender } })
            }
            break
            
            case 'bc': case 'broadcast': case 'bcall': {
                if (!isOwner) throw mess.owner
                if (!text) throw `Text mana?\n\nExample : ${prefix + command} fatih-san`
                let anu = await store.chats.all().map(v => v.id)
                m.reply(`Mengirim Broadcast Ke ${anu.length} Chat\nWaktu Selesai ${anu.length * 1.5} detik`)
		for (let yoi of anu) {
		    await sleep(1500)
		    let btn = [{
                                urlButton: {
                                    displayText: 'My Website',
                                    url: 'https://danzzcodingweb.vercel.app'
                                }
                            }, {
                                urlButton: {
                                    displayText: 'My RestAPI',
                                    url: 'https://danzzapi.xyz'
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: 'Menu',
                                    id: 'menu'
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: 'Owner',
                                    id: 'owner'
                                }
                            }]
                      let txt = ` Broadcast Bot \n\n${text}`
                      danzz.send5ButImg(yoi, txt, danzz.user.name, global.thumb, btn)
		}
		m.reply('Sukses Broadcast')
            }
            break
		
		// End Case
		default:
                if (budy.startsWith('=>')) {
                    if (!isOwner) return m.reply(mess.owner)
                    function Return(sul) {
                        sat = JSON.stringify(sul, null, 2)
                        bang = util.format(sat)
                            if (sat == undefined) {
                                bang = util.format(sul)
                            }
                            return m.reply(bang)
                    }
                    try {
                        m.reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
                    } catch (e) {
                        m.reply(String(e))
                    }
                }

                if (budy.startsWith('>')) {
                    if (!isOwner) return m.reply(mess.owner)
                    try {
                        let evaled = await eval(budy.slice(2))
                        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                        await m.reply(evaled)
                    } catch (err) {
                        await m.reply(String(err))
                    }
                }

                if (budy.startsWith('$')) {
                    if (!isOwner) return m.reply(mess.owner)
                    exec(budy.slice(2), (err, stdout) => {
                        if (err) return m.reply(`${err}`)
                        if (stdout) return m.reply(stdout)
                    })
                }
			
		if (isCmd && budy.toLowerCase() != undefined) {
		    if (m.chat.endsWith('broadcast')) return
		    if (m.isBaileys) return
		    let msgs = global.db.data.database
		    if (!(budy.toLowerCase() in msgs)) return
		    danzz.copyNForward(m.chat, msgs[budy.toLowerCase()], true)
		}
        }
        

    } catch (err) {
        m.reply(util.format(err))
    }
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.greenBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
