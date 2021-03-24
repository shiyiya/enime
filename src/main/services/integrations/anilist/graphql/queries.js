export default {
  SERIES_ID_PAGE: `query ($id: Int!, $type: MediaType) {
  Media(id: $id, type: $type) {
    id
    title {
      romaji
      english
      native
      userPreferred
    }
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    coverImage {
      large
      medium
    }
    bannerImage
    format
    type
    status
    episodes
    chapters
    volumes
    season
    description
    averageScore
    meanScore
    genres
    synonyms
    hashtag
    source
    isAdult
    isFavourite
    nextAiringEpisode {
      airingAt
      timeUntilAiring
      episode
    }
    characters (perPage: 18, sort: [ROLE]) {
      edges {
        node {
          id
          name {
            first
            last
          }
          image {
            medium
            large
          }
        }
        role
        voiceActors (language: JAPANESE) {
          id
          name {
            first
            last
            native
          }
          image {
            medium
            large
          }
          language
        }
      }
    }
    staff (perPage: 10) {
      edges {
        role
        node {
          id
          name {
            first
            last
            native
          }
          image {
            medium
            large
          }
        }
      }
    }
    relations {
      edges {
        relationType
        node {
          id
          title {
            romaji
            english
            native
            # ...
          }
        }
      }
    }
    trailer {
      id
      site
    }
    tags {
      id
      name
      description
      category
      rank
      isGeneralSpoiler
      isMediaSpoiler
      isAdult
    }
    reviews (perPage: 2) {
      nodes {
        id
        userId
        summary
        rating
        ratingAmount
      }
    }
    externalLinks {
      id
      url
      site
    }
    rankings {
      id
      rank
      type
      format
      year
      season
      allTime
      context
    }
    stats {
      airingProgression {
        episode
        score
        watching
      }
      statusDistribution {
        status
        amount
      }
      scoreDistribution {
        score
        amount
      }
    }
  }
}
`,
  SERIES_ID_SEARCH: `query ($query: String, $type: MediaType) {
  Page {
    media(search: $query, type: $type) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        medium
        large
      }
      format
      type
      averageScore
      popularity
      episodes
      season
      hashtag
      isAdult
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
    }
  }
}`,
  SERIES_LIST_ID: `
query ($id: Int!) {
  MediaList(id: $id) {
    id
    score
    scoreRaw: score(format: POINT_100)
    progress
    progressVolumes
    repeat
    private
    priority
    notes
    hiddenFromStatusLists
    startedAt {
      year
      month
      day
    }
    completedAt {
      year
      month
      day
    }
    updatedAt
    createdAt
    media {
      id
      title {
        userPreferred
      }
    }
  }
}`,
  USER_SERIES_LIST_RAW: `query ($id: Int!, $listType: MediaType) {
  Page {
    mediaList(userId: $id, type: $listType) {
      id
      score
      scoreRaw: score(format: POINT_100)
      progress
      progressVolumes
      repeat
      private
      priority
      notes
      hiddenFromStatusLists
      startedAt {
        year
        month
        day
      }
      completedAt {
        year
        month
        day
      }
      updatedAt
      createdAt
      media {
        id
        title {
          userPreferred
        }
      }
    }
  }
}`,
  USER_SERIES_LIST: `query ($id: Int!, $listType: MediaType) {
  MediaListCollection (userId: $id, type: $listType) {
    lists {
      name
      isCustomList
      isSplitCompletedList
      entries {
        ... mediaListEntry
      }
    }
    user {
      id
      name
      avatar {
        large
      }
      mediaListOptions {
        scoreFormat
        rowOrder
      }
    }
  }
}

fragment mediaListEntry on MediaList {
  id
  score
  scoreRaw: score (format: POINT_100)
  progress
  progressVolumes
  repeat
  private
  priority
  notes
  hiddenFromStatusLists
  startedAt {
    year
    month
    day
  }
  completedAt {
    year
    month
    day
  }
  updatedAt
  createdAt
  media {
    id
    title {
      userPreferred
    }
  }
}`
}
