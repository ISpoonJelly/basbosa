import { Command, interactionContext } from './command';

export class Stop extends Command {
  public description = 'Stops the player.';

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    const userVoiceChannel = this.getInteractionMember(interaction).voice.channel;
    if (!userVoiceChannel) {
      throw new Error('You are not connected to a voice channel.');
    }

    const guild = this.getInteractionGuild(interaction);
    await player.stop(guild, interaction.channel!);
    console.log('[Stop] stopped');
    return this.reply(interaction, '⏹');
  }
}
