export type DepulicateStrategy = "keep-first" | "keep-last";

export interface ArrayToTreeOptions {
  childrenId?: string;
  customId?: string;
  parentId?: string;
  rootId?: string;
  allowSelfAsParent?: boolean;
}

export type NormalizedArrayToTreeOptions = Required<ArrayToTreeOptions>;
