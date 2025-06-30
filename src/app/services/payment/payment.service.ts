import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { PaymentModel } from 'src/app/model/pages/payment/payment.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    constructor(
        private _utilityService: UtilityService,
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query?: PaymentModel.IPaymentQueryParams): Observable<PaymentModel.GetAllPayment> {
        if (query?.invoice_date) {
            query.invoice_date = this._utilityService.onFormatDate(new Date(query.invoice_date), 'yyyy-MM-DD');
        };

        return this._httpRequestService.getRequest(`${environment.webApiUrl}/payment`, query);
    }

    getById(id_payment: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/payment/retrieve/${id_payment}`);
    }

    create(payload: PaymentModel.CreatePayment): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/payment`, payload);
    }

    update(payload: PaymentModel.UpdatePayment): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/payment`, payload);
    }

    cancel(id_payment: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/payment/delete/${id_payment}`, null);
    }
}
