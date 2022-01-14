import { Accessor, createSignal, onMount } from 'solid-js';
import { createStore, SetStoreFunction, Store } from 'solid-js/store';

import { setAll } from '~lib/common/extensions/generics';

export type FormErr = Record<string, string | undefined>;

interface FormProps<TModel> {
  key?: string;
  model: () => Promise<TModel>;
  onSubmit: (model: TModel, key: string) => Promise<void>;
  validate: (model: TModel, key: string) => FormErr;
  onValidationError?: (error: FormErr) => void;
}

interface FormReturn<TModel> {
  model: Store<TModel>;
  setModel: SetStoreFunction<TModel>;
  errors: Store<FormErr>;
  clearError: (name?: string) => void;
  handleSubmit: (ev: Event) => void;
  loading: Accessor<boolean>;
}

export const useForm = <TModel extends Record<string, any>>(
  props: FormProps<TModel>
): FormReturn<TModel> => {
  const [errors, setErrors] = createStore<Record<string, any>>({});
  const [model, setModel] = createStore({} as TModel);
  const [loading, setLoading] = createSignal(false);

  onMount(async () => {
    setLoading(true);

    const m = await props.model();
    setModel(m);

    setLoading(false);
  });

  const clearError = (name?: string) => {
    if (name) {
      setErrors({ [name]: undefined });
    } else {
      setErrors((obj) => {
        setAll(obj, undefined);
        return obj;
      });
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (loading()) return;

    const err = props.validate(model, props.key);
    setErrors(err);

    if (err) {
      props.onValidationError?.(err);
    }

    // can submit when no more strings defined in the error values
    const canSubmit =
      Object.values(err).filter((x) => x !== undefined).length === 0;

    if (canSubmit) {
      setLoading(true);
      await props.onSubmit(model, props.key);
      setLoading(false);
    }
  };

  return { model, setModel, errors, clearError, handleSubmit, loading };
};
