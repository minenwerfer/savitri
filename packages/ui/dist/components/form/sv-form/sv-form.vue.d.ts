import type { CollectionProperty, Condition } from '@semantic-api/types';
type LayoutConfig = {
    span?: string;
    verticalSpacing?: string;
    optionsColumns?: number;
    if?: Condition<any>;
    component?: {
        name: string;
        props?: object;
    };
};
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    form: {
        type: import("vue").PropType<Record<string, CollectionProperty>>;
    };
    property: {
        type: import("vue").PropType<CollectionProperty>;
    };
    required: {
        type: import("vue").PropType<string[]>;
    };
    collection: {
        type: import("vue").PropType<string>;
    };
    modelValue: {
        type: import("vue").PropType<any>;
        required: true;
    };
    validationErrors: {
        type: import("vue").PropType<Record<string, any> | null>;
        default: null;
    };
    focus: {
        type: import("vue").PropType<boolean>;
    };
    propertyName: {
        type: import("vue").PropType<string>;
    };
    parentCollection: {
        type: import("vue").PropType<string>;
    };
    searchOnly: {
        type: import("vue").PropType<boolean>;
    };
    innerInputLabel: {
        type: import("vue").PropType<boolean>;
    };
    omitInputLabels: {
        type: import("vue").PropType<boolean>;
    };
    omitFormHeader: {
        type: import("vue").PropType<boolean>;
    };
    isReadOnly: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    strict: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    layout: {
        type: import("vue").PropType<{
            fields: Record<string, LayoutConfig>;
        }>;
    };
    formComponents: {
        type: import("vue").PropType<Record<string, any>>;
    };
    propertyComponents: {
        type: import("vue").PropType<Record<string, any>>;
    };
    highlightRequired: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: any) => void;
    input: (value: any) => void;
    "update:modelValue": (value: any) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    form: {
        type: import("vue").PropType<Record<string, CollectionProperty>>;
    };
    property: {
        type: import("vue").PropType<CollectionProperty>;
    };
    required: {
        type: import("vue").PropType<string[]>;
    };
    collection: {
        type: import("vue").PropType<string>;
    };
    modelValue: {
        type: import("vue").PropType<any>;
        required: true;
    };
    validationErrors: {
        type: import("vue").PropType<Record<string, any> | null>;
        default: null;
    };
    focus: {
        type: import("vue").PropType<boolean>;
    };
    propertyName: {
        type: import("vue").PropType<string>;
    };
    parentCollection: {
        type: import("vue").PropType<string>;
    };
    searchOnly: {
        type: import("vue").PropType<boolean>;
    };
    innerInputLabel: {
        type: import("vue").PropType<boolean>;
    };
    omitInputLabels: {
        type: import("vue").PropType<boolean>;
    };
    omitFormHeader: {
        type: import("vue").PropType<boolean>;
    };
    isReadOnly: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    strict: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    layout: {
        type: import("vue").PropType<{
            fields: Record<string, LayoutConfig>;
        }>;
    };
    formComponents: {
        type: import("vue").PropType<Record<string, any>>;
    };
    propertyComponents: {
        type: import("vue").PropType<Record<string, any>>;
    };
    highlightRequired: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
}>> & {
    onChange?: ((value: any) => any) | undefined;
    onInput?: ((value: any) => any) | undefined;
    "onUpdate:modelValue"?: ((value: any) => any) | undefined;
}, {
    validationErrors: Record<string, any> | null;
    isReadOnly: boolean;
    strict: boolean;
    highlightRequired: boolean;
}, {}>, Partial<Record<string, (_: {
    property: CollectionProperty;
    modelValue: any;
    key: string;
}) => any>> & {
    header?(_: {}): any;
    default?(_: {}): any;
    after?(_: {}): any;
    footer?(_: {
        isInsertReady: boolean;
    }): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
