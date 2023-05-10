import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command, interactionContext } from './command';

export class Seek extends Command {
  public description = 'Mashyy fel track yaba';

  protected getSlackCommandBuilder() {
    const builder = super.getSlackCommandBuilder() as SlashCommandBuilder;
    return builder.addStringOption((option) => option.setName('time').setDescription('time to fast forward to.').setRequired(true));
  }

  public async handleInteraction(ctx: interactionContext) {
    const queue = this.getQueueInSameChannel(ctx);
    const position = this.getPositionFromInput(ctx.interaction);

    if (position === -1) {
      throw Error('Invalid position');
    }

    const fastForwarded = await queue.node.seek(position);
    console.log('[Seek] seeked', position, fastForwarded);

    if (fastForwarded) {
      return this.reply(ctx.interaction, '⏩');
    } else {
      return this.reply(ctx.interaction, 'The player is not playing.');
    }
  }

  private getPositionFromInput(interaction: ChatInputCommandInteraction): number {
    const timeInput = interaction.options.getString('time', true);

    const secondsMatch = timeInput.match(/(\d*)s/g);
    const minutesMatch = timeInput.match(/(\d*)m/g);
    const hoursMatch = timeInput.match(/(\d*)h/g);

    const hours = parseInt(matchOrEmpty(hoursMatch)) || 0;
    const minutes = parseInt(matchOrEmpty(minutesMatch)) || 0;
    let seconds = parseInt(matchOrEmpty(secondsMatch)) || 0;

    if (!secondsMatch && !minutesMatch && !hoursMatch) {
      if (/^\d+$/.test(timeInput)) {
        seconds = parseInt(timeInput);
      } else {
        return -1;
      }
    }

    return seconds * 1000 + minutes * 60 * 1000 + hours * 60 * 60 * 1000;
  }
}

function matchOrEmpty(match: RegExpMatchArray | null): string {
  if (!match) {
    return '';
  }

  return match[0];
}
