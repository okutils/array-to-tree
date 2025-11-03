# @okutils/array-to-tree

[![npm version](https://img.shields.io/npm/v/@okutils/array-to-tree.svg)](https://www.npmjs.com/package/@okutils/array-to-tree)
[![license](https://img.shields.io/npm/l/@okutils/array-to-tree.svg)](LICENSE)

A TypeScript utility library for converting a flat array structure into a hierarchical tree structure based on parent-child relationships.

This project is based on [alferov/array-to-tree](https://github.com/alferov/array-to-tree), with modernizations, feature enhancements, and bug fixes applied to the original code.

> [!IMPORTANT]
>
> This package has not yet reached version 1.0. Bugs or breaking changes may occur.

## Features

- **Modern**: Written in modern TypeScript and ES for better type support.
- **Functional**: Adopts a functional programming paradigm, does not mutate the original data, and avoids side effects.
- **Configurable**: Allows customization of field names and other behaviors to adapt to different data structures.

## Installation

```bash
# Using pnpm
pnpm add @okutils/array-to-tree

# Using yarn
yarn add @okutils/array-to-tree

# Using npm
npm install @okutils/array-to-tree

# Using Bun
bun add @okutils/array-to-tree
```

## Usage

### Basic Usage

```typescript
import { arrayToTree } from "@okutils/array-to-tree";

const data = [
  { id: 1, name: "A", parentId: null },
  { id: 2, name: "B", parentId: 1 },
  { id: 3, name: "C", parentId: 1 },
  { id: 4, name: "D", parentId: 2 },
  { id: 5, name: "E", parentId: null },
];

const tree = arrayToTree(data);

console.log(tree);
```

Output:

```json
[
  {
    "id": 1,
    "name": "A",
    "parentId": null,
    "children": [
      {
        "id": 2,
        "name": "B",
        "parentId": 1,
        "children": [
          {
            "id": 4,
            "name": "D",
            "parentId": 2
          }
        ]
      },
      {
        "id": 3,
        "name": "C",
        "parentId": 1
      }
    ]
  },
  {
    "id": 5,
    "name": "E",
    "parentId": null
  }
]
```

### API

`arrayToTree(data, options?)`

- `data`: `Record<string, any>[]` - A flat array containing the data.
- `options`: `ArrayToTreeOptions` (optional) - A configuration options object.

### Configuration Options

You can pass an `options` object to customize field names and other behaviors.

```typescript
// src/types/options.ts
export interface ArrayToTreeOptions {
  childrenId?: string;
  customId?: string;
  parentId?: string;
  rootId?: string;
  allowSelfAsParent?: boolean;
}
```

| Option              | Type      | Default                               | Description                                                                                                                                                  |
| ------------------- | --------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `customId`          | `string`  | `'id'`                                | Specifies the field name for the unique identifier of a node.                                                                                                |
| `parentId`          | `string`  | `'parentId'`                          | Specifies the field name for associating with the parent node.                                                                                               |
| `childrenId`        | `string`  | `'children'`                          | Specifies the field name for the array of child nodes in the generated tree.                                                                                 |
| `allowSelfAsParent` | `boolean` | `false`                               | Whether to allow a node's `parentId` to be equal to its own `id`.                                                                                            |
| `rootId`            | `string`  | `'__ARRAY_TO_TREE_VIRTUAL_ROOT_ID__'` | An internal virtual root ID, which usually does not need to be changed. The `parentId` of root nodes should be `null`, `undefined`, or an empty string `""`. |

#### Example: Using Custom Fields

```typescript
import { arrayToTree } from "@okutils/array-to-tree";

const data = [
  { key: "node-1", parent: null, title: "Node 1" },
  { key: "node-2", parent: "node-1", title: "Node 2" },
];

const tree = arrayToTree(data, {
  customId: "key",
  parentId: "parent",
  childrenId: "nodes",
});
```

##### Output

```json
[
  {
    "key": "node-1",
    "parent": null,
    "title": "Node 1",
    "nodes": [
      {
        "key": "node-2",
        "parent": "node-1",
        "title": "Node 2"
      }
    ]
  }
]
```

### Error Classes

#### ArrayToTreeError

Represents an error that occurs when converting an array to a tree structure.

```typescript
export class ArrayToTreeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArrayToTreeError";
  }
}
```

##### Use Cases

`ArrayToTreeError` is thrown in the following situations:

1.  **Invalid Input Type**: When the `data` argument passed is not an array.

    ```typescript
    arrayToTree("not array"); // Throws ArrayToTreeError: Expected an array but got an invalid argument.
    ```

2.  **Duplicate Node ID**: When there are nodes with the same `id` in the array.

    ```typescript
    const data = [
      { id: 1, name: "A", parentId: null },
      { id: 1, name: "A-duplicate", parentId: null }, // Duplicate id
    ];
    arrayToTree(data); // Throws ArrayToTreeError: Duplicate node id "1" detected.
    ```

3.  **Self-Reference Error**: When a node's `parentId` is equal to its own `id`, and the `allowSelfAsParent` option is `false`.

    ```typescript
    const data = [
      { id: 1, name: "A", parentId: 1 }, // Self-reference
    ];
    arrayToTree(data, { allowSelfAsParent: false });
    // Throws ArrayToTreeError: Node "1" cannot be its own parent (self reference found).
    ```

4.  **Circular Reference Detection**: When a circular dependency is formed between nodes.

    ```typescript
    const data = [
      { id: 1, name: "A", parentId: 3 },
      { id: 2, name: "B", parentId: 1 },
      { id: 3, name: "C", parentId: 2 }, // Forms a cycle: 1 -> 3 -> 2 -> 1
    ];
    arrayToTree(data); // Throws ArrayToTreeError: Cycle detected in parent chain: 1 -> 3 -> 2 -> 1
    ```

##### Error Handling

It is recommended to use `try-catch` to capture and handle these errors:

```typescript
import { arrayToTree, ArrayToTreeError } from "@okutils/array-to-tree";

try {
  const tree = arrayToTree(data);
  console.log(tree);
} catch (error) {
  if (error instanceof ArrayToTreeError) {
    console.error("Conversion failed:", error.message);
    // Handle specific conversion errors
  } else {
    console.error("Unknown error:", error);
  }
}
```

## License

[MIT](LICENSE) © Luke Na
