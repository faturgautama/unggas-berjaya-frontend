import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { SettingCompanyModel } from 'src/app/model/pages/setup-data/setting-company.model';
import { LaporanService } from 'src/app/services/laporan/laporan.service';
import { PelangganService } from 'src/app/services/pelanggan/pelanggan.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-riwayat-pembayaran',
    standalone: true,
    imports: [
        CommonModule,
        GridComponent,
        DashboardComponent,
    ],
    templateUrl: './riwayat-pembayaran.component.html',
    styleUrl: './riwayat-pembayaran.component.scss'
})
export class RiwayatPembayaranComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    SettingCompany!: SettingCompanyModel.ISettingCompany;

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

    GridProps: GridModel.IGrid = {
        id: 'Riwayat-Pembayaran',
        column: [
            { field: 'invoice_number', headerName: 'No. Penjualan', class: 'font-semibold text-sky-500 text-xs' },
            { field: 'payment_number', headerName: 'No. Pembayaran', class: 'text-xs' },
            { field: 'payment_date', headerName: 'Tgl. Pembayaran', class: 'text-xs', format: 'date' },
            { field: 'full_name', headerName: 'Nama Pelanggan', class: 'text-xs' },
            { field: 'payment_amount', headerName: 'Total Bayar', class: 'text-xs', format: 'currency' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        showPaging: true,
        showSearch: true,
        showSort: false,
        searchKeyword: 'role',
        searchPlaceholder: 'Find Role Name Here',
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'id_pelanggan',
                placeholder: 'Cari Pelanggan Disini',
                type: 'dropdown',
                dropdownProps: {
                    options: [],
                    optionName: 'full_name',
                    optionValue: 'id_pelanggan'
                }
            },
        ],
    };
    GridSelectedData: any;

    constructor(
        private _messageService: MessageService,
        private _laporanService: LaporanService,
        private _utilityService: UtilityService,
        private _pelangganService: PelangganService,
    ) { }

    ngOnInit(): void {
        this.getAllPelanggan();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query: any) {
        if (query.id_pelanggan) {
            this._laporanService
                .getRiwayatPembayaran(query.id_pelanggan)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result) {
                        this.GridProps.dataSource = result.data;
                    }
                });
        } else {
            this._messageService.clear();
            this._messageService.add({ severity: 'warn', summary: 'Oops', detail: 'Mohon isikan semua filter' })
        }
    };

    private getAllPelanggan() {
        this._pelangganService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.customSearchProps![0].dropdownProps!.options = result.data;
                }
            });
    }

    onSearchGrid(args: any) {
        this.getAll(args);
    }

}
