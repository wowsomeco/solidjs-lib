import type { Component, PropsWithChildren } from 'solid-js';
import type { Store } from 'solid-js/store';

import type { CommonProps } from '~components/props';

import type { FormErr } from '../hooks/useForm';

interface FieldProps extends CommonProps, PropsWithChildren {
  label: string;
  labelClass?: string;
  key: string;
  error: Store<FormErr>;
}

const FormField: Component<FieldProps> = (props: FieldProps) => {
  return (
    <>
      <label class={props.labelClass ?? 'text-blue-500'}>{props.label}</label>
      {props.children}
      {props.error[props.key] && (
        <p class='text-red-500'>{props.error[props.key]}</p>
      )}
    </>
  );
};

export default FormField;
