import clsx from 'clsx';
import type { Component, JSX } from 'solid-js';
import { createSignal, onCleanup, onMount } from 'solid-js';

import type { CommonProps } from '~components/props';
import clickOutside from '~directives/clickOutside';
import Debounce from '~lib/common/utils/debounce';
import FontAwesomeIcon from '~lib/font-awesome/components/FontAwesomeIcon';
import SpinCircleLoader from '~lib/loaders/components/spinCircleLoader';

interface InputFieldProps extends CommonProps {
  ref?: (el: HTMLInputElement) => void;
  type?: string;
  value?: string;
  clearable?: boolean;
  loading?: boolean;
  readOnly?: boolean;
  onChange?: (v: string) => void;
  onFocus?: () => void;
  prefix?: JSX.Element;
  postfix?: JSX.Element;
  debounce?: number;
  placeholder?: string;
}

const InputField: Component<InputFieldProps> = (props: InputFieldProps) => {
  const [isFocus, setFocus] = createSignal(false);
  const debounce = props.debounce ? new Debounce() : undefined;
  let input: HTMLInputElement;

  onMount(() => {
    props.ref?.(input);
  });

  const clear = () => {
    props.onChange?.(null);
  };

  const focus = () => {
    setFocus(true);
    props.onFocus?.();
  };

  const blur = () => {
    input.blur();
    setFocus(false);
  };

  const onChange = (v: string) => {
    const propChange = () => {
      props.onChange?.(v);
    };

    if (debounce) {
      debounce.run(propChange, props.debounce);
    } else {
      propChange();
    }
  };

  onCleanup(() => debounce?.cancel());

  return (
    <div
      class={clsx(
        'w-full py-2 px-4 flex items-center leading-tight bg-white border rounded',
        isFocus() ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
      )}
    >
      {props.prefix}
      <input
        placeholder={props.placeholder}
        type={props.type}
        use:clickOutside={blur}
        class='w-full focus:outline-none'
        onfocus={focus}
        value={props.value}
        ref={input}
        onblur={() => setFocus(false)}
        oninput={(e) => onChange(e.currentTarget.value)}
        readonly={props.readOnly}
      />
      {props.clearable && (
        <FontAwesomeIcon
          onClick={clear}
          class='cursor-pointer text-gray-500 hover:text-blue-500'
          prefix='fas'
          iconName='times-circle'
        />
      )}
      {props.loading && <SpinCircleLoader size={20} />}
      {props.postfix}
    </div>
  );
};

export default InputField;
