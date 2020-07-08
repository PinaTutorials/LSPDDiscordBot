const Discord = require('discord.js');

const client = new Discord.Client();

 

client.on('ready', () => {

    console.log('I am ready!');

});

 

client.on('message', message => {

    if (message.content === 'ping') {

       message.reply('pong');

       }

});

client.login(process.env.NTM4NjY1ODM2OTExNzg4MDM5.XwWWng.HNnNVD54XJVmgQwh5O6jktF2BM0);