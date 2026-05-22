import { FormEventHandler } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Booking, BreadcrumbItem, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface CreateProps {
    bookings: Booking[];
    selectedServiceId?: number;
    auth?: {
        user?: User;
    };
}

export default function Create({ bookings }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        booking_id: bookings[0]?.id ?? undefined,
        rating: 0,
        comment: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('reviews.store'));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Reseñas', href: '/reviews' },
            { title: 'Crear', href: '/reviews/create' },
        ]}>
            <Head title="Crear reseña" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Crear nueva reseña</h1>
                        <p className="text-sm text-gray-500">
                            Selecciona una reserva completada y califica tu experiencia.
                        </p>
                    </div>
                    <Link href={route('reviews.index')} className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        Volver a reseñas
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid gap-4">
                        {bookings.length > 0 ? (
                            <div>
                                <Label htmlFor="booking_id">Reserva</Label>
                                <select
                                    id="booking_id"
                                    value={data.booking_id}
                                    onChange={(event) => setData('booking_id', Number(event.target.value))}
                                    className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                                >
                                    {bookings.map((booking) => (
                                        <option key={booking.id} value={booking.id}>
                                            Reserva #{booking.id} • servicio: {booking.service?.title}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.booking_id} />
                            </div>
                        ) : (
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
                                No tienes reservas completadas disponibles para reseñar. Completa una reserva primero y vuelve luego.
                            </div>
                        )}

                        <div>
                            <Label htmlFor="rating">Calificación</Label>
                            <Input
                                id="rating"
                                type="number"
                                min={1}
                                max={5}
                                value={data.rating}
                                onChange={(event) => setData('rating', Number(event.target.value))}
                                placeholder="1 a 5"
                            />
                            <InputError message={errors.rating} />
                        </div>

                        <div>
                            <Label htmlFor="comment">Comentario</Label>
                            <Textarea
                                id="comment"
                                value={data.comment}
                                onChange={(event) => setData('comment', event.target.value)}
                                placeholder="Cuenta cómo fue tu experiencia"
                                rows={5}
                            />
                            <InputError message={errors.comment} />
                        </div>
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Guardando...' : 'Crear reseña'}
                    </Button>
                    {bookings.length === 0 && (
                        <p className="text-sm text-gray-500">
                            No hay reservas completadas disponibles para reseñar.
                        </p>
                    )}
                </form>
            </div>
        </AppLayout>
    );
}
