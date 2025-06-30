import { Route } from '@angular/router';

export const laporanRoutes: Route[] = [
    {
        path: 'piutang-customer',
        loadComponent: async () => (await import('./piutang-customer/piutang-customer.component')).PiutangCustomerComponent,
        data: {
            title: 'Piutang Customer',
            breadcrumbs: [
                "Home", "Laporan", "Piutang Customer"
            ]
        }
    },
    {
        path: 'umur-piutang-customer',
        loadComponent: async () => (await import('./umur-piutang/umur-piutang.component')).UmurPiutangComponent,
        data: {
            title: 'Umur Piutang Customer',
            breadcrumbs: [
                "Home", "Laporan", "Umur Piutang Customer"
            ]
        }
    },
    {
        path: 'pembayaran-masuk',
        loadComponent: async () => (await import('./pembayaran-masuk/pembayaran-masuk.component')).PembayaranMasukComponent,
        data: {
            title: 'Pembayaran Masuk',
            breadcrumbs: [
                "Home", "Laporan", "Pembayaran Masuk"
            ]
        }
    },
    {
        path: 'rekap-penjualan',
        loadComponent: async () => (await import('./rekap-penjualan/rekap-penjualan.component')).RekapPenjualanComponent,
        data: {
            title: 'Rekap Penjualan',
            breadcrumbs: [
                "Home", "Laporan", "Rekap Penjualan"
            ]
        }
    },
    {
        path: 'riwayat-pembayaran',
        loadComponent: async () => (await import('./riwayat-pembayaran/riwayat-pembayaran.component')).RiwayatPembayaranComponent,
        data: {
            title: 'Riwayat Pembayaran Customer',
            breadcrumbs: [
                "Home", "Laporan", "Riwayat Pembayaran Customer"
            ]
        }
    },
];