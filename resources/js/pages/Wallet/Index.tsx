import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowDownLeft, ArrowUpRight, WalletCards } from 'lucide-react';

type Transaction = {
    id: number;
    type: string;
    amount: string | number;
    balance_before: string | number;
    balance_after: string | number;
    description: string;
    created_at: string;
    booking?: { id: number } | null;
};

type Props = {
    wallet: {
        available_balance: string | number;
        held_balance: string | number;
        currency: string;
        transactions: Transaction[];
    };
    isProfessional: boolean;
    heldPayments: { id: number; amount: string | number; held_amount?: string | number; release_at: string | null; booking: { id: number; service: { title: string } } }[];
};

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 });

const typeLabels: Record<string, string> = {
    demo_top_up: 'Carga simulada',
    payment_held: 'Pago enviado a custodia',
    payment_released: 'Pago liberado',
    payment_refund: 'Reembolso',
    demo_withdrawal: 'Retiro simulado',
};

export default function WalletIndex({ wallet, isProfessional, heldPayments }: Props) {
    const { errors, flash } = usePage().props as { errors: { amount?: string }; flash?: { success?: string } };
    const form = useForm({ amount: '' });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Mi billetera', href: route('wallet.show') },
    ];

    const submit = (amount: string) => {
        router.post(route('wallet.demoTopUp'), { amount }, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mi billetera" />
            <main className="min-h-full bg-[#f8f7fc]">
                <div className="prolink-page">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <p className="prolink-kicker">Finanzas de la plataforma</p>
                            <h1 className="prolink-title mt-2">Mi billetera</h1>
                            <p className="prolink-subtitle">Billetera simulada para fines académicos. No representa dinero real ni procesa pagos bancarios.</p>
                        </div>
                        <WalletCards className="hidden size-12 text-blue-700 sm:block" />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <section className="prolink-panel border-l-4 border-blue-600 p-6">
                            <p className="text-sm font-bold text-slate-500">{isProfessional ? 'Ingresos liberados' : 'Saldo disponible'}</p>
                            <p className="mt-3 text-4xl font-black text-slate-950">{currency.format(Number(wallet.available_balance))}</p>
                            <p className="mt-2 text-sm text-slate-600">Créditos simulados en ARS para usar dentro de la demo.</p>
                        </section>
                        <section className="prolink-panel border-l-4 border-amber-500 p-6">
                            <p className="text-sm font-bold text-slate-500">Fondos retenidos en custodia</p>
                            <p className="mt-3 text-4xl font-black text-slate-950">{currency.format(Number(wallet.held_balance))}</p>
                            <p className="mt-2 text-sm text-slate-600">No está disponible hasta un reembolso o liberación.</p>
                        </section>
                    </div>

                    {flash?.success && <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">{flash.success}</p>}

                    {!isProfessional && (
                        <section className="prolink-panel mt-8 p-6 sm:p-8">
                            <p className="prolink-kicker">Demo académica</p>
                            <h2 className="mt-2 text-2xl font-bold text-slate-950">Cargar saldo simulado</h2>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {[5000, 10000, 25000, 50000].map((amount) => (
                                    <Button key={amount} type="button" variant="outline" onClick={() => submit(String(amount))} disabled={form.processing}>
                                        {currency.format(amount)}
                                    </Button>
                                ))}
                            </div>
                            <form onSubmit={(event) => { event.preventDefault(); submit(form.data.amount); }} className="mt-5 flex flex-col gap-3 sm:flex-row">
                                <input
                                    value={form.data.amount}
                                    onChange={(event) => form.setData('amount', event.target.value)}
                                    inputMode="decimal"
                                    placeholder="Importe personalizado"
                                    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
                                />
                                <Button type="submit" disabled={form.processing}>Cargar saldo</Button>
                            </form>
                            {errors.amount && <p className="mt-3 text-sm font-semibold text-red-700">{errors.amount}</p>}
                        </section>
                    )}

                    {isProfessional && (
                        <section className="prolink-panel mt-8 p-6 sm:p-8">
                            <p className="prolink-kicker">Pagos de tus servicios</p>
                            <h2 className="mt-2 text-2xl font-bold text-slate-950">Fondos en custodia</h2>
                            {heldPayments.length === 0 ? (
                                <p className="mt-5 rounded-lg bg-slate-50 p-5 text-sm text-slate-600">No tenés pagos retenidos en este momento.</p>
                            ) : (
                                <div className="mt-5 divide-y divide-slate-200">
                                    {heldPayments.map((payment) => (
                                        <div key={payment.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="font-bold text-slate-900">{payment.booking.service.title}</p>
                                                <Link className="text-sm font-bold text-blue-700 hover:underline" href={route('bookings.show', payment.booking.id)}>Ver reserva #{payment.booking.id}</Link>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="font-black text-amber-700">{currency.format(Number(payment.held_amount || payment.amount))}</p>
                                                <p className="text-xs text-slate-500">Se libera al confirmar el cliente o en 60 días</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    <section className="prolink-panel mt-8 p-6 sm:p-8">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="prolink-kicker">Auditoría</p>
                                <h2 className="mt-2 text-2xl font-bold text-slate-950">Movimientos</h2>
                            </div>
                            <span className="text-sm font-bold text-slate-500">{wallet.currency}</span>
                        </div>
                        {wallet.transactions.length === 0 ? (
                            <p className="mt-6 rounded-lg bg-slate-50 p-5 text-sm text-slate-600">Todavía no hay movimientos en tu billetera.</p>
                        ) : (
                            <div className="mt-6 divide-y divide-slate-200">
                                {wallet.transactions.map((transaction) => (
                                    <div key={transaction.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-start gap-3">
                                            {transaction.type === 'payment_held' ? <ArrowDownLeft className="mt-1 size-5 text-amber-600" /> : <ArrowUpRight className="mt-1 size-5 text-emerald-600" />}
                                            <div>
                                                <p className="font-bold text-slate-900">{transaction.description}</p>
                                                <p className="text-sm text-slate-500">{typeLabels[transaction.type] || transaction.type} · {new Date(transaction.created_at).toLocaleString('es-AR')}</p>
                                                <p className="text-xs text-slate-500">Saldo: {currency.format(Number(transaction.balance_before))} → {currency.format(Number(transaction.balance_after))}</p>
                                                {transaction.booking && <Link className="text-sm font-bold text-blue-700 hover:underline" href={route('bookings.show', transaction.booking.id)}>Ver reserva #{transaction.booking.id}</Link>}
                                            </div>
                                        </div>
                                        <p className="font-black text-slate-900">{currency.format(Number(transaction.amount))}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </AppLayout>
    );
}