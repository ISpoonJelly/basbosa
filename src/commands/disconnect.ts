import { Command, interactionContext } from './command';

export class Disconnect extends Command {
  public description = 'Salam ya zmeely';

  public async handleInteraction(ctx: interactionContext) {
    const queue = this.getQueueInSameChannel(ctx);
    queue.destroy(true);

    console.log('[Disconnect] Disconnected successfully.');
    return this.reply(ctx.interaction, 'Fe r3ayet ellah 👋');
  }
}
