import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { InvoiceModel } from 'src/app/model/pages/invoice/invoice.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {

    constructor(
        private _utilityService: UtilityService,
        private _httpRequestService: HttpRequestService,
    ) { }

    getAll(query?: InvoiceModel.IInvoiceQueryParams): Observable<InvoiceModel.GetAllInvoice> {
        if (query?.invoice_date) {
            query.invoice_date = this._utilityService.onFormatDate(new Date(query.invoice_date), 'yyyy-MM-DD');
        };

        return this._httpRequestService.getRequest(`${environment.webApiUrl}/invoice`, query);
    }

    getById(id_invoice: number): Observable<InvoiceModel.GetAllInvoice> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/invoice/retrieve/${id_invoice}`);
    }
}
