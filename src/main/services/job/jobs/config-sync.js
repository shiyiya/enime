import Job from "../job";
import config from "../../../config/config";

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

  run() {
    config.init();
    config.save();
  }
}
