import 'flatpickr/dist/flatpickr.css';

import flatpickr from 'flatpickr';
import type { Component } from 'solid-js';
import { onCleanup } from 'solid-js';

import InputField from '~lib/input-field/components/inputField';

interface DatePickerProps {
  value?: string;
  onChange: (v: string) => void;
}

const DatePicker: Component<DatePickerProps> = (props: DatePickerProps) => {
  let fp;

  const onRef = (ref: HTMLInputElement) => {
    fp = flatpickr(ref, {
      dateFormat: 'Y-m-d',
      defaultDate: props.value
    });

    fp.config.onChange.push((_, currentDateString: string) => {
      props.onChange(currentDateString);
    });
  };

  onCleanup(() => {
    fp.destroy();
  });

  return (
    <InputField value={props.value} onChange={props.onChange} ref={onRef} />
  );
};

export default DatePicker;
