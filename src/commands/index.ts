import { Client, REST, Routes } from 'discord.js';
import { DPlayer } from '../player';

import { Clear } from './clear';
import { Command } from './command';
import { Disconnect } from './disconnect';
import { NowPlaying } from './nowplaying';
import { Pause } from './pause';
import { Ping } from './ping';
import { Play } from './play';
import { Playlist } from './playlist';
import { Queue } from './queue';
import { Resume } from './resume';
import { Seek } from './seek';
import { Shuffle } from './shuffle';
import { Skip } from './skip';
import { Stop } from './stop';
import { Summon } from './summon';
import { Spezi } from './spezi';
import { Presets } from './preset';
import { Addpreset } from './addPreset';

const commands: Command[] = [
  new Addpreset(),
  new Clear(),
  new Disconnect(),
  new NowPlaying(),
  new Pause(),
  new Ping(),
  new Play(),
  new Playlist(),
  new Presets(),
  new Queue(),
  new Resume(),
  new Seek(),
  new Shuffle(),
  new Skip(),
  new Spezi(),
  new Stop(),
  new Summon(),
];

function getSlashCommands() {
  return Object.values(commands)
    .map((command) => command.slachCommands())
    .flat();
}

export function registerInteractionCreate(discordClient: Client, player: DPlayer) {
  discordClient.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.find((command) => command.name === interaction.commandName);
    if (!command) return;

    try {
      await command.handleInteraction({ interaction, player });
    } catch (err: any) {
      console.log('[Command.handleInteraction] Error', err);
      command.replyError(interaction, err.message);
    }
  });
}

export async function registerSlashCommands(clientId: string, restClient: REST, discordClient: Client) {
  const isProd = process.env.NODE_ENV === 'production';
  console.log('Registered slash commands. prod? ', isProd);
  const commandsBody = getSlashCommands();

  if(isProd) {
    // Global, for prod
    await restClient.put(Routes.applicationCommands(clientId), { body: isProd ? commandsBody : [] });
  }

  if(!isProd) {
    // Faster for testing
    discordClient.guilds.cache
    .map((guild) => guild.id)
    .forEach(async (guildId) => {
      await restClient.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: isProd ? [] : commandsBody,
      });
      console.log(`Registered slash commands for ${guildId}.`);
    });
  }
}
