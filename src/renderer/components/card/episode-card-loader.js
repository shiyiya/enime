import React from "react";
import ContentLoader from "react-content-loader";

export default function EpisodeCardLoader(props) {
  return (
    <ContentLoader
      speed={2}
      width={142}
      height={303}
      viewBox="0 0 142 303"
      backgroundColor="#f3f3f3"
      foregroundColor="#000000"
    >
      <rect x="-6" y="238" rx="2" ry="2" width="142" height="18" />
      <rect x="-6" y="217" rx="2" ry="2" width="142" height="10" />
      <rect x="-10" y="-1" rx="5" ry="5" width="142" height="200" />
    </ContentLoader>
  );
}
