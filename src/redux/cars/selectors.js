export const selectCars = state => state.cars.items;
export const selectIsLoading = state => state.cars.isLoading;
export const selectError = state => state.cars.error;
export const selectPage = state => state.cars.page;
export const selectHasMore = state => state.cars.hasMore;
export const selectTotalPages = state => state.cars.totalPages;
export const selectCarsMeta = state => ({
  page: state.cars.page,
  totalPages: state.cars.totalPages,
  hasMore: state.cars.hasMore,
});
