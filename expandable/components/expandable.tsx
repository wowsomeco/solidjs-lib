import type { Component, JSX, PropsWithChildren } from 'solid-js';

import type { CommonProps } from '~lib/common/components/props';
import FontAwesomeIcon from '~lib/font-awesome/components/FontAwesomeIcon';

interface ExpandableProps extends CommonProps, PropsWithChildren {
  onChange: (expanded: boolean) => void;
  expanded: boolean;
  title: JSX.Element;
}

/** WIP */
const Expandable: Component<ExpandableProps> = (props) => {
  const toggle = () => {
    props.onChange(!props.expanded);
  };

  return (
    <div class={props.class}>
      <button class='w-full flex items-center justify-between' onclick={toggle}>
        {props.title}
        {props.expanded ? (
          <FontAwesomeIcon iconName={'angle-up'} />
        ) : (
          <FontAwesomeIcon iconName={'angle-down'} />
        )}
      </button>
      <div
        style={{
          height: `${props.expanded ? '100%' : 0}`,
          transform: `scaleY(${props.expanded ? 1 : 0})`,
          'will-change': 'transform'
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Expandable;
