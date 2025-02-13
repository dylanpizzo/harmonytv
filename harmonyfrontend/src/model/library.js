import axios from "axios";
import { action, extendObservable } from "mobx";
import { computedFn } from "mobx-utils";
import model from ".";
import config from "../config";

class Library {
  constructor(library) {
    this._library = library;

    extendObservable(this, {
      _media: null,
      get media() {
        return this._media;
      },
      get series() {
        if (!this.media)
          return null;
        const series = {};
        for (const mediaObj of this._media) {
          series[mediaObj.seriesname] = series[mediaObj.seriesname] || [];
          series[mediaObj.seriesname].push(mediaObj);
        }
        return series;
      },
      set media(media) {
        this._media = media;
      }
    });
  }

  get name() {
    return this._library.libraryname;
  }

  get id() {
    return this._library.libraryid;
  }

  get type() {
    return this._library.librarytype;
  }

  refreshMediaList() {
    axios.get(config.apiHost + "/library/" + this._library.libraryid + "/getMedia")
      .then(action(res => {
        res.data.sort((a, b) => {
          return (a > b) ? 1 : -1;
        });
        this.media = res.data;
      }));
  }
}

export default {

  findByName: computedFn((name) => {
    if (name === null || !model.state.libraries) {
      return null;
    }
    for (const library of Object.values(model.state.libraries)) {
      if (library.name === name)
        return library;
    }
    return null;
  }),

  refreshLibraries: () => {
    return axios.get(config.apiHost + "/library/getAll")
      .then(action((res) => {
        console.log("LibraryManager::refreshLibraries() - libraries list: ", JSON.stringify(res.data, false, 3));
        const newlibraries = {};
        for (const library of res.data) {
          newlibraries[library.libraryid] = new Library(library);
        }
        model.state.libraries = newlibraries;
      }))
      .catch((err) => {
        console.log("ERROR FETCHING LIBRARIES");
      });
  },
}