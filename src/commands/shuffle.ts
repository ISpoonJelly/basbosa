import { Command, interactionContext } from './command';

export class Shuffle extends Command {
  public description = 'La5bateeta yaba';

  public async handleInteraction(ctx: interactionContext) {
    const queue = this.getQueueInSameChannel(ctx);

    queue.tracks.shuffle();

    console.log('[Shuffle] done');
    return this.reply(ctx.interaction, '🔀');
  }
}
