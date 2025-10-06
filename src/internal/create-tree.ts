import { get } from "./get";

export const createTree = (
  grouped: Record<string, any[]>,
  rootNodes: any[],
  customId: string,
  childrenProperty: string,
) => {
  if (!Array.isArray(rootNodes)) {
    return [];
  }

  return rootNodes.map((node) => {
    const newNode = { ...node };
    const nodeId = get(node, customId);
    const children = nodeId != null ? grouped[nodeId] : undefined;
    if (children) {
      newNode[childrenProperty] = createTree(
        grouped,
        children,
        customId,
        childrenProperty,
      );
    }
    return newNode;
  });
};
