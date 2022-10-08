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
var { performance } = require('perf_hooks')
var { JSDOM } = require('jsdom')
var { spawn, exec, execSync } = require("child_process")

// lib
var { runtime, fetchJson, getBuffer, jsonformat, format, parseMention, smsg, formatp, tanggal, formatDate, getTime, isUrl, sleep, clockString, getRandom, getGroupAdmins } = require('./lib/myfunc')

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
        const from = m.chat
        const quoted = m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ''
        const isMedia = /image|video|sticker|audio/.test(mime)
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
        if (isCreator) return m.reply(`Owner Bot Mah Bebas Yakan?`)
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
case 'menu': case 'help': case 'm':
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

*Random*
- couple
- coffe

*Text Pro*
- 3dchristmas
- 3ddeepsea
- americanflag
- 3dscifi
- 3drainbow
- 3dwaterpipe
- halloweenskeleton
- sketch
- bluecircuit
- space
- metallic
- fiction
- greenhorror
- transformer
- berry
- thunder
- magma
- 3dcrackedstone
- 3dneonlight
- impressiveglitch
- naturalleaves
- fireworksparkle
- matrix
- dropwater
- harrypotter
- foggywindow
- neondevils
- christmasholiday
- 3dgradient
- blackpink
- gluetext

*Photo Oxy*
- shadow
- romantic
- smoke
- burnpapper
- naruto
- lovemsg
- grassmsg
- lovetext
- coffecup
- butterfly
- harrypotter
- retrolol

*Ephoto*
- ffcover
- crossfire
- galaxy
- glass
- neon
- beach
- blackpink
- igcertificate
- ytcertificate

*Primbon*
- artinama (name)
- tafsirmimpi (dream)

*Islamic*
- iqra (number)
- hadits (hadits)
- alquran (surah) (ayat)
- tafsirsurah (surah)`
txt = `${menu}`
		let btn = [{
                                urlButton: {
                                    displayText: 'Source Code',
                                    url: 'https://github.com/Danzzxcodes/danzz-apiv4'
                                }
                            }, {
                                urlButton: {
                                    displayText: 'Rest Api Free',
                                    url: 'https://danzzapi.xyz'
                                }
                            }, {quickReplyButton: {
                                    displayText: 'Rules',
                                    id: 'rules'
                                }
                                }, {
                                quickReplyButton: {
                                    displayText: 'Donate',
                                    id: 'donate'
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: 'Author',
                                    id: 'owner'
                                }  
                            }]
                         let danzzgz = db.data.settings[botNumber]
                        if (danzzgz.templateImage) {
                        danzz.send5ButImg(m.chat, txt, `${wm}`, global.thumb, btn, global.thumb)
                        } else if (danzzgz.templateGif) {
                        danzz.send5ButGif(m.chat, txt, `${wm}`, global.danzzz, btn, global.thumb)
                        } else if (danzzgz.templateVid) {
                        danzz.send5ButVid(m.chat, txt, `${wm}`, global.danzzz, btn, global.thumb)
                        } else if (danzzgz.templateMsg) {
                        danzz.send5ButMsg(m.chat, txt, `${wm}`, btn)
                        } else if (danzzgz.templateLocation) {
                        danzz.send5ButLoc(m.chat, txt, `${wm}`, global.thumb, btn)
                        }
            break
            
            // Owner
            case 'author': case 'owner': case 'creator': {
                danzz.sendContact(m.chat, global.owner, m)
            }
            break
            
            case 'tqto': case 'thanksto': case 'contributor':
let tqto = `*THANKS TO*
@Adiwajshing
@Dika Ardnt
@Saipul Anuar
@Danzz (me)

*Penyedia Rest Api*
https://danzzapi.xyz (danzz)
https://zenzapis.xyz (zhwzein)`
		let btn1 = [{
                                urlButton: {
                                    displayText: 'Source Code',
                                    url: 'https://github.com/Danzzxcodes/danzz-apiv4'
                                }
                            }, {
                                urlButton: {
                                    displayText: 'Rest Api Free',
                                    url: 'https://danzzapi.xyz'
                                }
                            }, {quickReplyButton: {
                                    displayText: 'Rules',
                                    id: 'rules'
                                }
                                }, {
                                quickReplyButton: {
                                    displayText: 'Menu',
                                    id: 'menu'
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: 'Author',
                                    id: 'owner'
                                }  
                            }]
                         let danzzgz1 = db.data.settings[botNumber]
                        if (danzzgz1.templateImage) {
                        danzz.send5ButImg(m.chat, tqto, `${wm}`, global.qris, btn1, global.thumb)
                        } else if (danzzgz1.templateGif) {
                        danzz.send5ButGif(m.chat, tqto, `${wm}`, global.danzzz, btn1, global.qris)
                        } else if (danzzgz1.templateVid) {
                        danzz.send5ButVid(m.chat, tqto, `${wm}`, global.danzzz, btn1, global.qris)
                        } else if (danzzgz1.templateMsg) {
                        danzz.send5ButMsg(m.chat, tqto, `${wm}`, btn1)
                        } else if (danzzgz1.templateLocation) {
                        danzz.send5ButLoc(m.chat, tqto, `${wm}`, global.qris, btn1)
                        }
            break
            
            case 'rules': {
	anu = `*RULES*
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
Ini`
let btn2 = [{
                                urlButton: {
                                    displayText: 'Source Code',
                                    url: 'https://github.com/Danzzxcodes/danzz-apiv4'
                                }
                            }, {
                                urlButton: {
                                    displayText: 'Rest Api Free',
                                    url: 'https://danzzapi.xyz'
                                }
                            }, {quickReplyButton: {
                                    displayText: 'Menu',
                                    id: 'menu'
                                }
                                }, {
                                quickReplyButton: {
                                    displayText: 'Donasi',
                                    id: 'donasi'
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: 'Author',
                                    id: 'owner'
                                }  
                            }]
                         let danzzgz2 = db.data.settings[botNumber]
                        if (danzzgz2.templateImage) {
                        danzz.send5ButImg(m.chat, anu, `${wm}`, global.thumb, btn2, global.thumb)
                        } else if (danzzgz2.templateGif) {
                        danzz.send5ButGif(m.chat, anu, `${wm}`, global.danzzz, btn2, global.thumb)
                        } else if (danzzgz2.templateVid) {
                        danzz.send5ButVid(m.chat, anu, `${wm}`, global.danzzz, btn2, global.thumb)
                        } else if (danzzgz2.templateMsg) {
                        danzz.send5ButMsg(m.chat, anu, `${wm}`, btn2)
                        } else if (danzzgz2.templateLocation) {
                        danzz.send5ButLoc(m.chat, anu, `${wm}`, global.thumb, btn2)
                        }
                     }
            break
            
            case 'donasi': case 'donate':
let payment = `
*Hai Kak ${pushname}, ${sayyingTime}*

donate to me so that the bot can develop more.

*e-wallet*
Dana: 089512545999
Gopay: 089512545999`
txt = `${payment}`
		let btn3 = [{
                                urlButton: {
                                    displayText: 'Source Code',
                                    url: 'https://github.com/Danzzxcodes/danzz-apiv4'
                                }
                            }, {
                                urlButton: {
                                    displayText: 'Rest Api Free',
                                    url: 'https://danzzapi.xyz'
                                }
                            }, {quickReplyButton: {
                                    displayText: 'Thanks To',
                                    id: 'tqto'
                                }
                                }, {
                                quickReplyButton: {
                                    displayText: 'Menu',
                                    id: 'menu'
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: 'Author',
                                    id: 'owner'
                                }  
                            }]
                         let danzzgz3 = db.data.settings[botNumber]
                        if (danzzgz3.templateImage) {
                        danzz.send5ButImg(m.chat, txt, `${wm}`, global.qris, btn3, global.thumb)
                        } else if (danzzgz3.templateGif) {
                        danzz.send5ButGif(m.chat, txt, `${wm}`, global.danzzz, btn3, global.qris)
                        } else if (danzzgz3.templateVid) {
                        danzz.send5ButVid(m.chat, txt, `${wm}`, global.danzzz, btn3, global.qris)
                        } else if (danzzgz3.templateMsg) {
                        danzz.send5ButMsg(m.chat, txt, `${wm}`, btn3)
                        } else if (danzzgz3.templateLocation) {
                        danzz.send5ButLoc(m.chat, txt, `${wm}`, global.qris, btn3)
                        }
            break
                        
            // Downloader
            case 'play': case 'ytplay': {
                if (!text) throw `Example : ${prefix + command} dj 30 detik`
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
			yy = await getBuffer(`https://danzzapi.xyz/api/asupan/random?apikey=danzzprem`)
			danzz.sendMessage(m.chat, {video: yy, mimetype: 'video/mp4'}, {quoted:m})
			}
			break
			
			case 'santuy': {
			yy = await getBuffer(`https://danzzapi.xyz/api/asupan/santuy?apikey=danzz`)
			danzz.sendMessage(m.chat, {video: yy, mimetype: 'video/mp4'}, {quoted:m})
			}
			break
			
			case 'bocil': {
			yy = await getBuffer(`https://danzzapi.xyz/api/asupan/bocil?apikey=danzz`)
			danzz.sendMessage(m.chat, {video: yy, mimetype: 'video/mp4'}, {quoted:m})
			}
			break
			
			case 'hijaber': {
			yy = await getBuffer(`https://danzzapi.xyz/api/asupan/hijaber?apikey=danzz`)
			danzz.sendMessage(m.chat, {video: yy, mimetype: 'video/mp4'}, {quoted:m})
			}
			break
			
			case 'ukhty': {
			yy = await getBuffer(`https://danzzapi.xyz/api/asupan/ukhty?apikey=danzz`)
			danzz.sendMessage(m.chat, {video: yy, mimetype: 'video/mp4'}, {quoted:m})
			}
			break
			
			// Cecan
			case 'randomcecan': {
			yy = await getBuffer(`https://danzzapi.xyz/api/cecan/random?apikey=danzzprem`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			case 'hijaber': {
			yy = await getBuffer(`https://danzzapi.xyz/api/cecan/hijaber?apikey=danzz`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			case 'china': {
			yy = await getBuffer(`https://danzzapi.xyz/api/cecan/china?apikey=danzzprem`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			case 'korea': {
			yy = await getBuffer(`https://danzzapi.xyz/api/cecan/korea?apikey=danzz`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			case 'japan': {
			yy = await getBuffer(`https://danzzapi.xyz/api/cecan/japan?apikey=danzz`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			case 'thailand': {
			yy = await getBuffer(`https://danzzapi.xyz/api/cecan/thailand?apikey=danzzprem`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			case 'vietnam': {
			yy = await getBuffer(`https://danzzapi.xyz/api/cecan/vietnam?apikey=danzzprem`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			// Cogan
			case 'randomcogan': {
			yy = await getBuffer(`https://danzzapi.xyz/api/cogan/random?apikey=danzz`)
			danzz.sendMessage(m.chat, {image: yy, mimetype: 'image/png'}, {quoted:m})
			}
			break
			
			// search
			case 'yts': case 'ytsearch': {
                if (!text) throw `Example : ${prefix + command} story wa anime`
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
                if (!text) throw 'No Query Text'
                m.reply(mess.wait)
                danzz.sendMessage(m.chat, { image: { url: api('zenz', '/photooxy/' + command, { text: text }, 'apikey') }, caption: `Photo Oxy ${command}` }, { quoted: m })
            }
            break

            // Ephoto
            case 'ffcover': case 'crossfire': case 'galaxy': case 'glass': case 'neon': case 'beach': case 'blackpink': case 'igcertificate': case 'ytcertificate': {
                if (!text) throw 'No Query Text'
                m.reply(mess.wait)
                danzz.sendMessage(m.chat, { image: { url: api('zenz', '/ephoto/' + command, { text: text }, 'apikey') }, caption: `Ephoto ${command}` }, { quoted: m })
            }
            break
            
            // Primbon
            case 'artinama': {
                if (!text) throw `Example : ${prefix + command} Dani`
                let anu = await fetchJson(`https://danzzapi.xyz/api/primbon/artinama?name=${text}&apikey=danzz`)
                danzz.sendText(m.chat, `${anu.result}`, m)
            }
            break
            
            case 'artimimpi': case 'tafsirmimpi': {
            	if (!text) throw `Example : ${prefix + command} Basah`
                let dream = await fetchJson(`https://danzzapi.xyz/api/primbon/tafsirmimpi?dream=${text}&apikey=danzz`)
                danzz.sendText(m.chat, `${dream.result}`, m)
            }
            break
            
            // Islamic
            case 'iqra': {
		oh = `Example : ${prefix + command} 3\n\nIQRA Yang tersedia : 1,2,3,4,5,6`
		if (!text) throw oh
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
		let res = await fetchJson(`https://islamic-api-indonesia.herokuapp.com/api/data/quran?surah=${args[0]}&ayat=${args[1]}`)
		let txt = ` *Tafsir Surah*  

*Pendek* : ${res.result.data.tafsir.id.short}

*Panjang* : ${res.result.data.tafsir.id.long}

( Q.S ${res.result.data.surah.name.transliteration.id} : ${res.result.data.number.inSurah} )`
		m.reply(txt)
		}
		break
		
		// End Case
		default:
                if (budy.startsWith('=>')) {
                    if (!isCreator) return m.reply(mess.owner)
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
                    if (!isCreator) return m.reply(mess.owner)
                    try {
                        let evaled = await eval(budy.slice(2))
                        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                        await m.reply(evaled)
                    } catch (err) {
                        await m.reply(String(err))
                    }
                }

                if (budy.startsWith('$')) {
                    if (!isCreator) return m.reply(mess.owner)
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
