import { Command, interactionContext } from './command';

export class Resume extends Command {
  public description = "mashy sha3'al";

  public async handleInteraction(ctx: interactionContext) {
    const queue = this.getQueueInSameChannel(ctx);
    const resumed = queue.node.setPaused(false);
    console.log('[Resume] done', resumed);

    if (resumed) {
      return this.reply(ctx.interaction, '▶');
    } else {
      return this.reply(ctx.interaction, 'The player is not paused.');
    }
  }
}
