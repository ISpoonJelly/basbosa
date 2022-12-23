import { Command, interactionContext } from './command';

export class Ping extends Command {
  public description = 'Replies with Pong.';

  public async handleInteraction({ interaction }: interactionContext) {
    return interaction.reply(`Pong (${interaction.client.ws.ping}ms)`);
  }
}
