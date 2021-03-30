import Job from "../job";
import { start } from "../../../../shared/settings/init.js";

export default class ConfigSync extends Job {
  constructor(props) {
    super(props);
  }

  name() {
    return "Initial Configuration Sync";
  }

  cron() {
    return null;
  }

  async run() {
    await start();
  }
}
