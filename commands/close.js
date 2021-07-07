const Jsonfile = require('../config.json');
exports.run = async (client, message, args) => {
    if (!message.guild.members.cache.find((member) => member.id === message.author.id).hasPermission("ADMINISTRATOR") || !message.guild.members.cache.find((member) => member.id === message).roles.cache.find(r => r.id === Jsonfile.Channelrole)) return message.author.send("You cannot use this command.")
    setTimeout(() => message.channel.delete(), 5000);
    message.channel.send("Deleting this channel in 5 seconds!");
    return;
}