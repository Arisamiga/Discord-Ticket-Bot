const Jsonfile = require('../config.json');
exports.run = async (client, message, args) => {
if (message.author.id !== Jsonfile.owner) return message.channel.send("Sorry but you cant use this command D:").then((msg) => {
    setTimeout(() => msg.delete(), 7000);
})
    const signup = await message.channel.send({embed: {
        color: Jsonfile.signup_color,
        fields: [{
            name: Jsonfile.signup_title,
            value: "To create a ticket react with  📩"
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL()
        }
      }
    });
    await signup.react("📩")
    const collector = signup.createReactionCollector(
        (reaction, user) => message.guild.members.cache.find((member) => member.id === user.id),
        { dispose: true }
        );
    collector.on("collect", (reaction, user) => {
        switch (reaction.emoji.name) {
            case "📩":
                contining(user)
            break;
        }
    })
    async function contining(user){
        const channel = await message.guild.channels.create(`ticket: ${user.username + "-" + user.discriminator}`);

        channel.updateOverwrite(message.guild.id, {
        "SEND_MESSAGE": false,
        "VIEW_CHANNEL": false,
        });
        channel.updateOverwrite(user.id, {
        "SEND_MESSAGE": true,
        "VIEW_CHANNEL": true,
        });

        const reactionMessage = await channel.send({embed: {
            color: Jsonfile.answer_color,
            fields: [{
                name: Jsonfile.answer_title,
                value: Jsonfile.answer_description
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL()
            }
          }
        })
        await reactionMessage.react("🔒");
        await reactionMessage.react("⛔");

        const collector = reactionMessage.createReactionCollector(
        (reaction, user) => message.guild.members.cache.find((member) => member.id === user.id).hasPermission("ADMINISTRATOR"),
        { dispose: true }
        );
        

        collector.on("collect", (reaction, user) => {
        switch (reaction.emoji.name) {
            case "🔒":
            channel.updateOverwrite(user.id, { "SEND_MESSAGES": false });
            break;
            case "⛔":
            if (message.guild.channels.cache.find(c => c.name.toLowerCase() === channel.name)) { //checks if there in an item in the channels collection that corresponds with the supplied parameters, returns a boolean
                setTimeout(() => channel.delete(), 5000);
                channel.send("Deleting this channel in 5 seconds!");
                return;
            }
            break;
        }
        });
    }
  }