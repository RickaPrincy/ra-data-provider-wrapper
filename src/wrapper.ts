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

const getProvider = <Fn extends keyof ResourceProvider>(
  fn: Fn,
  {
    providers,
    resource,
  }: { providers: ResourceProvider<RaRecord>[] } & RequiredResourceName
): Required<ResourceProvider<RaRecord>>[Fn] => {
  const providerValue = providers.find(
    (resourceProvider) => resourceProvider.resource === resource
  );
  if (!providerValue) {
    throw new Error(`Unknown resource: ${resource}`);
  }

  if (!providerValue[fn]) {
    throw new Error(`${fn} is not implemented for ${resource}`);
  }

  return (providerValue as Required<ResourceProvider<RaRecord>>)[fn];
};

export const createRaProvider = (
  providers: ResourceProvider[],
  options: {
    supportAbortSignal?: DataProvider['supportAbortSignal'];
    getListPageInfo: (
      resource: string,
      getListParams: GetListParams & QueryFunctionContext
    ) => Promise<Omit<GetListResult, 'data'>>;
  }
): DataProvider => {
  return {
    supportAbortSignal: options.supportAbortSignal,
    getManyReference: (resource, raParams) => {
      return getProvider('getManyReference', { providers, resource })(
        resource,
        raParams
      );
    },
    getMany: (resource, raParams) => {
      return getProvider('getMany', { providers, resource })(
        resource,
        raParams
      );
    },
    delete: async (resource, raParams) => {
      return toRaResponse(
        getProvider('delete', { providers, resource })(raParams)
      );
    },
    deleteMany: async (resource, raParams) => {
      return toRaResponse(
        getProvider('deleteAll', { providers, resource })(raParams)
      );
    },
    getOne: async (resource, raParams) => {
      return toRaResponse(
        getProvider('getOne', { providers, resource })(raParams)
      );
    },
    create: async (resource, raParams) => {
      const { meta = {}, ...restParams } = raParams;
      return toRaResponse(
        getProvider('saveOrUpdate', { providers, resource })({
          ...restParams,
          meta: { mutationType: 'CREATE', ...meta } as MutationMetaType<any>,
        })
      );
    },
    update: async (resource, raParams) => {
      const { meta = {}, ...restParams } = raParams;
      return toRaResponse(
        getProvider('saveOrUpdate', { providers, resource })({
          ...restParams,
          meta: { mutationType: 'UPDATE', ...meta } as MutationMetaType<any>,
        })
      );
    },
    updateMany: async (resource, raParams) => {
      return toRaResponse(
        getProvider('updateAll', { providers, resource })(raParams)
      );
    },
    getList: async (resource, raParams) => {
      const { total, pageInfo } = await options.getListPageInfo(
        resource,
        raParams
      );
      const data = await getProvider('getList', { providers, resource })(
        raParams
      );

      return Promise.resolve({
        data,
        total,
        pageInfo,
      });
    },
  } as DataProvider;
};
