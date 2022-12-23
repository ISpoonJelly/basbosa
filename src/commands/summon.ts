import { GuildMember, VoiceChannel } from 'discord.js';

import { Command, interactionContext } from './command';

export class Summon extends Command {
  public description = 'Summons the bot to the voice channel the user is connected to.';

  public async handleInteraction({ interaction, player }: interactionContext) {
    const guild = this.getInteractionGuild(interaction);
    const userVoiceChannel = this.getInteractionMember(interaction).voice.channel;
    if (!userVoiceChannel) {
      console.log('[Summon] User is summoning with no voice channel');
      throw new Error('You need to be connected to a voice channel to summon me.');
    }

    await player.getQueue(guild, interaction.channel!).connect(userVoiceChannel);

    console.log('[Summon] Joined', userVoiceChannel.id);
    return this.reply(interaction, `Joined ${userVoiceChannel.name}`);
  }
}
