import { Command, interactionContext } from './command';

export class Stop extends Command {
  public description = '22fel el 5ara da';

  public async handleInteraction(ctx: interactionContext) {
    const queue = this.getQueueInSameChannel(ctx);

    queue.delete();
    console.log('[Stop] done');
    return this.reply(ctx.interaction, '⏹');
  }
}
