# File Structure Convention

This document provides information regarding the project's file structure conventions, including the naming of files and directories, the organization of entities within directories, and conventions for imports and exports.

### Entities

An entity is a named directory containing a consistent set of files and permitted subdirectories—for example, `src/plugin`, `src/http`, or `src/http/request-context`. These serve as constituent units of the framework core and are located within the `src` directory.

First-order entities possess the following fixed set of files and subdirectories:

- `private/` - The directory containing all PRIVATE entity submodules. Optional.
- `private/index.ts` - The entry point for all entity private submodules. Required, if `private/` exists.
- `public/` - The directory containing all PUBLIC entity submodules. Optional.
- `public/index.ts` - The entry point for all entity public submodules. Required, if `public/` exists.
- `errors.ts` - The file containing error classes for an entity. Optional.
- `index.ts` - The entry point for the entity. Contains re-exports of ALL public modules of the entity. Required.
- `module.ts` - The file containing the declaration of a class OR a namespace for an entity. Required.
- `types.ts` - The file containing the entity type namespace. Optional.

Second-level entities are designed to group first-level entities (an example being `src/http`). They contain the same set of files and directories, with the exception that `module.ts` is now optional.

The names of ALL private and public submodules in the `private/` and `public/` directories, with the exception of the entry point, must begin with the prefix "_"; for example, `private/_rules.ts`, `public/_events.ts'. With the exception of the prefix, there are no other restrictions on naming these files.

### Exports

Each core entity module must contain only one NAMED export. Default exports are allowed only in tool configuration files (for example, in `tsdown.config.ts`). Renamed exports are completely prohibited. To group and subsequently export several named code blocks (classes, objects, functions, etc.) from a single module, you can use classes, namespaces, or simple objects. It is forbidden to export private entity modules externally, i.e., to include them in the entity’s entry point. Public modules must be exported by specifying the directory name (public) in the entity’s entry point, for example `export { publicModule } from './public';`.

### Imports

In each module, only named imports without renaming should be used (for example, the `import { foo as newName } from './mod'` construct is prohibited). Default imports and imports using namespaces (for example, `import * as newName from './mod'`) are also not allowed. It is recommended to import no more than four entities at a time. Only relative imports from the current directory are permitted (for example, `import { foo } from './mod'`) OR an import configured using `tsconfig.paths` (for example, `import { foo } from '@foo/module'`). An import specifying parent directories using the `../*` notation (for example, `import { foo } from '../mod'`) is prohibited. In such cases, you should use `tsconfig.paths` to specify the exact path to the required file, rather than to the entry point into the entity, to avoid circular imports (`index` => `module` => `public/sub` => `index`). When importing an entity INTO ANOTHER entity, you should refer to its entry point (index) only if you need to import more than one concept (types, errors, module); that is, if possible, you should use `@foo/module` OR `@foo/types` if you need to import just one thing. Type imports should always be marked as types.
