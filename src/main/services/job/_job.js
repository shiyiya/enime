import {getJobs as jobs, register} from "./job";

import ConfigSync from "./jobs/config-sync";
register(new ConfigSync());

import RecentRelease from "./jobs/recent-release";
register(new RecentRelease());

import DiscordPresence from "./jobs/discord-presence";
register(new DiscordPresence());

import cron from "node-cron";

export function start() {
  jobs().forEach(async job => {
    await job.run();

    if (job.cron()) cron.schedule(job.cron(), () => job.run(), {
      scheduled: true
    }).start();
  })
}
