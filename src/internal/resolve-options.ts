import type { ArrayToTreeOptions } from "../types";

export const resolveOptions = (
  options?: ArrayToTreeOptions,
): Required<ArrayToTreeOptions> => {
  options = options ?? {};
  return {
    allowSelfAsParent: options.allowSelfAsParent ?? false,
    childrenId: options.childrenId ?? "children",
    customId: options.customId ?? "id",
    parentId: options.parentId ?? "parentId",
    rootId: options.rootId ?? "__ARRAY_TO_TREE_VIRTUAL_ROOT_ID__",
  };
};
