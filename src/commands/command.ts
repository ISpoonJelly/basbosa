import { useMasterPlayer } from 'discord-player';
import {
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  InteractionResponse,
  Message,
  RESTPostAPIApplicationCommandsJSONBody,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  TextBasedChannel,
  VoiceBasedChannel
} from 'discord.js';

import { DPlayer } from '../player';

export interface interactionContext {
  interaction: ChatInputCommandInteraction;
  player: DPlayer;
}

export abstract class Command {
  public name: string;
  public description: string;

  constructor(name?: string) {
    this.name = name || this.constructor.name.toLowerCase();
    this.description = '';
  }

  protected getSlackCommandBuilder():
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> {
    return new SlashCommandBuilder().setName(this.name).setDescription(this.description);
  }

  public slachCommands(): RESTPostAPIApplicationCommandsJSONBody {
    return this.getSlackCommandBuilder().toJSON();
  }

  public abstract handleInteraction(ctx: interactionContext): Promise<any>;

  protected getInteractionMember({ interaction }: interactionContext): GuildMember {
    const member = interaction.member;
    if (!member) {
      throw new Error();
    }

    return member as GuildMember;
  }

  protected getMemberVoiceChannel(ctx: interactionContext): VoiceBasedChannel {
    const userVoiceChannel = this.getInteractionMember(ctx).voice.channel;
    if (!userVoiceChannel) {
      throw Error('Ysta ed5ol ay qnaah');
    }
    return userVoiceChannel;
  }

  protected getInteractionTextChannel({ interaction }: interactionContext): TextBasedChannel {
    const channel = interaction.channel;
    if (!channel) {
      throw new Error();
    }

    return channel;
  }

  protected getInteractionGuild({ interaction }: interactionContext): Guild {
    const guild = interaction.guild;
    if (!guild) {
      throw new Error();
    }

    return guild;
  }

  public getPlayer() {
    const player = useMasterPlayer()
    if(!player) {
      throw Error('Error getting player')
    }

    return player
  }

  public getQueue(ctx: interactionContext) {
    const guild = this.getInteractionGuild(ctx as interactionContext);
    const queue = ctx.player.getQueue(guild, this.getInteractionTextChannel(ctx))

    if(!queue) {
      throw Error('Error getting queue')
    }

    return queue
  }

  protected async connectToChannel(ctx: interactionContext) {
    const queue = this.getQueue(ctx)
    const userVoiceChannel = this.getMemberVoiceChannel(ctx);

    if (!queue.channel) {
      await queue.connect(userVoiceChannel);
    } else if (queue.channel.id !== userVoiceChannel.id) {
      throw Error(`Ysta t3ala **${queue.channel.name}**`);
    }
  }

  protected getQueueInSameChannel(ctx: interactionContext) {
    const queue = this.getQueue(ctx)
    const userVoiceChannel = this.getMemberVoiceChannel(ctx);

    if (queue.channel && queue.channel.id !== userVoiceChannel.id) {
      throw Error('Ysta t3ala el channel bt3ty');
    }

    return queue;
  }

  public async replyError(
    interaction: ChatInputCommandInteraction,
    message: string = 'Unexpected Error Occured, try again',
    followUp = false
  ): Promise<InteractionResponse | Message> {
    console.log('[Command.replyError]', message);
    if (interaction.replied || followUp) {
      return interaction.followUp({ content: message });
    }
    return this.reply(interaction, message, true);
  }

  public async reply(interaction: ChatInputCommandInteraction, message: string, ephemeral = false): Promise<InteractionResponse | Message> {
    return interaction.reply({
      content: message,
      ephemeral,
    });
  }
}
