# solidjs-lib

A Collection of experimental components, hooks and extensions for [solidjs](https://github.com/solidjs/solid)

## Getting Started

Right now it serves as a git submodule, no npm for now.
Add it as a submodule in your project by running:

```console
git submodule add git@github.com:wowsomeco/solidjs-lib.git src/lib
```

from your root project.

create global.d.ts in your root project, then add:

```typescript
import 'solid-js';

import { TooltipOptions } from '~directives/tooltip';
import { TransitionOptions } from '~directives/transition';

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      clickOutside?: () => void;
      tooltip?: TooltipOptions;
      ripple?: boolean;
      transition?: TransitionOptions;
    }
  }
}
```

Then, in your `tsconfig.json` of the project, add:

```json
{
  "compilerOptions": {
    "paths": {
      "~lib/*": ["src/lib/*"]
    }
  }
}
```

add these dependencies in package.json:

```json
{
  "devDependencies": {
    ...,
    "isomorphic-fetch": "latest",
    "tailwindcss": "latest",
  },
  "dependencies": {
    ...,
    "@fortawesome/fontawesome-svg-core": "latest",
    "@fortawesome/free-solid-svg-icons": "latest",
    "@popperjs/core": "latest",
    "clsx": "latest",
    "flatpickr": "latest",
    "nanoid": "latest",
    "tippy.js": "latest",
  }
}
```

## Documentation

Coming Soon

For more info about the usage, please check out our [Playground](https://github.com/wowsomeco/solidjs-playground)
