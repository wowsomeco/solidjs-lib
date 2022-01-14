import clsx from 'clsx';
import { nanoid } from 'nanoid';
import type { Component, PropsWithChildren } from 'solid-js';
import { createSignal, onCleanup, onMount } from 'solid-js';

import type { CommonProps } from '~lib/common/components/props';

export interface FilePickerProps extends PropsWithChildren, CommonProps {
  label?: string;
  /**
   * Accepted file types
   * Separated with comma if multiple
   */
  acceptFiles?: string[];
  onFileAdded?: (f: FileList) => Promise<string | undefined>;
}

const DRAG_EVENTS = ['dragenter', 'dragover', 'dragleave', 'drop'];

const FilePicker: Component<FilePickerProps> = (props) => {
  const acceptFileStr: string = props.acceptFiles.reduce((p, c) => p + `,${c}`);

  const [isHighlighted, setHighlighted] = createSignal(false);
  const [hasError, setError] = createSignal<string>(undefined);

  let div: HTMLDivElement;

  const preventDefaults = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const highlight = () => {
    setHighlighted(true);
  };

  const unhighlight = () => {
    setError(undefined);
    setHighlighted(false);
  };

  const handleFiles = async (files: FileList) => {
    unhighlight();

    for (const f of files) {
      if (!props.acceptFiles.includes(f.type)) {
        setError(`Only accepts ${acceptFileStr}`);
        return;
      }
    }

    const err = await props.onFileAdded?.(files);
    if (err) {
      setError(err);
    }
  };

  onMount(() => {
    DRAG_EVENTS.forEach((eventName) => {
      div.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });
  });

  onCleanup(() => {
    DRAG_EVENTS.forEach((eventName) => {
      div.removeEventListener(eventName, preventDefaults, false);
      document.body.removeEventListener(eventName, preventDefaults, false);
    });
  });

  const id = nanoid();

  return (
    <div class='w-full flex flex-col'>
      <div
        class={clsx(
          props.class,
          isHighlighted() && 'border-blue-500',
          hasError() && 'border-red-500',
          'bg-gray-50 border-dashed border-2 p-5 flex items-center justify-center'
        )}
        ondragenter={highlight}
        ondragover={highlight}
        ondragleave={unhighlight}
        ondrop={(e) => handleFiles(e.dataTransfer.files)}
        ref={div}
      >
        <input
          type='file'
          class='hidden'
          id={id}
          accept={acceptFileStr}
          onchange={(e) => handleFiles((e.target as HTMLInputElement).files)}
        />
        <label for={id} class='cursor-pointer hover:text-blue-500'>
          {props.label ?? 'Drag and drop the file here, or click to upload'}
        </label>
      </div>
      {hasError() && <p class='text-red-500'>{hasError()}</p>}
    </div>
  );
};

export default FilePicker;
