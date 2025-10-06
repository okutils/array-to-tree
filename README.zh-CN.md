# @okutils/array-to-tree

[![npm version](https://img.shields.io/npm/v/@okutils/array-to-tree.svg)](https://www.npmjs.com/package/@okutils/array-to-tree)
[![license](https://img.shields.io/npm/l/@okutils/array-to-tree.svg)](LICENSE)

一个 TypeScript 工具库，用于将扁平的数组结构通过父子关系转换为层级树结构。

这个项目基于 [alferov/array-to-tree](https://github.com/alferov/array-to-tree)，并针对原始代码做了现代化改造、功能增强和一些错误修复。

> [!IMPORTANT]
>
> 目前还没有发布 1.0 版，可能会存在 bug 或不兼容的变更。

## 特性

- **现代化**：使用现代 TypeScript 和 ES 编写，提供更好的类型支持。
- **函数式编程**：采用函数式编程范式，不修改原始数据，避免副作用。
- **可配置**：允许自定义字段名和其他行为，适应不同的数据结构。

## 安装

```bash
# 使用 pnpm
pnpm add @okutils/array-to-tree

# 使用 yarn
yarn add @okutils/array-to-tree

# 使用 npm
npm install @okutils/array-to-tree

# 使用 Bun
bun add @okutils/array-to-tree
```

## 使用方法

### 基本用法

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

##### 输出结果

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

- `data`: `Record<string, any>[]` - 包含数据的扁平数组。
- `options`: `ArrayToTreeOptions` (可选) - 配置选项对象。

### 配置选项

您可以传入一个 `options` 对象来自定义字段名和其他行为。

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

| 选项                | 类型      | 默认值                                | 描述                                                                                  |
| ------------------- | --------- | ------------------------------------- | ------------------------------------------------------------------------------------- |
| `customId`          | `string`  | `'id'`                                | 指定节点唯一标识的字段名。                                                            |
| `parentId`          | `string`  | `'parentId'`                          | 指定关联父节点的字段名。                                                              |
| `childrenId`        | `string`  | `'children'`                          | 指定生成的树中用于存放子节点数组的字段名。                                            |
| `allowSelfAsParent` | `boolean` | `false`                               | 是否允许一个节点的 `parentId` 等于它自身的 `id`。                                     |
| `rootId`            | `string`  | `'__ARRAY_TO_TREE_VIRTUAL_ROOT_ID__'` | 内部使用的虚拟根 ID，通常不需要修改。根节点的 `parentId` 应为 `null` 或 `undefined`。 |

#### 示例：使用自定义字段

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

输出结果:

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

### 错误类

#### ArrayToTreeError

用于表示在将数组转换为树结构时发生的错误。

```typescript
export class ArrayToTreeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArrayToTreeError";
  }
}
```

##### 使用场景

`ArrayToTreeError` 会在以下情况下被抛出:

1. **输入类型错误**: 当传入的 `data` 参数不是数组时

```typescript
arrayToTree("not array"); // 抛出 ArrayToTreeError: Expected an array but got an invalid argument.
```

2. **重复的节点 ID**: 当数组中存在相同 `id` 的节点时

```typescript
const data = [
  { id: 1, name: "A", parentId: null },
  { id: 1, name: "A-duplicate", parentId: null }, // 重复的 id
];
arrayToTree(data); // 抛出 ArrayToTreeError: Duplicate node id "1" detected.
```

3. **自引用错误**: 当节点的 `parentId` 等于自身 `id`,且 `allowSelfAsParent` 选项为 `false` 时

```typescript
const data = [
  { id: 1, name: "A", parentId: 1 }, // 自引用
];
arrayToTree(data, { allowSelfAsParent: false });
// 抛出 ArrayToTreeError: Node "1" cannot be its own parent (self reference found).
```

4. **循环引用检测**: 当节点之间形成循环依赖时

```typescript
const data = [
  { id: 1, name: "A", parentId: 3 },
  { id: 2, name: "B", parentId: 1 },
  { id: 3, name: "C", parentId: 2 }, // 形成循环: 1 -> 3 -> 2 -> 1
];
arrayToTree(data); // 抛出 ArrayToTreeError: Cycle detected in parent chain: 1 -> 3 -> 2 -> 1
```

##### 错误处理

建议使用 `try-catch` 捕获并处理这些错误:

```typescript
import { arrayToTree, ArrayToTreeError } from "@okutils/array-to-tree";

try {
  const tree = arrayToTree(data);
  console.log(tree);
} catch (error) {
  if (error instanceof ArrayToTreeError) {
    console.error("转换失败:", error.message);
    // 处理特定的转换错误
  } else {
    console.error("未知错误:", error);
  }
}
```

## 许可证

[MIT](LICENSE) © Luke Na
