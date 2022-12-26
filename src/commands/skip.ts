import { SlashCommandBuilder } from 'discord.js';
import { Command, interactionContext } from './command';

export class Skip extends Command {
  public description = 'Skips the currently playing song.';

  protected getSlackCommandBuilder() {
    const builder = super.getSlackCommandBuilder() as SlashCommandBuilder;
    return builder.addNumberOption((option) => option.setName('position').setDescription('Skip lfain?').setMinValue(1));
  }

  public async handleInteraction(ctx: interactionContext) {
    const queue = this.getQueueInSameChannel(ctx);

    const position = ctx.interaction.options.getNumber('position');

    if (!position) {
      queue.skip();
    } else {
      queue.skipTo(position - 1);
    }

    console.log('[Skip] skipped');
    return this.reply(ctx.interaction, '⏭');
  }
}
