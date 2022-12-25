import {
  ChatInputCommandInteraction,
  CommandInteraction,
  Guild,
  GuildMember,
  InteractionResponse,
  Message,
  RESTPostAPIApplicationCommandsJSONBody,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  VoiceBasedChannel,
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

  protected getInteractionGuild({ interaction }: interactionContext): Guild {
    const guild = interaction.guild;
    if (!guild) {
      throw new Error();
    }

    return guild;
  }

  protected getQueueInSameChannel(ctx: interactionContext) {
    const { interaction, player } = ctx;
    const userVoiceChannel = this.getMemberVoiceChannel(ctx);

    const guild = this.getInteractionGuild(ctx);
    const queue = player.getQueue(guild, interaction.channel!);

    if (queue.connection && queue.connection.channel.id !== userVoiceChannel.id) {
      throw Error('Ysta t3ala el channel bt3ty');
    }

    return queue;
  }

  public async replyError(
    interaction: CommandInteraction,
    message: string = 'Unexpected Error Occured, try again',
  ): Promise<InteractionResponse | Message> {
    console.log('[Command.replyError]', message);
    if (interaction.replied) {
      return interaction.followUp({ content: message });
    }
    return this.reply(interaction, message, true);
  }

  public async reply(interaction: CommandInteraction, message: string, ephemeral = false): Promise<InteractionResponse | Message> {
    return interaction.reply({
      content: message,
      ephemeral,
    });
  }
}
