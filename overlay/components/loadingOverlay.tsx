import type { Component } from 'solid-js';

import SpinCircleLoader from '~lib/loaders/components/spinCircleLoader';

import type { OverlayProps } from './overlay';
import Overlay from './overlay';

export interface LoadingOverlayProps extends OverlayProps {}

const LoadingOverlay: Component<LoadingOverlayProps> = (props) => {
  return (
    <Overlay {...props}>
      <div className='relative w-full h-full'>
        <div
          style={{ transform: 'translate(-50%,-50%)' }}
          class='absolute top-1/2 left-1/2 text-center flex items-center'
        >
          <SpinCircleLoader size={32} fillColor='white' />
          {props.children}
        </div>
      </div>
    </Overlay>
  );
};

export default LoadingOverlay;
