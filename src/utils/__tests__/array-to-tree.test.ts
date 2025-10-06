import { describe, expect, it } from "@jest/globals";
import { ArrayToTreeError } from "../../errors";
import { arrayToTree } from "../array-to-tree";

describe("arrayToTree", () => {
  it("should correctly convert a flat array to a tree (default field configuration)", () => {
    const data = [
      { id: 1, name: "A", parentId: null },
      { id: 2, name: "B", parentId: 1 },
      { id: 3, name: "C", parentId: 1 },
      { id: 4, name: "D", parentId: 2 },
      { id: 5, name: "E", parentId: null },
    ];

    const options = {
      childrenId: "children",
      customId: "id",
      parentId: "parentId",
      rootId: "root",
    };

    const tree = arrayToTree(data, options);

    expect(tree).toEqual([
      {
        children: [
          {
            children: [
              {
                id: 4,
                name: "D",
                parentId: 2,
              },
            ],
            id: 2,
            name: "B",
            parentId: 1,
          },
          {
            id: 3,
            name: "C",
            parentId: 1,
          },
        ],
        id: 1,
        name: "A",
        parentId: null,
      },
      {
        id: 5,
        name: "E",
        parentId: null,
      },
    ]);
  });

  it("should handle self-referencing nodes correctly (when self-reference is allowed)", () => {
    const data = [
      { id: 1, name: "A", parentId: null },
      { id: 2, name: "B", parentId: 1 },
      { id: 3, name: "C", parentId: 3 }, // self-referencing node
    ];

    const options = {
      allowSelfAsParent: true,
    };

    const tree = arrayToTree(data, options);

    expect(tree).toEqual([
      {
        children: [
          {
            id: 2,
            name: "B",
            parentId: 1,
          },
        ],
        id: 1,
        name: "A",
        parentId: null,
      },
      {
        id: 3,
        name: "C",
        parentId: 3,
      },
    ]);
  });

  it("should throw ArrayToTreeError for non-array input", () => {
    // @ts-expect-error intentionally passing wrong type
    expect(() => arrayToTree("not array")).toThrow(ArrayToTreeError);
  });

  it("should throw ArrayToTreeError for self-referencing nodes when self-reference is not allowed", () => {
    const data = [
      { id: 1, name: "A", parentId: null },
      { id: 2, name: "B", parentId: 1 },
      { id: 3, name: "C", parentId: 3 }, // self-referencing node
    ];

    const options = {
      allowSelfAsParent: false,
    };

    expect(() => arrayToTree(data, options)).toThrow(ArrayToTreeError);
  });

  it("should still convert to a tree correctly when data contains UUIDs", () => {
    const data = [
      { id: "550e8400-e29b-41d4-a716-446655440000", name: "A", parentId: null },
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "B",
        parentId: "550e8400-e29b-41d4-a716-446655440000",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "C",
        parentId: "550e8400-e29b-41d4-a716-446655440000",
      },
    ];
    const options = {};
    const tree = arrayToTree(data, options);
    expect(tree).toEqual([
      {
        children: [
          {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "B",
            parentId: "550e8400-e29b-41d4-a716-446655440000",
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "C",
            parentId: "550e8400-e29b-41d4-a716-446655440000",
          },
        ],
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "A",
        parentId: null,
      },
    ]);
  });

  it("should be a pure function: does not modify the original data object", () => {
    const data = [
      { id: 1, parentId: null },
      { id: 2, parentId: 1 },
    ];
    const clone = JSON.parse(JSON.stringify(data));
    const tree = arrayToTree(data);
    expect(data).toEqual(clone);
    expect(tree[0].children![0].id).toBe(2);
  });

  it("should throw an error for duplicate IDs", () => {
    const data = [
      { id: 1, name: "A-1", parentId: null },
      { id: 1, name: "A-2 (dup)", parentId: null },
    ];
    expect(() => arrayToTree(data)).toThrow(ArrayToTreeError);
  });

  it("should detect circular references (A -> B -> C -> A)", () => {
    const data = [
      { id: 1, name: "A", parentId: 3 },
      { id: 2, name: "B", parentId: 1 },
      { id: 3, name: "C", parentId: 2 },
    ];

    expect(() => arrayToTree(data)).toThrow(ArrayToTreeError);
    expect(() => arrayToTree(data)).toThrow(/Cycle detected/);
  });
});
