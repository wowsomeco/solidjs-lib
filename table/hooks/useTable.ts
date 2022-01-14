import { Accessor, batch, createEffect, createSignal } from 'solid-js';

type Filter = Record<string, any>;

export interface TableModel<TData> {
  data: TData[];
  count: number;
}

export interface GetOptions {
  curPage: number;
  itemsPerPage: number;
  filters: Filter;
}

export interface InitOptions<TData> {
  curPage: number;
  itemsPerPage: number;
  filters: Filter;
  get: (options: GetOptions) => Promise<TableModel<TData>>;
}

interface TableStore<TData> {
  data: Accessor<TData[]>;
  loading: Accessor<boolean>;
  curPage: Accessor<number>;
  maxPage: Accessor<number>;
  filters: Accessor<Filter>;
  changeFilters: (filters: Filter) => void;
  changePage: (offset: number) => void;
}

function useTable<TData>(options: InitOptions<TData>): TableStore<TData> {
  const [curPage, setCurPage] = createSignal(options.curPage);
  const [maxPage, setMaxPage] = createSignal(0);
  const [loading, setLoading] = createSignal(true);
  const [data, setData] = createSignal<TData[]>([]);
  const [filters, setFilters] = createSignal<Filter>(options.filters);

  const getData = async () => {
    setLoading(true);

    const d = await options.get({
      curPage: curPage(),
      itemsPerPage: options.itemsPerPage,
      filters: filters()
    });

    batch(() => {
      setData(d.data);
      setMaxPage(d.count);
      setLoading(false);
    });
  };

  const changePage = (offset: number) => {
    setCurPage(offset);
  };

  const changeFilters = (filters: Filter) => {
    setFilters(filters);
  };

  createEffect(() => {
    getData();
  });

  return {
    data,
    loading,
    filters,
    changeFilters,
    curPage,
    maxPage,
    changePage
  };
}

export default useTable;
