import type { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { icon } from '@fortawesome/fontawesome-svg-core';
import type { Component } from 'solid-js';
import { onMount } from 'solid-js';

import type { CommonProps } from '~components/props';

interface FontAwesomeIconProps extends CommonProps {
  iconName: IconName;
  prefix?: IconPrefix;
  onClick?: () => void;
}

const FontAwesomeIcon: Component<FontAwesomeIconProps> = (
  props: FontAwesomeIconProps
) => {
  let spanRef: HTMLSpanElement;

  onMount(() => {
    const ic = icon({
      prefix: props.prefix ?? 'fas',
      iconName: props.iconName
    }).html[0];

    spanRef.innerHTML = ic;
  });

  return (
    <span
      onclick={props.onClick}
      class={props.class ?? ''}
      ref={spanRef}
    ></span>
  );
};

export default FontAwesomeIcon;
