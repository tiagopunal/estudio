export type GeolocationFailure = {
    title: string;
    message: string;
};

export function explainGeolocationError(error: GeolocationPositionError): GeolocationFailure {
    if (error.code === error.PERMISSION_DENIED) {
        return {
            title: 'Permiso de ubicación bloqueado',
            message: 'Habilitá la ubicación para este sitio desde el candado del navegador y volvé a intentarlo.',
        };
    }

    if (error.code === error.POSITION_UNAVAILABLE) {
        return {
            title: 'Ubicación no disponible',
            message: 'No pudimos detectar tu posición. Podés intentarlo nuevamente o elegirla manualmente en el mapa.',
        };
    }

    if (error.code === error.TIMEOUT) {
        return {
            title: 'La búsqueda tardó demasiado',
            message: 'Revisá que la ubicación del dispositivo esté activada y volvé a intentarlo.',
        };
    }

    return {
        title: 'No pudimos obtener tu ubicación',
        message: 'Podés volver a intentarlo o seleccionar un punto manualmente en el mapa.',
    };
}
