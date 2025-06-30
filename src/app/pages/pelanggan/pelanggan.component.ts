import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { InvoiceService } from 'src/app/services/invoice/invoice.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { PelangganService } from 'src/app/services/pelanggan/pelanggan.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
    selector: 'app-pelanggan',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        InputTextModule,
        TabMenuModule,
    ],
    templateUrl: './pelanggan.component.html',
    styleUrl: './pelanggan.component.scss'
})
export class PelangganComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' | 'set_paket' = 'list';

    ActiveTab: 'active' | 'inactive' = 'active';

    UserData = this._authenticationService.getUserData();

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

    @ViewChild('GridPelangganComps') GridPelangganComps!: GridComponent;
    GridProps: GridModel.IGrid = {
        id: 'GridPelanggan',
        column: [
            { field: 'ref_id', headerName: 'Kode Pelanggan', class: 'text-sky-500 font-semibold', width: '150px' },
            { field: 'full_name', headerName: 'Nama Pelanggan', width: '200px' },
            { field: 'phone', headerName: 'No. Handphone', width: '150px' },
            { field: 'alamat', headerName: 'Alamat', width: '200px' },
            { field: 'create_at', headerName: 'Waktu Entry', width: '200px', format: 'datetime' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Detail',],
        showPaging: true,
        showSearch: false,
        showSort: true,
        searchKeyword: 'role',
        searchPlaceholder: 'Find Role Name Here',
        defaultRows: 50
    };
    GridSelectedData: any;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    @ViewChild('GridHistoryTagihanComps') GridHistoryTagihanComps!: GridComponent;
    GridHistoryTagihanProps: GridModel.IGrid = {
        id: 'GridHistoryTagihan',
        column: [
            { field: 'invoice_number', headerName: 'No. Tagihan', class: 'font-semibold text-sky-500 text-xs', width: '200px' },
            { field: 'invoice_date', headerName: 'Periode', class: 'text-xs', width: '150px' },
            { field: 'full_name', headerName: 'Pelanggan', class: 'text-xs', width: '300px' },
            { field: 'total', headerName: 'Subtotal', format: 'currency', class: 'text-end text-xs', width: '150px' },
            { field: 'bayar', headerName: 'Bayar', format: 'currency', class: 'text-end text-xs', width: '150px' },
            { field: 'invoice_status', headerName: 'Status', class: 'text-center text-xs', width: '100px' },
            { field: 'is_cash', headerName: 'Apakah Cash?', class: 'text-center text-xs', width: '100px', format: 'icon_boolean' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Detail', 'Buat Pembayaran'],
        showPaging: true,
        showSearch: false,
        showSort: false,
        searchKeyword: 'role',
        searchPlaceholder: 'Find Role Name Here',
        paginationInfo: {
            page: 1,
            limit: 5,
            total: 0,
            total_pages: 0,
            first: 0
        },
    };
    GridHistoryTagihanQueryParams: any;

    ShowDialogImport = false;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _invoiceService: InvoiceService,
        private _utilityService: UtilityService,
        private _paymentService: PaymentService,
        private _pelangganService: PelangganService,
        private _confirmationService: ConfirmationService,
        private _authenticationService: AuthenticationService,
    ) {
        this.FormProps = {
            id: 'form_setup_pelanggan',
            fields: [
                {
                    id: 'id_pelanggan',
                    label: 'Id Pelanggan',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'is_active',
                    label: 'Is Active',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'ref_id',
                    label: 'Kode Pelanggan',
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
                },
                {
                    id: 'alamat',
                    label: 'Alamat',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'phone',
                    label: 'No. Handphone',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'identity_number',
                    label: 'No. Identitas',
                    required: false,
                    type: 'text',
                    value: '',
                    mask: '0000-0000-0000-0000',
                },
                {
                    id: 'notes',
                    label: 'Notes',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'is_blacklist',
                    label: 'Is Blacklist',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-3 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll();
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

        if (queryParams && queryParams['id_pelanggan']) {
            this._pelangganService
                .getById(queryParams['id_pelanggan'])
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.status) {
                        this.GridSelectedData = result.data;
                        this.onRowDoubleClicked(result.data);
                    }
                })
        }
    }

    handleChangeTab(state: 'active' | 'inactive') {
        this.ActiveTab = state;
        this.getAll();
    }

    handleSearchGridPelanggan(query: string) {
        this.getAll(query);
    }

    handleExportGridPelanggan() {
        this.GridPelangganComps.onExportExcel();
    }

    private getAll(query?: any) {
        let newQuery: any = {}

        if (query) newQuery.search = query;

        newQuery.is_active = true;

        this._pelangganService
            .getAll(newQuery, true)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data;
                }
            });

    }

    private getAllInvoice(query?: any) {
        this.GridHistoryTagihanQueryParams = query;

        this._invoiceService
            .getAll(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result: any) => {
                if (result) {
                    this.GridHistoryTagihanProps.paginationInfo = {
                        ...result.meta,
                        first: (result.meta.page - 1) * result.meta.limit
                    };

                    this.GridHistoryTagihanProps.dataSource = result.data.map((item: any) => {
                        return {
                            ...item,
                            invoice_date: this._utilityService.onFormatDate(new Date(item.invoice_date), 'MMMM yyyy')
                        }
                    });
                }
            });
    }

    onSearchGrid(args: any) {
        this.getAll(args);
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'set_paket') {
            this.PageState = 'set_paket';
            this.ButtonNavigation = [
                {
                    id: 'back',
                    title: 'Kembali',
                    icon: 'pi pi-chevron-left'
                },
            ];
        };

        if (data.id == 'add') {
            this.PageState = 'form';
            this.ButtonNavigation = [];

            setTimeout(() => {
                if (this.UserData) {
                    this.FormComps.FormGroup.get('id_setting_company')?.setValue(this.UserData.id_setting_company);
                }

                this.FormComps.FormGroup.get('subscribe_start_date')?.setValue(new Date());
            }, 500);
        };

        if (data.id == 'import') {
            this.ShowDialogImport = true;
        };

        if (data.id == 'back') {
            this.handleBackToList();
        };
    }

    handleBackToList() {
        this._router.navigateByUrl("/pelanggan");

        if (this.PageState == 'form') {
            this.FormComps.onResetForm();
        }

        setTimeout(() => {
            this.PageState = 'list';
            this.FormState = 'insert';
            this.ButtonNavigation = [];
            this.getAll();
        }, 100);
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
            args.phone = args.phone;
            args.whatsapp = args.whatsapp;
            args.subscribe_start_date = new Date(args.subscribe_start_date);
            this.FormComps.FormGroup.patchValue(args);
            this.getAllInvoice({ id_pelanggan: args.id_pelanggan, page: 1, limit: 5 });
        }, 500);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'change status') {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                message: 'Pelanggan status will be changed',
                header: 'Are you sure?',
                icon: 'pi pi-info-circle',
                acceptButtonStyleClass: "p-button-danger p-button-sm",
                rejectButtonStyleClass: "p-button-secondary p-button-sm",
                acceptIcon: "none",
                acceptLabel: 'Yes, sure',
                rejectIcon: "none",
                rejectLabel: 'No, back',
                accept: () => {
                    this.changeStatusData(args.data);
                }
            });
        }

        if (args.type == 'delete') {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                message: 'Data yang dihapus tidak dapat dikembalikan',
                header: 'Apakah Anda Yakin?',
                icon: 'pi pi-info-circle',
                acceptButtonStyleClass: "p-button-danger p-button-sm",
                rejectButtonStyleClass: "p-button-secondary p-button-sm",
                acceptIcon: "none",
                acceptLabel: 'Iya, yakin',
                rejectIcon: "none",
                rejectLabel: 'Tidak, kembali',
                accept: () => {
                    this.deleteData(args.data);
                }
            });
        }

        if (args.type == 'detail') {
            this.ButtonNavigation = [];
            this.onRowDoubleClicked(args.data);
        }
    }

    onPageChanged(args: any) {
        console.log(args);
    }

    saveData(data: any) {
        delete data.id_pelanggan;
        delete data.is_active;

        data.phone = data.phone ? this._utilityService.onFormatPhoneNumber(data.phone) : "";
        data.whatsapp = data.whatsapp ? this._utilityService.onFormatPhoneNumber(data.whatsapp) : "";

        this._pelangganService
            .create(data)
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
        this._confirmationService.confirm({
            target: (<any>event).target as EventTarget,
            message: 'Data will be updated',
            header: 'Are you sure?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: "p-button-warning p-button-sm",
            rejectButtonStyleClass: "p-button-secondary p-button-sm",
            acceptIcon: "none",
            acceptLabel: 'Yes, sure',
            rejectIcon: "none",
            rejectLabel: 'No, back',
            accept: () => {
                data.phone = data.phone ? this._utilityService.onFormatPhoneNumber(data.phone) : "";
                data.whatsapp = data.whatsapp ? this._utilityService.onFormatPhoneNumber(data.whatsapp) : "";

                this._pelangganService
                    .update(data)
                    .pipe(takeUntil(this.Destroy$))
                    .subscribe((result) => {
                        if (result.status) {
                            this._messageService.clear();
                            this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data updated succesfully' });
                            this.handleBackToList();
                        }
                    })
            }
        });
    }

    private changeStatusData(data: any) {
        this._pelangganService
            .changeStatus(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data updated succesfully' });
                    this.getAll();
                }
            })
    }

    private deleteData(data: any) {
        this._pelangganService
            .delete(data.id_pelanggan)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data deleted succesfully' });
                    this.getAll();
                }
            })
    }

    handleExportHistoryTagihan() {
        this.GridHistoryTagihanComps.onExportExcel();
    }

    handleGoToAddInvoice(id_pelanggan: number) {
        this._router.navigateByUrl(`/tagihan?state=add&id_pelanggan=${id_pelanggan}`);
    }

    handleGoToAddPaymentCash(id_pelanggan: number) {
        this._router.navigateByUrl(`/tagihan?state=add&id_pelanggan=${id_pelanggan}`);
    }

    onToolbarClickedHistoryInvoice(args: any): void {
        if (args.type == 'detail') {
            this._router.navigateByUrl(`/tagihan?state=edit&id_invoice=${args.data.id_invoice}`);
        };

        if (args.type == 'print') {
            if (args.data.payment_status == 'PAID') {
                this._router.navigateByUrl(`/print-out/pos?id_payment=${args.data.id_payment}&id_pelanggan=${args.data.id_pelanggan}`)
            } else {
                this._messageService.clear();
                this._messageService.add({ severity: 'warn', summary: 'Oops', detail: 'Invoice ini belum lunas' });
            }
        }

        if (args.type == 'buat pembayaran') {
            this._router.navigateByUrl(`/pembayaran?state=add&id_pelanggan=${args.data.id_pelanggan}&id_invoice=${args.data.id_invoice}`)
        }
    }

    onPageChangedHistoryInvoice(args: any) {
        const id_pelanggan = this.FormComps.FormGroup.get('id_pelanggan')?.value;
        this.getAllInvoice({
            page: args.page,
            limit: args.limit,
            id_pelanggan
        });
    }
}
