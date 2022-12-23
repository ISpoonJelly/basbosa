import { Player, Queue, Track } from 'discord-player';
import { Client, Guild, TextBasedChannel } from 'discord.js';

export class DPlayer {
  public player: Player;

  constructor(discordClient: Client) {
    const player = new Player(discordClient, {
      ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
      },
    });

    player.on('error', (_, error) => console.log('!!![Player] error', error));
    player.on('trackStart', (queue: Queue<any>, track: Track) => {
      if (queue.metadata.channel) queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`);
    });

    this.player = player;
  }

  getQueue(guild: Guild, channel: TextBasedChannel): Queue {
    let queue = this.player.getQueue(guild);
    if (!queue) {
      queue = this.player.createQueue(guild, {
        leaveOnEnd: false,
        leaveOnEmpty: false,
        leaveOnStop: false,
        metadata: {
          channel,
        },
      });
    }

    return queue;
  }

  isPlaying(guild: Guild, channel: TextBasedChannel) {
    const queue = this.getQueue(guild, channel);
    return queue.connection && queue.playing;
  }

  skip(guild: Guild, channel: TextBasedChannel) {
    if (this.isPlaying(guild, channel)) {
      this.getQueue(guild, channel).skip();
    }
  }

  stop(guild: Guild, channel: TextBasedChannel): void {
    return this.getQueue(guild, channel).stop();
  }

  pause(guild: Guild, channel: TextBasedChannel): boolean {
    return this.getQueue(guild, channel).setPaused(true);
  }

  resume(guild: Guild, channel: TextBasedChannel): boolean {
    return this.getQueue(guild, channel).setPaused(false);
  }

  async seek(guild: Guild, channel: TextBasedChannel, position: number): Promise<boolean> {
    return this.getQueue(guild, channel).seek(position);
  }
}
