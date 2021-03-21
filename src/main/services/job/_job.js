import {getJobs as jobs, register} from "./job";
import RecentRelease from "./jobs/recent-release";
register(new RecentRelease());

import DiscordPresence from "./jobs/discord-presence";
register(new DiscordPresence());

import ConfigSync from "./jobs/config-sync";
register(new ConfigSync());

import cron from "node-cron";

export function start() {
  jobs().forEach(job => {
    if (job.cron()) cron.schedule(job.cron(), () => job.run(), {
      scheduled: true
    }).start();

    job.run();
  })
}
