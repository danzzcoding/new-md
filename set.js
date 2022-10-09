const fs = require('fs')
const chalk = require('chalk')

// web api
global.APIs = {
	danzz: 'https://danzzapi.xyz',
	zenz: 'https://zenzapis.xyz',
}

// Apikey Website Api
global.APIKeys = {
	'https://danzzapi.xyz': 'danzz',
	'https://zenzapis.xyz': 'sonelstore',
}

// Other
global.namabot = ['Danzz-Botz']
global.namaowner = ['DanzzCoding']
global.owner = ['6289512545999']
global.premium = ['6288296339947','6289512545999']
global.packname = '© Created By'
global.author = 'DanzzXCode'
global.sessionName = 'session'
global.prefa = ['','!','.','🐦','🐤','🗿']
global.symbol1 = '•'
global.symbol2 = '>'
global.wm = '© Danzz Coding'
global.mess = {
    success: 'Success ✓',
    admin: 'Fitur Khusus Admin Group!',
    botAdmin: 'Bot Harus Menjadi Admin Terlebih Dahulu!',
    owner: 'Fitur Khusus Owner Bot',
    group: 'Fitur Khusus Group Chat',
    private: 'Fitur Khusus Private Chat!',
    bot: 'Fitur Khusus Nomor Bot',
    wait: 'Waittt...',
    premium: 'Kamu Bukan User Premium, Beli Sana Ke Owner Bot',
    endLimit: 'Limit Harian Anda Telah Habis, Limit Akan Direset Setiap Pukul 00:00 WIB.',
}
global.limitawal = {
    premium: "Infinity",
    free: 100
}
global.thumb = fs.readFileSync('./media/foto/image.jpg')
global.qris = { url: 'https://telegra.ph/file/cd0372ebf13b265f3feb5.jpg' }

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.greenBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
