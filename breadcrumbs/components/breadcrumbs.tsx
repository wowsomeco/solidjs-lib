import clsx from 'clsx';
import { useLocation } from 'solid-app-router';
import type { Component, JSX, PropsWithChildren } from 'solid-js';

import type { CommonProps } from '~lib/common/components/props';
import { loop } from '~lib/common/extensions/arrays';

export type FontSize = 'xs' | 'sm' | 'md' | 'lg';

export type Gap = 'none' | 'xs' | 'sm' | 'md' | 'lg';

export type Align =
  | 'left'
  | 'center'
  | 'right'
  | 'between'
  | 'around'
  | 'evenly';

const FontSizeOptions: Map<FontSize, string> = new Map([
  ['xs', 'text-xs'],
  ['sm', 'text-sm'],
  ['md', 'text-md'],
  ['lg', 'text-lg']
]);

const GapOptions: Map<Gap, string> = new Map([
  ['none', 'space-x-0'],
  ['xs', 'space-x-2'],
  ['sm', 'space-x-4'],
  ['md', 'space-x-8'],
  ['lg', 'space-x-12']
]);

const AlignOptions: Map<Align, string> = new Map([
  ['left', 'justify-start'],
  ['center', 'justify-center'],
  ['right', 'justify-end'],
  ['between', 'justify-between'],
  ['around', 'justify-around'],
  ['evenly', 'justify-evenly']
]);

export type EachCrumbCbItems = {
  /** The route name */
  name: string;
  /** The previous route path */
  prev: string | undefined;
  /** Indicates whether it's the first index of the route location */
  first: boolean;
  /** Indicates whether it's the last index of the route location */
  last: boolean;
  /** The current combined route path from the prev one(s)  */
  joinPath: string;
};

export type EachCrumbCallback = (cb: EachCrumbCbItems) => Crumbs | undefined;

export interface Crumbs {
  to: string;
  label?: string;
  icon?: JSX.Element | null;
}

export interface BreadcrumbsProps extends PropsWithChildren, CommonProps {
  /**
   * Callback to parent that gets executed for each route of the current location
   * if returns undefined, then, the route will be ignored
   */
  eachCrumb: EachCrumbCallback;
  /**
   * The string used to separate the breadcrumbs
   * @default "/"
   */
  separator?: string;
  /**
   * Well, it's the font size.
   * @default "sm"
   */
  fontSize?: FontSize;
  /**
   * The gutter value allows you control over the space between the breadcrumb elements.
   * @default "sm"
   */
  gap?: Gap;
  /**
   * Specify how to align the breadcrumbs horizontally
   * @default "left"
   */
  align?: Align;
}

const Breadcrumbs: Component<BreadcrumbsProps> = (props: BreadcrumbsProps) => {
  const location = useLocation();
  // transform the pathname into array of string
  const splitPath = location.pathname.split('/');
  // remove the first item since it's only '/'
  splitPath.shift();
  // initially the items will be empty
  const items: Crumbs[] = [];
  // iterate over the splitpath and emit the callback for each of them to the parent
  let joinPath = '';
  loop(splitPath, ({ item: name, prev, first, last }) => {
    joinPath += `/${name}`;
    // callback to the parent for each crumb item
    const crumb = props.eachCrumb({
      name,
      prev,
      first,
      last,
      joinPath
    });
    // only push to the arr if the parent returns with an item.
    if (crumb) items.push(crumb);
  });

  return Array.isArray(items) ? (
    <nav
      className={clsx(
        'flex items-center text-gray-500 whitespace-nowrap flex-wrap',
        AlignOptions.get(props.align) ?? AlignOptions['left'],
        GapOptions.get(props.gap) ?? GapOptions['sm'],
        FontSizeOptions.get(props.fontSize) ?? FontSizeOptions['sm'],
        props.class
      )}
    >
      {items.map(({ to = '', label = '', icon = null }, index) => {
        const currentLocation = to === location.pathname;

        return to && (label || icon) ? (
          <>
            <a
              href={to}
              tabIndex={currentLocation ? -1 : 0}
              className={clsx(
                'flex items-center space-x-2 px-1 py-0.5 text-blue-500 rounded',
                currentLocation
                  ? 'font-bold cursor-default'
                  : 'hover:bg-blue-100 focus:ring-2'
              )}
            >
              <>
                {icon ? icon : null}
                {label ? <span>{label}</span> : null}
              </>
            </a>
            {index < items.length - 1 ? (
              <span>{props.separator ?? '/'}</span>
            ) : null}
          </>
        ) : null;
      })}
    </nav>
  ) : null;
};

export default Breadcrumbs;
