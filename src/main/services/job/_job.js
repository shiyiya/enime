import {getJobs as jobs, register} from "./job";
import RecentRelease from "./jobs/recent-release";
register(new RecentRelease());

import cron from "node-cron";

export function start() {
  jobs().forEach(job => {
    cron.schedule(job.cron(), () => job.run(), {
      scheduled: true
    }).start();
    job.run();
  })
}
