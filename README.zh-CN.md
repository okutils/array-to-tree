# @oktils/array-to-tree

[![npm version](https://img.shields.io/npm/v/@oktils/array-to-tree.svg)](https://www.npmjs.com/package/@oktils/array-to-tree)
[![license](https://img.shields.io/npm/l/@oktils/array-to-tree.svg)](LICENSE)

一个 TypeScript 工具库，用于将扁平的数组结构通过父子关系转换为层级树结构。

这个项目基于 [alferov/array-to-tree](https://github.com/alferov/array-to-tree)，并针对原始代码做了现代化改造、功能增强和一些错误修复。

> [!IMPORTANT]
>
> 目前处于 Alpha 阶段，可能会存在 bug 或不兼容的变更。

## 特性

- **现代化**：使用现代 TypeScript 和 ES 编写，提供更好的类型支持。
- **函数式编程**：采用函数式编程范式，不修改原始数据，避免副作用。
- **可配置**：允许自定义字段名和其他行为，适应不同的数据结构。

## 安装

```bash
# 使用 pnpm
pnpm add @oktils/array-to-tree

# 使用 yarn
yarn add @oktils/array-to-tree

# 使用 npm
npm install @oktils/array-to-tree
```

## 使用方法

### 基本用法

```typescript
import { arrayToTree } from "@oktils/array-to-tree";

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
import { arrayToTree } from "@oktils/array-to-tree";

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

## 📄 许可证

[MIT](LICENSE) © Luke Na
