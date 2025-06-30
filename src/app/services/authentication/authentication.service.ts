import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationModel } from 'src/app/model/pages/authentication/authentication.model';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    UserData$ = new BehaviorSubject<AuthenticationModel.IAuthentication>({} as any);

    SidebarMenu$ = new BehaviorSubject<any[]>([
        {
            "id_user_group_menu": 2,
            "id_menu": 2,
            "menu": "Pelanggan",
            "icon": "pi pi-user",
            "url": "/pelanggan",
            "id_parent": null,
            "is_active": true,
            "create_at": "2025-02-04T06:41:56.809Z",
            "create_by": 1,
            "update_at": null,
            "update_by": null,
            "is_assigned": true,
            "child": []
        },
        {
            "id_user_group_menu": 3,
            "id_menu": 3,
            "menu": "Penjualan",
            "icon": "pi pi-receipt",
            "url": "/tagihan",
            "id_parent": null,
            "is_active": true,
            "create_at": "2025-02-04T06:42:27.763Z",
            "create_by": 1,
            "update_at": "2025-02-19T04:11:39.251Z",
            "update_by": 2,
            "is_assigned": true,
            "child": []
        },
        {
            "id_user_group_menu": 4,
            "id_menu": 4,
            "menu": "Pembayaran",
            "icon": "pi pi-wallet",
            "url": "/pembayaran",
            "id_parent": null,
            "is_active": true,
            "create_at": "2025-02-04T06:42:38.728Z",
            "create_by": 1,
            "update_at": "2025-02-19T04:12:15.557Z",
            "update_by": 2,
            "is_assigned": true,
            "child": []
        },
        {
            "id_user_group_menu": 5,
            "id_menu": 5,
            "menu": "Laporan",
            "icon": "pi pi-folder",
            "url": "/laporan",
            "id_parent": null,
            "is_active": true,
            "create_at": "2025-02-04T06:42:45.272Z",
            "create_by": 1,
            "update_at": "2025-02-19T04:14:40.043Z",
            "update_by": 2,
            "is_parent": true,
            "is_assigned": true,
            "toggle_child": false,
            "child": [
                {
                    "id_user_group_menu": 20,
                    "id_menu": 19,
                    "menu": "Piutang Customer",
                    "icon": "pi pi-calculator",
                    "url": "/laporan/piutang-customer",
                    "id_parent": 5,
                    "is_active": true,
                    "create_at": "2025-03-14T09:12:55.906Z",
                    "create_by": 3,
                    "update_at": "2025-03-14T13:07:26.151Z",
                    "update_by": 3,
                    "is_assigned": true,
                    "child": []
                },
                {
                    "id_user_group_menu": 20,
                    "id_menu": 20,
                    "menu": "Umur Piutang Customer",
                    "icon": "pi pi-wave-pulse",
                    "url": "/laporan/umur-piutang-customer",
                    "id_parent": 5,
                    "is_active": true,
                    "create_at": "2025-03-14T09:12:55.906Z",
                    "create_by": 3,
                    "update_at": "2025-03-14T13:07:26.151Z",
                    "update_by": 3,
                    "is_assigned": true,
                    "child": []
                },
                {
                    "id_user_group_menu": 20,
                    "id_menu": 21,
                    "menu": "Rekap Penjualan",
                    "icon": "pi pi-shop",
                    "url": "/laporan/rekap-penjualan",
                    "id_parent": 5,
                    "is_active": true,
                    "create_at": "2025-03-14T09:12:55.906Z",
                    "create_by": 3,
                    "update_at": "2025-03-14T13:07:26.151Z",
                    "update_by": 3,
                    "is_assigned": true,
                    "child": []
                },
                {
                    "id_user_group_menu": 20,
                    "id_menu": 22,
                    "menu": "Pembayaran Masuk",
                    "icon": "pi pi-arrow-down-right",
                    "url": "/laporan/pembayaran-masuk",
                    "id_parent": 5,
                    "is_active": true,
                    "create_at": "2025-03-14T09:12:55.906Z",
                    "create_by": 3,
                    "update_at": "2025-03-14T13:07:26.151Z",
                    "update_by": 3,
                    "is_assigned": true,
                    "child": []
                },
                {
                    "id_user_group_menu": 20,
                    "id_menu": 23,
                    "menu": "Riwayat Pembayaran",
                    "icon": "pi pi-images",
                    "url": "/laporan/riwayat-pembayaran",
                    "id_parent": 5,
                    "is_active": true,
                    "create_at": "2025-03-14T09:12:55.906Z",
                    "create_by": 3,
                    "update_at": "2025-03-14T13:07:26.151Z",
                    "update_by": 3,
                    "is_assigned": true,
                    "child": []
                },
            ]
        },
    ]);

    constructor(
        private _cookieService: CookieService,
        private _httpRequestService: HttpRequestService,
    ) { }

    signIn(payload: AuthenticationModel.ISignIn): Observable<AuthenticationModel.SignIn> {
        return this._httpRequestService
            .postRequest(`${environment.webApiUrl}/authentication/login`, payload)
            .pipe(
                tap((result) => {
                    if (result.status) {
                        this.handleSignIn(result.data);
                    }
                })
            )
    }

    getProfile(loginResult: any) {
        localStorage.removeItem("_LBS_MENU_");

        this._httpRequestService
            .getRequest(`${environment.webApiUrl}/authentication/profile`)
            .pipe(
                tap((result) => {
                    if (result.status) {

                    }
                })
            )
            .subscribe((result) => {
                const newRes = {
                    ...loginResult,
                    ...result.data,
                };

                localStorage.setItem("_LBS_UD_", JSON.stringify(newRes));
                this.setMenu(result.data.id_user_group)
            })
    }

    setUserData() {
        const user_data = localStorage.getItem("_LBS_UD_");
        const layanan_data = localStorage.getItem("_LBS_UD_");
        this.UserData$.next({ ...JSON.parse(user_data as any), ...JSON.parse(layanan_data as any) });
    }

    getUserData() {
        const user_data = localStorage.getItem("_LBS_UD_");
        const layanan_data = localStorage.getItem("_LBS_UD_");
        return { ...JSON.parse(user_data as any), ...JSON.parse(layanan_data as any) };
    }

    setMenu(id_user_group: number) {

    }

    private handleSignIn(data: AuthenticationModel.IAuthentication) {
        localStorage.clear();
        localStorage.setItem("_LBS_UD_", JSON.stringify(data));
        setTimeout(() => {
            this.getProfile(data);
        }, 1000);
    }
}
