import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './middleware/auth.guard';

const routes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('./pages/authentication/authentication.component')).AuthenticationComponent,
        data: {
            title: 'Sign In'
        }
    },
    {
        path: 'beranda',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./pages/beranda/beranda.component')).BerandaComponent,
        data: {
            title: 'Home',
            breadcrumbs: ['Home']
        }
    },
    {
        path: 'pelanggan',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./pages/pelanggan/pelanggan.component')).PelangganComponent,
        data: {
            title: 'Pelanggan',
            breadcrumbs: ['Home', 'Pelanggan']
        }
    },
    {
        path: 'tagihan',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./pages/invoice/invoice.component')).InvoiceComponent,
        data: {
            title: 'Penjualan',
            breadcrumbs: ['Home', 'Penjualan']
        }
    },
    {
        path: 'pembayaran',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./pages/payment/payment.component')).PaymentComponent,
        data: {
            title: 'Pembayaran',
            breadcrumbs: ['Home', 'Pembayaran']
        }
    },
    {
        path: 'laporan',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./pages/laporan/laporan.routes')).laporanRoutes
    },
    {
        path: '**',
        loadComponent: async () => (await import('./pages/wildcard-not-found/wildcard-not-found.component')).WildcardNotFoundComponent,
        data: {
            title: 'Oops'
        }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
