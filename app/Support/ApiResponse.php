<?php

namespace App\Support;

class ApiResponse
{
    public static function success($data = null, $message = "OK")
    {
        return response()->json([
            "success" => true,
            "message" => $message,
            "data" => $data
        ]);
    }

    public static function error($message = "Error", $code = 400, $data = null)
    {
        return response()->json([
            "success" => false,
            "message" => $message,
            "data" => $data
        ], $code);
    }
}