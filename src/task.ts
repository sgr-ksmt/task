
import * as functions from 'firebase-functions'
import { DocumentReference } from '@google-cloud/firestore';
import { DeltaDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export class Task {
  status: TaskStatus
  action: TaskAction
  data: any
  error?: TaskError

  // Create task below ref
  static async create(ref: DocumentReference, action: TaskAction, data: any, error?: TaskError) {
    let task: any = {}
    task.action = action
    if (error) {
      task.error = error.json()
      task.status = TaskStatus.failure
    } else {
      task.status = TaskStatus.success
    }
    delete data.task // avoid recursive assignment
    task.data = data
    await ref.update({task})
    return undefined
  }

  static async success(ref: DocumentReference, data: any) {
    return Task.create(ref, TaskAction.none, data)
  }

  static async failure(ref: DocumentReference, action: TaskAction, data: any, error: TaskError) {
    return Task.create(ref, action, data, error)
  }

  static isOnlyAddTaskOnUpdate(data: DeltaDocumentSnapshot): boolean {
    const newValue = data.data()
    if (!data.previous) {
      return false
    }
    const previousValue = data.previous.data()
    return !previousValue.task && newValue.task
  }

  constructor(task: any) {
    this.status = task.status || TaskStatus.none
    this.action = task.action || TaskAction.none
    this.data = task.data || {}
    this.error = task.error
  }

  needsResume(): boolean {
    return this.status === TaskStatus.failure && this.action === TaskAction.resume
  }
}

export enum TaskStatus {
  none = 0,
  success = 1,
  failure = 2
}

export enum TaskAction {
  none = 0,
  resume = 1
}

export class TaskError {
  description: string

  constructor(description: string) {
    this.description = description
  }

  json(): any {
    return {'description': this.description}
  }
}