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

    it("Delete node: Depth 1", () => {
        const avl = new AVL();
        avl.insert(5);
        avl.insert(10);
        avl.insert(1);

        avl.delete(10);
        expect(avl.head.value).toBe(5);
    });

    it("Delete node: Depth 2", () => {
        const avl = new AVL();
        avl.insert(5);
        avl.insert(10);
        avl.insert(3);
        avl.insert(4);
        avl.insert(1);
        avl.insert(0);

        avl.delete(3);
        expect(avl.head.left.value).toBe(4);

        avl.insert(8);
        avl.insert(12);
        avl.delete(10);
        expect(avl.head.right.value).toBe(8);
    });
});

describe("Balancing Factors within AVL", () => {
    it("Complete and Full Tree", () => {
        const avl = new AVL();
        avl.insert(5);
        avl.insert(1);
        avl.insert(10);

        expect(avl.head.balancingFactor).toBe(0);
    });

    // This test will break once turns are added, might have to mock insert function for this test to work properly
    it("Unbalanced special LL", () => {
        const avl = new AVL();
        avl.insert(10);
        avl.insert(5);
        avl.insert(1);

        expect(avl.head.balancingFactor).toBe(2);
    });

    it("Unbalanced special LR", () => {
        const avl = new AVL();
        avl.insert(5);
        avl.insert(3);
        avl.insert(4);

        expect(avl.head.balancingFactor).toBe(2);
    });

    it("Unbalanced special RL", () => {
        const avl = new AVL();
        avl.insert(10);
        avl.insert(15);
        avl.insert(12);

        expect(avl.head.balancingFactor).toBe(-2);
    });

    it("Unbalanced special RR", () => {
        const avl = new AVL();
        avl.insert(10);
        avl.insert(13);
        avl.insert(14);

        expect(avl.head.balancingFactor).toBe(-2);
    });

    it("Rebalance after delete", () => {
        const avl = new AVL();
        avl.insert(5);
        avl.insert(10);
        avl.insert(3);
        avl.insert(4);
        avl.insert(1);
        avl.insert(0);

        avl.delete(3);
        expect(avl.head.left.balancingFactor).toBe(2);
    });
});

describe("Tree rotations", () => {
    it("LL rotation", () => {
        const avl = new AVL();
        avl.insert(10);
        avl.insert(5);
        avl.insert(6);
        // console.log(
        //     `BFs 10: ${avl.head.balancingFactor} | 5: ${avl.head.left.balancingFactor} | 6: ${avl.head.left.right.balancingFactor}`
        // );
        expect(true).toBe(true);
    });

    it("RR rotation", () => {});

    it("LR rotation", () => {});

    it("RL rotation", () => {});
});
