/// <reference types="packages/backend/node_modules/mongoose" />
import { Schema } from 'mongoose';
/**
 * @exports @function
 * Converts a description object into a mongoose Schema structure.
 */
export declare const descriptionToSchema: <T>({ strict, fields, ...props }: any, options?: {}, extra?: any) => Schema<T, import("mongoose").Model<T, any, any, any>, any, any>;
