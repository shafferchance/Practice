const PriorityQueue = require("../priorityQueue/priorityQueue");

describe("Basic Priority Queue Push/Pop", () => {
    it("Push values and pop", () => {
        const queue = new PriorityQueue();
        queue.push([0, 2]);
        expect(queue.pop()).toEqual([0, 2]);
    });

    it("Push values in correct order", () => {
        const queue = new PriorityQueue();
        queue.push([0, 2]);
        queue.push([1, 5]);
        queue.push([3, 3]);
        expect(queue.queue[2]).toEqual([1, 5]);
        expect(queue.pop()).toEqual([0, 2]);
    });

    it("Validates entry", () => {
        const queue = new PriorityQueue();
        expect(queue.push).toThrow();
    });
});

describe("Priority Queue Update/Delete value", () => {
    it("Update without predicate", () => {});

    it("Update with predicate", () => {});

    it("Delete by value", () => {});

    it("Delete by priority", () => {});
});
