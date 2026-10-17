# File Structure Convention

This document provides information regarding the project's file structure conventions, including the naming of files and directories, the organization of entities within directories, and conventions for imports and exports.

### Entities

An entity is a named directory containing a consistent set of files and permitted subdirectories—for example, `src/plugin`, `src/http`, or `src/http/request-context`. These serve as constituent units of the framework core and are located within the `src` directory.

First-order entities possess the following fixed set of files and subdirectories:

- `internals/` - The directory containing all PRIVATE entity modules. Optional.
- `internals/index.ts` - The entry point for all entity internal modules. Required, if `internals/` exists.
- `errors.ts` - The file containing error classes for an entity. Optional.
- `index.ts` - The entry point for the entity. Contains re-exports of ALL public modules of the entity. Required.
- `module.ts` - The file containing the declaration of a class OR a namespace for an entity. Required.
- `types.ts` - The file containing the entity type namespace. Optional.

Second-level entities are designed to group first-level entities (an example being `src/http`). They contain the same set of files and directories, with the exception that `module.ts` is now optional.

The names of ALL private modules in directory `internals/`, with the exception of the entry point, must begin with the character "_"; see example `internals/_rules.ts`.

### Exports

Every entity module must have a single named export. Default exports are permitted only in tool configuration files (such as those for `tsdown.config.ts`). In entity files, only a single named export is allowed. To group and subsequently export multiple named sets of code, you can use classes, namespaces, or simple objects.
