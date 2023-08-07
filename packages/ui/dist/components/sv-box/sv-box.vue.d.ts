declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    fill: {
        type: import("vue").PropType<boolean>;
    };
    title: {
        type: import("vue").PropType<string>;
    };
    closeHint: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    modelValue: {
        type: import("vue").PropType<any>;
        default: boolean;
    };
    float: {
        type: import("vue").PropType<boolean>;
    };
    fixedRight: {
        type: import("vue").PropType<boolean>;
    };
    floating: {
        type: import("vue").PropType<boolean>;
    };
    overlay: {
        type: import("vue").PropType<boolean>;
    };
    invisibleOverlay: {
        type: import("vue").PropType<boolean>;
    };
    collapsed: {
        type: import("vue").PropType<boolean>;
    };
    collapsible: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    fullWidth: {
        type: import("vue").PropType<boolean>;
    };
    transparent: {
        type: import("vue").PropType<boolean>;
    };
    transparentMobile: {
        type: import("vue").PropType<boolean>;
    };
    outerHeader: {
        type: import("vue").PropType<boolean>;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => void;
    overlayClick: () => void;
    close: () => void;
    "update:collapsed": (value: boolean) => void;
    "update:closeHint": (value: boolean) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    fill: {
        type: import("vue").PropType<boolean>;
    };
    title: {
        type: import("vue").PropType<string>;
    };
    closeHint: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    modelValue: {
        type: import("vue").PropType<any>;
        default: boolean;
    };
    float: {
        type: import("vue").PropType<boolean>;
    };
    fixedRight: {
        type: import("vue").PropType<boolean>;
    };
    floating: {
        type: import("vue").PropType<boolean>;
    };
    overlay: {
        type: import("vue").PropType<boolean>;
    };
    invisibleOverlay: {
        type: import("vue").PropType<boolean>;
    };
    collapsed: {
        type: import("vue").PropType<boolean>;
    };
    collapsible: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    fullWidth: {
        type: import("vue").PropType<boolean>;
    };
    transparent: {
        type: import("vue").PropType<boolean>;
    };
    transparentMobile: {
        type: import("vue").PropType<boolean>;
    };
    outerHeader: {
        type: import("vue").PropType<boolean>;
    };
}>> & {
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    "onUpdate:collapsed"?: ((value: boolean) => any) | undefined;
    "onUpdate:closeHint"?: ((value: boolean) => any) | undefined;
    onOverlayClick?: (() => any) | undefined;
    onClose?: (() => any) | undefined;
}, {
    closeHint: boolean;
    modelValue: any;
    collapsible: boolean;
}, {}>, {
    header?(_: {}): any;
    extra?(_: {}): any;
    default?(_: {}): any;
    body?(_: {}): any;
    footer?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
