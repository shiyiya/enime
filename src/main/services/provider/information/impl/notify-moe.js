import cheerio from "cheerio";
import request from "request-promise"
import InformationProvider from "../information-provider";

const BASE_URL_SEARCH = "https://notify.moe/_/anime-search/";
const BASE_URL_IMAGE = "https://media.notify.moe/images/anime";

export default class NotifyMoe extends InformationProvider {
  name() {
    return "Notify.moe";
  }

  information(title) {
    return new Promise((resolve, reject) => {
      request.get(`${BASE_URL_SEARCH}${encodeURIComponent(title)}`)
        .then(response => {
          const $ = cheerio.load(response);
          console.log(title)
          let animeId = $('.anime-search').first().children('a').first().attr('href').replace("/anime/", "");
          resolve({
            id: animeId,
            thumbnail: {
              small: BASE_URL_IMAGE + "/small/" + animeId + ".jpg",
              medium: BASE_URL_IMAGE + "/medium/" + animeId + ".jpg",
              large: BASE_URL_IMAGE + "/large/" + animeId + ".jpg",
            }
          })
        });
    })
  }
}
