import { Command, interactionContext } from './command';

export class Resume extends Command {
  public description = 'Resumes the player.';

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    const userVoiceChannel = this.getInteractionMember(interaction).voice.channel;
    if (!userVoiceChannel) {
      throw new Error('You are not connected to a voice channel.');
    }

    const guild = this.getInteractionGuild(interaction);
    const resumed = player.resume(guild, interaction.channel!);
    console.log('[Resume] resumed', resumed);

    if (resumed) {
      return this.reply(interaction, '▶');
    } else {
      return this.reply(interaction, 'The player is not paused.');
    }
  }
}
