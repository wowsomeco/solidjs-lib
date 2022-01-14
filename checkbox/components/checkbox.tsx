import './checkbox.css';

import type { Component } from 'solid-js';

import type { CommonProps } from '~components/props';

interface CheckboxProps extends CommonProps {
  name?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

const Checkbox: Component<CheckboxProps> = (props) => {
  return (
    <label class='checkbox w-full'>
      {props.children}
      <input
        type='checkbox'
        name={props.name}
        checked={props.value}
        onInput={(e) => {
          const isChecked = (e.target as HTMLInputElement).checked;

          props.onChange(isChecked);
        }}
      />
      <span class='checkmark border bg-white'></span>
    </label>
  );
};

export default Checkbox;
