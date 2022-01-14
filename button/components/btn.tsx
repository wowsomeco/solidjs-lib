import clsx from 'clsx';
import type { Component, PropsWithChildren } from 'solid-js';

import type { CommonProps } from '~components/props';
import ripple from '~directives/ripple';
import tooltip from '~directives/tooltip';
import SpinCircleLoader from '~lib/loaders/components/spinCircleLoader';

export interface BtnProps extends PropsWithChildren, CommonProps {
  type?: 'submit' | 'reset' | 'button';
  loading?: boolean;
  loadingColor?: string;
  onClick?: () => void;
  tooltip?: string;
}

const Btn: Component<BtnProps> = (props: BtnProps) => {
  return (
    <button
      type={props.type ?? 'button'}
      onclick={() => {
        !props.loading && props.onClick?.();
      }}
      class={clsx(props.class, 'flex items-center justify-center')}
      use:ripple
      use:tooltip={{
        text: props.tooltip,
        disabled: props.tooltip === undefined,
        cls: 'bg-gray-500 text-gray-50 p-1 rounded-sm'
      }}
    >
      {props.children}
      {props.loading && (
        <SpinCircleLoader
          class='ml-1'
          fillColor={props.loadingColor ?? 'white'}
          size={20}
        />
      )}
    </button>
  );
};

export default Btn;
