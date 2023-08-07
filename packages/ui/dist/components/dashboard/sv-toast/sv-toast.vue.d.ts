declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    idx: {
        type: import("vue").PropType<number>;
        required: true;
    };
    itr: {
        type: import("vue").PropType<number>;
        required: true;
    };
    date: {
        type: import("vue").PropType<Date>;
        required: true;
    };
    icon: {
        type: import("vue").PropType<string>;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    idx: {
        type: import("vue").PropType<number>;
        required: true;
    };
    itr: {
        type: import("vue").PropType<number>;
        required: true;
    };
    date: {
        type: import("vue").PropType<Date>;
        required: true;
    };
    icon: {
        type: import("vue").PropType<string>;
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
