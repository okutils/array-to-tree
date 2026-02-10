import { ArrayToTreeError } from "../errors";
import type { NormalizedArrayToTreeOptions } from "../types";
import { get } from "./get";

export const groupByParents = (
  array: Record<string, any>[],
  options: NormalizedArrayToTreeOptions,
) => {
  const arrayById: Record<string, any> = {};

  // 第一次遍历：构建索引并检测重复 id
  for (const item of array) {
    const key = get(item, options.customId);
    if (key != null && Object.hasOwn(arrayById, key)) {
      throw new ArrayToTreeError(`Duplicate node id "${key}" detected.`);
    }
    arrayById[key] = item;
  }

  const safe = new Set<any>();

  return array.reduce<Record<string, any[]>>((grouped, item) => {
    const id = get(item, options.customId);
    let parentId = get(item, options.parentId);

    // 1. 先处理自指节点
    if (parentId === id) {
      if (!options.allowSelfAsParent) {
        throw new ArrayToTreeError(
          `Node "${id}" cannot be its own parent (self reference found).`,
        );
      }
      parentId = options.rootId;
    }

    if (id != null && !safe.has(id)) {
      const path = new Set<any>([id]);
      let cursor = parentId;

      while (cursor != null && cursor !== options.rootId) {
        if (safe.has(cursor)) {
          break;
        }
        if (path.has(cursor)) {
          const cyclePath = [...path, cursor].join(" -> ");
          throw new ArrayToTreeError(
            `Cycle detected in parent chain: ${cyclePath}`,
          );
        }
        path.add(cursor);

        const parentNode = arrayById[cursor];
        if (!parentNode) {
          break;
        }
        cursor = get(parentNode, options.parentId);
      }
      for (const n of path) safe.add(n);
    }

    if (parentId == null || !Object.hasOwn(arrayById, parentId)) {
      parentId = options.rootId;
    }

    if (Object.hasOwn(grouped, parentId)) {
      grouped[parentId].push(item);
    } else {
      grouped[parentId] = [item];
    }
    return grouped;
  }, {});
};
