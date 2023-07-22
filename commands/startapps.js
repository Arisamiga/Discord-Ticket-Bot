const Jsonfile = require('../config.json');
const fs = require('fs');
exports.run = async (client, message) => {
  if (message.author.id !== Jsonfile.owner)
    return message.channel.send('Sorry but you cant use this command D:').then((msg) => {
      setTimeout(() => msg.delete(), 7000);
    });

  function addToCollectors(messageID, channelID) {
    fs.readFile('./collectors.json', 'utf8', function readFileCallback(err, data) {
      if (err) return console.error(err);
      const obj = JSON.parse(data);
      obj.collector.push({ id: messageID, channelId: channelID });
      const json = JSON.stringify(obj);
      fs.writeFile('./collectors.json', json, 'utf8', function (err) {
        if (err) throw err;
      });
    });
  }
  const signupEmbed = {
    color: Jsonfile.signup_color,
    fields: [
      {
        name: Jsonfile.signup_title,
        value: 'To create a ticket react with  📩',
      },
    ],
    footer: {
      icon_url: client.user.avatarURL(),
    },
  };
  const signup = await message.channel.send({
    embeds: [signupEmbed],
  });
  await signup.react('📩');
  addToCollectors(signup.id, message.channel.id);
};

const contining = async (client, message, user) => {
  function addToTickets(messageID, channelID) {
    fs.readFile('./collectors.json', 'utf8', function readFileCallback(err, data) {
      if (err) console.error(err);
      const obj = JSON.parse(data);
      obj.tickets.push({ id: messageID, channelId: channelID });
      const json = JSON.stringify(obj);
      fs.writeFile('./collectors.json', json, 'utf8', (err) => {
        if (err) throw err;
      });
    });
  }

  let channel = await message.guild.channels.create(`ticket: ${user.username}`, {
    parent: Jsonfile.answer_category,
  });

  channel.permissionOverwrites.edit(message.guild.id, {
    SEND_MESSAGES: false,
    VIEW_CHANNEL: false,
  });
  channel.permissionOverwrites.edit(user.id, {
    SEND_MESSAGES: true,
    VIEW_CHANNEL: true,
  });
  Jsonfile.Channelrole.forEach((role) => {
    channel.permissionOverwrites.edit(role, {
      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    });
  });

  const reactionMessageEmbed = {
    color: Jsonfile.answer_color,
    fields: [
      {
        name: Jsonfile.answer_title,
        value: Jsonfile.answer_description,
      },
    ],
    footer: {
      icon_url: client.user.avatarURL(),
    },
  };
  const reactionMessage = await channel.send({
    embeds: [reactionMessageEmbed],
  });
  await reactionMessage.react('🔒');
  await reactionMessage.react('⛔');

  addToTickets(reactionMessage.id, channel.id);
};
module.exports.contining = contining;

// "Contining"? Misspelled?
