// To parse this data:
//
//   import { Convert, Temperatures } from "./file";
//
//   const temperatures = Convert.toTemperatures(json);

export interface Pagination {
  previousPageLink: null;
  nextPageLink: string;
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  pagelinks: number[];
}

// Converts JSON strings to/from your types
export class Convert {
  public static toPagination(json: string): Pagination {
    let x: Pagination = JSON.parse(json);
    x.pagelinks = [];
    return x;
  }

  public static PaginationToJson(value: Pagination): string {
    return JSON.stringify(value);
  }

  public static generatePageLinks(page: Pagination, pageLinkSize: number = 9): Pagination {

    let newPageLinkSize = Math.round(pageLinkSize / 2) - 1;

    if (page.totalPages <= pageLinkSize) {
      for (let i = 1; i <= page.totalPages; i++) {
        page.pagelinks.push(i);
      }
    } else if (page.currentPage == 1) {
      for (let i = 1; i <= (page.currentPage + pageLinkSize) - 1; i++) {
        page.pagelinks.push(i);
      }
    } else if (page.currentPage + newPageLinkSize >= page.totalPages) {
      for (let i = page.totalPages - pageLinkSize + 1; i <= page.totalPages; i++) {
        page.pagelinks.push(i);
      }
    } else if (page.currentPage >= pageLinkSize && page.currentPage <= page.totalPages - 4) {
      for (let i = page.currentPage - newPageLinkSize; i <= page.currentPage + newPageLinkSize; i++) {
        page.pagelinks.push(i);
      }
    } else {
      for (let i = 1; i <= pageLinkSize; i++) {
        page.pagelinks.push(i);
      }
    }
    return page;
  }
}
