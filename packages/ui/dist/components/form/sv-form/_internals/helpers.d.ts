import { CollectionProperty } from '@semantic-api/types';
export declare const getComponent: (property: CollectionProperty, customComponents: Record<string, any>) => any;
export declare const pushToArray: (modelValue: Array<any>, property: CollectionProperty) => number;
export declare const spliceFromArray: (modelValue: Array<any>, index: number) => void;
