// All libraries
const Telegraf = require("telegraf");
const random = require("random");
const fetch = require("node-fetch");

// Files
const config = require("./config.json");

// Other
const client = new Telegraf(config.token);

// Helper functions
getPosts = (subreddit, type, time) =>{
    return new Promise((resolve, reject) => {
        let url = `https://api.reddit.com/r/${subreddit}/top.json?sort=${type}`;
        
        if(time)
            url += `&t=${time}`;
        
        url += "&limit=100";

        fetch(url)
        .then(async r => {
            const response = await r.json();

            if(response.error == 404)
                return;

            return resolve(response.data.children[random.int(0, response.data.children.length - 1)].data);
        });
    });
}

reply = (ctx, data) => {
    ctx.replyWithPhoto({url: data.url}, {caption: `${data.title}\n\nPosted by u/${data.author} in r/${data.subreddit}\n\n⬆️ Upvotes: ${data.ups}\n💬 Comments: ${data.num_comments}`});   
}

// Commands
// Hot meme
client.command("hotmeme", async ctx => {
    getPosts("hot")
    .then(data => {
        reply(ctx, data);
    });
});

client.on("text", async ctx => {
    const content = ctx.update.message.text;

    const parts = content.split(" ");
    const command = parts[0].substr(1, parts[0].length - 1);

    const args = parts.slice(1);
 // /subreddit memes hot
    if(command == "subreddit") {
        const subreddit = args[0];

        if(!subreddit)
            return;
        
        let category = args[1];
        let time = args[2];

        if(!category)
            category = "hot";
            
        if(!time && category != "hot")
            time = "all";

        getPosts(subreddit, category, time)
        .then(data => {
            reply(ctx, data);
        });
    }
});

// Top memes
client.command("topmemeday", async ctx => {
    getPosts("memes", "top", "day")
    .then(data => {
        reply(ctx, data);
    });
});

client.command("topmemeweek", async ctx => {
    getPosts("memes", "top", "week")
    .then(data => {
        reply(ctx, data);
    });
});

client.command("topmememonth", async ctx => {
    getPosts("memes", "top", "month")
    .then(data => {
        reply(ctx, data);
    });
});

client.command("topmemeyear", async ctx => {
    getPosts("memes", "top", "year")
    .then(data => {
        reply(ctx, data);
    });
});

client.command("topmemeall", async ctx => {
    getPosts("memes", "top", "all")
    .then(data => {
        reply(ctx, data);
    });
});

client.launch();