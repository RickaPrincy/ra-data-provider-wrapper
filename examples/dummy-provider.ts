import { type ResourceProvider } from '../src/types';

export type Dummy = {
  id: string;
  name: string;
};

export const dummyProvider: ResourceProvider<Dummy> = {
  resource: 'dummies',
  getList: async ({ filter: _filter, meta: _meta }) => {
    return Promise.resolve([
      {
        id: 'test',
        name: 'test',
      },
    ]);
  },
  getOne: async ({ id }) => {
    return Promise.resolve({
      id,
      name: `name: ${id}`,
    });
  },
  deleteAll: async () => {
    //some api calls
    return Promise.resolve([]);
  },
  saveOrUpdate: async ({ meta }) => {
    console.log(meta?.muationType === 'UPDATE');
    return null as any;
  },
  //others
};
