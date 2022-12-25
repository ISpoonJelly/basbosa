import { Command, interactionContext } from './command';

export class Skip extends Command {
  public description = 'Skips the currently playing song.';

  public async handleInteraction(ctx: interactionContext) {
    const queue = this.getQueueInSameChannel(ctx);

    queue.skip();
    console.log('[Skip] skipped');
    return this.reply(ctx.interaction, '⏭');
  }
}
