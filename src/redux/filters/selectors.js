export const selectBrand = state => state.filters.brand;
export const selectPrice = state => state.filters.price;
export const selectMileageFrom = state => state.filters.mileageFrom;
export const selectMileageTo = state => state.filters.mileageTo;
export const selectLastSearch = state => state.filters.lastSearch;

export const selectIsFiltered = state => {
  const { brand, price, mileageFrom, mileageTo } = state.filters;
  return (
    (brand && brand.length > 0) ||
    (price && price.length > 0) ||
    (mileageFrom !== null && mileageFrom !== undefined && mileageFrom !== '') ||
    (mileageTo !== null && mileageTo !== undefined && mileageTo !== '')
  );
};
