let request = require('request');
let https = require('https');
let TelegramBot = require('node-telegram-bot-api');

let token = '340829957:AAH2nqKteoElJw8tWQh3SJTCBIiQIixuTew';
let botOptions = {
    polling: true
};
let lolApiKey = 'RGAPI-1fc5b64a-0dec-433c-9cb6-93b34d30c663';
let kittenArray = [
    'https://static1.squarespace.com/static/54e8ba93e4b07c3f655b452e/t/56c2a04520c64707756f4267/1455596221531/',
    'http://i.telegraph.co.uk/multimedia/archive/02830/cat_2830677b.jpg',
    'http://dreamatico.com/data_images/kitten/kitten-3.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCKbV24ga18bP0XAVCXwmYaZ6v_BEPauuG8eCcSg4H3cIkMcw5_A',
    'http://weknowyourdreams.com/images/kitten/kitten-01.jpg',
    'http://static.boredpanda.com/blog/wp-content/uploads/2016/08/cute-kittens-69-57b32c431e8a7__605.jpg'
]
let bot = new TelegramBot(token, botOptions);

bot.getMe().then(function(me)
{
    console.log('Hello! My name is %s!', me.first_name);
    console.log('My id is %s.', me.id);
    console.log('And my username is @%s.', me.username);
});

bot.on('text', function(msg)
{
    let messageChatId = msg.chat.id;
    let messageText = msg.text;
    let messageDate = msg.date;
    let messageUsr = msg.from.username;

    if (messageText === 'Привет') {
        sendMessageByBot(messageChatId, 'Привет киса, я тебя очень очень сильно люблю <3');
    }
    if (messageText === 'Kitten') {
        let rand = Math.floor(Math.random() * (kittenArray.length - 0 + 1));
        if(kittenArray[rand] !== undefined)
        bot.sendPhoto(messageChatId,kittenArray[rand]);
        else {
            bot.sendPhoto(messageChatId,kittenArray[3]);
        }
    }
    if (messageText === 'L'){
        let answer = getLeagueData('fiercekilla');
        sendMessageByBot(messageChatId, 'Вы играли за ' + answer.champName + '. Победа:  ' + answer.win);
    }

    console.log(msg);
});

function getLeagueData(name) {
    let sumId;
    request('https://ru.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + name + '?api_key=RGAPI-1fc5b64a-0dec-433c-9cb6-93b34d30c663', function (error, response, body) {
        console.log('SummonerId:', JSON.parse(body).id); // Print the HTML for the Google homepage.
        sumId =  JSON.parse(body).id;
        request('https://ru.api.riotgames.com/api/lol/RU/v1.3/game/by-summoner/' + sumId + '/recent?api_key=RGAPI-1fc5b64a-0dec-433c-9cb6-93b34d30c663', function (error, response, body) {
            let matchList = JSON.parse(body).games;
            let win = matchList[0].stats['win'];
            request('https://ru.api.riotgames.com/lol/static-data/v3/champions/' + matchList[0].championId + '?champData=info&api_key=RGAPI-1fc5b64a-0dec-433c-9cb6-93b34d30c663', function (error, response, body) {
                let name = JSON.parse(body).name;
                let data = {
                    win: win,
                    champName: name
                };
                console.log(data);
                return data;
            })
        });
    });

}

function sendMessageByBot(aChatId, aMessage)
{
    bot.sendMessage(aChatId, aMessage, { caption: 'I\'m a cute bot!' });
}