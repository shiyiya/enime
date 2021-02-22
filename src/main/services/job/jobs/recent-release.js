import Job from "../job";
import providers from "../../provider/providers";
import StateActions from "../../../../shared/storage/action/state-actions";

export default class RecentRelease extends Job {
  constructor(props) {
    super(props);
  }

  name() {
    return "Recent Release"
  }

  cron() {
    return "*/5 * * * *"
  }

  run() {
    const store = global.store;
    providers.getTorrentProvider()
      .recentReleases(1)
      .then(result => {
        store.dispatch({
          type: StateActions.UPDATE_RECENT_RELEASES,
          payload: result
        })
      })
  }
}
