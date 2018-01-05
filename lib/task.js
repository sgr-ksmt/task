"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Task {
    // Create task below ref
    static async create(ref, action, data, error) {
        let task = {};
        task.action = action;
        if (error) {
            task.error = error.json();
            task.status = TaskStatus.failure;
        }
        else {
            task.status = TaskStatus.success;
        }
        delete data.task; // avoid recursive assignment
        task.data = data;
        await ref.update({ task });
        return undefined;
    }
    static async success(ref, data) {
        return Task.create(ref, TaskAction.none, data);
    }
    static async failure(ref, action, data, error) {
        return Task.create(ref, action, data, error);
    }
    static isOnlyAddTaskOnUpdate(data) {
        const newValue = data.data();
        if (!data.previous) {
            return false;
        }
        const previousValue = data.previous.data();
        return !previousValue.task && newValue.task;
    }
    constructor(task) {
        this.status = task.status || TaskStatus.none;
        this.action = task.action || TaskAction.none;
        this.data = task.data || {};
        this.error = task.error;
    }
    needsResume() {
        return this.status === TaskStatus.failure && this.action === TaskAction.resume;
    }
}
exports.Task = Task;
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["none"] = 0] = "none";
    TaskStatus[TaskStatus["success"] = 1] = "success";
    TaskStatus[TaskStatus["failure"] = 2] = "failure";
})(TaskStatus = exports.TaskStatus || (exports.TaskStatus = {}));
var TaskAction;
(function (TaskAction) {
    TaskAction[TaskAction["none"] = 0] = "none";
    TaskAction[TaskAction["resume"] = 1] = "resume";
})(TaskAction = exports.TaskAction || (exports.TaskAction = {}));
class TaskError {
    constructor(description) {
        this.description = description;
    }
    json() {
        return { 'description': this.description };
    }
}
exports.TaskError = TaskError;
//# sourceMappingURL=task.js.map