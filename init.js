const axios = require("axios").default
const fs = require("fs")
const chalk = require('chalk')

console.log(chalk.redBright("██████╗░██████╗░██╗░░░░░██╗░░██╗░░░░░░░██████╗░██████╗░░█████╗░██╗░░░██╗██████╗░░██████╗"))
console.log(chalk.redBright("██╔══██╗██╔══██╗██║░░░░░╚██╗██╔╝░░░░░░██╔════╝░██╔══██╗██╔══██╗██║░░░██║██╔══██╗██╔════╝"))
console.log(chalk.redBright("██████╔╝██████╦╝██║░░░░░░╚███╔╝░█████╗██║░░██╗░██████╔╝██║░░██║██║░░░██║██████╔╝╚█████╗░"))
console.log(chalk.redBright("██╔══██╗██╔══██╗██║░░░░░░██╔██╗░╚════╝██║░░╚██╗██╔══██╗██║░░██║██║░░░██║██╔═══╝░░╚═══██╗"))
console.log(chalk.redBright("██║░░██║██████╦╝███████╗██╔╝╚██╗░░░░░░╚██████╔╝██║░░██║╚█████╔╝╚██████╔╝██║░░░░░██████╔╝"))
console.log(chalk.redBright("╚═╝░░╚═╝╚═════╝░╚══════╝╚═╝░░╚═╝░░░░░░░╚═════╝░╚═╝░░╚═╝░╚════╝░░╚═════╝░╚═╝░░░░░╚═════╝░\n\n"))

const preferences = { // err config ⚙️
    started: 0, // dont you dare change this 🔫
    webhook: {
        enabled: false,
        url: "",
    },
    int: { // group id
        min: 50000,
        max: 100000,
    },
    interval: 1000,
    logToFile: {
        enabled: true,
        fileName: "log" // exstension will be added automaticly
    },
    repeat: true, // "true" for continues || "false" for 1 time
}

if (preferences.logToFile.enabled) {
    var wStream = fs.createWriteStream(preferences.logToFile.fileName + ".txt")
}

var currentProxy = {};
function newProxy() {
    axios.get("https://api.getproxylist.com/proxy").then((res, req) => {
        currentProxy.host = res.data.ip
        currentProxy.port = res.data.port
    })
}

var currentint = preferences.int.min;
var miner = setInterval(() => {
    if (!preferences.started == 1) { console.log(chalk.gray("[APP]:") + chalk.greenBright(" Started")); preferences.started++; } // dont you dare change this 🔫
    if (currentint > preferences.int.max) return end(); else { currentint++; };

    axios.get(`https://groups.roblox.com/v1/groups/${currentint}`,
        {
            proxy: {
                host: "http://" + currentProxy.host,
                port: currentProxy.port
            }
        }
    ).then((res, req) => {
        var data = res.data;

        console.log(chalk.gray("[APP]: ") + currentint)

        if (data.publicEntryAllowed == true && data.owner == null) {
            valid(data)
        }
    }).catch((err) => {
        if (err.response) {
            if (err.response.status == 429) {
                console.log(chalk.gray("[APP]:") + chalk.red(" 429"))

                newProxy()
            };
            
            console.error(err)
        }
    })
}, preferences.interval)

function end() {
    if (preferences.repeat == false) {
        console.warn(chalk.gray("[APP]:") + " Finished")

        clearInterval(miner) // Stops it from running again
    };

    currentint = preferences.int.min;
}

function valid(data) {
    if (preferences.logToFile.enabled) {
        wStream.write(`${data.name} (${data.id})`)
    }

    console.warn(`[APP]: ${data.name} (${data.id})`)
}