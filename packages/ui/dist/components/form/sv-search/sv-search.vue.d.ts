import type { CollectionProperty } from '@semantic-api/types';
declare const _default: import("vue").DefineComponent<{
    modelValue: {
        type: import("vue").PropType<any>;
        required: true;
    };
    propertyName: {
        type: import("vue").PropType<string>;
    };
    parentCollection: {
        type: import("vue").PropType<string>;
    };
    property: {
        type: import("vue").PropType<{
            $ref?: string | undefined;
        } & {
            enum?: readonly any[] | undefined;
        } & {
            type?: "string" | "number" | "boolean" | "object" | "time" | "array" | "integer" | "month" | undefined;
        } & {
            properties?: Record<string, CollectionProperty> | undefined;
            additionalProperties?: import("@semantic-api/types").Property | undefined;
            format?: "date" | "date-time" | undefined;
            default?: any;
            description?: string | undefined;
            items?: import("@semantic-api/types").Property | undefined;
            readOnly?: boolean | undefined;
            uniqueItems?: boolean | undefined;
            minimum?: number | undefined;
            maximum?: number | undefined;
            exclusiveMinimum?: number | undefined;
            exclusiveMaximum?: number | undefined;
            minItems?: number | undefined;
            maxItems?: number | undefined;
            minLength?: number | undefined;
            maxLength?: number | undefined;
        } & {
            s$icon?: string | undefined;
            s$element?: import("@semantic-api/types").PropertyElement | undefined;
            s$inputType?: import("@semantic-api/types").PropertyInputType | undefined;
            s$placeholder?: string | undefined;
            s$hint?: string | undefined;
            s$translate?: boolean | undefined;
            s$meta?: boolean | undefined;
            s$mask?: string | readonly string[] | undefined;
            s$form?: readonly string[] | undefined;
            s$focus?: boolean | undefined;
            s$noLabel?: boolean | undefined;
            s$unique?: boolean | undefined;
            s$hidden?: boolean | undefined;
            s$purge?: boolean | undefined;
            readonly s$accept?: readonly string[] | undefined;
            s$componentProps?: Record<string, any> | undefined;
            s$isReference?: boolean | undefined;
            s$isFile?: boolean | undefined;
            s$referencedCollection?: string | undefined;
            s$preventPopulate?: boolean | undefined;
            s$noId?: boolean | undefined;
            s$prefetch?: number | boolean | undefined;
            s$array?: boolean | undefined;
            s$limit?: number | undefined;
            s$indexes?: readonly string[] | undefined;
            s$select?: readonly string[] | undefined;
            s$maxDepth?: number | undefined;
            s$inline?: boolean | undefined;
            s$inlineEditing?: boolean | undefined;
        } & {
            s$isReference: boolean | undefined;
            s$referencedCollection: string | undefined;
        }>;
        required: true;
    };
    searchOnly: {
        type: import("vue").PropType<boolean>;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (event: any) => void;
    "update:modelValue": (event: any) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: import("vue").PropType<any>;
        required: true;
    };
    propertyName: {
        type: import("vue").PropType<string>;
    };
    parentCollection: {
        type: import("vue").PropType<string>;
    };
    property: {
        type: import("vue").PropType<{
            $ref?: string | undefined;
        } & {
            enum?: readonly any[] | undefined;
        } & {
            type?: "string" | "number" | "boolean" | "object" | "time" | "array" | "integer" | "month" | undefined;
        } & {
            properties?: Record<string, CollectionProperty> | undefined;
            additionalProperties?: import("@semantic-api/types").Property | undefined;
            format?: "date" | "date-time" | undefined;
            default?: any;
            description?: string | undefined;
            items?: import("@semantic-api/types").Property | undefined;
            readOnly?: boolean | undefined;
            uniqueItems?: boolean | undefined;
            minimum?: number | undefined;
            maximum?: number | undefined;
            exclusiveMinimum?: number | undefined;
            exclusiveMaximum?: number | undefined;
            minItems?: number | undefined;
            maxItems?: number | undefined;
            minLength?: number | undefined;
            maxLength?: number | undefined;
        } & {
            s$icon?: string | undefined;
            s$element?: import("@semantic-api/types").PropertyElement | undefined;
            s$inputType?: import("@semantic-api/types").PropertyInputType | undefined;
            s$placeholder?: string | undefined;
            s$hint?: string | undefined;
            s$translate?: boolean | undefined;
            s$meta?: boolean | undefined;
            s$mask?: string | readonly string[] | undefined;
            s$form?: readonly string[] | undefined;
            s$focus?: boolean | undefined;
            s$noLabel?: boolean | undefined;
            s$unique?: boolean | undefined;
            s$hidden?: boolean | undefined;
            s$purge?: boolean | undefined;
            readonly s$accept?: readonly string[] | undefined;
            s$componentProps?: Record<string, any> | undefined;
            s$isReference?: boolean | undefined;
            s$isFile?: boolean | undefined;
            s$referencedCollection?: string | undefined;
            s$preventPopulate?: boolean | undefined;
            s$noId?: boolean | undefined;
            s$prefetch?: number | boolean | undefined;
            s$array?: boolean | undefined;
            s$limit?: number | undefined;
            s$indexes?: readonly string[] | undefined;
            s$select?: readonly string[] | undefined;
            s$maxDepth?: number | undefined;
            s$inline?: boolean | undefined;
            s$inlineEditing?: boolean | undefined;
        } & {
            s$isReference: boolean | undefined;
            s$referencedCollection: string | undefined;
        }>;
        required: true;
    };
    searchOnly: {
        type: import("vue").PropType<boolean>;
    };
}>> & {
    onChange?: ((event: any) => any) | undefined;
    "onUpdate:modelValue"?: ((event: any) => any) | undefined;
}, {}, {}>;
export default _default;
