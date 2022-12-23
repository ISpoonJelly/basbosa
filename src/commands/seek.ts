import { SlashCommandBuilder } from 'discord.js';
import { Command, interactionContext } from './command';

export class Seek extends Command {
  public description = 'Seeks the current playing track.';

  protected getSlackCommandBuilder() {
    const builder = super.getSlackCommandBuilder() as SlashCommandBuilder;
    return builder.addStringOption((option) => option.setName('time').setDescription('time to fast forward to.').setRequired(true));
  }

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    const userVoiceChannel = this.getInteractionMember(interaction).voice.channel;
    if (!userVoiceChannel) {
      throw new Error('You are not connected to a voice channel.');
    }

    const guild = this.getInteractionGuild(interaction);
    const timeInput = interaction.options.getString('time', true);

    let position: number;

    const [hourMinutes, secondsStr] = timeInput.split('m');
    const [hoursStr, minutesStr] = hourMinutes.split('h');

    const hours = parseInt(hoursStr) || 0;
    const minutes = parseInt(minutesStr) || 0;
    const seconds = parseInt(secondsStr) || 0;

    position = seconds * 1000 + minutes * 60 * 1000 + hours * 60 * 60 * 1000;

    const fastForwarded = await player.seek(guild, interaction.channel!, position);
    console.log('[Seek] seeked', position);

    if (fastForwarded) {
      return this.reply(interaction, '⏩');
    } else {
      return this.reply(interaction, 'The player is not playing.');
    }
  }
}
