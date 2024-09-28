import { type ResourceProvider } from '@rck.princy/ra-data-provider-wrapper';

export type Person = {
  id: string;
  name: string;
};

let PERSONS: Person[] = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Alice Johnson' },
  { id: '4', name: 'Robert Brown' },
  { id: '5', name: 'Emily Davis' },
  { id: '6', name: 'Michael Wilson' },
  { id: '7', name: 'Sarah Lee' },
  { id: '8', name: 'David White' },
  { id: '9', name: 'Laura Green' },
  { id: '10', name: 'James Clark' },
  { id: '11', name: 'Emily Davis' },
  { id: '12', name: 'Michael Wilson' },
  { id: '13', name: 'Sarah Lee' },
  { id: '14', name: 'David White' },
  { id: '15', name: 'Laura Green' },
  { id: '16', name: 'James Clark' },
];

export const personProvider: ResourceProvider<Person> = {
  resource: 'persons',
  getList: async ({ pagination = { page: 1, perPage: 2 } }) => {
    const { perPage, page } = pagination;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return Promise.resolve(PERSONS.slice(startIndex, endIndex));
  },
  getOne: async ({ id }) => {
    return Promise.resolve(PERSONS.find((person) => person.id === id)!);
  },
  saveOrUpdate: async ({ data, meta }) => {
    if (meta?.mutationType === 'CREATE') {
      PERSONS.push(data as Required<Person>);
    } else {
      PERSONS = PERSONS.map((person) =>
        person.id === data.id! ? (data as Required<Person>) : person
      );
    }
    return PERSONS.find((person) => person.id === data.id)!;
  },
  //others
};
