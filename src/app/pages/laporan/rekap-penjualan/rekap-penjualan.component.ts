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
    selector: 'app-rekap-penjualan',
    standalone: true,
    imports: [
        CommonModule,
        GridComponent,
        DashboardComponent,
    ],
    templateUrl: './rekap-penjualan.component.html',
    styleUrl: './rekap-penjualan.component.scss'
})
export class RekapPenjualanComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    SettingCompany!: SettingCompanyModel.ISettingCompany;

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

    GridProps: GridModel.IGrid = {
        id: 'Rekap-Penjualan',
        column: [
            { field: 'bulan', headerName: 'Periode', class: 'font-semibold text-sky-500 text-xs' },
            { field: 'total_penjualan', headerName: 'Total Penjualan', class: 'text-xs', format: 'currency' },
            { field: 'total_invoice', headerName: 'Jumlah Faktur', class: 'text-xs', format: 'number' },
            { field: 'total_piutang', headerName: 'Total Piutang', class: 'text-xs', format: 'currency' },
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
        ],
    };
    GridSelectedData: any;

    constructor(
        private _messageService: MessageService,
        private _laporanService: LaporanService,
        private _utilityService: UtilityService,
    ) { }

    ngOnInit(): void {
        const queries = {
            bulan: this._utilityService.onFormatDate(new Date(), 'M'),
            tahun: this._utilityService.onFormatDate(new Date(), 'yyyy'),
        };
        this.getAll(queries, true);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query: any, isInit?: boolean) {
        const { date, ...rest } = query;

        if (date) {
            const queries = {
                ...rest,
                bulan: this._utilityService.onFormatDate(new Date(date), 'M'),
                tahun: this._utilityService.onFormatDate(new Date(date), 'yyyy'),
            };

            this._laporanService
                .getRekapPenjualan(isInit ? query : queries)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result) {
                        this.GridProps.dataSource = result.data;
                    }
                });
        } else {
            this._messageService.add({ severity: 'warn', summary: 'Oops', detail: 'Filter periode tidak boleh kosong' })
        }
    };

    onSearchGrid(args: any) {
        this.getAll(args);
    }


}
