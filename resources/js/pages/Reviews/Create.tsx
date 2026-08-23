import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Booking, User } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

interface CreateProps {
    bookings?: Booking[];
    booking?: Booking;
    selectedServiceId?: number;
    auth?: {
        user?: User;
    };
}

export default function Create({ bookings = [], booking, selectedServiceId }: CreateProps) {
    const page = usePage();
    const flash = page.props.flash as { success?: string; error?: string } | undefined;

    const defaultBookingId = booking ? booking.id : (bookings.find((item) => item.service?.id === selectedServiceId)?.id ?? bookings[0]?.id);

    const { data, setData, post, processing, errors } = useForm({
        booking_id: defaultBookingId,
        rating: 0,
        comment: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('reviews.store'));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Reseñas', href: '/reviews' },
                { title: 'Crear', href: booking ? `/bookings/${booking.id}/reviews/create` : '/reviews/create' },
            ]}
        >
            <Head title="Crear reseña" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Crear reseña</h1>
                        <p className="text-sm text-gray-500">Selecciona una reserva completada y califica tu experiencia.</p>
                    </div>
                    <Link
                        href={route('reviews.index')}
                        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        Volver a reseñas
                    </Link>
                </div>

                {flash?.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={submit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    {booking ? (
                        <div className="space-y-4">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Reserva #{booking.id}</p>
                                <p className="text-lg font-semibold">Servicio: {booking.service?.title}</p>
                            </div>
                            <input type="hidden" name="booking_id" value={booking.id} />
                        </div>
                    ) : bookings.length > 0 ? (
                        <div>
                            <Label htmlFor="booking_id">Reserva</Label>
                            <select
                                id="booking_id"
                                value={data.booking_id}
                                onChange={(event) => setData('booking_id', Number(event.target.value))}
                                className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                            >
                                {bookings.map((bookingItem) => (
                                    <option key={bookingItem.id} value={bookingItem.id}>
                                        Reserva #{bookingItem.id} • servicio: {bookingItem.service?.title}
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

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Guardando...' : 'Crear reseña'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
