import { explainGeolocationError } from '@/lib/geolocation';
import L from 'leaflet';
import { LocateFixed, MapPin, Search, X } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

interface LocationPickerProps {
    latitude: string;
    longitude: string;
    onChange: (latitude: string, longitude: string) => void;
    title?: string;
}

const argentinaCenter: [number, number] = [-38.4161, -63.6167];
const geocodingSearchUrl = import.meta.env.VITE_GEOCODING_SEARCH_URL || 'https://nominatim.openstreetmap.org/search';

interface AddressResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

export function LocationPicker({ latitude, longitude, onChange, title = 'Punto del servicio' }: LocationPickerProps) {
    const [status, setStatus] = useState('Hacé clic en el mapa para marcar la ubicación exacta.');
    const [locating, setLocating] = useState(false);
    const [address, setAddress] = useState('');
    const [searching, setSearching] = useState(false);
    const [addressError, setAddressError] = useState('');
    const [results, setResults] = useState<AddressResult[]>([]);
    const hasPosition = Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude)) && latitude !== '' && longitude !== '';
    const position: [number, number] | null = hasPosition ? [Number(latitude), Number(longitude)] : null;

    const locate = () => {
        if (!navigator.geolocation) {
            setStatus('Tu dispositivo no admite geolocalización.');
            return;
        }
        setLocating(true);
        setStatus('Buscando tu ubicación…');
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                onChange(coords.latitude.toFixed(7), coords.longitude.toFixed(7));
                setStatus('Ubicación detectada. Podés ajustarla haciendo clic en el mapa.');
                setLocating(false);
            },
            (error) => {
                setStatus(explainGeolocationError(error).message);
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
        );
    };

    const searchAddress = async (event: FormEvent) => {
        event.preventDefault();
        const query = address.trim();

        if (query.length < 3) {
            setAddressError('Escribí al menos 3 caracteres para buscar una dirección.');
            return;
        }

        setSearching(true);
        setAddressError('');
        setResults([]);

        try {
            const params = new URLSearchParams({
                q: query,
                format: 'jsonv2',
                addressdetails: '1',
                limit: '5',
                countrycodes: 'ar',
            });
            const response = await fetch(`${geocodingSearchUrl}?${params.toString()}`, {
                headers: { 'Accept-Language': 'es-AR,es;q=0.9' },
            });

            if (!response.ok) throw new Error('Address search failed');

            const matches = (await response.json()) as AddressResult[];
            setResults(matches);
            if (!matches.length) setAddressError('No encontramos esa dirección en Argentina. Probá agregando ciudad y provincia.');
        } catch {
            setAddressError('No pudimos consultar direcciones ahora. Podés marcar el punto directamente en el mapa.');
        } finally {
            setSearching(false);
        }
    };

    const chooseAddress = (result: AddressResult) => {
        onChange(Number(result.lat).toFixed(7), Number(result.lon).toFixed(7));
        setAddress(result.display_name);
        setResults([]);
        setAddressError('');
        setStatus('Dirección encontrada. Ajustá el punto en el mapa si es necesario.');
    };

    const clearPosition = () => {
        onChange('', '');
        setAddress('');
        setResults([]);
        setAddressError('');
        setStatus('Hacé clic en el mapa para marcar la ubicación exacta.');
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-blue-200 bg-blue-50">
            <div className="border-b border-blue-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="flex items-center gap-2 font-bold text-slate-950">
                            <MapPin className="size-4 text-blue-700" /> {title}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">{status}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={locate}
                            disabled={locating}
                            className="prolink-secondary shrink-0 disabled:cursor-wait disabled:opacity-60"
                        >
                            <LocateFixed className={`size-4 ${locating ? 'animate-pulse' : ''}`} />
                            {locating ? 'Buscando...' : 'Usar mi ubicación'}
                        </button>
                        {position && (
                            <button type="button" onClick={clearPosition} className="prolink-secondary shrink-0">
                                <X className="size-4" /> Quitar punto
                            </button>
                        )}
                    </div>
                </div>
                <form onSubmit={searchAddress} className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <label className="sr-only" htmlFor="map-address-search">
                        Buscar dirección en Argentina
                    </label>
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            id="map-address-search"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            className="prolink-field w-full pl-10"
                            placeholder="Ej. Av. Colón 100, Córdoba"
                            autoComplete="street-address"
                        />
                    </div>
                    <button type="submit" disabled={searching} className="prolink-primary disabled:cursor-wait disabled:opacity-60">
                        {searching ? 'Buscando...' : 'Buscar dirección'}
                    </button>
                </form>
                {addressError && (
                    <p role="alert" className="mt-2 text-sm font-semibold text-red-700">
                        {addressError}
                    </p>
                )}
                {results.length > 0 && (
                    <div className="mt-2 overflow-hidden rounded-xl border border-blue-200 bg-white shadow-lg">
                        <p className="border-b border-blue-100 px-4 py-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
                            Elegí una coincidencia
                        </p>
                        {results.map((result) => (
                            <button
                                key={result.place_id}
                                type="button"
                                onClick={() => chooseAddress(result)}
                                className="flex w-full items-start gap-2 border-b border-blue-50 px-4 py-3 text-left text-sm text-slate-800 transition last:border-0 hover:bg-blue-50"
                            >
                                <MapPin className="mt-0.5 size-4 shrink-0 text-blue-700" /> {result.display_name}
                            </button>
                        ))}
                    </div>
                )}
                <p className="mt-2 text-xs text-slate-500">Búsqueda limitada a Argentina · Datos de OpenStreetMap</p>
            </div>
            <MapContainer center={position || argentinaCenter} zoom={position ? 14 : 4} className="h-80 w-full" scrollWheelZoom>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ChoosePosition onChange={onChange} />
                <Recenter position={position} />
                {position && <Marker position={position} icon={pickerIcon} />}
            </MapContainer>
        </div>
    );
}

function ChoosePosition({ onChange }: { onChange: LocationPickerProps['onChange'] }) {
    useMapEvents({ click: ({ latlng }) => onChange(latlng.lat.toFixed(7), latlng.lng.toFixed(7)) });
    return null;
}

function Recenter({ position }: { position: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (position && !map.getBounds().contains(position)) map.setView(position, 14);
    }, [map, position]);
    return null;
}

const pickerIcon = L.divIcon({ className: '', html: '<div class="prolink-map-marker">●</div>', iconSize: [42, 42], iconAnchor: [21, 42] });
