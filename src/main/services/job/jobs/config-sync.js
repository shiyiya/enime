import Job from "../job";
import { CONFIG_NAME, SETTINGS } from "../../../../shared/settings/settings";
import { exists, writeFile, getFile } from "../../../utilities";
import StateActions from "../../../../shared/storage/action/state-actions";

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
    import("../../../../shared/settings/init.js");
  }
}
