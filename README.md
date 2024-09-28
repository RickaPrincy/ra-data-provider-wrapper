# @rck.princy/ra-data-provider-wrapper :hammer:

A wrapper for [React Admin](https://github.com/marmelab/react-admin) `DataProvider` that simplifies the integration of multiple ResourceProvider instances (one facade DataProvider).

### Features :collision:

- Facade Provider: Automatically manages multiple `ResourceProviders`.
- Error Handling: Throws errors for unknown resource names and unimplemented functions

### Installation :zap:

```bash
npm install @rck.princy/ra-data-provider-wrapper
```

### Usage :seedling:

#### Creating a resource provider

```typescript
import { type ResourceProvider } from '@rck.princy/ra-data-provider-wrapper';

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
  //others
};
```

#### Creating react-admin DataProvider using @rck.princy/ra-data-provider-wrapper

```typescript
import { type DataProvider } from 'react-admin';
import { createRaProvider } from '@rck.princy/ra-data-provider-wrapper';
import { dummyProvider } from './dummy-provider';
import { personProvider } from './person-provider';

export const raDataProvider = createRaProvider(
  [personProvider, dummyProvider],
  {
    getListOptions: {
      defaultPagination: { page: 1, perPage: 5 };
      getPageInfo: async (args) => {
        return Promise.resolve({
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
          },
        });
      },
    }
  }
);
```

### Examples

[Examples](https://github.com/RickaPrincy/ra-data-provider-wrapper/tree/main/examples)

### License

This project is licensed under the [MIT License](LICENSE.md).
