export interface LocatorMap {
  readonly searchInput: string;
  readonly searchButton: string;
  readonly searchCaption: string;
  readonly productName: string;
}

export const mainPageLocators: LocatorMap = {
  searchInput: "search-query",
  searchButton: "search-submit",
  searchCaption: "search-caption",
  productName: "product-name",
};
