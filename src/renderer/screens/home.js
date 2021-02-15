import * as React from "react";
import RecentEpisodes from "../components/container/recent-episodes";

export default function Home() {
  return (
    <div className={"home"}>
      <RecentEpisodes onPageFlip={() => console.log('onPageFlip called')}/>
    </div>
  )
}
