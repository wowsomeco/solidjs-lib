import { createRoot, onCleanup } from 'solid-js';

import Observable from '~lib/common/utils/observable';

export interface NotifOptions {
  text: string;
  class: string;
}

interface NotifContextReturn {
  notif: Observable<NotifOptions>;
}

const notifContext = (): NotifContextReturn => {
  let notif = new Observable<NotifOptions>({} as NotifOptions);

  onCleanup(() => (notif = new Observable<NotifOptions>({} as NotifOptions)));

  return { notif };
};

const useNotif = createRoot(notifContext);

export default useNotif;
