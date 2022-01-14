import type { IconName } from '@fortawesome/fontawesome-svg-core';
import clsx from 'clsx';
import type { Component, PropsWithChildren } from 'solid-js';

import type { CommonProps } from '~components/props';
import Btn from '~lib/button/components/btn';
import { createNumArray } from '~lib/common/extensions/arrays';
import FontAwesomeIcon from '~lib/font-awesome/components/FontAwesomeIcon';

interface PaginationItemProps extends PropsWithChildren {
  isSelected: boolean;
  onSelected: () => void;
}

const PaginationItem: Component<PaginationItemProps> = (
  props: PaginationItemProps
) => {
  return (
    <Btn
      onClick={props.onSelected}
      class={clsx(
        'rounded-full border p-1 w-8 h-8 hover:bg-gray-300',
        props.isSelected && 'bg-gray-200'
      )}
    >
      {props.children}
    </Btn>
  );
};

interface PaginationNavProps {
  iconName: IconName;
  disabled: boolean;
  onClick: () => void;
}

const PaginationNav: Component<PaginationNavProps> = (
  props: PaginationNavProps
) => {
  return (
    <FontAwesomeIcon
      iconName={props.iconName}
      class={clsx(
        'rounded-full p-1 w-8 h-8 text-center',
        props.disabled
          ? 'pointer-events-none cursor-not-allowed text-gray-300'
          : 'hover:bg-gray-300 cursor-pointer'
      )}
      onClick={() => {
        if (!props.disabled) props.onClick();
      }}
    />
  );
};

interface PaginationProps extends CommonProps {
  count: number;
  page: number;
  onChange: (page: number) => void;
}

const Pagination: Component<PaginationProps> = (props: PaginationProps) => {
  return (
    <div class={clsx('flex items-center space-x-2', props.class)}>
      <PaginationNav
        iconName='angle-left'
        disabled={props.page === 1}
        onClick={() => props.onChange(props.page - 1)}
      />
      {createNumArray(props.count, 1).map((i) => (
        <PaginationItem
          isSelected={i === props.page}
          onSelected={() => props.onChange(i)}
        >
          {i.toString()}
        </PaginationItem>
      ))}
      <PaginationNav
        iconName='angle-right'
        disabled={props.page === props.count}
        onClick={() => props.onChange(props.page + 1)}
      />
    </div>
  );
};

export default Pagination;
