export const updateRankings = (
  favoriteThings,
  id,
  newRank,
  oldRank,
  category
) => {
  const favThings = favoriteThings.filter(
    favThing => favThing.category === category
  );
  const restThings = favoriteThings.filter(
    favThing => favThing.category !== category
  );

  let fIdx;
  for (let i = 0; i < favThings.length; i++) {
    if (favThings[i].id === id) {
      fIdx = i;
    }
  }

  const favThing = favThings.splice(fIdx, 1)[0];
  favThing.ranking = newRank;

  for (let i = 0; i < favThings.length; i++) {
    if (newRank > oldRank) {
      if (favThings[i].ranking > oldRank && favThings.ranking <= newRank) {
        favThings[i].ranking -= 1;
      }
    } else if (oldRank > newRank) {
      if (favThings[i].ranking < oldRank && favThings[i].ranking >= newRank) {
        favThings[i].ranking += 1;
      }
    }
  }

  return [...restThings, ...favThings, favThing];
};

/**
 * items which are added for first time and do not have ranking which is equal to the no. of
 * items in that particular ccategory
 * @param {*} favoriteThings
 * @param {*} item
 */
export const firstTimeAddItem = (favoriteThings, item) => {
  const rank = item.ranking;
  for (let i = 0; i < favoriteThings.length; i++) {
    if (favoriteThings[i].ranking >= rank) {
      favoriteThings[i].ranking += 1;
    }
  }
  return [...favoriteThings, item];
};

export const updateRankingBecauseCategoryChanged = (
  favoriteThings,
  id,
  currentRank,
  oldCategory,
  newCategory
) => {
  const oldCatFavThings = favoriteThings.filter(
    favThing => favThing.category === oldCategory
  );
  const newCatFavThings = favoriteThings.filter(
    favThing => favThing.category === newCategory
  );
  const restThings = favoriteThings.filter(
    favThing =>
      favThing.category !== oldCategory && favThing.category !== newCategory
  );

  let favThingChangedCategory;
  let favThingChangedCategoryIdx;
  for (let i = 0; i < oldCatFavThings.length; i++) {
    if (oldCatFavThings[i].id === id) {
      favThingChangedCategoryIdx = i;
    }
  }
  favThingChangedCategory = oldCatFavThings.splice(
    favThingChangedCategoryIdx,
    1
  )[0];

  for (let i = 0; i < oldCatFavThings.length; i++) {
    if (oldCatFavThings[i].ranking >= favThingChangedCategory.ranking) {
      oldCatFavThings[i].ranking -= 1;
    }
  }

  favThingChangedCategory.ranking = currentRank;
  favThingChangedCategory.category = newCategory;
  for (let i = 0; i < newCatFavThings.length; i++) {
    if (newCatFavThings[i].ranking >= currentRank) {
      newCatFavThings[i].ranking += 1;
    }
  }

  return [
    ...restThings,
    ...oldCatFavThings,
    ...newCatFavThings,
    favThingChangedCategory
  ];
};

export const getCookie = name => {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length === 2)
    return parts
      .pop()
      .split(";")
      .shift();
};
