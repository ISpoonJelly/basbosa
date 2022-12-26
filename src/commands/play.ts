import { QueryType, Queue, Track } from 'discord-player';
import { Colors, EmbedBuilder, InteractionReplyOptions, SlashCommandBuilder } from 'discord.js';

import { Command, interactionContext } from './command';

export class Play extends Command {
  public description = 'Ngeblak w n7asbak';

  protected getSlackCommandBuilder() {
    const builder = super.getSlackCommandBuilder() as SlashCommandBuilder;
    return builder
      .addStringOption((option) => option.setName('query').setDescription('3yz tsma3 eh').setRequired(true))
      .addBooleanOption((option) => option.setName('next').setDescription('7otaha next?'))
      .addBooleanOption((option) => option.setName('now').setDescription('5osh beeha 3ltool?'))
      .addNumberOption((option) => option.setName('position').setDescription('A7otahalak fain?').setMinValue(1));
  }

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    const userVoiceChannel = this.getMemberVoiceChannel(ctx);

    const guild = this.getInteractionGuild(ctx);
    const queue = player.getQueue(guild, interaction.channel!);

    if (!queue.connection) {
      await queue.connect(userVoiceChannel);
    } else if (queue.connection.channel.id !== userVoiceChannel.id) {
      throw Error(`Ysta t3ala **${queue.connection.channel.name}**`);
    }

    await interaction.deferReply();

    const response = await this.handleSearchCommand({ interaction, player }, queue);
    await interaction.followUp(response);

    if (!queue.playing) await queue.play();
  }

  private async handleSearchCommand({ interaction, player }: interactionContext, queue: Queue): Promise<InteractionReplyOptions> {
    const songUrl = interaction.options.getString('query', true);
    const optionNext = interaction.options.getBoolean('next') || false;
    const optionNow = interaction.options.getBoolean('now') || false;
    const optionPosition = (interaction.options.getNumber('position') || 1) - 1;

    const searchResult = await player.player.search(songUrl, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!searchResult || searchResult.tracks.length === 0) {
      return { content: `❌ | no results found!` };
    }

    const track = searchResult.tracks[0];

    if (optionNow) {
      queue.play(track, { immediate: true });
    } else if (optionNext || optionPosition) {
      queue.insert(track, optionPosition);
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
      .setDescription(`${description} by <@${track.requestedBy.id}>`)
      .setImage(track.thumbnail)
      .setFooter({ text: `Duration: ${track.duration}` })
      .setColor(Colors.DarkGreen)
      .setTimestamp(Date.now());

    return { embeds: [embed] };
  }
}
