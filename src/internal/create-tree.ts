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
    const children = grouped[node[customId]];
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
