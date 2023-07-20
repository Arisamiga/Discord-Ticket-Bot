const { Collection, Intents, Client } = require('discord.js');
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
  partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
});
const fs = require('fs');
const token = require('./config.json');

client.on('ready', async () => {
  console.log(`Logged in as user: ${client.user.tag}, ID: ${client.user.id}`);
  client.user.setStatus('online');

  console.log('Checking collectors.json');
  if (!fs.existsSync('./collectors.json')) {
    console.log('collectors.json not found, creating file...');
    fs.writeFile('./collectors.json', '{"collector": [], "tickets": []}', function (err) {
      if (err) throw err;
    });
  }
  // Check if messageid's in collectors.json are still valid
  fs.readFile('./collectors.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      // Read collectors.json and check if the messageid's are still valid
      const obj = JSON.parse(data);
      var collectorToDeleteid = [];
      var ticketToDeleteid = [];
      var collectorCheck = false;
      var ticketCheck = false;

      if (obj.collector.length == 0) {
        collectorCheck = true;
      }
      if (obj.tickets.length == 0) {
        ticketCheck = true;
      }

      for (let i = 0; i < obj.collector.length; i++) {
        checkMessage(obj.collector[i].id, obj.collector[i].channelId).then((result) => {
          // Reread collectors.json and remove the invalid messageid
          if (!result) {
            console.log(`Cleaning up inactive collector: messageid: ${obj.collector[i].id} in channelid: ${obj.collector[i].channelId}`);
            collectorToDeleteid.push(obj.collector[i].id);
          }
        });
        if (i == obj.collector.length - 1) collectorCheck = true;
      }
      for (let i = 0; i < obj.tickets.length; i++) {
        checkMessage(obj.tickets[i].id, obj.tickets[i].channelId).then((result) => {
          // Reread collectors.json and remove the invalid messageid
          if (!result) {
            console.log(`Cleaning up inactive ticket: messageid: ${obj.collector[i].id} in channelid: ${obj.collector[i].channelId}`);
            ticketToDeleteid.push(obj.tickets[i].id);
          }
        });
        if (i == obj.tickets.length - 1) ticketCheck = true;
      }

      // Wait for the promises to finish
      var interval = setInterval(function () {
        if (collectorCheck && ticketCheck) {
          clearInterval(interval);
          // Remove invalid messageid's
          for (let i = 0; i < collectorToDeleteid.length; i++) {
            for (let j = 0; j < obj.collector.length; j++) {
              if (obj.collector[j].id == collectorToDeleteid[i]) {
                obj.collector.splice(j, 1);
              }
            }
          }
          for (let i = 0; i < ticketToDeleteid.length; i++) {
            for (let j = 0; j < obj.tickets.length; j++) {
              if (obj.tickets[j].id == ticketToDeleteid[i]) {
                obj.tickets.splice(j, 1);
              }
            }
          }
          // Write the new collectors.json
          const json = JSON.stringify(obj);
          fs.writeFile('./collectors.json', json, 'utf8', (err) => {
            if (err) throw err;
            console.log('collectors.json Updated');
          });
        }
      }, 1000);
    }
  });
});

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    let eventName = file.split('.')[0];
    console.log(`Loading event ${eventName}`);
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Collection();

fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith('.js')) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split('.')[0];
    console.log(`Loaded ${commandName}`);
    client.commands.set(commandName, props);
  });
});

client.login(token.token);

const checkMessage = async (id, channelid) => {
  const channel = await client.channels.cache.get(channelid);
  if (!channel) return;
  const channelMessage = await channel?.messages.fetch(id);
  return channelMessage;
};
