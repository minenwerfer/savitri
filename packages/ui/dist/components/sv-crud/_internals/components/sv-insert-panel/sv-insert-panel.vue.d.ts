declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    parentCollection: {
        type: import("vue").PropType<string>;
    };
    parentField: {
        type: import("vue").PropType<string>;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    parentCollection: {
        type: import("vue").PropType<string>;
    };
    parentField: {
        type: import("vue").PropType<string>;
    };
}>>, {}, {}>, Partial<Record<string, (_: {
    property: import("@semantic-api/types").CollectionProperty;
    modelValue: any;
    key: string;
}) => any>>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
