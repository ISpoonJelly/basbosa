import { Client, GatewayIntentBits, REST } from 'discord.js';
import 'dotenv/config';

import { registerInteractionCreate, registerSlashCommands } from './commands';
import { DPlayer } from './player';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token || !clientId) {
  throw new Error('Launch Error: discord credentials missing');
}

const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates],
});
const restClient = new REST({ version: '10' }).setToken(token);

const player = new DPlayer(discordClient);

discordClient.on('ready', () => {
  registerSlashCommands(clientId, restClient, discordClient);
  registerInteractionCreate(discordClient, player);
});

discordClient.login(token);
