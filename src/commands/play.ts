import { QueryType, Track } from 'discord-player';
import { Colors, EmbedBuilder, InteractionReplyOptions, SlashCommandBuilder } from 'discord.js';

import { QueueType } from '../player';
import { Command, interactionContext } from './command';

export class Play extends Command {
  public description = 'Ngeblak w n7asbak';

  protected getSlashCommandBuilder() {
    const builder = super.getSlashCommandBuilder() as SlashCommandBuilder;
    return builder
      .addStringOption((option) => option.setName('query').setDescription('3yz tsma3 eh').setRequired(true))
      .addBooleanOption((option) => option.setName('next').setDescription('7otaha next?'))
      .addBooleanOption((option) => option.setName('now').setDescription('5osh beeha 3ltool?'))
      .addNumberOption((option) => option.setName('position').setDescription('A7otahalak fain?').setMinValue(1));
  }

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    await this.connectToChannel(ctx)

    await interaction.deferReply();

    const queue = this.getQueueInSameChannel(ctx)
    await queue.tasksQueue.acquire().getTask()

    const response = await this.handleSearchCommand(ctx, queue);
    await interaction.followUp(response);

    try {
      if (!queue.isPlaying()) await queue.node.play();
    } finally {
      queue.tasksQueue.release()
    }
  }

  private async handleSearchCommand({ interaction, player }: interactionContext, queue: QueueType): Promise<InteractionReplyOptions> {
    const songUrl = interaction.options.getString('query', true);
    const optionNext = interaction.options.getBoolean('next') || false;
    const optionNow = interaction.options.getBoolean('now') || false;
    const optionPosition = (interaction.options.getNumber('position') || 1) - 1;

    const searchResult = await player.search(songUrl, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!searchResult || searchResult.tracks.length === 0) {
      return { content: `❌ | no results found!` };
    }

    const track = searchResult.tracks[0];


    if (optionNow) {
      queue.addTrack(track);
    } else if (optionNext || optionPosition) {
      queue.insertTrack(track, optionPosition);
    } else {
      queue.addTrack(track);
    }
    console.log('[Play] played: ', track.id, track.title, `(next=${optionNext}`, `now=${optionNow}`, `position=${optionPosition})`);

    return this.getTrackEmbed(track, { optionNow, optionNext, optionPosition });
  }

  private getTrackEmbed(
    track: Track,
    { optionNow, optionNext, optionPosition }: { optionNow: boolean; optionNext: boolean; optionPosition: number },
  ) {
    let description = 'Added to queue';
    if (optionNext || optionPosition === 0) {
      description = 'Added next in queue';
    } else if (optionPosition > 0) {
      description = `Added to position ${optionPosition}`;
    } else if (optionNow) {
      description = 'Played immediately';
    }

    const embed = new EmbedBuilder()
      .setTitle(track.title)
      .setURL(track.url)
      .setDescription(`${description} by <@${track.requestedBy?.id}>`)
      .setImage(track.thumbnail)
      .setFooter({ text: `Duration: ${track.duration}` })
      .setColor(Colors.DarkGreen)
      .setTimestamp(Date.now());

    return { embeds: [embed] };
  }
}
