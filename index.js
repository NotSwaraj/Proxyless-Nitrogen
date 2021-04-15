const request = require('request');
const fs = require('fs');
const chalk = require('chalk');
const triesPerSecond = 0.5;
var working = [];

getGiftCode = function () {
    let code = '';
    let dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for(var i = 0; i < 16; i++){
        code = code + dict.charAt(Math.floor(Math.random() * dict.length));
    }
    return code;
}

checkCode = function (code) {
    request(`https://discordapp.com/api/v6/entitlements/gift-codes/${code}?with_application=false&with_subscription_plan=true`, (error, res, body) => {
        if(error){
            console.log(`An error occurred:`);
            console.log(error);
            return;
        }
        try {
            body = JSON.parse(body);
            if(body.message != "Unknown Gift Code" && body.message != "You are being rate limited."){
                console.log(chalk.green`https://discord.gift/${code} is Valid!`);
                 console.log(JSON.stringify(body, null, 4));
                working.push(`https://discord.gift/${code}`);
                fs.writeFileSync(__dirname + '/codes.json', JSON.stringify(working, null, 4));
                
            }
            else {
                console.log(chalk.red`${code} is invalid`);
            }
        }
        catch (error) {
            console.log(`An error occurred:`);
            console.log(error);
            return;
        }
    });
}

console.log("Nitro Generator now starting!")




checkCode(getGiftCode());
setInterval(() => {
    checkCode(getGiftCode());
}, (6/triesPerSecond) * 1000);
