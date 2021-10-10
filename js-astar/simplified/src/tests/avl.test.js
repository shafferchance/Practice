const { AVL, AVLNode } = require("../avlTree/avlTree");

describe("CRUD AVL", () => {
    it("Create AVL", () => {
        const avl = new AVL();
        expect(avl).toBeDefined();
    });

    it("Insert node", () => {
        const avl = new AVL();
        avl.insert(2);
        expect(avl.head).toEqual(new AVLNode(2));
    });

    it("Insert nodes in correct order: Depth 1", () => {
        const avl = new AVL();
        avl.insert(10);
        avl.insert(4);
        avl.insert(20);
        expect(avl.head.value).toBe(10);
        expect(avl.head.left.value).toBe(4);
        expect(avl.head.right.value).toBe(20);
    });

    it("Insert nodes in correct order: Depth 2", () => {
        const avl = new AVL();
        avl.insert(10);
        avl.insert(4);
        avl.insert(20);
        avl.insert(21);
        avl.insert(3);
        expect(avl.head.value).toBe(10);
        expect(avl.head.left.value).toBe(4);
        expect(avl.head.right.value).toBe(20);
        expect(avl.head.left.left.value).toBe(3);
        expect(avl.head.right.right.value).toBe(21);
    });

    it("Update node: Depth 1", () => {});

    it("Update node: Depth 2", () => {});
});
