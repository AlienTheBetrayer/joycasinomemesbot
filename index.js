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
            
            const data = response.data.children[random.int(0, response.data.children.length - 1)].data;

            return resolve(data);
        });
    });
}

reply = (ctx, data) => {
    ctx.replyWithPhoto({url: data.url}, {caption: `${data.title}\n\nPosted by u/${data.author} in r/${data.subreddit}\n\n⬆️ Upvotes: ${data.ups}\n💬 Comments: ${data.num_comments}`});   
}

client.on("text", async ctx => {
    const content = ctx.update.message.text;

    const parts = content.split(" ");
    const command = parts[0].substr(1, parts[0].length - 1);

    const args = parts.slice(1);
 // /subreddit memes hot
    switch(command) {
        case "subreddit":
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
            break;

        case "meme":
            const meme_subreddits = [
                "memes", "dankmemes"
            ];

            const rand = random.int(0, meme_subreddits.length - 1);

            let meme_subreddit = meme_subreddits[rand];
            let meme_category = args[0];
            let meme_time = args[1];

            if(!meme_category)
                meme_category = "hot";
            
            if(!meme_time && meme_category != "hot")
                meme_time = "all";
    
            getPosts(meme_subreddit, meme_category, meme_time)
            .then(data => {
                reply(ctx, data);
            });
            break;
    }
});

client.launch();