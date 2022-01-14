import type { Instance } from '@popperjs/core';
import { createPopper } from '@popperjs/core';
import clsx from 'clsx';
import type { JSX, PropsWithChildren } from 'solid-js';
import { createSignal, onCleanup } from 'solid-js';

import clickOutside from '~directives/clickOutside';
import { KeyEventBinder } from '~lib/common/utils/keyEventBinder';
import FontAwesomeIcon from '~lib/font-awesome/components/FontAwesomeIcon';
import InputField from '~lib/input-field/components/inputField';

interface SelectProps<TData> extends PropsWithChildren {
  renderValue?: () => string;
  renderItem: (item: TData) => JSX.Element;
  options: TData[];
  onChange: (item: TData) => void;
  loading?: boolean;
}

const Select = <TData extends Record<string, any>>(
  props: SelectProps<TData>
) => {
  const [showing, setShowing] = createSignal(false);

  let container: HTMLDivElement;
  let input: HTMLInputElement;
  let pop: HTMLDivElement;
  let popperInstance: Instance;

  const show = () => {
    setShowing(true);

    pop.style.display = 'block';
    popperInstance.update();
  };

  const hide = () => {
    pop.style.display = 'none';

    input.value = props.renderValue()?.toString() ?? null;
    input.blur();

    setShowing(false);
  };

  const clickItem = (item: TData) => {
    props.onChange(item);
    hide();
  };

  const keyBinder = KeyEventBinder.init().on(
    'keydown',
    ['Escape', 'Enter'],
    () => {
      if (!showing()) return false;

      hide();
      return true;
    }
  );

  const onRef = (i: HTMLInputElement) => {
    input = i;
    hide();

    popperInstance = createPopper(container, pop, {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['top', 'right']
          }
        },
        {
          name: 'sameWidth',
          enabled: true,
          fn: ({ state }) => {
            state.styles.popper.width = `${state.rects.reference.width}px`;
          },
          phase: 'beforeWrite',
          requires: ['computeStyles']
        }
      ]
    });
  };

  onCleanup(() => {
    keyBinder.remove();
  });

  return (
    <>
      <div ref={container} use:clickOutside={() => hide()}>
        <InputField
          value={props.renderValue() ?? null}
          onFocus={show}
          ref={onRef}
          loading={props.loading}
          readOnly
          postfix={<FontAwesomeIcon prefix='fas' iconName='angle-down' />}
        />
      </div>
      <div
        style={{ 'max-height': '300px', margin: 0 }}
        ref={pop}
        class={'border rounded bg-white overflow-y-scroll z-50'}
      >
        {props.options.map((it) => (
          <div
            class={clsx(
              'p-2 cursor-pointer hover:bg-gray-200',
              props.renderValue() === it.name && 'bg-blue-50'
            )}
            onclick={() => clickItem(it)}
          >
            {props.renderItem(it)}
          </div>
        ))}
      </div>
    </>
  );
};

export default Select;
