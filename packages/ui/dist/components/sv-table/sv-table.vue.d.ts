import type { CollectionProperty } from '@semantic-api/types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    collection: {
        type: import("vue").PropType<string>;
    };
    checkbox: {
        type: import("vue").PropType<boolean>;
    };
    rows: {
        type: import("vue").PropType<any>;
    };
    columns: {
        type: import("vue").PropType<Record<string, CollectionProperty>>;
    };
    layout: {
        type: import("vue").PropType<any>;
    };
    actions: {
        type: import("vue").PropType<any[]>;
    };
    border: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    headers: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    collection: {
        type: import("vue").PropType<string>;
    };
    checkbox: {
        type: import("vue").PropType<boolean>;
    };
    rows: {
        type: import("vue").PropType<any>;
    };
    columns: {
        type: import("vue").PropType<Record<string, CollectionProperty>>;
    };
    layout: {
        type: import("vue").PropType<any>;
    };
    actions: {
        type: import("vue").PropType<any[]>;
    };
    border: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    headers: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
}>>, {
    border: boolean;
    headers: boolean;
}, {}>, Partial<Record<string, (_: {
    store: (Omit<import("@savitri/web").CollectionStore<any>, "functions" | "item" | "items"> & {
        functions: {
            [x: string]: (arg: unknown) => any;
        };
        item: any;
        items: any[];
    }) | null;
    column: string;
    property: CollectionProperty;
    row: any;
}) => any>> & {
    thead?(_: {}): any;
    tbody?(_: {}): any;
    tfoot?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
