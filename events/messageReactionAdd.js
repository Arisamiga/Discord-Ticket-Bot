const config = require(`../config.json`);
const fs = require('fs');
const { contining } = require('../commands/startapps.js');
module.exports = (client, messageReaction, user) => {
    if (user.bot) return; // Ignore bot's reactions

    // Readfile collectors.json and save it in a variable
    let collectors = JSON.parse(fs.readFileSync('./collectors.json', 'utf8'));

    // Handle collectors
    if (!collectors.collector.filter((e) => e.id === messageReaction.message.id).length > 0) {
        if (messageReaction.emoji.name === '📩') {
            let channelname = `ticket-${user.username}`;
            channelname = channelname.replace(/\s/g, '-').toLowerCase();
            if (!messageReaction.message.guild.channels.cache.find((channel) => channel.name === channelname) || !config.one_app) {
                user.send(`You already have an ongoing ticket.`).catch(console.error);
                return messageReaction.users.remove(user.id);
            }
            contining(client, messageReaction.message, user);
            messageReaction.users.remove(user.id);
        }
    }

    // Handle tickets
    if (collectors.tickets.filter((e) => e.id === messageReaction.message.id).length > 0) {
        let channel = messageReaction.message.guild.channels.cache.find((channel) => channel.id === messageReaction.message.channel.id);
        switch (messageReaction.emoji.name) {
            case '🔒':
                if (!checkUser(messageReaction.message, user) || config.allow_user_lock) {
                    user.send('Only Staff can lock the channels');
                    return messageReaction.users.remove(user.id);
                }
                channel.permissionOverwrites.edit(user.id, {
                    SEND_MESSAGES: false,
                });
                return messageReaction.message.channel.send('Channel Locked 🔒');
            case '⛔':
                if (!messageReaction.message.guild.channels.cache.find((c) => c.name.toLowerCase() === channel.name)) return;
                if (!checkUser(messageReaction.message, user) || config.allow_user_delete) {
                    user.send('Only Staff can delete the channels').catch(console.error);
                    messageReaction.users.remove(user.id);
                    break;
                }
                setTimeout(() => {
                    if (messageReaction.message.guild.channels.cache.find((c) => c.name.toLowerCase() === channel.name)) channel.delete();
                    removeTicketfromCollectors(messageReaction.message.id);
                }, 5000);
                messageReaction.message.channel.send('Deleting this channel in 5 seconds!');
                return;
        }
    }
};

const checkUser = (message, user) => {
    if (message.guild.members.cache.find((member) => member.id === user.id).permissions.has('ADMINISTRATOR')) return true;

    var roles = config.Channelrole.some((role) => {
        if (message.guild.members.cache.find((member) => member.id === user.id).roles.cache.find((r) => r.id === role)) return true;
    });
    if (roles) return true;

    return false;
};
const removeTicketfromCollectors = (MessageID) => {
    let collectors = JSON.parse(fs.readFileSync('./collectors.json', 'utf8'));
    collectors.tickets = collectors.tickets.filter((e) => e.id !== MessageID);
    const json = JSON.stringify(collectors);
    fs.writeFile('./collectors.json', json, 'utf8', (err) => {
        if (err) throw err;
    });
};
