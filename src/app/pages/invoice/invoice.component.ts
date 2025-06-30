import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';
import { PanelFilterComponent } from 'src/app/components/filter/panel-filter/panel-filter.component';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { PanelFilterModel } from 'src/app/model/components/filter.model';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { SettingCompanyModel } from 'src/app/model/pages/setup-data/setting-company.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { InvoiceService } from 'src/app/services/invoice/invoice.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { PelangganService } from 'src/app/services/pelanggan/pelanggan.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-invoice',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        ButtonModule,
        GridComponent,
        InputTextModule,
        DashboardComponent,
        ConfirmDialogModule,
        DynamicFormComponent,
        PanelFilterComponent,
    ],
    templateUrl: './invoice.component.html',
    styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    FromPelanggan = false;

    QueryParams: any = null;

    AdvancedFilterProps: PanelFilterModel.FilterDatasource[] = [
        {
            id: 'invoice_number',
            label: 'No. Faktur',
            type: PanelFilterModel.TypeFilter.TEXT,
            value: ''
        },
        {
            id: 'invoice_date',
            label: 'Tgl. Penjualan',
            type: PanelFilterModel.TypeFilter.DATE,
            value: '',
            date_format: 'dd MM yy'
        },
        {
            id: 'full_name',
            label: 'Nama Pelanggan',
            type: PanelFilterModel.TypeFilter.TEXT,
            value: '',
        },
        {
            id: 'invoice_status',
            label: 'Status',
            type: PanelFilterModel.TypeFilter.SELECT,
            value: '',
            select_props: {
                options: [
                    { name: 'BELUM TERBAYAR', value: 'BELUM TERBAYAR' },
                    { name: 'LUNAS', value: 'LUNAS' },
                ],
                optionName: 'name',
                optionValue: 'value'
            }
        },
    ];

    PageState: 'list' | 'form' = 'list';

    SettingCompany!: SettingCompanyModel.ISettingCompany;

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

    @ViewChild('GridComps') GridComps!: GridComponent;
    GridProps: GridModel.IGrid = {
        id: 'GridPenjualan',
        column: [
            { field: 'invoice_number', headerName: 'No. Faktur', class: 'font-semibold text-sky-500 text-xs', width: '200px' },
            { field: 'invoice_date', headerName: 'Tgl. Penjualan', class: 'text-xs', width: '150px' },
            { field: 'full_name', headerName: 'Pelanggan', class: 'text-xs', width: '300px' },
            { field: 'total', headerName: 'Sub Total', format: 'currency', class: 'text-xs', width: '150px' },
            { field: 'bayar', headerName: 'Bayar', format: 'currency', class: 'text-xs', width: '150px' },
            { field: 'invoice_status', headerName: 'Status', class: 'text-xs', width: '100px' },
            { field: 'is_cash', headerName: 'Apakah Cash?', class: 'text-center text-xs', width: '100px', format: 'icon_boolean' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Detail'],
        showPaging: true,
        showSearch: false,
        showSort: true,
        defaultRows: 5,
        searchKeyword: 'role',
        searchPlaceholder: 'Find Role Name Here',
        isCustomSearch: false,
        customSearchProps: [
            {
                id: 'invoice_date',
                placeholder: 'Cari Periode Tagihan Disini',
                type: 'monthpicker',
            },
            {
                id: 'id_pelanggan',
                placeholder: 'Cari Pelanggan Disini',
                type: 'dropdown',
                dropdownProps: {
                    options: [],
                    optionName: 'full_name',
                    optionValue: 'id_pelanggan',
                    customField: {
                        title: 'full_name',
                        subtitle: 'pelanggan_code',
                        description: 'alamat'
                    }
                }
            },
            {
                id: 'invoice_number',
                placeholder: 'Cari No. Tagihan Disini',
                type: 'text'
            },
        ],
        paginationInfo: {
            page: 1,
            limit: 5,
            total: 0,
            total_pages: 0,
            first: 0
        },
    };
    GridSelectedData: any;
    GridQueryParams: any;

    FormState: 'insert' | 'update' = 'insert';
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

    GrandTotal = 0;

    FilterPelanggan$ = new Subject();

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _utilityService: UtilityService,
        private _invoiceService: InvoiceService,
        private _paymentService: PaymentService,
        private _pelangganService: PelangganService,
        private _confirmationService: ConfirmationService,
        private _authenticationService: AuthenticationService,
    ) {
        this.FormProps = {
            id: 'form_tagihan',
            fields: [
                {
                    id: 'id_invoice',
                    label: 'Id Invoice',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_pelanggan',
                    label: 'Id Pelanggan',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'invoice_number',
                    label: 'No. Faktur',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true
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
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'full_name',
                    label: 'Nama Pelanggan',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'alamat',
                    label: 'Alamat Pelanggan',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'phone',
                    label: 'No. HP Pelanggan',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-2 grid-cols-3',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll({ invoice_date: new Date(), page: 1, limit: 50 });
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
            this.FromPelanggan = true;
            this.QueryParams = queryParams;

            if (queryParams['state'] == 'add') {
                this.PageState = 'form';
                this.ButtonNavigation = [];
            }

            if (queryParams['state'] == 'edit') {
                this._invoiceService
                    .getById(queryParams['id_invoice'])
                    .pipe(takeUntil(this.Destroy$))
                    .subscribe((result) => {
                        if (result.status) {
                            this.onRowDoubleClicked(result.data);
                        }
                    })
            }
        } else {
            this.FromPelanggan = false;
        }
    }

    handleFilterGridInvoice(args: any) {
        this.GridQueryParams = this.resetQueryParams(args);
        this.getAll(this.GridQueryParams);
    }

    handleSearchGridInvoice(search: string) {
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

    handleExportGridInvoice() {
        this.GridComps.onExportExcel();
    }

    private resetQueryParams(obj: Record<string, any>) {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );
    }

    private getAll(query?: any) {
        this.GridQueryParams = query;

        this._invoiceService
            .getAll(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result: any) => {
                if (result) {
                    this.GridProps.paginationInfo = {
                        ...result.meta,
                        first: (result.meta.page - 1) * result.meta.limit
                    };

                    this.GridProps.dataSource = result.data.map((item: any) => {
                        return {
                            ...item,
                            invoice_date: this._utilityService.onFormatDate(new Date(item.invoice_date), 'DD MMMM yyyy')
                        }
                    });
                }
            });
    }

    onSearchGrid(args: any) {
        this.getAll(args);
    }

    onPageChanged(args: any) {
        this.GridQueryParams.page = args.page;
        this.GridQueryParams.limit = args.limit;

        this.getAll(this.GridQueryParams);
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {

    }

    handleBackToList() {
        if (this.FromPelanggan) {
            const id_pelanggan = this.FormComps.FormGroup.get('id_pelanggan')?.value;
            this._router.navigateByUrl(`/pelanggan?id_pelanggan=${id_pelanggan}`);
        } else {
            this.FormComps.onResetForm();

            setTimeout(() => {
                this.PageState = 'list';
                this.FormState = 'insert';
                this.ButtonNavigation = [];

                this.getAll(this.GridQueryParams);
            }, 100);
        }

    }

    onCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        this.PageState = 'form';
        this.FormState = 'update';
        this.ButtonNavigation = [];
        // ** Set value ke Dynamic form components
        setTimeout(() => {
            args.invoice_date = this._utilityService.onFormatDate(new Date(args.invoice_date), 'DD MMMM yyyy');
            this.FormComps.FormGroup.patchValue(args);
            this.GrandTotal = args.total;
            this.getDetailInvoice(args.id_invoice);
        }, 500);
    };

    private getDetailInvoice(id_invoice: number) {
        this._invoiceService
            .getById(id_invoice)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result: any) => {
                if (result) {
                    this.GridDetailProps.dataSource = result.data.detail;
                }
            })
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }

        if (args.type == 'buat pembayaran') {
            this._router.navigateByUrl(`/pembayaran?state=add&id_pelanggan=${args.data.id_pelanggan}&id_invoice=${args.data.id_invoice}`)
        }
    }

}
