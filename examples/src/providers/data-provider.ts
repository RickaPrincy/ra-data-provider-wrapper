import { type DataProvider } from 'react-admin';
import { createRaProvider } from '@rck.princy/ra-data-provider-wrapper';
import { personProvider } from './person-provider';

export const raDataProvider: DataProvider = createRaProvider([personProvider], {
  getListOptions: {
    defaultPagination: {
      page: 1,
      perPage: 2,
    },
    getPageInfo: async ({ currentProvider, getListParams: { pagination } }) => {
      const nextPage = await currentProvider.getList!({
        pagination: {
          perPage: pagination.perPage,
          page: pagination.page + 1,
        },
      });

      return {
        pageInfo: {
          hasNextPage: nextPage.length > 0,
          hasPreviousPage: (pagination?.page ?? 1) > 1,
        },
      };
    },
  },
});
