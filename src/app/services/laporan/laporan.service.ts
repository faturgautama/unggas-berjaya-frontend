import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LaporanModel } from 'src/app/model/pages/laporan/laporan.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';

@Injectable({
    providedIn: 'root'
})
export class LaporanService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getLaporanPiutangCustomer(query: LaporanModel.QueryBulanTahun): Observable<LaporanModel.GetLaporanPiutangCustomer> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/laporan/piutang-customer`, query);
    }

    getLaporanUmurPiutangCustomer(query: LaporanModel.QueryBulanTahun): Observable<LaporanModel.GetLaporanUmurPiutangCustomer> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/laporan/umur-piutang-customer`, query);
    }

    getLaporanPembayaranMasuk(query: LaporanModel.QueryBulanTahun): Observable<LaporanModel.GetLaporanPembayaranMasuk> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/laporan/pembayaran-masuk`, query);
    }

    getRekapPenjualan(query: LaporanModel.QueryBulanTahun): Observable<LaporanModel.GetRekapitulasiPenjualan> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/laporan/rekapitulasi-penjualan`, query)
            .pipe(
                map((result: any) => {
                    if (result.status) {
                        return {
                            ...result,
                            data: [result.data]
                        }
                    }
                })
            );
    }

    getCustomerPiutangTerbanyak(): Observable<LaporanModel.GetCustomerPiutangTerbanyak> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/laporan/customer-piutang-terbanyak`);
    }

    getRiwayatPembayaran(id_pelanggan: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/laporan/riwayat-pembayaran/${id_pelanggan}`);
    }
}
