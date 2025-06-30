export namespace SettingCompanyModel {
    export interface ISettingCompany {
        id_setting_company: number;
        company_name: string;
        company_email: string;
        company_short_name: string;
        company_address: string;
        company_phone: string;
        company_whatsapp: string;
        company_email_admin: string;
        company_nomor_rekening: string;
        company_bank_name: string;
        tagihan_ppn: number;
        tagihan_jatuh_tempo: number;
        tagihan_use_unik_kode: boolean;
        tagihan_biaya_admin: number
        tagihan_pesan_invoice: string;
        tagihan_pesan_lunas: string;
        tagihan_editor_invoice: string;
        tagihan_editor_pos: string;
        create_at: Date;
        create_by: number;
        update_at: Date;
        update_by: number;
        is_active: boolean;
        is_mitra: boolean;
        is_cabang: boolean;
        api_key_pg: string;
    }

    export interface ISettingCompanyQuery {
        company_name?: string;
        is_mitra?: boolean;
        is_cabang?: boolean;
        is_active?: boolean;
    }

    export class GetAllSettingCompany {
        status!: boolean;
        message!: string;
        data!: ISettingCompany[]
    }

    export class GetByIdSettingCompany {
        status!: boolean;
        message!: string;
        data!: ISettingCompany;
    }

    export interface CreateSettingCompany {
        company_name: string;
        company_email: string;
        company_short_name: string;
        company_address: string;
        company_phone: string;
        company_whatsapp: string;
        company_email_admin: string;
        company_nomor_rekening: string;
        company_bank_name: string;
        tagihan_ppn: number;
        tagihan_jatuh_tempo: number;
        tagihan_use_unik_kode: boolean;
        tagihan_biaya_admin: number;
        tagihan_pesan_invoice: string;
        tagihan_pesan_lunas: string;
        tagihan_editor_invoice: string;
        tagihan_editor_pos: string;
        is_mitra: boolean;
        is_cabang: boolean;
        api_key_pg: string;
    }

    export interface UpdateSettingCompany {
        id_setting_company: number;
        company_name: string;
        company_email: string;
        company_short_name: string;
        company_address: string;
        company_phone: string;
        company_whatsapp: string;
        company_email_admin: string;
        company_nomor_rekening: string;
        company_bank_name: string;
        tagihan_ppn: number;
        tagihan_jatuh_tempo: number;
        tagihan_use_unik_kode: boolean;
        tagihan_biaya_admin: number;
        tagihan_pesan_invoice: string;
        tagihan_pesan_lunas: string;
        tagihan_editor_invoice: string;
        tagihan_editor_pos: string;
        is_active: boolean;
        is_mitra: boolean;
        is_cabang: boolean;
        api_key_pg: string;
    }
}