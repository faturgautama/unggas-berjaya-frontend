import { CommonModule, formatCurrency } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Subject, takeUntil } from 'rxjs';
import { PanelFilterComponent } from 'src/app/components/filter/panel-filter/panel-filter.component';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { PanelFilterModel } from 'src/app/model/components/filter.model';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { InvoiceService } from 'src/app/services/invoice/invoice.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { PelangganService } from 'src/app/services/pelanggan/pelanggan.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-payment',
    standalone: true,
    imports: [
        FormsModule,
        ButtonModule,
        CommonModule,
        GridComponent,
        InputTextModule,
        InputNumberModule,
        DashboardComponent,
        InputTextareaModule,
        ConfirmDialogModule,
        DynamicFormComponent,
        PanelFilterComponent,
    ],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    FromPelanggan = false;

    QueryParams: any;

    UserData = this._authenticationService.getUserData();

    AdvancedFilterProps: PanelFilterModel.FilterDatasource[] = [
        {
            id: 'invoice_number',
            label: 'No. Penjualan',
            type: PanelFilterModel.TypeFilter.TEXT,
            value: ''
        },
        {
            id: 'invoice_date',
            label: 'Tgl. Penjualan',
            type: PanelFilterModel.TypeFilter.DATE,
            value: '',
            date_format: 'DD MM yy'
        },
        {
            id: 'full_name',
            label: 'Nama Pelanggan',
            type: PanelFilterModel.TypeFilter.TEXT,
            value: '',
        },
        {
            id: 'payment_date',
            label: 'Tgl. Pembayaran',
            type: PanelFilterModel.TypeFilter.DATE,
            value: '',
            date_format: 'DD MM yy'
        },
        {
            id: 'payment_number',
            label: 'No. Pembayaran',
            type: PanelFilterModel.TypeFilter.TEXT,
            value: '',
        },
        {
            id: 'payment_status',
            label: 'Status Pembayaran',
            type: PanelFilterModel.TypeFilter.SELECT,
            value: '',
            select_props: {
                options: [
                    { name: 'PENDING', value: 'PENDING' },
                    { name: 'PAID', value: 'PAID' },
                    { name: 'CANCEL', value: 'CANCEL' },
                ],
                optionName: 'name',
                optionValue: 'value'
            }
        },
    ]

    PageState: 'list' | 'form' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'add',
            title: 'Add Payment Manual',
            icon: 'pi pi-plus'
        },
    ];

    @ViewChild('GridComps') GridComps!: GridComponent;
    GridProps: GridModel.IGrid = {
        id: 'GridSetupMenu',
        column: [
            { field: 'payment_number', headerName: 'No. Faktur', class: 'font-semibold text-sky-500 text-xs', width: '150px' },
            { field: 'invoice_number', headerName: 'No. Penjualan', width: '150px' },
            { field: 'invoice_date', headerName: 'Tgl. Penjualan', class: 'text-xs', width: '100px' },
            { field: 'full_name', headerName: 'Pelanggan', class: 'text-xs', width: '150px' },
            { field: 'alamat', headerName: 'Alamat', class: 'text-xs', width: '200px' },
            { field: 'payment_date', headerName: 'Tgl. Bayar', format: 'datetime', class: 'text-xs', width: '150px' },
            { field: 'payment_method', headerName: 'Metode Bayar', class: 'text-xs', width: '150px' },
            { field: 'payment_amount', headerName: 'Total', format: 'currency', class: 'text-start text-xs', width: '150px' },
            { field: 'potongan', headerName: 'Potongan', format: 'currency', class: 'text-start text-xs', width: '150px' },
            { field: 'total', headerName: 'Grand Total', format: 'currency', class: 'text-start text-xs', width: '150px' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Detail', 'Hapus'],
        showPaging: true,
        showSearch: false,
        showSort: false,
        searchKeyword: 'role',
        searchPlaceholder: 'Find Role Name Here',
        isCustomSearch: false,
        customSearchProps: [
            {
                id: 'invoice_date',
                placeholder: 'Cari Tgl. Tagihan Disini',
                type: 'monthpicker',
            },
            {
                id: 'invoice_number',
                placeholder: 'Cari No. Tagihan Disini',
                type: 'text'
            },
        ],
        defaultRows: 50
    };
    GridSelectedData: any;
    GridQueryParams: any;

    FormState: 'insert' | 'update' | 'update_cash' | 'detail' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    @ViewChild('GridDetailComps') GridDetailComps!: GridComponent;
    GridDetailProps: GridModel.IGrid = {
        id: 'GridDetailPenjualan',
        column: [
            { field: 'kode_product', headerName: 'Kode Produk', class: 'font-semibold text-sky-500', width: '150px' },
            { field: 'nama_product', headerName: 'Nama Produk', width: '150px' },
            { field: 'price', headerName: 'Harga', format: 'currency', width: '150px' },
            { field: 'qty', headerName: 'Qty', format: 'number', width: '150px' },
            { field: 'weight', headerName: 'Berat', format: 'number', width: '150px' },
            { field: 'total', headerName: 'Total', format: 'currency', width: '150px' },
        ],
        dataSource: [],
        height: "calc(100vh - 24rem)",
        showPaging: false,
        showSearch: false,
        showSort: false,
        defaultRows: 50,
        searchKeyword: 'role',
        searchPlaceholder: 'Find Role Name Here',
    };

    Notes = "";
    PaymentAmount = 0;
    Potongan = 0;
    Total = 0;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _paymentService: PaymentService,
        private _utilityService: UtilityService,
        private _invoiceService: InvoiceService,
        private _pelangganService: PelangganService,
        private _confirmationService: ConfirmationService,
        private _authenticationService: AuthenticationService,
    ) {
        this.FormProps = {
            id: 'form_payment',
            fields: [
                {
                    id: 'id_payment',
                    label: 'id payment',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true,
                },
                {
                    id: 'id_pelanggan',
                    label: 'Pilih Pelanggan',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'full_name',
                        optionValue: 'id_pelanggan',
                        customField: {
                            title: 'full_name',
                            subtitle: 'pelanggan_code',
                            description: 'alamat'
                        }
                    },
                    onChange: (args: any) => {
                        if (args) {
                            this.getAllInvoice(args.id_pelanggan);
                        }
                    }
                },
                {
                    id: 'id_invoice',
                    label: 'Pilih Invoice',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'invoice_number',
                        optionValue: 'id_invoice',
                        customField: {
                            title: 'invoice_number',
                            subtitle: 'product_name',
                            description: 'notes'
                        }
                    },
                    onChange: (args: any) => {
                        if (args) {
                            const payload = {
                                invoice_date: this._utilityService.onFormatDate(new Date(args.invoice_date), 'DD MMMM yyyy'),
                                invoice_status: args.invoice_status,
                                total: formatCurrency(args.total, 'EN', 'Rp. '),
                                payment_date: new Date(),
                                payment_amount: args.total,
                            };
                            this.FormComps.FormGroup.patchValue(payload);
                            this.getByIdInvoice(args.id_invoice);
                            this.PaymentAmount = args.total;
                            this.Potongan = 0;
                            this.Total = args.total;
                        }
                    }
                },
                {
                    id: 'invoice_date',
                    label: 'Tgl. Penjualan',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'invoice_status',
                    label: 'Status Penjualan',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'payment_date',
                    label: 'Tgl. Pembayaran',
                    required: true,
                    type: 'datetime',
                    value: "",
                },
                {
                    id: 'payment_amount',
                    label: 'Jumlah Pembayaran',
                    required: true,
                    type: 'number',
                    value: 0,
                    readonly: true,
                    hidden: true
                },
                {
                    id: 'payment_method',
                    label: 'Metode Bayar',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [
                            { name: 'Cash', value: 'Cash' },
                            { name: 'Transfer', value: 'Transfer' }
                        ],
                        optionName: 'name',
                        optionValue: 'value',
                    },
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-2 grid-cols-3',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.ButtonNavigation = [
            {
                id: 'add',
                title: 'Add Pembayaran',
                icon: 'pi pi-plus'
            },
        ]

        this.getAll({ payment_date: this._utilityService.onFormatDate(new Date(), 'yyyy-MM-DD') });
        this.getAllPelanggan({ is_active: true });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.checkQueryParams();
        }, 100);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private checkQueryParams() {
        const queryParams = this._activatedRoute.snapshot.queryParams;
        if (Object.keys(queryParams).length) {
            this.QueryParams = queryParams;
            this.FromPelanggan = true;

            if (queryParams['state'] == 'cash') {
                this.PageState = 'form';
                this.ButtonNavigation = [];
                this.getAllInvoice(this.QueryParams.id_pelanggan, true, this.QueryParams.id_invoice);
            }

            if (queryParams['state'] == 'add') {
                this.PageState = 'form';
                this.FormState = 'insert';
                this.ButtonNavigation = [];
                this.getAllInvoice(this.QueryParams.id_pelanggan, true, this.QueryParams.id_invoice);
            }
        } else {
            this.FromPelanggan = false;
        }
    }

    handleFilterGridPayment(args: any) {
        args.search = this.GridQueryParams.search;
        this.GridQueryParams = this.resetQueryParams(args);
        this.getAll(this.GridQueryParams);
    }

    handleSearchGridPayment(search: string) {
        let query = {
            ...this.GridQueryParams
        };

        if (search) {
            query.search = search;
            this.GridQueryParams = query;
        } else {
            delete this.GridQueryParams.search;
        }

        this.getAll(this.GridQueryParams);
    }

    handleExportGridPayment() {
        this.GridComps.onExportExcel();
    }

    private resetQueryParams(obj: Record<string, any>) {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );
    }

    private getAll(query?: any) {
        this.GridQueryParams = query;

        this._paymentService
            .getAll(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data.map((item: any) => {
                        return {
                            ...item,
                            invoice_date: this._utilityService.onFormatDate(new Date(item.invoice_date), 'DD MMMM yyyy')
                        }
                    });
                }
            });
    }

    private getAllPelanggan(query?: any) {
        this._pelangganService
            .getAll(query, true)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_pelanggan');
                    this.FormProps.fields[index].dropdownProps.options = result.data;
                }
            });
    }

    private getAllInvoice(id_pelanggan: string, is_set?: boolean, id_invoice?: number) {
        this._invoiceService
            .getAll({ id_pelanggan: id_pelanggan, id_invoice: id_invoice })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_invoice');
                    this.FormProps.fields[index].dropdownProps.options = result.data;

                    if (is_set) {
                        setTimeout(() => {
                            const invoice = result.data.find(item => item.id_invoice == parseInt(id_invoice as any));
                            const payload = {
                                id_pelanggan: parseInt(id_pelanggan),
                                id_invoice: parseInt(id_invoice as any),
                                invoice_date: this._utilityService.onFormatDate(new Date(invoice!.invoice_date), 'DD MMMM yyyy'),
                                invoice_status: invoice!.invoice_status,
                                total: formatCurrency(invoice!.total, 'EN', 'Rp. '),
                                payment_amount: invoice!.total,
                            };
                            this.FormComps.FormGroup.patchValue(payload);
                            this.getByIdInvoice(id_invoice!);

                            if (this.FormState == 'insert') {
                                this.FormProps.fields[index].readonly = false;
                                this.PaymentAmount = invoice ? invoice.total : 0;
                                this.Potongan = 0;
                                this.Total = invoice ? invoice.total : 0;
                            };
                        }, 1000);
                    }
                }
            });
    }

    private getByIdInvoice(id_invoice: number) {
        this._invoiceService
            .getById(id_invoice)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result: any) => {
                if (result.status) {
                    this.GridDetailProps.dataSource = result.data.detail;
                }
            })
    }

    onSearchGrid(args: any) {
        this.getAll(args);
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'add') {
            this.PageState = 'form';
            this.ButtonNavigation = [];
        };
    }

    handleBackToList() {
        if (this.FromPelanggan) {
            this._router.navigateByUrl(`/pelanggan?id_pelanggan=${this.QueryParams.id_pelanggan || this.FormComps.FormGroup.get('id_pelanggan')?.value}`);
        } else {
            setTimeout(() => {
                this.PageState = 'list';
                this.FormState = 'insert';
                this.ButtonNavigation = [
                    {
                        id: 'add',
                        title: 'Add Payment Manual',
                        icon: 'pi pi-plus'
                    }
                ];

                this.getAll(this.GridQueryParams);
            }, 100);
        }
    }

    onCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        this.PageState = 'form';
        this.ButtonNavigation = [];
        this.FormState = 'update';
        this.getAllInvoice(args.id_pelanggan, true, args.id_invoice);

        // ** Set value ke Dynamic form components
        setTimeout(() => {
            args.payment_date = new Date(args.payment_date);
            this.FormComps.FormGroup.patchValue(args);

            this.PaymentAmount = args.payment_amount;
            this.Potongan = args.potongan;
            this.Total = args.total;
            this.Notes = args.notes;

            const index = this.FormProps.fields.findIndex(item => item.id == 'id_invoice');
            this.FormProps.fields[index].readonly = true;
        }, 500);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }

        if (args.type == 'edit') {
            if (args.data.payment_provider != 'MANUAL' && (args.data.payment_status == 'PENDING' || args.data.payment_status == 'ACTIVE')) {
                this.onRowDoubleClicked(args.data);
            } else {
                this._messageService.clear();
                this._messageService.add({ severity: 'warn', summary: 'Oops', detail: 'Aksi ini hanya untuk PENDING payment & tidak melalui Payment Gateway' });
            }
        }

        if (args.type == 'print') {
            if (args.data.payment_status == 'PAID') {
                this._router.navigateByUrl(`/print-out/pos?id_payment=${args.data.id_payment}`)
            } else {
                this._messageService.clear();
                this._messageService.add({ severity: 'warn', summary: 'Oops', detail: 'Aksi ini hanya untuk PAID payment' });
            }
        }

        if (args.type == 'hapus') {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                message: 'Pembayaran akan dihapus',
                header: 'Apakah Anda Yakin?',
                icon: 'pi pi-info-circle',
                acceptButtonStyleClass: "p-button-danger p-button-sm",
                rejectButtonStyleClass: "p-button-secondary p-button-sm",
                acceptIcon: "none",
                acceptLabel: 'Iya, yakin',
                rejectIcon: "none",
                rejectLabel: 'Tidak',
                accept: () => {
                    this.cancelData(args.data.id_payment);
                }
            });
        }
    }

    handleCountGrandTotal(args: number) {
        this.Total = parseFloat((this.PaymentAmount - args) as any);
    }

    saveData(data: any) {
        const payload = {
            id_invoice: data.id_invoice,
            payment_number: "",
            payment_date: data.payment_date,
            payment_method: data.payment_method,
            payment_amount: this.PaymentAmount,
            potongan: this.Potongan,
            total: this.Total,
            notes: this.Notes,
        };

        this._paymentService
            .create(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data saved succesfully' });
                    this.handleBackToList();
                }
            })
    }

    updateData(data: any) {
        const payload = {
            id_payment: data.id_payment,
            id_invoice: data.id_invoice,
            payment_number: "",
            payment_date: data.payment_date,
            payment_method: data.payment_method,
            payment_amount: this.PaymentAmount,
            potongan: this.Potongan,
            total: this.Total,
            notes: this.Notes,
        };

        this._paymentService
            .update(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data updated succesfully' });
                    this.handleBackToList();
                }
            })
    }

    private cancelData(id_payment: any) {
        this._paymentService
            .cancel(id_payment)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data canceled succesfully' });
                    this.getAll(this.GridQueryParams);
                }
            })
    }
}
