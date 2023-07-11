const config = require(`../config.json`)
const fs = require('fs');
const {contining} = require('../commands/startapps.js')
module.exports = (client, messageReaction, user) => {
    function checkUser(message, user) {
        if (message.guild.members.cache.find((member) => member.id === user.id).permissions.has("ADMINISTRATOR")) {
          return true
        }
        var roles = config.Channelrole.some(role => {
          if (message.guild.members.cache.find((member) => member.id === user.id).roles.cache.find(r => r.id === role)) {
            return true
          }
        });
        if (roles) {
          return true
        }
        return false
      }
    
    function removeTicketfromCollectors(MessageID){
        let collectors = JSON.parse(fs.readFileSync('./collectors.json', 'utf8'));
        collectors.tickets = collectors.tickets.filter(e => e.id !== MessageID)
        json = JSON.stringify(collectors);
        fs.writeFile('./collectors.json', json, 'utf8', function(err) {
            if (err) throw err;
        });
    }

    // Readfile collectors.json and save it in a variable
    let collectors = JSON.parse(fs.readFileSync('./collectors.json', 'utf8'));
    if (collectors.collector.filter(e => e.id === messageReaction.message.id).length > 0) {
        if (user.bot) return;
        switch (messageReaction.emoji.name) {
            case "📩":
                let channelname = `ticket-${user.username}`
                channelname = channelname.replace(/\s/g, '-').toLowerCase()
                if (messageReaction.message.guild.channels.cache.find(channel => channel.name === channelname) && config.one_app) {
                    user.send(`You already have an ongoing ticket.`).catch(console.error);
                    messageReaction.users.remove(user.id)
                    return;
                } else {
                    contining(client, messageReaction.message, user)
                    messageReaction.users.remove(user.id)
                }
                
            }
        }
    if (collectors.tickets.filter(e => e.id === messageReaction.message.id).length > 0) {
        if (user.bot) return;
        let channel = messageReaction.message.guild.channels.cache.find(channel => channel.id === messageReaction.message.channel.id);
        switch (messageReaction.emoji.name) {
            case "🔒":
                    if (checkUser(messageReaction.message, user) || config.allow_user_lock) {
                      channel.permissionOverwrites.edit(user.id, {
                        "SEND_MESSAGES": false
                      });
                      messageReaction.message.channel.send("Channel Locked 🔒");
                      break;
                    } else {
                      user.send("Only Staff can lock the channels")
                      messageReaction.users.remove(user.id)
                      break
                    }
            case "⛔":
                if (messageReaction.message.guild.channels.cache.find(c => c.name.toLowerCase() === channel.name)) {
                if (checkUser(messageReaction.message, user) || config.allow_user_delete) {
                    setTimeout(() => {
                    if (messageReaction.message.guild.channels.cache.find(c => c.name.toLowerCase() === channel.name)) {
                        channel.delete();
                        removeTicketfromCollectors(messageReaction.message.id)
                    }
                    else {
                        removeTicketfromCollectors(messageReaction.message.id)
                    }
                    }, 5000);
                    messageReaction.message.channel.send("Deleting this channel in 5 seconds!");
                    return;
                } else {
                    user.send("Only Staff can delete the channels").catch(console.error);
                    messageReaction.users.remove(user.id)
                    break
                }
                }
                break;
        }
    }
};