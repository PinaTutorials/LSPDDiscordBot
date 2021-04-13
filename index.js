const Discord = require('discord.js');
let db = require("mysql-sync-query");
let databaseObject = new db("sql11405372");

var niggerCount = 0;
var finalCount = 0;

databaseObject.connectLocal("sql11.freemysqlhosting.net", 3306, "sql11405372", "Kjct3ReGFb"); 

const bot = new Discord.Client();

bot.on('message', message => {
	
	if(message.author.id == 538665836911788039){
		return;
	}
	
	var string = message + '';
	
	var words = string.split(" ");
	
	var count = words.length;
	
	for(var i = 0; i < count; i++){
		switch(words[i].toLowerCase()){
			case 'nigga': finalCount++; break;
			case 'preto': finalCount++; break;
			case 'negro': finalCount++; break;
			case 'nigger': finalCount++; break;
			case 'niggers': finalCount++; break;
			case 'n4gger': finalCount++; break;
			case 'n4gger': finalCount++; break;
			case 'bai': if(words[i + 1] == 'bunda') finalCount++; break;
			case 'nice': if(words[i + 1] == 'cock') finalCount++; break;
			case 'tem': if(words[i + 1] == 'glema') finalCount++; break;
		}
	}
	if(finalCount != 0){		
		badWordFound(message, finalCount);
	}
	finalCount = 0;
});

bot.login(process.env.BOT_KEY);

async function badWordFound(message, count){
	var res = await databaseObject.executeQuery("SELECT COUNT(*) AS count FROM User WHERE user = " + message.author.id);
	if(res[0].count == 0){
		var res = await databaseObject.executeQuery("INSERT INTO User (user, occurance) VALUES (" + message.author.id + ", " + count + ")");
		niggerCount = count;
		if(parseInt(count) == 1){
			message.channel.send("<@" + message.author.id + "> You said a total of " + niggerCount + " bad word.");
		}
		else{
			message.channel.send("<@" + message.author.id + "> You said a total of " + niggerCount + " bad word.");
		}
	}
	else{
		var res = await databaseObject.executeQuery("SELECT occurance FROM User WHERE user = " + message.author.id);
		await databaseObject.executeQuery("UPDATE User SET occurance = " + (res[0].occurance + count) + " WHERE user = " + message.author.id);
		if(parseInt(count) >= 5){
			message.channel.send("<@" + message.author.id + "> You said a total of " + (res[0].occurance + count) + " bad words.");
		}
		else{
			if((parseInt(res[0].occurance % 5) > (parseInt(res[0].occurance) + count) % 5 )){
				message.channel.send("<@" + message.author.id + "> You said a total of " + (res[0].occurance + count) + " bad words.");
			}
		}
	}
}
