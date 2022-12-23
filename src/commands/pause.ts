import { Command, interactionContext } from './command';

export class Pause extends Command {
  public description = 'Pauses the player.';

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    const userVoiceChannel = this.getInteractionMember(interaction).voice.channel;
    if (!userVoiceChannel) {
      throw new Error('You are not connected to a voice channel.');
    }

    const guild = this.getInteractionGuild(interaction);
    const paused = player.pause(guild, interaction.channel!);
    console.log('[Pause] paused', paused);

    if (paused) {
      return this.reply(interaction, '⏸');
    } else {
      return this.reply(interaction, 'The player is not playing.');
    }
  }
}
