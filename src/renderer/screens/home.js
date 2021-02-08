import * as React from "react";
import RecentEpisodes from "../components/container/recent-episodes";

export class Home extends React.Component {
  render() {
    return (
      <div className={"home"}>
        <RecentEpisodes/>
      </div>
    )
  }
}
