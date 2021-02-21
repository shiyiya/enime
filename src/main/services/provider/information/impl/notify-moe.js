import request from "request-promise"
import InformationProvider from "../information-provider";

const BASE_URL_SEARCH = "https://notify.moe/_/anime-search/";
const BASE_URL_ANIME = "https://notify.moe/api/anime/";
const BASE_URL_IMAGE = "https://media.notify.moe/images/anime";

export default class NotifyMoe extends InformationProvider {
  name() {
    return "Notify.moe";
  }

  seek(title) {
    return new Promise((resolve, reject) => {
      request.get(`${BASE_URL_SEARCH}${encodeURIComponent(title)}`)
        .then(response => {
          let animeIds = response.match(/href='\/anime\/(\S*)/gi).map(a => {
            return a.replace("href='/anime/", "").replace("'", "");
          });

          let promises = [];

          animeIds.forEach(animeId => {
            promises.push(request.get(`${BASE_URL_ANIME}${animeId}`));
          });

          Promise.all(promises)
            .then(values => {
              let anime = null;

              values.forEach(response => {
                let responseAnime = JSON.parse(response);
                if (!anime || (anime && Date.parse(responseAnime.startDate) > Date.parse(anime.startDate))) anime = responseAnime;
              })

              anime.title.primary = anime.title.english.length > 0 ? anime.title.english : anime.title.canonical;

              resolve({
                id: anime.id,
                title: anime.title,
                thumbnail: {
                  small: BASE_URL_IMAGE + "/small/" + anime.id + ".jpg",
                  medium: BASE_URL_IMAGE + "/medium/" + anime.id + ".jpg",
                  large: BASE_URL_IMAGE + "/large/" + anime.id + ".jpg",
                }
              })
            })
        });
    })
  }

  information(id) {
    return new Promise((resolve, reject) => {
      request.get(`${BASE_URL_ANIME}`)
    })
  }
}
