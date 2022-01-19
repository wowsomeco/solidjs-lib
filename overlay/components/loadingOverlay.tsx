import type { Component } from 'solid-js';

import SpinCircleLoader from '~lib/loaders/components/spinCircleLoader';

import CenterOverlay from './centerOverlay';
import type { OverlayProps } from './overlay';

export interface LoadingOverlayProps extends OverlayProps {}

const LoadingOverlay: Component<LoadingOverlayProps> = (props) => {
  return (
    <CenterOverlay {...props}>
      <SpinCircleLoader size={32} fillColor='white' />
      {props.children}
    </CenterOverlay>
  );
};

export default LoadingOverlay;
