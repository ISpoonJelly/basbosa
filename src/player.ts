import { Player, GuildQueue, Track } from 'discord-player';
import { YoutubeiExtractor } from "discord-player-youtubei"
import { Client, Guild, TextBasedChannel } from 'discord.js';

type QueueMetadata = { textChannel: TextBasedChannel }
export type QueueType = GuildQueue<QueueMetadata>

export class DPlayer {
  private player: Player;

  private readonly LEAVE_COOLDOWN = 5 * 60 * 1000

  constructor(discordClient: Client) {
    const player = new Player(discordClient, {
      ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
      },
    });

    player.extractors.register(YoutubeiExtractor, {});

    player.events.on('error', (error) => console.log('!!![Player] error', error));
    player.events.on('playerStart', (queue: GuildQueue<any>, track: Track) => {
      if (queue.metadata.textChannel?.send) queue.metadata.textChannel.send(`🎶 | Now playing **${track.title}**!`);
    });

    this.player = player;
  }

  public getQueue(guild: Guild, textChannel: TextBasedChannel): GuildQueue<QueueMetadata> {
    const existing = this.player.nodes.get<QueueMetadata>(guild)
    if (existing) {
      return existing
    }


    return this.player.nodes.create(guild, {
      leaveOnEnd: true,
      leaveOnEmpty: true,
      leaveOnStop: true,
      leaveOnEmptyCooldown: this.LEAVE_COOLDOWN,
      leaveOnEndCooldown: this.LEAVE_COOLDOWN,
      leaveOnStopCooldown: this.LEAVE_COOLDOWN,
      metadata: {
        textChannel
      }
    })
  }

  public search(...args: Parameters<typeof this.player.search>) {
    return this.player.search(...args)
  }
}
