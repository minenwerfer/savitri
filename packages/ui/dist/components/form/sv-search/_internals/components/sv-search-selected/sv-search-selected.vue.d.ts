import type { CollectionProperty } from '@semantic-api/types';
declare const _default: import("vue").DefineComponent<{
    modelValue: {
        type: import("vue").PropType<any>;
    };
    indexes: {
        type: import("vue").PropType<string[]>;
        required: true;
    };
    searchOnly: {
        type: import("vue").PropType<boolean>;
    };
    property: {
        type: import("vue").PropType<CollectionProperty>;
        required: true;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: any) => void;
    pushBack: (value: any) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: import("vue").PropType<any>;
    };
    indexes: {
        type: import("vue").PropType<string[]>;
        required: true;
    };
    searchOnly: {
        type: import("vue").PropType<boolean>;
    };
    property: {
        type: import("vue").PropType<CollectionProperty>;
        required: true;
    };
}>> & {
    "onUpdate:modelValue"?: ((value: any) => any) | undefined;
    onPushBack?: ((value: any) => any) | undefined;
}, {}, {}>;
export default _default;
