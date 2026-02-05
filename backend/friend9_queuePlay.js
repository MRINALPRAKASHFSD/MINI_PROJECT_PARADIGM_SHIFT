// friend9_queuePlay.js
// Author: Vishal Kapoor
// Illustrates a simple task queue in plain JS. Purely for backend practice.

class TaskQueue {
    constructor() {
        this.tasks = [];
    }
    add(task) {
        this.tasks.push(task);
    }
    runAll() {
        this.tasks.forEach((task, i) => {
            console.log(`Running task #${i + 1}:`);
            task();
        });
    }
}

const queue = new TaskQueue();
queue.add(() => console.log("Send notification"));
queue.add(() => console.log("Process payroll"));
queue.runAll();
