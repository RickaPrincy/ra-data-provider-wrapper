import { type DataProvider } from 'react-admin';
import { createRaProvider } from '../src/wrapper';
import { dummyProvider } from './dummy-provider';

export const raDataProvider: DataProvider = createRaProvider([dummyProvider], {
  getListPageInfo: async ({ resource: _resource }) => {
    return Promise.resolve({
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
      },
    });
  },
});
