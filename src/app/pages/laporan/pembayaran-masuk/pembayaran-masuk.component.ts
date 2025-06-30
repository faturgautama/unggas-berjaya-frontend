import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
    selector: 'app-pembayaran-masuk',
    standalone: true,
    imports: [
        CommonModule,
        GridComponent,
        DashboardComponent,
    ],
    templateUrl: './pembayaran-masuk.component.html',
    styleUrl: './pembayaran-masuk.component.scss'
})
export class PembayaranMasukComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    SettingCompany!: SettingCompanyModel.ISettingCompany;

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

    GridProps: GridModel.IGrid = {
        id: 'Pembayaran-Masuk',
        column: [
            { field: 'payment_number', headerName: 'No. Faktur', class: 'font-semibold text-sky-500 text-xs' },
            { field: 'invoice_number', headerName: 'No. Penjualan', class: 'text-xs' },
            { field: 'full_name', headerName: 'Pelanggan', class: 'text-xs' },
            { field: 'payment_date', headerName: 'Tgl. Pembayaran', class: 'text-xs', format: 'currency' },
            { field: 'payment_amount', headerName: 'Total Bayar', class: 'text-xs', format: 'currency' },
            { field: 'payment_method', headerName: 'Metode Bayar', class: 'text-xs' },
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
                id: 'date',
                placeholder: 'Cari Periode Disini',
                type: 'monthpicker',
            },
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
        private _laporanService: LaporanService,
        private _utilityService: UtilityService,
        private _pelangganService: PelangganService,
    ) { }

    ngOnInit(): void {
        const queries = {
            bulan: this._utilityService.onFormatDate(new Date(), 'M'),
            tahun: this._utilityService.onFormatDate(new Date(), 'yyyy'),
        };
        this.getAll(queries, true);
        this.getAllPelanggan();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query: any, isInit?: boolean) {
        const { date, ...rest } = query;

        const queries = {
            ...rest,
            bulan: this._utilityService.onFormatDate(new Date(date), 'M'),
            tahun: this._utilityService.onFormatDate(new Date(date), 'yyyy'),
        }

        this._laporanService
            .getLaporanPembayaranMasuk(isInit ? query : queries)
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
    };

    private getAllPelanggan() {
        this._pelangganService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.customSearchProps![1].dropdownProps!.options = result.data;
                }
            });
    }

    onSearchGrid(args: any) {
        this.getAll(args);
    }

}
