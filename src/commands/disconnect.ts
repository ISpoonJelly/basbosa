import { Command, interactionContext } from './command';

export class Disconnect extends Command {
  public description = 'Etla3 yaba';

  public async handleInteraction(ctx: interactionContext) {
    const queue = this.getQueueInSameChannel(ctx);

    if (!queue.connection) {
      throw Error('Atl3 mnain y3m?');
    }

    queue.destroy(true);

    console.log('[Disconnect] Disconnected successfully.');
    return this.reply(ctx.interaction, 'Fe r3ayet ellah 👋');
  }
}
