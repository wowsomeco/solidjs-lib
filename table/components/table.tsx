import type { JSX } from 'solid-js';
import { For } from 'solid-js';

import type { CommonProps } from '~lib/common/components/props';
import { createNumArray } from '~lib/common/extensions/arrays';
import Skeleton from '~lib/skeleton/components/skeleton';

import type { GetOptions, TableModel } from '../hooks/useTable';
import useTable from '../hooks/useTable';
import Pagination from './pagination';

interface TableProps<TData> extends CommonProps {
  curPage?: number;
  itemsPerPage?: number;
  get: (options: GetOptions) => Promise<TableModel<TData>>;
  header: JSX.Element[];
  eachRow: (data: TData, idx: number) => JSX.Element;
}

const Table = <TData extends Record<string, any>>(props: TableProps<TData>) => {
  const { data, loading, changePage, curPage, maxPage } = useTable<TData>({
    curPage: props.curPage ?? 1,
    itemsPerPage: props.itemsPerPage ?? 10,
    filters: {},
    get: props.get
  });

  return (
    <div class={props.class}>
      <table class='table-auto mb-2 w-full overflow-x-scroll'>
        <thead>
          <tr class='px-2 py-4'>
            {props.header.map((h) => (
              <th>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!loading() ? (
            <For each={data()}>{(item, i) => props.eachRow(item, i())}</For>
          ) : (
            createNumArray(props.itemsPerPage).map(() => (
              <tr>
                <td class='py-1' colSpan={100}>
                  <Skeleton class='rounded-2xl bg-gray-200 w-full h-4' />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div class='flex justify-end'>
        <Pagination
          count={maxPage()}
          page={curPage()}
          onChange={(v) => changePage(v)}
        />
      </div>
    </div>
  );
};

export default Table;
