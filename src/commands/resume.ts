import { Command, interactionContext } from './command';

export class Resume extends Command {
  public description = 'Resumes the player.';

  public async handleInteraction(ctx: interactionContext) {
    const queue = this.getQueueInSameChannel(ctx);
    const resumed = queue.setPaused(false);
    console.log('[Resume] resumed', resumed);

    if (resumed) {
      return this.reply(ctx.interaction, '▶');
    } else {
      return this.reply(ctx.interaction, 'The player is not paused.');
    }
  }
}
