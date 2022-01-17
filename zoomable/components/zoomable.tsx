import type { IconName } from '@fortawesome/fontawesome-svg-core';
import clsx from 'clsx';
import type { Component, JSX, PropsWithChildren } from 'solid-js';
import { createEffect, onCleanup, onMount } from 'solid-js';

import type { CommonProps } from '~lib/common/components/props';
import Draggable from '~lib/common/utils/draggable';
import Vector2 from '~lib/common/utils/vec2';
import FontAwesomeIcon from '~lib/font-awesome/components/FontAwesomeIcon';

interface ZoomBtnProps {
  onClick: () => void;
  iconName: IconName;
  disabled: boolean;
}

const ZoomBtn: Component<ZoomBtnProps> = (props) => {
  return (
    <button
      class={clsx(
        'border px-2 py-1 h-full',
        props.disabled ? 'bg-gray-100 text-gray-500' : 'bg-white text-blue-500'
      )}
      onClick={() => !props.disabled && props.onClick()}
    >
      <FontAwesomeIcon
        class='cursor-pointer text-lg'
        iconName={props.iconName}
      />
    </button>
  );
};

interface ZoomableProps extends PropsWithChildren, CommonProps {
  style?: JSX.CSSProperties;
  zoom: number;
  deltaZoom?: number;
  onChangeZoom: (v: number) => void;
  pos: Vector2;
  onChangePos: (v: Vector2) => void;
}

const Zoomable: Component<ZoomableProps> = (props) => {
  let viewportEl: HTMLDivElement;
  let containerEl: HTMLDivElement;
  let dragHandler: Draggable;

  const transformCss = () =>
    `scale(${props.zoom}, ${props.zoom}) translate3d(${props.pos.x}px, ${props.pos.y}px, 0)`;

  const percentage = () => `${Math.floor(props.zoom * 100)}%`;

  const delta = () => props.deltaZoom ?? 0.1;

  const refresh = () => {
    if (!containerEl) return;

    containerEl.style.transform = transformCss();
  };

  const updateValue = (delta: number) => {
    const newValue = parseFloat((props.zoom + delta).toFixed(1));
    props.onChangeZoom(newValue);
  };

  const zoomIn = () => {
    updateValue(delta());
  };

  const zoomOut = () => {
    updateValue(-delta());
  };

  onMount(() => {
    refresh();

    dragHandler = new Draggable(viewportEl, {
      onDragging: ({ delta }) => {
        props.onChangePos(Vector2.add(props.pos, delta));
      }
    });
  });

  onCleanup(() => dragHandler?.cleanup());

  createEffect(() => {
    refresh();
  });

  return (
    <div
      class={clsx(props.class, 'relative overflow-hidden')}
      style={props.style}
      ref={viewportEl}
    >
      <div class='w-full h-full' ref={containerEl}>
        {props.children}
      </div>
      <div
        class='absolute bottom-0 right-0 flex items-center p-2'
        style={{ height: '50px' }}
      >
        <ZoomBtn
          iconName='minus'
          onClick={zoomOut}
          disabled={props.zoom === 0}
        ></ZoomBtn>
        <div class='bg-white border-b border-t p-1 h-full text-gray-500'>
          {percentage()}
        </div>
        <ZoomBtn
          iconName='plus'
          onClick={zoomIn}
          disabled={props.zoom === 1}
        ></ZoomBtn>
      </div>
    </div>
  );
};

export default Zoomable;
