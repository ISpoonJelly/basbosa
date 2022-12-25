import { ChatInputCommandInteraction, Client, REST, Routes } from 'discord.js';
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
import { Skip } from './skip';
import { Stop } from './stop';
import { Summon } from './summon';

const commands: Command[] = [
  new Clear(),
  new Disconnect(),
  new NowPlaying(),
  new Pause(),
  new Ping(),
  new Play(),
  new Playlist(),
  new Resume(),
  new Seek(),
  new Skip(),
  new Stop(),
  new Summon(),
  new Queue(),
];

function getSlashCommands() {
  return Object.values(commands)
    .map((command) => command.slachCommands())
    .flat();
}

export function registerInteractionCreate(discordClient: Client, player: DPlayer) {
  discordClient.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = commands.find((command) => command.name === interaction.commandName);
    if (!command) return;

    try {
      await command.handleInteraction({ interaction: interaction as ChatInputCommandInteraction, player });
    } catch (err: any) {
      console.log('[Command.handleInteraction] Error', err);
      command.replyError(interaction, `Fe 7war: ${err.message}`);
    }
  });
}

export async function registerSlashCommands(clientId: string, restClient: REST, discordClient: Client) {
  const commandsBody = getSlashCommands();

  // Global, for prod
  await restClient.put(Routes.applicationCommands(clientId), { body: [] });

  // Faster for testing
  discordClient.guilds.cache
    .map((guild) => guild.id)
    .forEach(async (guildId) => {
      await restClient.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commandsBody,
      });
      console.log(`Registered slash commands for ${guildId}.`);
    });
}

export { Clear, Disconnect, NowPlaying, Pause, Ping, Play, Playlist, Resume, Seek, Skip, Stop, Summon, Queue };
