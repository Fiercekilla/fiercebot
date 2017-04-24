let request = require('request');
let rp = require('request-promise');
let https = require('https');
let TelegramBot = require('node-telegram-bot-api');

let token = '340829957:AAH2nqKteoElJw8tWQh3SJTCBIiQIixuTew';
let botOptions = {
    polling: true
};
let itemsArray = [];
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

    itemsArray = [];

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
    if (messageText.indexOf('/l') !== -1){
        let mesage = messageText.split(' ');
        if(mesage.length === 2){
            getLeagueData(mesage[1], messageChatId);
        } else {
            sendMessageByBot(messageChatId, 'Команда не верна. Введите /l *Имя призывателя*.');
        }


    }

    console.log(msg);
});

function getLeagueData(name, chatId) {
    let sumId;
    request('https://ru.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + name + '?api_key=RGAPI-1fc5b64a-0dec-433c-9cb6-93b34d30c663', function (error, response, body) {
        console.log('SummonerId:', JSON.parse(body).id); // Print the HTML for the Google homepage.
        sumId =  JSON.parse(body).id;
        request('https://ru.api.riotgames.com/api/lol/RU/v1.3/game/by-summoner/' + sumId + '/recent?api_key=RGAPI-1fc5b64a-0dec-433c-9cb6-93b34d30c663', function (error, response, body) {
            let matchList = JSON.parse(body).games;
            let win = matchList[0].stats['win'];
            let stats = matchList[0].stats;
            request('https://ru.api.riotgames.com/lol/static-data/v3/champions/' + matchList[0].championId + '?champData=info&api_key=RGAPI-1fc5b64a-0dec-433c-9cb6-93b34d30c663', function (error, response, body) {
                let name = JSON.parse(body).name;
                let data = {
                    win: win,
                    champName: name
                };
                let rankedStats = [];
                let w = win ? 'победили' : 'проиграли';
                let KDA = (stats['championsKilled'] + stats['assists'])/stats['numDeaths'];
                let statsKeys = Object.keys(stats);
                itemsCollector(stats, statsKeys);
                request('https://ru.api.riotgames.com/api/lol/RU/v2.5/league/by-summoner/' + sumId + '/entry?api_key=RGAPI-1fc5b64a-0dec-433c-9cb6-93b34d30c663',function (error, responce, body) {
                    let stats = JSON.parse(body);
                    stats[sumId].forEach(function (item) {
                       rankedStats.push(leagueConverter(item));
                    });
                });
                setTimeout(function () {
                    sendMessageByBot(chatId,
                        `Ранговая статистика: \n${rankedStats.join('\n')}\n
Последний раз вы ${w} за ${data.champName}.\n
Убито миньонов: ${stats['minionsKilled']}\n
KDA: ${stats['championsKilled']}/${stats['numDeaths']}/${stats['assists']}(${KDA.toFixed(2)})\n
Предметы:\n${itemsArray.join('\n')}`);
                },500);
            });
        });
    });

}

function itemsCollector(obj,keys) {
    for(let i = 0; i < keys.length; i++){
        if (keys[i].indexOf('item') === 0){
            rp('https://ru.api.riotgames.com/lol/static-data/v3/items/' + obj[keys[i]] + '?itemData=all&locale=ru_RU&api_key=RGAPI-1fc5b64a-0dec-433c-9cb6-93b34d30c663')
                .then(function (res) {
                    itemsArray.push(JSON.parse(res).name);
                });
        }
    }
}

function leagueConverter(data) {
    let result,
        league,
        type,
        winrate,
        tier;
    switch (data.queue){
        case 'RANKED_SOLO_5x5':
            type = 'Ранговая одиночная/парная: ';
            break;
        case 'RANKED_FLEX_SR':
            type = 'Ранговая гибкая: ';
            break;
        default:
            type = data.queue;
            break;
    }
    switch (data.tier) {
        case 'BRONZE':
            league = 'Бронза';
            break;
        case 'SILVER':
            league = 'Серебро';
            break;
        case 'GOLD':
            league = 'Золото';
            break;
        case 'PLATINUM':
            league = 'Платина';
            break;
        case 'DIAMOND':
            league = 'Алмаз';
            break;
        case 'MASTER':
            league = 'Мастер';
            break;
        case 'CHALLENGER':
            league = "Претендент";
            break;
    }
    switch (data.entries[0].division) {
        case 'I':
            tier = '1';
            break;
        case 'II':
            tier = '2';
            break;
        case 'III':
            tier = '3';
            break;
        case 'IV':
            tier = '4';
            break;
        case 'V':
            tier = '5';
            break;
    }
    winrate = data.entries[0].wins / (data.entries[0].wins + data.entries[0].losses) * 100;
    result = type + '\n' + league + ' ' + tier + ' ' + ' ' + data.entries[0]['leaguePoints'] + 'ЛП \nСыграно игр:' + (data.entries[0].wins + data.entries[0].losses) + '\nПроцент побед: ' + winrate.toFixed(1) + '%\n';
    return result;

}

function sendMessageByBot(aChatId, aMessage)
{
    bot.sendMessage(aChatId, aMessage, { caption: 'I\'m a cute bot!' });
}