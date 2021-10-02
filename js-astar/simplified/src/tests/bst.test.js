const { BST, BSTNode } = require("../binarySearchTree/binarySearchTree");

describe("CRUD BST", () => {
    it("Create BST", () => {
        const bst = new BST();
        expect(bst).not.toBeUndefined();
    });

    it("Insert node", () => {
        const bst = new BST();
        bst.insert(2);
        expect(bst.head).toEqual(new BSTNode(2));
    });

    it("Insert nodes in correct order: Depth 1", () => {
        const bst = new BST();
        bst.insert(10);
        bst.insert(4);
        bst.insert(20);
        expect(bst.head.value).toBe(10);
        expect(bst.head.left.value).toBe(4);
        expect(bst.head.right.value).toBe(20);
    });

    it("Insert nodes in correct order: Depth 2", () => {
        const bst = new BST();
        bst.insert(10);
        bst.insert(4);
        bst.insert(20);
        bst.insert(21);
        bst.insert(3);
        expect(bst.head.value).toBe(10);
        expect(bst.head.left.value).toBe(4);
        expect(bst.head.right.value).toBe(20);
        expect(bst.head.left.left.value).toBe(3);
        expect(bst.head.right.right.value).toBe(21);
    });

    it("Update node: Depth 1", () => {});

    it("Update node: Depth 2", () => {});
});
