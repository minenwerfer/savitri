export declare const defaultDescriptions: {
    user: {
        module: string;
        route: boolean;
        unicon: string;
        actions: {
            spawnAdd: {
                name: string;
            };
        };
        individualActions: {
            spawnEdit: {
                name: string;
                unicon: string;
            };
            spawnChangePwd: {
                name: string;
                unicon: string;
            };
            remove: {
                name: string;
                unicon: string;
                ask: boolean;
            };
        };
        fields: {
            name: {
                label: string;
                type: string;
                required: boolean;
            };
            first_name: {
                label: string;
                type: string;
                notable: boolean;
                noform: boolean;
            };
            access: {
                label: string;
                type: string;
                values: {
                    __query: {
                        module: string;
                        index: string;
                    };
                };
                required: boolean;
            };
            email: {
                label: string;
                type: string;
                required: boolean;
            };
            password: {
                label: string;
                type: string;
                hidden: boolean;
                noform: boolean;
                notable: boolean;
            };
            active: {
                label: string;
                type: string;
                default: boolean;
            };
            phone: {
                label: string;
                type: string;
                mask: string;
            };
            picture: {
                module: string;
                label: string;
                index: string;
            };
            group: {
                label: string;
                type: string;
                noform: boolean;
                notable: boolean;
            };
            updated_at: {
                label: string;
                type: string;
                meta: boolean;
            };
        };
    };
    accessProfile: {
        module: string;
        route: boolean;
        unicon: string;
        actions: {
            spawnAdd: {
                name: string;
            };
        };
        individualActions: {
            spawnEdit: {
                name: string;
                unicon: string;
            };
            remove: {
                name: string;
                unicon: string;
                ask: boolean;
            };
        };
        table: string[];
        fields: {
            name: {
                label: string;
                type: string;
                unique: boolean;
            };
            visibility: {
                label: string;
                type: string;
                required: boolean;
                translate: boolean;
                values: string[];
            };
            capabilities: {
                label: string;
                type: string;
            };
            created_at: {
                label: string;
                type: string;
                meta: boolean;
            };
            updated_at: {
                label: string;
                type: string;
                meta: boolean;
            };
        };
    };
    feedback: {
        module: string;
        route: boolean;
        unicon: string;
        alwaysAttribute: boolean;
        actions: {
            removeAll: {
                name: string;
                ask: boolean;
                selection: boolean;
            };
        };
        individualActions: {
            remove: {
                name: string;
                unicon: string;
                ask: boolean;
            };
        };
        fields: {
            user_id: {
                module: string;
                label: string;
                index: string;
            };
            product_version: {
                label: string;
                type: string;
                noform: boolean;
            };
            base_version: {
                label: string;
                type: string;
                noform: boolean;
            };
            user_agent: {
                label: string;
                type: string;
                notable: boolean;
                noform: boolean;
                flexGrow: boolean;
            };
            section: {
                label: string;
                type: string;
            };
            type: {
                label: string;
                type: string;
                required: boolean;
                values: string[];
            };
            comment: {
                label: string;
                type: string;
                notable: boolean;
            };
        };
    };
    file: {
        module: string;
        route: boolean;
        actions: {
            removeAll: {
                name: string;
                ask: boolean;
                selection: boolean;
            };
        };
        individualActions: {
            remove: {
                name: string;
                unicon: string;
                ask: boolean;
            };
        };
        fields: {
            user_id: {
                module: string;
                label: string;
                index: string;
            };
            context: {
                label: string;
                type: string;
            };
            mime: {
                label: string;
                type: string;
            };
            size: {
                label: string;
                type: string;
            };
            last_modified: {
                label: string;
                type: string;
            };
            filename: {
                label: string;
                type: string;
            };
            absolute_path: {
                label: string;
                type: string;
            };
            relative_path: {
                label: string;
                type: string;
            };
            immutable: {
                label: string;
                type: string;
            };
        };
    };
    notification: {
        module: string;
        route: boolean;
        alwaysAttribute: boolean;
        flex: boolean;
        actions: {
            spawnAdd: {
                name: string;
            };
        };
        individualActions: {
            spawnEdit: {
                name: string;
                unicon: string;
            };
            remove: {
                name: string;
                unicon: string;
                ask: boolean;
            };
        };
        fields: {
            user_id: {
                module: string;
                label: string;
                index: string;
                noform: boolean;
            };
            destination: {
                module: string;
                label: string;
                index: string;
                array: boolean;
            };
            title: {
                label: string;
                type: string;
                required: boolean;
            };
            action: {
                label: string;
                type: string;
            };
            groups: {
                label: string;
                type: string;
                placeholder: string;
                description: string;
            };
            subject: {
                label: string;
                type: string;
            };
            content: {
                label: string;
                type: string;
                notable: boolean;
            };
        };
    };
    report: {
        module: string;
        route: boolean;
        unicon: string;
        alwaysAttribute: boolean;
        actions: {
            removeAll: {
                name: string;
                ask: boolean;
                selection: boolean;
            };
        };
        individualActions: {
            download: {
                name: string;
                unicon: string;
            };
            remove: {
                name: string;
                unicon: string;
                ask: boolean;
            };
        };
        fields: {
            user_id: {
                module: string;
                label: string;
                index: string;
                noform: boolean;
            };
            module: {
                label: string;
                type: string;
                translate: boolean;
            };
            created_at: {
                label: string;
                type: string;
                meta: boolean;
            };
            file: {
                module: string;
                label: string;
                index: string;
                notable: boolean;
                noform: boolean;
            };
            format: {
                label: string;
                type: string;
                values: {
                    csv: string;
                    pdf: string;
                };
            };
            type: {
                label: string;
                type: string;
                values: {
                    filtered_only: string;
                    everything: string;
                };
                translate: string;
            };
            limit: {
                label: string;
                description: string;
                type: string;
                notable: boolean;
            };
            offset: {
                label: string;
                description: string;
                type: string;
                notable: boolean;
            };
            filters: {
                label: string;
                type: string;
                notable: boolean;
                noform: boolean;
            };
            entries_count: {
                label: string;
                type: string;
                noform: boolean;
            };
        };
    };
    release: {
        module: string;
        route: boolean;
        methods: string[];
        actions: {
            spawnAdd: {
                name: string;
            };
            removeAll: {
                name: string;
                ask: boolean;
                selection: boolean;
            };
        };
        individualActions: {
            spawnEdit: {
                name: string;
            };
            remove: {
                name: string;
                ask: boolean;
            };
        };
        fields: {
            base: {
                label: string;
                type: string;
            };
            product: {
                label: string;
                type: string;
            };
        };
    };
};
