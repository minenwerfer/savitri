declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    item: {
        type: import("vue").PropType<any>;
        required: true;
    };
    indexes: {
        type: import("vue").PropType<string[]>;
        required: true;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    item: {
        type: import("vue").PropType<any>;
        required: true;
    };
    indexes: {
        type: import("vue").PropType<string[]>;
        required: true;
    };
}>>, {}, {}>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
