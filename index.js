const Discord = require('discord.js');
let db = require("mysql-sync-query");
let databaseObject = new db("sql11405372");
var fs = require("fs");

const bot = new Discord.Client();

var finalCount = 0;
var fileString = fs.readFileSync("./badWords.txt", "utf-8").toLowerCase();
var fileWords = fileString.split("\n");

databaseObject.connectLocal("sql11.freemysqlhosting.net", 3306, "sql11405372", "Kjct3ReGFb");

bot.on('ready', () => {
        bot.user.setActivity('!helpwords', { type: 'PLAYING' })
})

bot.on('message', async message => {
	
	var messageString = message + '';
	
	if(message.author.id == 538665836911788039){
		return;
	}
	
	if(message.content.toLowerCase() === "!badwords"){
		await badWords(message); 
	}
	else if(message.content.toLowerCase().includes("!addbadword")){
		var badWordToAdd = messageString.slice(messageString.indexOf(' ') + 1, messageString.length).trim();
		if(! await checkForBadWord(badWordToAdd)){
			fileString += "\n" + badWordToAdd.toLowerCase();
			await writeToFile(fileString);
			message.channel.send("Word " + badWordToAdd + " will now be accounted for.");
		}
		else{
			message.channel.send("Word " + badWordToAdd + " is already being accounted for.");
		}
	}
	else if(message.content.toLowerCase() === "!helpwords"){
		message.channel.send("List of commands: \n-!addbadword: Adds a word to be counted, OBS: I can't remove it, talk to Creator to remove a word;\n-!badwords: Lists your bad word counter;\n-!listbadwords: Lists all words being accounted for.").then(msg => {msg.delete(60000)});
	}
	else if(message.content.toLowerCase() === "!listbadwords"){
		var string = "Words currently being accounted for: ";
		for(var i = 0; i < fileWords.length; i++){
			console.log(fileWords.length + " = " + i);
			if(fileWords.length == (i + 2)){
				string += "\"" + fileWords[i].replace(/(\r\n|\n|\r)/gm, "") + "\"" + " and ";
			}
			else if(fileWords.length != (i + 1)){
				string += "\"" + fileWords[i].replace(/(\r\n|\n|\r)/gm, "") + "\"" + ", ";
			}
			else{
				string += "\"" + fileWords[i].replace(/(\r\n|\n|\r)/gm, "") + "\"" + ".";
			}
		}
		message.channel.send(string).then(msg => {msg.delete(10000)});
	}
	else{
		for(var i = 0; i < fileWords.length; i++){
			if(messageString === fileWords[i].replace(/(\r\n|\n|\r)/gm, "")){
				if(fileWords[i] != ''){
					console.log("yes");
					finalCount++;
				}
			}
		}
		if(finalCount != 0){		
			badWordFound(message, finalCount);
			message.react("🙊");
		}
		finalCount = 0;
		
	}
});

bot.login(process.env.BOT_KEY);

async function checkForBadWord(badWord){
	for(var i = 0; i < fileWords.length; i++){
		if(badWord.includes(fileWords[i].replace(/(\r\n|\n|\r)/gm, ""))){
			if(fileWords[i] != ''){
				return true;
			}
		}
	}
	return false;
}

async function writeToFile(fileString){
	fs.writeFileSync('./badWords.txt', fileString);
	fileWords = fileString.split("\n");
}

async function badWords(message){
	var res = await databaseObject.executeQuery("SELECT COUNT(*) AS count FROM User WHERE user = " + message.author.id);
	if(res[0].count == 0){
		message.channel.send("<@" + message.author.id + "> You haven't said a bad word!");
	}
	else{
		res = await databaseObject.executeQuery("SELECT occurance FROM User WHERE user = " + message.author.id);
		message.channel.send("<@" + message.author.id + "> You said a total of " + res[0].occurance + " bad words.");
	}
}

async function badWordFound(message, count){
	var res = await databaseObject.executeQuery("SELECT COUNT(*) AS count FROM User WHERE user = " + message.author.id);
	if(res[0].count == 0){
		var res = await databaseObject.executeQuery("INSERT INTO User (user, occurance) VALUES (" + message.author.id + ", " + count + ")");
		if(parseInt(count) == 1){
			message.channel.send("<@" + message.author.id + "> You said a bad word!.");
		}
		else{
			message.channel.send("<@" + message.author.id + "> You said a total of " + count + " bad words.");
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
