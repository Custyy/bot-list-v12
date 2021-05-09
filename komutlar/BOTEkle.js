const Discord = require('discord.js')
const ayarlar = require('../ayarlar.json')
const db = require('quick.db')
const moment = require('moment')
require('moment-duration-format')
moment.locale('tr')
exports.run = async (client, message, args) => {
if (message.channel.id !== ayarlar.BOTEkletmeKanalı) return message.channel.send('Bu Komut Sadece <#'+ayarlar.BOTEkletmeKanalı+'> Kanalında Kullanılabilir!').then(Message => Message.delete({timeout: 7500}))
const ClientID = args[0]
if (!ClientID || isNaN(ClientID) || ClientID == client.user.id) return message.channel.send('**Lütfen BOT ID Yazınız**').then(Message => Message.delete({timeout: 7500}))
const Prefix = args[1]
if (!Prefix) return message.channel.send('**Lütfen Prefix Yazınız**').then(Message => Message.delete({timeout: 7500}))
const DBL = args[2]
if (!DBL) return message.channel.send('**Lütfen DBL Durumunu Yazınız**').then(Message => Message.delete({timeout: 7500}))
if (ClientID.length < 18) return message.channel.send('**Girdiğiniz ID Hiçbir Hesap İle Eşleşmedi (Eksik Yazmış Olabilirsiniz.).**').then(Message => Message.delete({timeout: 7500}))
if (db.fetch(`Durum_${ClientID}`) == true) return message.channel.send('**Botunuzun Hali Hazırda Mevcut Bir Başvurusu Bulunuyor. Lütfen Bekleyin ya da Bir Yetkili İle İletişime Geçin.**').then(Message => Message.delete({timeout: 7500}))
if (message.guild.members.cache.filter(Users => Users.user.bot).find(Botlar => Botlar.id === ClientID) && db.has(`Sahip_${ClientID}`) && db.has(`Eklenme_${ClientID}`)) return message.channel.send('**Bu BOT Zaten Ekli!** (Tarafından: `'+client.users.cache.get(db.fetch(`Sahip_${ClientID}`)).tag+' | '+db.fetch(`Eklenme_${ClientID}`)+'`)').then(Message => Message.delete({timeout: 7500}))
const BOTModeratör = ayarlar.BOTModRol
db.set(`Durum_${ClientID}`,true)
client.users.fetch(ClientID).then((User) => {
if (!User) return message.channel.send('**Girdiğiniz ID Geçersiz.**').then(Message => Message.delete({timeout: 7500}))
if (!User.bot) return message.channel.send('**Girdiğiniz ID Bir Bota Ait Değil.**').then(Message => Message.delete({timeout: 7500}))
const Revenge = new Discord.MessageEmbed()
.setColor('BLUE')
.setAuthor(message.author.tag,message.author.avatarURL({dynamic:true}))
.setDescription(`
\`${message.author.username}\` Adlı Kullanıcı Botunu Ekletti!

Client ID: **\`${ClientID}\`**
Client Name: **\`${User.tag}\`**
Prefix: **\`${Prefix}\`**
Sahip: **\`${message.author.tag}\`** (${message.author})
DBL Onay: **[${DBL}](https://top.gg/bot/${ClientID})**

[BOT Davet!](https://discord.com/oauth2/authorize?scope=bot&permissions=0&client_id=${ClientID}&guild_id=${message.guild.id})`)
.setTimestamp()
.setFooter(User.tag,User.avatarURL())
client.channels.cache.get(ayarlar.BOTLog).send(`**${message.author} Adlı Kullanıcı \`${User.tag}\` Adlı Botunu Sisteme Onaylanması İçin Başvurdu.**`)
client.channels.cache.get(ayarlar.BOTModKanal).send('<@&'+BOTModeratör+'>',Revenge).then(Mesaj => {
db.set(`Mesaj_${ClientID}`,Mesaj.id)
db.set(`Bilgi_${Mesaj.id}`,{Client: ClientID , Gönderen: message.author.id})
})
message.author.send(`\`${User.tag}\` Adlı Botun Sisteme Eklenmesi İçin Başvuruldu. Şimdi Yapman Gerek Sıranı Beklemek.`)
db.set(`BOT_${message.author.id}`,ClientID)
db.set(`Ekledi_${ClientID}`,message.author.id)
db.set(`Sahip_${ClientID}`,message.author.id)
db.set(`Eklenme_${ClientID}`,moment().add(3,'hours').format('LLL'))
})
}

exports.conf = {
   enabled: true,
   guildOnly: true,
   aliases: ['bot-ekle','botekle','addbot','add-bot'],
   permLevel: 0
}

exports.help = {
   name: 'BOT Ekle',
   description: 'BOT Ekler',
   usage: 'botekle'
}
