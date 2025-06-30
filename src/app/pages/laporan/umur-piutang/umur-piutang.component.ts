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
    selector: 'app-umur-piutang',
    standalone: true,
    imports: [
        CommonModule,
        GridComponent,
        DashboardComponent,
    ],
    templateUrl: './umur-piutang.component.html',
    styleUrl: './umur-piutang.component.scss'
})
export class UmurPiutangComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    SettingCompany!: SettingCompanyModel.ISettingCompany;

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

    GridProps: GridModel.IGrid = {
        id: 'Umur-Piutang-Customer',
        column: [
            { field: 'id_pelanggan', headerName: 'Kode Pelanggan', class: 'font-semibold text-sky-500 text-xs', width: '150px' },
            { field: 'full_name', headerName: 'Nama Pelanggan', class: 'text-xs', width: '150px' },
            { field: 'alamat', headerName: 'Alamat', class: 'text-xs', width: '150px' },
            { field: 'invoice_number', headerName: 'No. Penjualan', class: 'text-xs', width: '150px' },
            { field: 'invoice_date', headerName: 'Tgl. Penjualan', class: 'text-xs', format: 'date', width: '150px' },
            { field: 'total_tagihan_max_30_day', headerName: '0 - 30 Hari', class: 'text-xs', format: 'currency', width: '150px' },
            { field: 'total_tagihan_max_60_day', headerName: '31 - 60 Hari', class: 'text-xs', format: 'currency', width: '150px' },
            { field: 'total_tagihan_max_90_day', headerName: '61 - 90 Hari', class: 'text-xs', format: 'currency', width: '150px' },
            { field: 'total_tagihan_more_90_day', headerName: '> 90 Hari', class: 'text-xs', format: 'currency', width: '150px' },
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
            .getLaporanUmurPiutangCustomer(isInit ? query : queries)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data;
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
