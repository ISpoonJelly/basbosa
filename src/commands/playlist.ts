import { QueryType, Queue, Track } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, InteractionReplyOptions, SlashCommandBuilder, Colors } from 'discord.js';

import { Command, interactionContext } from './command';

export class Playlist extends Command {
  public description = 'Enqueues a playlist.';

  protected getSlackCommandBuilder() {
    const builder = super.getSlackCommandBuilder() as SlashCommandBuilder;
    return builder.addStringOption((option) => option.setName('url').setDescription('playlist url').setRequired(true));
  }

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    const userVoiceChannel = this.getInteractionMember(interaction).voice.channel;
    if (!userVoiceChannel) {
      throw new Error('You are not connected to a voice channel.');
    }

    const guild = this.getInteractionGuild(interaction);
    const queue = player.getQueue(guild, interaction.channel!);

    if (!queue.connection) {
      await queue.connect(userVoiceChannel);
    } else {
      if (queue.connection.channel.id !== userVoiceChannel.id) {
        throw new Error('You are not in the same voice channel as me.');
      }
    }

    await interaction.deferReply();

    const response = await this.handlePlaylistCommand({ interaction, player }, queue);
    await interaction.followUp(response);

    if (!queue.playing) await queue.play();
  }

  private async handlePlaylistCommand({ interaction, player }: interactionContext, queue: Queue): Promise<InteractionReplyOptions> {
    const playlistUrl = interaction.options.getString('url', true);

    const searchResult = await player.player.search(playlistUrl, {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_PLAYLIST,
    });

    if (!searchResult || !searchResult.tracks || !searchResult.playlist) {
      return { content: `❌ | Playlist **${playlistUrl}** not found!` };
    }
    const { playlist, tracks } = searchResult;

    await queue.addTracks(tracks);
    console.log('[Playlist] enqueued: ', playlist.id, playlist.title);

    const embed = new EmbedBuilder()
      .setTitle(`Playlist: [${playlist.title}]`)
      .setURL(playlist.url)
      .setDescription(`Added by <@${tracks[0].requestedBy.id}>`)
      .setImage((playlist.thumbnail as any).url)
      .setFooter({ text: `Song count: ${tracks.length}` })
      .setColor(Colors.DarkGreen)
      .setTimestamp(Date.now());

    return { embeds: [embed] };
  }
}
