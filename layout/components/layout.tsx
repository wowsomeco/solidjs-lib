import clsx from 'clsx';
import type { Component, JSX, PropsWithChildren } from 'solid-js';

interface LayoutProps extends PropsWithChildren {
  appBarHeight?: number;
  appBarClass?: string;
  headerSlot?: JSX.Element;
}

const Layout: Component<LayoutProps> = (props: LayoutProps) => {
  const appBarHeight = props.appBarHeight ?? 50;

  return (
    <div class='w-screen h-screen relative'>
      <div
        class={clsx('flex justify-between items-center p-5', props.appBarClass)}
        style={{ height: `${appBarHeight}px` }}
      >
        {props.headerSlot}
      </div>
      <div class='flex' style={{ height: `calc(100% - ${appBarHeight}px)` }}>
        <main class='bg-gray-100 overflow-y-scroll py-2 px-2 w-full h-full'>
          {props.children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
