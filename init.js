const axios = require("axios").default
const fs = require("fs")
const chalk = require('chalk')

console.clear()
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
        min: 1000000,
        max: 10000000,
    },
    interval: 5000,
    logToFile: {
        enabled: true,
        fileName: "log" // exstension will be added automaticly
    },
    repeat: true, // "true" for continues || "false" for 1 time
    proxy: true,
}

if (preferences.logToFile.enabled) {
    var wStream = fs.createWriteStream(preferences.logToFile.fileName + ".txt")
}

var currentProxy = { host: null, port: null };
function axiosConfig(host, port) {
    if (!preferences.proxy) return {};

    return {
        proxy: {
            host: host,
            port: port
        }
    };
}
function newProxy() {
    if (!preferences.proxy) return;

    axios.get("yourAPI").then((res, req) => {
        currentProxy.host = res.data.ip // modify data so it points to the right thing
        currentProxy.port = parseInt(res.data.port, 10)
    })
}

var currentint = preferences.int.min;
var miner = setInterval(() => {
    if (!preferences.started == 1) { console.log(chalk.gray("[APP]:") + chalk.greenBright(" Started")); preferences.started++; if (preferences.proxy) newProxy(); } // dont you dare change this 🔫
    if (currentint > preferences.int.max) return end(); else { currentint++; };

    if (preferences.proxy) {
        //console.log(chalk.gray("[APP]: ") + "starting request with proxy " + `${currentProxy.host}:${currentProxy.port}`)
    } else {
        //console.log(chalk.gray("[APP]: ") + "starting request")
    };

    var conf = axiosConfig(currentProxy.host, currentProxy.port)

    axios.get(`https://groups.roblox.com/v1/groups/${currentint}`,
        conf
    ).then((res, req) => {
        var data = res.data;

        console.log(chalk.gray("[APP]: ") + currentint)

        if (data.publicEntryAllowed == true && data.owner == null) {
            valid(data)
        }
    }).catch((err) => {
        if (err.response) {
            var done = 0;

            if (err.response.status == 429 || res.status == 429) {
                console.log(chalk.gray("[APP]:") + chalk.red(" 429"))
                if (preferences.proxy) newProxy();
                done++;
            };

            if (done == 1) return;

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