import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Service } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { LoaderCircle, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

type ServiceFormData = {
    title: string;
    description: string;
    price: string;
    category: string;
    latitude: string;
    longitude: string;
};

type Props = {
    service?: Service;
    submitLabel: string;
    submitUrl: string;
    method?: 'post' | 'put';
};

export default function ServiceForm({ service, submitLabel, submitUrl, method = 'post' }: Props) {
    const { data, setData, post, put, processing, errors } = useForm<ServiceFormData>({
        title: service?.title ?? '',
        description: service?.description ?? '',
        price: service ? String(service.price) : '',
        category: service?.category ?? '',
        latitude: service ? String(service.latitude) : '',
        longitude: service ? String(service.longitude) : '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        if (method === 'put') {
            put(submitUrl);
            return;
        }

        post(submitUrl);
    };

    return (
        <form onSubmit={submit} className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="title">Titulo</Label>
                    <Input id="title" value={data.title} onChange={(event) => setData('title', event.target.value)} disabled={processing} />
                    <InputError message={errors.title} />
                </div>

                <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="description">Descripcion</Label>
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(event) => setData('description', event.target.value)}
                        disabled={processing}
                        rows={5}
                        className="border-input bg-background ring-offset-background focus-visible:ring-ring min-h-32 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <InputError message={errors.description} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="price">Precio</Label>
                    <Input id="price" type="number" min="0" step="0.01" value={data.price} onChange={(event) => setData('price', event.target.value)} disabled={processing} />
                    <InputError message={errors.price} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input id="category" value={data.category} onChange={(event) => setData('category', event.target.value)} disabled={processing} />
                    <InputError message={errors.category} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="latitude">Latitud</Label>
                    <Input id="latitude" type="number" step="0.0000001" value={data.latitude} onChange={(event) => setData('latitude', event.target.value)} disabled={processing} />
                    <InputError message={errors.latitude} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="longitude">Longitud</Label>
                    <Input id="longitude" type="number" step="0.0000001" value={data.longitude} onChange={(event) => setData('longitude', event.target.value)} disabled={processing} />
                    <InputError message={errors.longitude} />
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={processing}>
                    {processing ? <LoaderCircle className="animate-spin" /> : <Save />}
                    {submitLabel}
                </Button>
                <Button asChild variant="outline" type="button">
                    <Link href="/services">Cancelar</Link>
                </Button>
            </div>
        </form>
    );
}
