const axios = require("axios").default
const fs = require("fs")
const chalk = require('chalk')
const child_process = require("child_process")

const readline = require("readline")
const rl = readline.createInterface(process.stdin, process.stdout)

process.title = "RBLX-GROUPS"

console.clear()
console.log(chalk.redBright("██████╗░██████╗░██╗░░░░░██╗░░██╗░░░░░░░██████╗░██████╗░░█████╗░██╗░░░██╗██████╗░░██████╗"))
console.log(chalk.redBright("██╔══██╗██╔══██╗██║░░░░░╚██╗██╔╝░░░░░░██╔════╝░██╔══██╗██╔══██╗██║░░░██║██╔══██╗██╔════╝"))
console.log(chalk.redBright("██████╔╝██████╦╝██║░░░░░░╚███╔╝░█████╗██║░░██╗░██████╔╝██║░░██║██║░░░██║██████╔╝╚█████╗░"))
console.log(chalk.redBright("██╔══██╗██╔══██╗██║░░░░░░██╔██╗░╚════╝██║░░╚██╗██╔══██╗██║░░██║██║░░░██║██╔═══╝░░╚═══██╗"))
console.log(chalk.redBright("██║░░██║██████╦╝███████╗██╔╝╚██╗░░░░░░╚██████╔╝██║░░██║╚█████╔╝╚██████╔╝██║░░░░░██████╔╝"))
console.log(chalk.redBright("╚═╝░░╚═╝╚═════╝░╚══════╝╚═╝░░╚═╝░░░░░░░╚═════╝░╚═╝░░╚═╝░╚════╝░░╚═════╝░╚═╝░░░░░╚═════╝░\n\n"))

const preferences = { // err config ⚙️
    started: 0, // dont you dare change this 🔫
    int: { // group id
        min: 5000000,
        max: 8200000,
    },
    interval: 1000,
    startingRequestMessages: true,
    errorMessages: true,
    /**
     * Over 600 requests per minute if "interval" is below 100.
     * 
     * 60000/(interval)
     */
    logToFile: {
        enabled: false,
        fileName: "", // exstension is required
    },
    repeat: true, // "true" for continues || "false" for 1 time
    proxy: false, // https://proxyscrape.com/free-proxy-list
    proxyFile: "", // exstension is required

    // You can leave "dWebhook" empty.
    // Intro to webhooks : https://support.discord.com/hc/en-us/articles/228383668
    // dWebhook2 Optional, only required if you're having interval on very low (near 1)
    dWebhook: "",
    dWebhook2: "",
    dWebhook3: "",
}

if (fs.existsSync(process.cwd() + '/config.json')) {
    console.log(chalk.gray("[APP]: ") + chalk.blue("Join the Discord - https://discord.gg/CT6HxZewz6"))
    console.log(chalk.gray("[APP]: ") + chalk.green("config found") + chalk.white(" (config.json)"))
    
    var pref1 = require(process.cwd() + "/config.json")

    console.log(chalk.gray("[APP]: ") + chalk.yellowBright("assigning variables"))
    preferences.int.min = pref1.int.min
    preferences.int.max = pref1.int.max
    preferences.interval = pref1.interval
    preferences.startingRequestMessages = pref1.startingRequestMessages
    preferences.errorMessages = pref1.errorMessages
    preferences.logToFile.enabled = pref1.logToFile.enabled
    preferences.logToFile.fileName = pref1.logToFile.fileName
    preferences.repeat = pref1.repeat
    preferences.proxy = pref1.proxy
    preferences.proxyFile = pref1.proxyFile
    preferences.dWebhook = pref1.dWebhook
    preferences.dWebhook2 = pref1.dWebhook2
    preferences.dWebhook3 = pref1.dWebhook3

    console.log(chalk.gray("[APP]: ") + chalk.green("assigned variables\n"))

    startMiner()
} else {
    console.log(chalk.gray("[APP]: ") + chalk.yellowBright("no config found & asking questions"))
    rl.question("Do you want to use the default settings? (true/false)\n", (defaultOrNot) => {
        if (defaultOrNot.toLowerCase() == "true") {
            console.log(chalk.gray("[APP]: ") + chalk.yellowBright("chose default preferences\n"))
            startMiner()   
        } else {
            rl.question("\nFrom which group id do you want to start? (Ex: 5000000)\n", (answer) => {
                preferences.int.min = parseInt(answer, 10)

                rl.question("\nTo which group id do you want to go? (Ex: 8200000)\n", (answer2) => {
                    preferences.int.max = parseInt(answer2, 10)

                    rl.question("\nHow many MILLISECONDS do you want to be between every request? (Ex: 100)\n", (answer3) => {
                        preferences.interval = parseInt(answer3, 10)

                        rl.question("\nDo you want to log request messages? (true/false)\n", (answer4) => {
                            if (answer4.toLowerCase() == "true") {
                                preferences.startingRequestMessages = true
                            } else {
                                preferences.startingRequestMessages = false
                            }

                            rl.question("\nDo you want to log error messages? (true/false)\n", (answer5) => {
                                if (answer5.toLowerCase() == "true") {
                                    preferences.errorMessages = true
                                } else {
                                    preferences.errorMessages = false
                                }

                                function done() {
                                    fs.writeFileSync(process.cwd() + "/config.json", JSON.stringify(preferences))
                                    console.log(chalk.gray("[APP]: ") + chalk.greenBright("Setup Finished"))

                                    startMiner()
                                }

                                function afterProxy() {
                                    rl.question("\nDiscord Webhook 1 URL (Optional, leave blank for none)\n", (w1) => {
                                        if (w1.split(" ").join("") == "") {
                                            preferences.dWebhook = ""

                                            done()
                                        } else {
                                            preferences.dWebhook = w1

                                            rl.question("\nDiscord Webhook 2 URL (Optional, leave blank for none)\n", (w2) => {
                                                if (w2.split(" ").join("") == "") {
                                                    preferences.dWebhook2 = ""
        
                                                    done()
                                                } else {
                                                    preferences.dWebhook2 = w2

                                                    rl.question("\nDiscord Webhook 3 URL (Optional, leave blank for none)\n", (w3) => {
                                                        if (w3.split(" ").join("") == "") {
                                                            preferences.dWebhook3 = ""
                
                                                            done()
                                                        } else {
                                                            preferences.dWebhook3 = w3
                                                    
                                                            done()
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }

                                function afterLog() {
                                    rl.question("\nDo you want to repeat? (true/false)\n", (answer7) => {
                                        if (answer7.toLowerCase() == "true") {
                                            preferences.repeat = true
                                        } else {
                                            preferences.repeat = false
                                        }

                                        rl.question("\nDo you want to use proxys? (true/false)\n", (answer8) => {
                                            if (answer8.toLowerCase() == "true") {
                                                preferences.proxy = true

                                                console.log(chalk.grey("\nEach line of the proxy file must look like this: ") + chalk.yellowBright("ip:port"))
                                                rl.question("Send the name of the file with the proxys inside. ! WITH EXSTENSION !\n", (proxyFile) => {
                                                    preferences.proxyFile = proxyFile

                                                    afterProxy()
                                                })
                                            } else {
                                                preferences.proxy = false

                                                afterProxy()
                                            }
                                        })
                                    })
                                }

                                rl.question("\nDo you want to log the groups to a file? (true/false)\n", (answer6) => {
                                    if (answer6.toLowerCase() == "true") {
                                        preferences.logToFile.enabled = true

                                        rl.question("\nWhere do you want to log the groups? (Ex: txt file) ! WITH EXSTENSION !\n", (logFile) => {
                                            preferences.logToFile.fileName = logFile.toString()

                                            afterLog()
                                        })
                                    } else {
                                        preferences.logToFile.enabled = false

                                        afterLog()
                                    }
                                })
                            })
                        })
                    })
                })
                
            })
        }
    })
}

if (preferences.logToFile.enabled == true) {
    var wStream = fs.createWriteStream(process.cwd() + "/" + preferences.logToFile.fileName)

    wStream.write("Made by completelyfcked#0001\nGroups can be unable to load, the Roblox API does not show if it loads or not.\nMake sure to tab in and out because if you're viewing the file, you only see the one when you opened it.\n\n")
}

var stats = { groupsFound: 0, requestsMade: 0 }

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

    var proxies = fs.readFileSync(process.cwd() + "/" + preferences.proxyFile)
    proxies = proxies.toString().split("\n")

    if (!proxies[currentProxy.index++]) {
        currentProxy.index = 0;
    }

    var proxy = proxies[currentProxy.index++]
    try {
        proxy = proxy.toString().split(":")

        currentProxy.host = proxy[0]
        currentProxy.port = proxy[1]
    } catch (err) {
        console.error(chalk.gray("[APP]:") + chalk.red(" Error fetching Proxy"))  
    }
}

function startMiner() {
    var currentint = preferences.int.min;

    var miner = setInterval(() => {
        if (!preferences.started == 1) { console.log(chalk.gray("[APP]:") + chalk.greenBright(" Starting")); preferences.started = 1; } // dont you dare change this 🔫
        if (currentint > preferences.int.max) return end(miner);

        if (preferences.proxy) {
            if (preferences.startingRequestMessages) {
                console.log(chalk.gray("[APP]: ") + "starting request with proxy " + `${currentProxy.host}:${currentProxy.port}`)
            }

            newProxy()
        } else {
            if (preferences.startingRequestMessages) {
                console.log(chalk.gray("[APP]: ") + "starting request")
            }
        };

        var conf = axiosConfig(currentProxy.host, currentProxy.port)

        axios.get(`https://groups.roblox.com/v1/groups/${currentint}`, conf).then((res, req) => {
            var data = res.data;

            console.log(chalk.gray("[APP]: ") + chalk.blueBright(currentint))

            currentint++;

            if (data.owner.username == "") {
                if (data.isLocked != true) {
                    if (data.publicEntryAllowed == true) {
                        valid(data, miner)
                    }
                }
            }
        }).catch((err) => {
            if (err.response && preferences.errorMessages) {
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
}

function end(miner) {
    if (preferences.repeat == false) {
        console.warn(chalk.gray("[APP]:") + chalk.greenBright(" Finished"))

        clearInterval(miner) // Stops it from running again
    };

    currentint = preferences.int.min;
}

function valid(data, miner) {
    if (preferences.logToFile.enabled) {
        wStream.write(`${data.name} - ${data.id}\n`)
    }

    console.warn(chalk.gray("[APP]: ") + chalk.bgGreenBright.blackBright(`${data.name} - ${data.id}`))

    if (!preferences.dWebhook == "") {
        axios.post(preferences.dWebhook,
            webhook(data)
        ).catch((err) => {
            if (!preferences.dWebhook2 && preferences.errorMessages) {
                return console.error(chalk.gray("[APP]:") + chalk.red(` Discord Webhook Error`));
            };

            axios.post(preferences.dWebhook2,
                webhook(data)
            ).catch((err) => {
                if (preferences.dWebhook2) {
                    axios.post(preferences.dWebhook3, webhook(data)).catch((err) => {
                        if (preferences.errorMessages) {
                            return console.error(chalk.gray("[APP]:") + chalk.red(` Discord Webhook Error`));
                        } else {
                            return;
                        } 
                    })
                } else {
                    if (preferences.errorMessages) {
                        return console.error(chalk.gray("[APP]:") + chalk.red(` Discord Webhook Error`));
                    } else {
                        return;
                    }
                }
            })
        })
    }
}

function webhook(data) {
    return {
        "content": null,
        "embeds": [
            {
                "title": "Group Found",
                "description": "The groups have a high chance of not loading because they are too outdated.\nMake sure to check `" + preferences.logToFile.fileName + ".txt` for the more accurate results since Discord doesn't like so many post requests to a webhook.",
                "url": "https://www.roblox.com/groups/" + data.id,
                "color": 1638178,
                "fields": [
                    {
                        "name": "Name",
                        "value": data.name,
                        "inline": true
                    },
                    {
                        "name": "Members",
                        "inline": true,
                        "value": data.memberCount
                    },
                    {
                        "name": "Id",
                        "inline": true,
                        "value": data.id
                    }
                ],
                "author": {
                    "name": "completelyfcked#0001",
                    "url": "https://discord.com/users/449250687868469258",
                    "icon_url": "https://cdn.discordapp.com/attachments/906456481589768192/925122166540869692/completelyf_trans.png"
                },
                "thumbnail": {
                    "url": "https://external-preview.redd.it/9HZBYcvaOEnh4tOp5EqgcCr_vKH7cjFJwkvw-45Dfjs.png?auto=webp&s=ade9b43592942905a45d04dbc5065badb5aa3483"
                },
                "footer": {
                    "text": "Thumbnail is currently not supported."
                }
            }
        ]
    }
}