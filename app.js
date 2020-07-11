const Discord = require('discord.js');
const client = new Discord.Client();
const keys = require('./keys.json');

client.on('message', async (msg) => {
    const split = msg.content.split(' ');
    if (!split || !split[0] || split[0] !== keys.command) return; //Command not found
    const first = split[1] || null;
    var user;
    try {
        if (first) {
            if (first.slice(0, 2) == "<@") { // Mention
                if (first.slice(0, 3) == "<@!") {
                    user = await client.users.fetch(first.slice(3, -1));
                } else {
                    user = await client.users.fetch(first.slice(2, -1));
                }
            } else { // ID
                user = await client.users.fetch(first);
            }
        } else { // Current User
            user = await client.users.fetch(msg.author.id);
        }
    } catch (e) {
        return msg.channel.send(`User not found.`);
    }
    if (!user) return msg.channel.send(`User not found.`);
    const flags = await user.fetchFlags();
    if (!flags.has("VERIFIED_DEVELOPER")) return msg.channel.send(`\`@${user.tag}\` is **not** a Discord Developer`);
    msg.channel.send(`\`@${user.tag}\` is a Discord Developer`);
    if (msg.guild.members.cache.get(user.id)) msg.guild.members.cache.get(user.id).roles.add(keys.role); // Give role
});

client.on('ready', () => {
    console.log('ready');
})

client.login(keys.token);