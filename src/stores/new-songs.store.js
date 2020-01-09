import { writable, get } from "svelte/store";

function makeQuery(nextPage) {
  return fetch(`https://beatsaver.com/api/maps/latest/${nextPage}`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data.docs;
    });
}

function createNewSongStore() {
  const store = writable({
    nextPage: 0,
    songs: [],
    error: null
  });

  return {
    subscribe: store.subscribe,
    loadNextPage: async () => {
      const { nextPage } = get(store);
      try {
        const newSongs = await makeQuery(nextPage);
        store.update(current => ({
          nextPage: current.nextPage + 1,
          songs: [...current.songs, ...newSongs],
          error: null
        }));
      } catch (err) {
        store.update(current => ({ ...current, error: err }));
      }
    }
  };
}

export const newSongsStore = createNewSongStore();