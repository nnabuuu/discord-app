import { Client, GatewayIntentBits } from "discord.js";
import dotenv from 'dotenv';
dotenv.config();

const userToken = process.env.USER_TOKEN;
const userId = process.env.USER_ID;
const channelId = process.env.CHANNEL_ID;

async function main() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

  client
    .on("debug", console.log)
    .on("warn", console.log)

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

// Replace <YOUR_TOKEN> with your bot token
  const str = await client.login(userToken);
  console.log(str);

// Replace <MESSAGE_CONTENT> with the content of the message you want to send
  const messageContent = 'HELLO123';

// Get the user object
  const user = client.users.cache.get(userId);

  console.log(user);

// Get the channel object
  const channel = client.channels.cache.get(channelId);

  console.log("Channel:", channel);

// Send the message as the user
  //@ts-ignore
  user.send(messageContent);
}

main()