const Discord = require('discord.js');

const bot = new Discord.Client();

bot.on('ready', () => {

    console.log('I am ready!');
	message.send('Hello everybody!!');

});

bot.on('message', message => {

    if (message.content === 'ping') {

       message.reply('pong');

    }
	
	else if (message.content === 'you') {
		
		message.reply('suck!');

	}
	
});

bot.login(process.env.BOT_TOKEN);