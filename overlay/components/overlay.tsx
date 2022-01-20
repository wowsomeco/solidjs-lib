import type { Component, PropsWithChildren } from 'solid-js';
import { onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

import { toRgba } from '~lib/common/extensions/strings';
import { Z_INDEX_OVERLAY } from '~lib/common/scripts/constants';
import { KeyEventBinder } from '~lib/common/utils/keyEventBinder';
import FontAwesomeIcon from '~lib/font-awesome/components/FontAwesomeIcon';

export interface OverlayProps extends PropsWithChildren {
  open: boolean;
  onClose?: () => void;
  /** the BG color in hex e.g. #ecf0f1 */
  color?: string;
  /** The opacity of the BG */
  opacity?: number;
  zIndex?: number;
  withCloseBtn?: boolean;
}

const Overlay: Component<OverlayProps> = (props) => {
  const keyBinder = KeyEventBinder.init().on('keydown', ['Escape'], () => {
    if (!props.open) return false;

    props.onClose?.();

    return true;
  });

  const rgba = toRgba(props.color ?? '#000000', props.opacity ?? 0.3);

  onCleanup(() => {
    keyBinder.remove();
  });

  return (
    <Portal mount={document.body}>
      {props.open ? (
        <div
          style={{
            'background-color': rgba,
            'z-index': props.zIndex ?? Z_INDEX_OVERLAY
          }}
          class='absolute w-full h-full top-0 left-0'
        >
          {props.children}
          {props.withCloseBtn && (
            <FontAwesomeIcon
              iconName='times'
              class='absolute top-0 right-0 text-white hover:text-yellow-200 m-3 text-3xl cursor-pointer'
              onClick={() => props.onClose?.()}
            />
          )}
        </div>
      ) : null}
    </Portal>
  );
};

export default Overlay;
