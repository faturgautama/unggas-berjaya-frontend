export namespace TemplateEditorModel {
    export interface ITemplateEditor {
        id_template_editor: number;
        template_pesan_invoice: string;
        template_pesan_lunas: string;
        template_editor_invoice: string;
        template_editor_pos: string;
        create_at: Date;
        create_by: number;
        update_at: Date;
        update_by: number;
    }

    export class ITemplateEditorQueryParams {
        user_group?: string;
    }

    export class GetAllTemplateEditor {
        status!: boolean;
        message!: string;
        data!: ITemplateEditor
    }

    export class GetByIdTemplateEditor {
        status!: boolean;
        message!: string;
        data!: ITemplateEditor;
    }

    export interface CreateTemplateEditor {
        template_pesan_invoice: string;
        template_pesan_lunas: string;
        template_editor_invoice: string;
        template_editor_pos: string;
    }

    export interface UpdateTemplateEditor {
        id_template_editor: number;
        template_pesan_invoice: string;
        template_pesan_lunas: string;
        template_editor_invoice: string;
        template_editor_pos: string;
    }
}