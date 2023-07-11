# Discord-Ticket-Bot

### A Simple useful ticket bot for discord coded in Discord.js

 <a href="https://github.com/Arisamiga/Discord-Ticket-Bot//issues">
   <img alt="Issues" src="https://img.shields.io/github/issues/Arisamiga/Discord-Ticket-Bot?color=0088ff" />
  </a>
  
[![CodeFactor](https://www.codefactor.io/repository/github/arisamiga/discord-ticket-bot/badge?s=ce8618765d3ec8b05264bac256588a4411f7712b)](https://www.codefactor.io/repository/github/arisamiga/discord-ticket-bot) 

<img src= "https://i.imgur.com/XQi0yrC.jpg"> <img src="https://i.imgur.com/XBZZTA3.jpg">

## Installation
```
You have to install NodeJS and Git.
Create a folder.
Open Command Promt.
Type in: cd The path to your new folder. (Example: C:\Users\User\Desktop\New folder)
Press enter.
After that type in: git clone https://github.com/Arisamiga/Discord-Ticket-Bot.git
Press enter.
When you see all Github files in your folder you installed the bot files succesfully.
After that you would want to edit the config.json.
```
Change the following
```
{
    "token": "(Enter Token here)",
    "prefix": "(Enter Prefix Here)",
    "owner": "(Enter id of Bot Owner)",
    "Channelrole":"(Enter id of Viewing Role)",
    "signup_color": "(Enter Hex Code for signup Embed Here)",
    "signup_title": "(Enter Title for signup Embed Here)",
    "answer_title": "(Enter Title for Answer Embed Here)",
    "answer_color": "(Enter Hex Code for Answer Embed Here)",
    "answer_description": "(Enter Answer Embed Description) (Use \n for breaking lines!)",
    "answer_category": "(Enter id of Category for Tickets)",
    "allow_user_delete": false, (Allow users to delete their own tickets)
    "allow_user_lock": false, (Allow users to lock their own tickets)
    "one_app": true (Pick either True = To allow only 1 ticket to exist at a time / False = To allow multiple ticket to exist at a time)
}

```
Get your discord token from https://discord.com/developers/applications

And you should be ready to start the bot! 

Use either use ```npm start``` or ```node main.js``` to start the bot in your command prompt!

## Setting the Reaction Embed!

To start the Reaction Embed you should have the bot enabled.
Next you should enter the command showed bellow 
```
(your Prefix)startapps
```
And after that you should have made a Reaction Embed! Congrats!
So when someone reacts to the message a channel will be created and the Answer Embed will be sent.

## Features!
<ul>
<li>
Supports Multiple Channels
</li>
<li>
Custom Emded Titles
</li>
<li>
Custom Embed Descriptions
</li>
<li>
Custom Embed Color Option
</li>
<li>
Easy to use!
</li>
</ul>

### If you are having troubles with the bot i recommend opening a issue.

***Made By Arisamiga***
