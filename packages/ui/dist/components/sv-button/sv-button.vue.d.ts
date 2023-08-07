type Size = 'small' | 'medium' | 'large';
type Variant = 'normal' | 'alt' | 'transparent' | 'brand';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    size: {
        type: import("vue").PropType<Size>;
    };
    small: {
        type: import("vue").PropType<boolean>;
    };
    large: {
        type: import("vue").PropType<boolean>;
    };
    variant: {
        type: import("vue").PropType<Variant>;
    };
    icon: {
        type: import("vue").PropType<string>;
    };
    disabled: {
        type: import("vue").PropType<boolean>;
    };
    loading: {
        type: import("vue").PropType<boolean>;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    size: {
        type: import("vue").PropType<Size>;
    };
    small: {
        type: import("vue").PropType<boolean>;
    };
    large: {
        type: import("vue").PropType<boolean>;
    };
    variant: {
        type: import("vue").PropType<Variant>;
    };
    icon: {
        type: import("vue").PropType<string>;
    };
    disabled: {
        type: import("vue").PropType<boolean>;
    };
    loading: {
        type: import("vue").PropType<boolean>;
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
