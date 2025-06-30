export namespace PaymentModel {
    export interface IPayment {
        id_payment: number;
        id_invoice: number;
        invoice_number: string;
        invoice_date: Date;
        id_pelanggan: number;
        full_name: string;
        payment_date: Date;
        payment_method: string;
        payment_number: string;
        payment_amount: number;
        notes: string;
        create_at: Date;
        create_by: number;
        update_at: Date;
        update_by: number;
    }

    export interface IPaymentQueryParams {
        invoice_number?: string;
        invoice_date?: string;
        payment_number?: string;
        payment_date?: string;
        full_name?: string;
        search?: string;
        page: number;
        limit: number;
    }

    export class GetAllPayment {
        status!: boolean;
        message!: string;
        data!: IPayment[]
    }

    export class GetByIdPayment {
        status!: boolean;
        message!: string;
        data!: IPayment;
    }

    export interface CreatePayment {
        id_invoice: number;
        payment_number: string;
        payment_date: Date;
        payment_method: string;
        payment_amount: number;
        notes?: string;
    }

    export interface UpdatePayment {
        id_payment: number;
        id_invoice: number;
        payment_number: string;
        payment_date: Date;
        payment_method: string;
        payment_amount: number;
        notes?: string;
    }
}