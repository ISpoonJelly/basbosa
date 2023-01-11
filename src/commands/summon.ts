import { Command, interactionContext } from './command';

export class Summon extends Command {
  public description = 'Agelak l7ad 3ndak';

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    const userVoiceChannel = this.getMemberVoiceChannel(ctx);

    const guild = this.getInteractionGuild(ctx);
    const queue = player.getQueue(guild, interaction.channel!, true);

    if (queue.connection) {
      if (queue.connection.channel.id !== userVoiceChannel.id) {
        throw Error(`Ysta t3ala **${queue.connection.channel.name}**`);
      }
    }

    await queue.connect(userVoiceChannel);

    console.log('[Summon] Joined', userVoiceChannel.name, userVoiceChannel.id);
    return this.reply(interaction, `Slamo 3leko ya **${userVoiceChannel.name}**`);
  }
}
