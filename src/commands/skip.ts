import { Command, interactionContext } from './command';

export class Skip extends Command {
  public description = 'Skips the currently playing song.';

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    const userVoiceChannel = this.getInteractionMember(interaction).voice.channel;
    if (!userVoiceChannel) {
      throw new Error('You are not connected to a voice channel.');
    }

    const guild = this.getInteractionGuild(interaction);
    player.skip(guild, interaction.channel!);
    console.log('[Skip] skipped');
    return this.reply(interaction, '⏭');
  }
}
