import { LayoutOptions } from '@semantic-api/types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    individualActions: {
        type: import("vue").PropType<any>;
        required: true;
    };
    hasSelectionActions: {
        type: import("vue").PropType<boolean>;
        required: true;
    };
    layoutOptions: {
        type: import("vue").PropType<LayoutOptions>;
        required: true;
    };
    componentProps: {
        type: import("vue").PropType<Record<string, any>>;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    individualActions: {
        type: import("vue").PropType<any>;
        required: true;
    };
    hasSelectionActions: {
        type: import("vue").PropType<boolean>;
        required: true;
    };
    layoutOptions: {
        type: import("vue").PropType<LayoutOptions>;
        required: true;
    };
    componentProps: {
        type: import("vue").PropType<Record<string, any>>;
    };
}>>, {}, {}>, Partial<Record<string, (_: {
    store: (Omit<import("@savitri/web").CollectionStore<any>, "functions" | "item" | "items"> & {
        functions: {
            [x: string]: (arg: unknown) => any;
        };
        item: any;
        items: any[];
    }) | null;
    column: string;
    property: import("@semantic-api/types").CollectionProperty;
    row: any;
}) => any>> & {
    inner?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
