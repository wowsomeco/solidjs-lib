import clsx from 'clsx';
import type { Component } from 'solid-js';
import { createSignal, For } from 'solid-js';
import { Portal } from 'solid-js/web';

import transition from '~directives/transition';
import FontAwesomeIcon from '~lib/font-awesome/components/FontAwesomeIcon';

import type { NotifOptions } from '../contexts/context';
import useNotif from '../contexts/context';

interface NotifProps {
  /** Appearance duration in ms */
  duration: number;
}

const Notif: Component<NotifProps> = (props: NotifProps) => {
  let ref: HTMLDivElement;
  const [notifs, setNotifs] = createSignal<NotifOptions[]>([]);

  const { notif } = useNotif;

  const addNotif = (n: NotifOptions) => {
    setNotifs([...notifs(), n]);
  };

  const removeNotif = (i: number) => {
    setNotifs((n) => [...n.slice(0, i), ...n.slice(i + 1)]);
  };

  notif.subscribe(addNotif);

  return (
    <Portal mount={document.body}>
      <div class='w-64 fixed bottom-0 right-0 p-2' ref={ref}>
        <For each={notifs()}>
          {(notif, i) => {
            return (
              <div
                use:transition={{
                  onDone: () => removeNotif(i()),
                  steps: [
                    {
                      duration: 500,
                      tweens: new Map([
                        ['opacity', { from: 0, to: 1 }],
                        ['y', { from: 10, to: 0 }]
                      ])
                    },
                    {
                      duration: props.duration
                    },
                    {
                      duration: 500,
                      tweens: new Map([['opacity', { from: 1, to: 0 }]])
                    }
                  ]
                }}
                class={clsx(
                  'text-white shadow rounded p-2 my-2 flex items-center justify-between',
                  notif.class
                )}
              >
                {notif.text}
                <FontAwesomeIcon
                  class='cursor-pointer hover:text-gray-50'
                  iconName='times-circle'
                  onClick={() => removeNotif(i())}
                />
              </div>
            );
          }}
        </For>
      </div>
    </Portal>
  );
};

export default Notif;
