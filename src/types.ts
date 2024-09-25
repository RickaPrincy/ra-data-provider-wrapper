import {
  CreateParams,
  DataProvider,
  DeleteManyParams,
  DeleteParams,
  GetListParams,
  QueryFunctionContext,
  GetOneParams,
  Identifier,
  RaRecord,
  UpdateManyParams,
  UpdateParams,
} from 'react-admin';

type WithMeta<T> = { meta?: T };

export type Dict = Record<string, any>;
export type MutationType = 'CREATE' | 'UPDATE';
export type RequiredResourceName = {
  resource: string;
};

export type MutationMetaType<Type extends MutationType> = {
  muationType: Type;
};

export type DeleteAllArgsType<
  RecordType extends RaRecord = any,
  Meta extends Dict = any,
> = Omit<DeleteManyParams<RecordType>, 'meta'> & WithMeta<Meta>;
export type DeleteArgsType<
  RecordType extends RaRecord = any,
  Meta extends Dict = any,
> = Omit<DeleteParams<RecordType>, 'meta'> & WithMeta<Meta>;
export type GetOneArgsType<
  RecordType extends RaRecord = any,
  Meta extends Dict = any,
> = Omit<GetOneParams<RecordType> & QueryFunctionContext, 'meta'> &
  WithMeta<Meta>;
export type GetListArgsType<
  Filter extends Dict = any,
  Meta extends Dict = any,
> = Omit<GetListParams & QueryFunctionContext, 'meta'> &
  WithMeta<Meta> & {
    filter?: Filter;
  };

type CreateArgsType<
  RecordType extends RaRecord = any,
  Meta extends Dict = any,
> = Omit<CreateParams<RecordType>, 'meta'> &
  WithMeta<Meta & MutationMetaType<'CREATE'>>;

type UpdateArgsType<
  RecordType extends RaRecord = any,
  Meta extends Dict = any,
> = Omit<UpdateParams<RecordType>, 'meta'> &
  WithMeta<Meta & MutationMetaType<'UPDATE'>>;

export type SaveOrUpdateArgsType<
  RecordType extends RaRecord = any,
  Meta extends Dict = any,
> = CreateArgsType<RecordType, Meta> | UpdateArgsType<RecordType, Meta>;

export type UpdateAllArgsType<
  RecordType extends RaRecord = any,
  Meta extends Dict = any,
> = Omit<UpdateManyParams<RecordType>, 'meta'> & WithMeta<Meta>;

export type ResourceProvider<RecordType extends RaRecord = any> =
  RequiredResourceName & {
    getMany?: DataProvider['getMany']; // Huh
    getManyReference?: DataProvider['getManyReference']; // Huh
    delete?: <Meta extends Dict = any>(
      args: DeleteArgsType<RecordType, Meta>
    ) => Promise<RecordType>;
    getOne?: <Meta extends Dict = any>(
      args: GetOneArgsType<RecordType, Meta>
    ) => Promise<RecordType>;
    getList?: <Filter extends Dict = any, Meta extends Dict = any>(
      args: GetListArgsType<Filter, Meta>
    ) => Promise<RecordType[]>;
    updateAll?: <Meta extends Dict = any>(
      args: UpdateAllArgsType<RecordType, Meta>
    ) => Promise<RecordType[]>;
    deleteAll?: <Meta extends Dict = any>(
      args: DeleteAllArgsType<RecordType, Meta>
    ) => Promise<Identifier[]>;
    saveOrUpdate?: <Meta extends Dict = any>(
      args: SaveOrUpdateArgsType<RecordType, Meta>
    ) => Promise<RecordType>;
  };
