import type { Component } from 'solid-js';

import type { OverlayProps } from './overlay';
import Overlay from './overlay';

export interface CenterOverlayProps extends OverlayProps {}

const CenterOverlay: Component<CenterOverlayProps> = (props) => {
  return (
    <Overlay {...props}>
      <div className='relative w-full h-full'>
        <div
          style={{ transform: 'translate(-50%,-50%)' }}
          class='absolute top-1/2 left-1/2'
        >
          {props.children}
        </div>
      </div>
    </Overlay>
  );
};

export default CenterOverlay;
