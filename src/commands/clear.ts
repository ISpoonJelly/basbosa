import { Command, interactionContext } from './command';

export class Clear extends Command {
  public description = 'Clears the queue.';

  public async handleInteraction(ctx: interactionContext) {
    const queue = this.getQueueInSameChannel(ctx);

    queue.clear();
    console.log('[Clear] queue cleared');
    return this.reply(ctx.interaction, '☑');
  }
}
