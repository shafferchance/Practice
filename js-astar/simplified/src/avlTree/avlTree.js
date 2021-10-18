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

        // Rotation logic
        if (node.balancingFactor > 1) {
            // LR case
            if (node.left.balancingFactor === -1) {
                this.leftRotation(node.left.right);
            }
            this.rightRotation(node.left);
        } else if (node.balancingFactor < -1) {
            if (node.right.balancingFactor === 1) {
                this.rightRotation(node.right.left);
            }
            this.leftRotation(node.right);
        }

        if (node.parent) {
            return this.calculateBalancingFactor(node.parent);
        }
    }

    leftRotation(node) {
        const nodeParent = node.parent;
        const newParent = nodeParent?.parent;
        const leftSubtree = node.left;

        // Left rotation means old left subtree becomes old parent's right subtree
        nodeParent.right = leftSubtree;
        nodeParent.parent = node;
        node.left = nodeParent;
        node.parent = newParent;

        // If no parent of parent then we are at the root of the AVL
        if (!newParent) {
            this.head = node;
        }
    }

    rightRotation(node) {
        const nodeParent = node.parent;
        const newParent = nodeParent.parent;
        const rightSubtree = node.right;

        // Right rotation means old right subtree becomes old parent's left subtree
        nodeParent.left = rightSubtree;
        nodeParent.parent = node;
        node.right = nodeParent;
        node.parent = newParent;

        // If no parent of parent then we are at the root of the AVL
        if (!newParent) {
            this.head = node;
        }
    }

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
