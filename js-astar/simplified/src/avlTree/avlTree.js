class AVLNode {
    constructor(value, pointers) {
        this.parent = pointers?.parent;
        this.left = pointers?.left;
        this.right = pointers?.right;
        this.value = value;
        this.balancingFactor = 0;

        // TODO: Figure out when to calculate balancing factor
    }
}

class AVL {
    constructor() {
        this.current = undefined;
        this.head = undefined;
    }

    _traversal(value, current = this.head) {
        if (value < current?.value) {
            if (current.left) {
                return this._traversal(value, current.left);
            } else {
                return [-1, current];
            }
        }

        if (value > current?.value) {
            if (current.right) {
                return this._traversal(value, current.right);
            } else {
                return [1, current];
            }
        }

        return [0, current];
    }

    calculateBalancingFactor(node) {
        const leftScore =
            Math.abs(node.left?.balancingFactor ?? 0) + (node.left ? 1 : 0);
        const rightScore =
            Math.abs(node.right?.balancingFactor ?? 0) + (node.right ? 1 : 0);

        node.balancingFactor = leftScore - rightScore;

        if (node.parent) {
            return this.calculateBalancingFactor(node.parent);
        }
    }

    leftRotation(node) {}

    rightRotation(node) {}

    insert(value) {
        const [direction, parent] = this._traversal(value);

        if (!parent) {
            this.head = new AVLNode(value);
            return true;
        }

        switch (direction) {
            case -1: {
                parent.left = new AVLNode(value, { parent });
                this.calculateBalancingFactor(parent.left);
                break;
            }
            case 0: {
                const temp = parent;
                parent = new AVLNode(value, {
                    parent: temp.parent,
                    left: temp,
                });
                this.calculateBalancingFactor(parent);
                break;
            }
            case 1: {
                parent.right = new AVLNode(value, { parent });
                this.calculateBalancingFactor(parent.right);
                break;
            }
            default: {
                throw new Error("Invalid direction recieved from traversal");
            }
        }
    }

    delete(value) {
        const [direction, node] = this._traversal(value);

        if (direction !== 0) {
            throw new Error("Couldn't find node");
        }

        const deleteNode = node;

        // Since this is a BST, only the two cases should be possible
        if (deleteNode.value < deleteNode.parent.value) {
            // Re-Attaching detacted left tree
            const leftNode = deleteNode.right ?? deleteNode.left;
            if (leftNode) {
                if (leftNode !== deleteNode.left) {
                    leftNode.left = deleteNode.left;
                }
                deleteNode.parent.left = leftNode;
                leftNode.parent = deleteNode.parent;
                this.calculateBalancingFactor(leftNode);
                return;
            }
        } else {
            // Re-Attaching detacted right tree
            const rightNode = deleteNode.left ?? deleteNode.right;
            if (rightNode) {
                if (rightNode !== deleteNode.right) {
                    rightNode.right = deleteNode.right;
                }
                deleteNode.parent.right = rightNode;
                rightNode.parent = deleteNode.parent;
                this.calculateBalancingFactor(rightNode);
                return;
            }
        }
        this.calculateBalancingFactor(deleteNode.parent);
    }
}

module.exports = {
    AVL,
    AVLNode,
};
