import React from "react";
import ContentLoader from "react-content-loader";

export default function EpisodeCardLoader(props) {
  return (
    <ContentLoader
      speed={2}
      width={160}
      height={303}
      viewBox="0 0 160 303"
      backgroundColor="#2e2e2e"
      foregroundColor="#545454"
    >
      <rect x="0" y="251" rx="2" ry="2" width="160" height="18" />
      <rect x="0" y="282" rx="2" ry="2" width="160" height="10" />
      <rect x="0" y="10" rx="5" ry="5" width="160" height="224" />
    </ContentLoader>
  );
}
