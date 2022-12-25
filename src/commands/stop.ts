import { Command, interactionContext } from './command';

export class Stop extends Command {
  public description = 'Stops the player.';

  public async handleInteraction(ctx: interactionContext) {
    const queue = this.getQueueInSameChannel(ctx);

    queue.skip();
    await queue.stop();
    console.log('[Stop] stopped');
    return this.reply(ctx.interaction, '⏹');
  }
}
