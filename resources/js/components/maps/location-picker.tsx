import { explainGeolocationError } from '@/lib/geolocation';
import L from 'leaflet';
import { LocateFixed, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

interface LocationPickerProps {
    latitude: string;
    longitude: string;
    onChange: (latitude: string, longitude: string) => void;
}

const argentinaCenter: [number, number] = [-38.4161, -63.6167];

export function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
    const [status, setStatus] = useState('Hacé clic en el mapa para marcar la ubicación exacta.');
    const [locating, setLocating] = useState(false);
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

    return (
        <div className="overflow-hidden rounded-2xl border border-blue-200 bg-blue-50">
            <div className="flex flex-col gap-3 border-b border-blue-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="flex items-center gap-2 font-bold text-slate-950">
                        <MapPin className="size-4 text-blue-700" /> Punto del servicio
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{status}</p>
                </div>
                <button
                    type="button"
                    onClick={locate}
                    disabled={locating}
                    className="prolink-secondary shrink-0 disabled:cursor-wait disabled:opacity-60"
                >
                    <LocateFixed className={`size-4 ${locating ? 'animate-pulse' : ''}`} /> {locating ? 'Buscando...' : 'Usar mi ubicación'}
                </button>
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
