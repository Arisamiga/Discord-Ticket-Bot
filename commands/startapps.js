const Jsonfile = require('../config.json');
exports.run = async (client, message) => {
  if (message.author.id !== Jsonfile.owner) return message.channel.send("Sorry but you cant use this command D:").then((msg) => {
    setTimeout(() => msg.delete(), 7000);
  })
  const signupEmbed = {
    color: Jsonfile.signup_color,
    fields: [{
      name: Jsonfile.signup_title,
      value: "To create a ticket react with  📩"
    }],
    footer: {
      icon_url: client.user.avatarURL()
    }
  }
  const signup = await message.channel.send({
    embeds: [signupEmbed]
  });
  await signup.react("📩")
  const collector = signup.createReactionCollector(
    (reaction, user) => message.guild.members.cache.find((member) => member.id === user.id), {
      dispose: true
    }
  );
  collector.on("collect", (reaction, user) => {
    if (user.bot) return;
    switch (reaction.emoji.name) {
      case "📩":
        let channelname = `ticket-${user.username}-${user.discriminator}`
        channelname = channelname.replace(/\s/g, '-').toLowerCase()
        if (message.guild.channels.cache.find(channel => channel.name === channelname) && Jsonfile.one_app) {
          user.send(`You already have an ongoing ticket.`).catch(console.error);
          reaction.users.remove(user.id)
          return;
        } else {
          contining(user)
          reaction.users.remove(user.id)
        }
        break;
    }
  })
  async function contining(user) {
    const channel = await message.guild.channels.create(`ticket: ${user.username + "-" + user.discriminator}`);

    channel.permissionOverwrites.edit(message.guild.id, {
      "SEND_MESSAGES": false,
      "VIEW_CHANNEL": false,
    });
    channel.permissionOverwrites.edit(user.id, {
      "SEND_MESSAGES": true,
      "VIEW_CHANNEL": true,
    });
    channel.permissionOverwrites.edit(Jsonfile.Channelrole, {
      "SEND_MESSAGES": true,
      "VIEW_CHANNEL": true,
    })

    const reactionMessageEmbed = {
      color: Jsonfile.answer_color,
      fields: [{
        name: Jsonfile.answer_title,
        value: Jsonfile.answer_description
      }],
      footer: {
        icon_url: client.user.avatarURL()
      }
    }
    const reactionMessage = await channel.send({
      embeds: [reactionMessageEmbed]
    })
    await reactionMessage.react("🔒");
    await reactionMessage.react("⛔");

    const collector = reactionMessage.createReactionCollector(
      (reaction, user) => message.guild.members.cache.find((member) => member.id === user.id).permissions.has("ADMINISTRATOR") || message.guild.members.cache.find((member) => member.id === user.id).roles.cache.find(r => r.id === Jsonfile.Channelrole), {
        dispose: true
      }
    );


    collector.on("collect", (reaction, user) => {
      if (user.bot) return;
      switch (reaction.emoji.name) {
        case "🔒":
          if (message.guild.members.cache.find((member) => member.id === user.id).permissions.has("ADMINISTRATOR") || message.guild.members.cache.find((member) => member.id === user.id).roles.cache.find(r => r.id === Jsonfile.Channelrole)) {
            channel.permissionOverwrites.edit(user.id, {
              "SEND_MESSAGES": false
            });
            channel.send("Channel Locked 🔒");
            break;
          } else {
            user.send("Only Staff can lock the channels")
            reaction.users.remove(user.id)
            break
          }
          case "⛔":
            if (message.guild.channels.cache.find(c => c.name.toLowerCase() === channel.name)) {
              if (message.guild.members.cache.find((member) => member.id === user.id).permissions.has("ADMINISTRATOR") || message.guild.members.cache.find((member) => member.id === user.id).roles.cache.find(r => r.id === Jsonfile.Channelrole)) {
                setTimeout(() => channel.delete(), 5000);
                channel.send("Deleting this channel in 5 seconds!");
                return;
              } else {
                user.send("Only Staff can delete the channels")
                reaction.users.remove(user.id)
                break
              }
            }
            break;
      }
    });
  }
}