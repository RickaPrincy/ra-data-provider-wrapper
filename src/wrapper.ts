import {
  DataProvider,
  GetListParams,
  GetListResult,
  QueryFunctionContext,
  RaRecord,
} from 'react-admin';
import {
  MutationMetaType,
  RequiredResourceName,
  ResourceProvider,
} from './types';

const toRaResponse = async <T>(response: Promise<T>) => {
  return response.then((data) => ({ data }));
};

const getProvider = ({
  providers,
  resource,
}: {
  providers: ResourceProvider<RaRecord>[];
} & RequiredResourceName): ResourceProvider<RaRecord> => {
  const providerValue = providers.find(
    (resourceProvider) => resourceProvider.resource === resource
  );
  if (!providerValue) {
    throw new Error(`Unknown resource: ${resource}`);
  }

  return providerValue;
};

const getProviderFn = <Fn extends keyof ResourceProvider>(
  fn: Fn,
  {
    providers,
    resource,
  }: { providers: ResourceProvider<RaRecord>[] } & RequiredResourceName
): Required<ResourceProvider<RaRecord>>[Fn] => {
  const providerValue = getProvider({ resource, providers });

  if (!providerValue[fn]) {
    throw new Error(`${fn} is not implemented for ${resource}`);
  }

  return (providerValue as Required<ResourceProvider<RaRecord>>)[fn];
};

export const createRaProvider = (
  providers: ResourceProvider[],
  options: {
    supportAbortSignal?: DataProvider['supportAbortSignal'];
    getListPageInfo: (args: {
      resource: string;
      getListParams: GetListParams & QueryFunctionContext;
      currentProvider: ResourceProvider<any>;
    }) => Promise<Omit<GetListResult, 'data'>>;
  }
): DataProvider => {
  return {
    supportAbortSignal: options.supportAbortSignal,
    getManyReference: (resource, raParams) => {
      return getProviderFn('getManyReference', { providers, resource })(
        resource,
        raParams
      );
    },
    getMany: (resource, raParams) => {
      return getProviderFn('getMany', { providers, resource })(
        resource,
        raParams
      );
    },
    delete: async (resource, raParams) => {
      return toRaResponse(
        getProviderFn('delete', { providers, resource })(raParams)
      );
    },
    deleteMany: async (resource, raParams) => {
      return toRaResponse(
        getProviderFn('deleteAll', { providers, resource })(raParams)
      );
    },
    getOne: async (resource, raParams) => {
      return toRaResponse(
        getProviderFn('getOne', { providers, resource })(raParams)
      );
    },
    create: async (resource, raParams) => {
      const { meta = {}, ...restParams } = raParams;
      return toRaResponse(
        getProviderFn('saveOrUpdate', { providers, resource })({
          ...restParams,
          meta: { mutationType: 'CREATE', ...meta } as MutationMetaType<any>,
        })
      );
    },
    update: async (resource, raParams) => {
      const { meta = {}, ...restParams } = raParams;
      return toRaResponse(
        getProviderFn('saveOrUpdate', { providers, resource })({
          ...restParams,
          meta: { mutationType: 'UPDATE', ...meta } as MutationMetaType<any>,
        })
      );
    },
    updateMany: async (resource, raParams) => {
      return toRaResponse(
        getProviderFn('updateAll', { providers, resource })(raParams)
      );
    },
    getList: async (resource, raParams) => {
      const providerValue = getProvider({ providers, resource });
      const { total, pageInfo } = await options.getListPageInfo({
        resource,
        getListParams: raParams,
        currentProvider: providerValue,
      });

      if (!providerValue.getList) {
        throw new Error(`getList is not implemented for ${resource}`);
      }

      const data = await providerValue.getList(raParams);
      return Promise.resolve({
        data,
        total,
        pageInfo,
      });
    },
  } as DataProvider;
};
