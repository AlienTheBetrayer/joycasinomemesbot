// All libraries
const Telegraf = require("telegraf");
const random = require("random");
const fetch = require("node-fetch");

// Files
const config = require("./config.json");

// Other
const client = new Telegraf(config.token);

// Helper functions
getMemes = (type, time) =>{
    return new Promise((resolve, reject) => {
        let url = `https://api.reddit.com/r/memes/top.json?sort=${type}`;

        if(time)
            url += `&t=${time}`;
        
        url += "&limit=100";

        fetch(url)
        .then(async r => {
            const response = await r.json();
            const imageURL = response.data.children[random.int(0, response.data.children.length - 1)].data.url;

            return resolve(imageURL);
        });
    });
}

// Commands
// Hot meme
client.command("hotmeme", async ctx => {
    getMemes("hot")
    .then(url => {
        ctx.replyWithPhoto(url);
    });
});

// Top memes
client.command("topmemeday", async ctx => {
    getMemes("top", "day")
    .then(url => {
        ctx.replyWithPhoto(url);
    });
});

client.command("topmemeweek", async ctx => {
    getMemes("top", "week")
    .then(url => {
        ctx.replyWithPhoto(url);
    });
});

client.command("topmememonth", async ctx => {
    getMemes("top", "month")
    .then(url => {
        ctx.replyWithPhoto(url);
    });
});

client.command("topmemeyear", async ctx => {
    getMemes("top", "year")
    .then(URL => {
        ctx.replyWithPhoto({url: URL}, {caption: "BIBBA"});
        
    });
});

client.command("topmemeall", async ctx => {
    getMemes("top", "all")
    .then(url => {
        ctx.replyWithPhoto(url);
    });
});

client.launch();