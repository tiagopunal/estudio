<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API ROUTES
|--------------------------------------------------------------------------
| The frontend is served through Inertia. This keeps a small health endpoint
| available for validation while avoiding duplicate API definitions.
*/
Route::get('/test', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API funcionando correctamente',
    ]);
});
