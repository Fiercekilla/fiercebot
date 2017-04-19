var TelegramBot = require('node-telegram-bot-api');

var token = '340829957:AAH2nqKteoElJw8tWQh3SJTCBIiQIixuTew';
var botOptions = {
    polling: true
};
var kittenArray = [
    'https://static1.squarespace.com/static/54e8ba93e4b07c3f655b452e/t/56c2a04520c64707756f4267/1455596221531/',
    'http://i.telegraph.co.uk/multimedia/archive/02830/cat_2830677b.jpg',
    'http://dreamatico.com/data_images/kitten/kitten-3.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCKbV24ga18bP0XAVCXwmYaZ6v_BEPauuG8eCcSg4H3cIkMcw5_A',
    'http://weknowyourdreams.com/images/kitten/kitten-01.jpg',
    'http://static.boredpanda.com/blog/wp-content/uploads/2016/08/cute-kittens-69-57b32c431e8a7__605.jpg'
]
var bot = new TelegramBot(token, botOptions);

bot.getMe().then(function(me)
{
    console.log('Hello! My name is %s!', me.first_name);
    console.log('My id is %s.', me.id);
    console.log('And my username is @%s.', me.username);
});

bot.on('text', function(msg)
{
    var messageChatId = msg.chat.id;
    var messageText = msg.text;
    var messageDate = msg.date;
    var messageUsr = msg.from.username;

    if (messageText === 'Привет') {
        sendMessageByBot(messageChatId, 'Привет киса, я тебя очень очень сильно люблю <3');
    }
    if (messageText === 'Kitten') {
        var rand = Math.floor(Math.random() * (kittenArray.length - 0 + 1)) + 0;
        if(kittenArray[rand] !== undefined)
        bot.sendPhoto(messageChatId,kittenArray[rand]);
        else {
            bot.sendPhoto(messageChatId,kittenArray[3]);
        }
    }

    console.log(msg);
});

function sendMessageByBot(aChatId, aMessage)
{
    bot.sendMessage(aChatId, aMessage, { caption: 'I\'m a cute bot!' });
}