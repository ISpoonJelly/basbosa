import { Command, interactionContext } from './command';

export class Pause extends Command {
  public description = 'Awa2aflak';

  public async handleInteraction(ctx: interactionContext) {
    const queue = this.getQueueInSameChannel(ctx);
    const paused = queue.node.setPaused(true);

    console.log('[Pause] paused', paused);
    if (paused) {
      return this.reply(ctx.interaction, '⏸');
    } else {
      return this.reply(ctx.interaction, 'The player is not playing.');
    }
  }
}
