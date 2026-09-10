import { Link } from '@inertiajs/react';
import L, { type LatLngBoundsExpression } from 'leaflet';
import { useEffect, useMemo } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

export interface MapService {
    id: number;
    title: string;
    category: string;
    price: number | string;
    location?: string | null;
    latitude: number | string;
    longitude: number | string;
    distance_km?: number | null;
    user: { name: string };
}

interface ServiceMapProps {
    services: MapService[];
    userLocation?: { latitude: number; longitude: number } | null;
    radiusKm?: number;
    className?: string;
    selectedServiceId?: number | null;
    onServiceSelect?: (serviceId: number) => void;
    originLabel?: string;
}

const argentinaCenter: [number, number] = [-38.4161, -63.6167];

export function ServiceMap({
    services,
    userLocation,
    radiusKm,
    className = 'h-[560px]',
    selectedServiceId,
    onServiceSelect,
    originLabel = 'Tu ubicación aproximada',
}: ServiceMapProps) {
    const locatedServices = useMemo(
        () => services.filter((service) => Number.isFinite(Number(service.latitude)) && Number.isFinite(Number(service.longitude))),
        [services],
    );
    const userLatitude = userLocation?.latitude;
    const userLongitude = userLocation?.longitude;
    const points = useMemo(() => {
        const locations = locatedServices.map((service) => [Number(service.latitude), Number(service.longitude)] as [number, number]);
        if (userLatitude != null && userLongitude != null) locations.push([userLatitude, userLongitude]);
        return locations;
    }, [locatedServices, userLatitude, userLongitude]);
    const selectedService = locatedServices.find((service) => service.id === selectedServiceId);

    return (
        <div className={`prolink-map overflow-hidden rounded-3xl border border-blue-200 bg-blue-50 ${className}`}>
            <MapContainer
                center={userLocation ? [userLocation.latitude, userLocation.longitude] : argentinaCenter}
                zoom={userLocation ? 12 : 4}
                className="h-full w-full"
                scrollWheelZoom
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FitMap points={points} />
                <ResizeMap />
                <FocusService service={selectedService} />
                {userLocation && (
                    <>
                        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
                            <Popup>{originLabel}</Popup>
                        </Marker>
                        {radiusKm && (
                            <Circle
                                center={[userLocation.latitude, userLocation.longitude]}
                                radius={radiusKm * 1000}
                                pathOptions={{ color: '#0b4dd8', fillColor: '#3b82f6', fillOpacity: 0.08 }}
                            />
                        )}
                    </>
                )}
                {locatedServices.map((service) => (
                    <Marker
                        key={service.id}
                        position={[Number(service.latitude), Number(service.longitude)]}
                        icon={service.id === selectedServiceId ? selectedServiceIcon : serviceIcon}
                        eventHandlers={{ click: () => onServiceSelect?.(service.id) }}
                        zIndexOffset={service.id === selectedServiceId ? 1000 : 0}
                    >
                        <Popup minWidth={220}>
                            <p className="text-xs font-bold tracking-wider text-blue-700 uppercase">{service.category}</p>
                            <h3 className="mt-1 text-base font-bold text-slate-950">{service.title}</h3>
                            <p className="mt-1 text-sm text-slate-600">{service.user.name}</p>
                            {service.location && <p className="mt-1 text-sm text-slate-600">{service.location}</p>}
                            <div className="mt-3 flex items-center justify-between gap-3">
                                <strong className="text-blue-700">{formatArs(service.price)}</strong>
                                {service.distance_km != null && <span className="text-xs text-slate-500">A {service.distance_km} km</span>}
                            </div>
                            <Link href={route('services.show', service.id)} className="mt-3 inline-flex font-bold text-blue-700">
                                Ver servicio →
                            </Link>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

function ResizeMap() {
    const map = useMap();

    useEffect(() => {
        const resize = () => map.invalidateSize();
        const frame = requestAnimationFrame(resize);
        window.addEventListener('resize', resize);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', resize);
        };
    }, [map]);

    return null;
}

function FocusService({ service }: { service?: MapService }) {
    const map = useMap();

    useEffect(() => {
        if (!service) return;
        map.flyTo([Number(service.latitude), Number(service.longitude)], Math.max(map.getZoom(), 14), { duration: 0.6 });
    }, [map, service]);

    return null;
}

function FitMap({ points }: { points: [number, number][] }) {
    const map = useMap();
    const bounds = useMemo<LatLngBoundsExpression | null>(() => (points.length ? points : null), [points]);

    useEffect(() => {
        if (!bounds) return;
        if (points.length === 1) map.setView(points[0], 13);
        else map.fitBounds(bounds, { padding: [44, 44], maxZoom: 13 });
    }, [bounds, map, points]);

    return null;
}

const serviceIcon = L.divIcon({
    className: '',
    html: '<div class="prolink-map-marker">$</div>',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -40],
});
const selectedServiceIcon = L.divIcon({
    className: '',
    html: '<div class="prolink-map-marker prolink-map-marker-selected">$</div>',
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -46],
});
const userIcon = L.divIcon({ className: '', html: '<div class="prolink-user-marker"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });

function formatArs(value: number | string) {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(value));
}
