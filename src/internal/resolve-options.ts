import type {
  ArrayToTreeOptions,
  NormalizedArrayToTreeOptions,
} from "../types";

export const resolveOptions = (
  options?: ArrayToTreeOptions,
): NormalizedArrayToTreeOptions => {
  const resolved = options ?? {};
  return {
    allowSelfAsParent: resolved.allowSelfAsParent ?? false,
    childrenId: resolved.childrenId ?? "children",
    customId: resolved.customId ?? "id",
    parentId: resolved.parentId ?? "parentId",
    rootId: Symbol("root"),
  };
};
