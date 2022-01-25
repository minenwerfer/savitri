import { ReportDocument } from '../models/Report';
import { Mutable } from './abstract/Mutable';
export interface ReportController {
    formatMap: any;
}
export declare class ReportController extends Mutable<ReportDocument> {
    constructor();
    private _getFields;
    private _getColumns;
    private _formatValue;
    private _filename;
    private _saveCSV;
    private _savePDF;
    insert(props: {
        what: any;
    }, req: unknown, decodedToken: any): Promise<any>;
    download(_id: string): Promise<void>;
}
