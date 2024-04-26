import { QueryType } from 'discord-player';
import { Colors, EmbedBuilder, InteractionReplyOptions, SlashCommandBuilder } from 'discord.js';

import { QueueType } from '../player';
import { Command, interactionContext } from './command';
import { shuffleArray } from '../utils';

export class Playlist extends Command {
  public description = 'Shreet cocktail';

  protected getSlackCommandBuilder() {
    const builder = super.getSlackCommandBuilder() as SlashCommandBuilder;
    return builder.addStringOption((option) => option.setName('url').setDescription('playlist url').setRequired(true))
      .addBooleanOption((option) => option.setName('shuffle').setDescription('shuffle playlist before playing').setRequired(false));
  }

  public async handleInteraction(ctx: interactionContext) {
    const { interaction } = ctx;

    await this.connectToChannel(ctx);

    await interaction.deferReply();
    const queue = this.getQueueInSameChannel(ctx);
    await queue.tasksQueue.acquire().getTask();

    const response = await this.handlePlaylistCommand(ctx, queue);
    await interaction.followUp(response);

    try {
      if (!queue.isPlaying()) await queue.node.play();
    } finally {
      queue.tasksQueue.release();
    }
  }

  private async handlePlaylistCommand({ interaction, player }: interactionContext, queue: QueueType): Promise<InteractionReplyOptions> {
    const playlistUrl = interaction.options.getString('url', true);
    const shuffle = interaction.options.getBoolean('shuffle', false);

    const searchResult = await player.search(playlistUrl, {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_PLAYLIST,
    });

    if (!searchResult || !searchResult.tracks || !searchResult.playlist) {
      return { content: `❌ | msh la2y Playlist [${playlistUrl}]` };
    }
    const { playlist, tracks } = searchResult;

    await queue.addTrack(shuffle === false ? tracks: shuffleArray(tracks));
    console.log('[Playlist] enqueued: ', playlist.id, playlist.title);

    const embed = new EmbedBuilder()
      .setTitle(`Playlist: [${playlist.title}]`)
      .setURL(playlist.url)
      .setDescription(`Added by <@${tracks[0].requestedBy?.id}>`)
      .setImage((playlist.thumbnail as any).url)
      .setFooter({ text: `Song count: ${tracks.length}` })
      .setColor(Colors.DarkGreen)
      .setTimestamp(Date.now());

    return { embeds: [embed] };
  }
}
