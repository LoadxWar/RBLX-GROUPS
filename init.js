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
    interval: 10,
    logToFile: {
        enabled: true,
        fileName: "log" // exstension will be added automaticly
    },
    repeat: true, // "true" for continues || "false" for 1 time
    proxy: true,
    proxyFile: "http_proxies.txt",
}

if (preferences.logToFile.enabled) {
    var wStream = fs.createWriteStream(preferences.logToFile.fileName + ".txt")
}

var currentProxy = { host: null, port: null, index: 0 };
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

    var proxies = fs.readFileSync(preferences.proxyFile)
    proxies = proxies.toString().split("\n")

    if (!proxies[currentProxy.index++]) {
        currentProxy.index = 0;
    }

    var proxy = proxies[currentProxy.index++]
    proxy = proxy.toString().split(":")

    currentProxy.host = proxy[0]
    currentProxy.port = proxy[1]
}

var currentint = preferences.int.min;
var miner = setInterval(() => {
    if (!preferences.started == 1) { console.log(chalk.gray("[APP]:") + chalk.greenBright(" Started")); preferences.started++; } // dont you dare change this 🔫
    if (currentint > preferences.int.max) return end(); else { currentint++; };

    if (preferences.proxy) {
        console.log(chalk.gray("[APP]: ") + "starting request with proxy " + `${currentProxy.host}:${currentProxy.port}`)

        newProxy()
    } else {
        console.log(chalk.gray("[APP]: ") + "starting request")
    };

    var conf = axiosConfig(currentProxy.host, currentProxy.port)

    axios.get(`https://groups.roblox.com/v1/groups/${currentint}`,
        conf
    ).then((res, req) => {
        var data = res.data;

        console.log(chalk.gray("[APP]: ") + chalk.blue(currentint))

        if (data.owner == null) {
            valid(data)
        }
    }).catch((err) => {
        if (err.response) {
            var done = 0;

            if (err.response.status == 429) {
                console.warn(chalk.gray("[APP]:") + chalk.red(" 429 (RATE LIMIT)"))
                done++;
            } else if (err.response.status == 502) {
                console.log(chalk.gray("[APP]:") + chalk.red(" 502 (BAD GATEWAY)"))
                done++;
            } else if (err.response.status == 404) {
                console.log(chalk.gray("[APP]:") + chalk.red(" 404 (NOT FOUND)"))
                done++;
            } else if (err.response.status == 503) {
                console.error(chalk.gray("[APP]:") + chalk.red(" 503 (TOO MANY OPEN CONNECTIONS)"))
                done++;
            } else if (err.response.status == 403) {
                console.log(chalk.gray("[APP]:") + chalk.red(" 403 (FORBIDDEN)"))
                done++;
            } else {
                console.log(chalk.gray("[APP]: ") + chalk.red(err.response.status))
            };
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