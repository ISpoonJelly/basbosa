import { Command, interactionContext } from './command';

export class Summon extends Command {
  public description = 'Agelak l7ad 3ndak';

  public async handleInteraction(ctx: interactionContext) {
    const userVoiceChannel = this.getMemberVoiceChannel(ctx);

    await this.connectToChannel(ctx)

    console.log('[Summon] Joined', userVoiceChannel.name, userVoiceChannel.id);
    return this.reply(ctx.interaction, `Slamo 3leko ya **${userVoiceChannel.name}**`);
  }
}
