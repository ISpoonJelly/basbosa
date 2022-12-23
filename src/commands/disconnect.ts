import { Command, interactionContext } from './command';

export class Disconnect extends Command {
  public description = 'Disconnects from a voice channel.';

  public async handleInteraction({ interaction, player }: interactionContext) {
    const guild = this.getInteractionGuild(interaction);

    const connection = player.getQueue(guild, interaction.channel!);
    if (!connection) {
      console.log('[Disconnect] Attempted disconnect while not in a voice channel');
      throw new Error('I am not connected to a voice channel.');
    }

    connection.destroy(true);
    console.log('[Disconnect] Disconnected successfully.');
    return this.reply(interaction, 'Slamo 3leko');
  }
}
