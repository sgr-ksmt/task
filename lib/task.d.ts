import { DocumentReference } from '@google-cloud/firestore';
import { DeltaDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
export declare class Task {
    status: TaskStatus;
    action: TaskAction;
    data: any;
    error?: TaskError;
    static create(ref: DocumentReference, action: TaskAction, data: any, error?: TaskError): Promise<any>;
    static success(ref: DocumentReference, data: any): Promise<any>;
    static failure(ref: DocumentReference, action: TaskAction, data: any, error: TaskError): Promise<any>;
    static isOnlyAddTaskOnUpdate(data: DeltaDocumentSnapshot): boolean;
    constructor(task: any);
    needsResume(): boolean;
}
export declare enum TaskStatus {
    none = 0,
    success = 1,
    failure = 2,
}
export declare enum TaskAction {
    none = 0,
    resume = 1,
}
export declare class TaskError {
    description: string;
    constructor(description: string);
    json(): any;
}
