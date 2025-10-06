import { ArrayToTreeError } from "../errors";
import { createTree, groupByParents, resolveOptions } from "../internal";
import type {
  ArrayToTreeOptions,
  NormalizedArrayToTreeOptions,
} from "../types";

export const arrayToTree = (
  data: Record<string, any>[],
  options?: ArrayToTreeOptions,
) => {
  const normalizeOptions = resolveOptions(
    options,
  ) as NormalizedArrayToTreeOptions;

  if (!Array.isArray(data)) {
    throw new ArrayToTreeError(
      "Expected an array but got an invalid argument.",
    );
  }

  const grouped = groupByParents(data, normalizeOptions);

  return createTree(
    grouped,
    grouped[normalizeOptions.rootId],
    normalizeOptions.customId,
    normalizeOptions.childrenId,
  );
};
