export interface LocatorMap {
  readonly searchInput: string;
  readonly searchButton: string;
  readonly searchCaption: string;
  readonly searchResultCount: string;
  readonly searchCompleted: string;
  readonly searchReset: string;
  readonly productName: string;
}

export const mainPageLocators: LocatorMap = {
  searchInput: "search-query",
  searchButton: "search-submit",
  searchCaption: "search-caption",
  searchResultCount: "search-result-count",
  searchCompleted: "search_completed",
  searchReset: "search-reset",
  productName: "product-name",
};
