import { ArrayToTreeError } from "../errors";
import type { NormalizedArrayToTreeOptions } from "../types";
import { get } from "./get";

export const groupByParents = (
  array: Record<string, any>[],
  options: NormalizedArrayToTreeOptions,
) => {
  const arrayById: Record<string, any> = {};
  for (const item of array) {
    const key = item[options.customId];
    if (key != null && Object.hasOwn(arrayById, key)) {
      throw new ArrayToTreeError(`Duplicate node id "${key}" detected.`);
    }
    arrayById[key] = item;
  }

  return array.reduce((prev, item) => {
    const id = get(item, options.customId);
    let parentId = get(item, options.parentId);

    // Handle self-referencing nodes
    if (parentId === id) {
      if (!options.allowSelfAsParent) {
        throw new ArrayToTreeError(
          `Node "${id}" cannot be its own parent (self reference found).`,
        );
      }
      parentId = options.rootId;
    }

    if (!parentId || !Object.hasOwn(arrayById, parentId)) {
      parentId = options.rootId;
    }

    if (parentId && Object.hasOwn(prev, parentId)) {
      prev[parentId].push(item);
      return prev;
    }

    prev[parentId] = [item];
    return prev;
  }, {});
};
