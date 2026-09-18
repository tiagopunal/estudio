<?php

namespace App\Http\Controllers;

use App\Http\Requests\DemoTopUpRequest;
use App\Models\Payment;
use App\Services\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class WalletController extends Controller
{
    public function __construct(private readonly WalletService $wallets) {}

    public function show(Request $request): Response
    {
        $wallet = $this->wallets->getOrCreateWallet($request->user());
        $this->authorize('view', $wallet);
        $wallet->load(['transactions' => fn ($query) => $query->with(['booking', 'payment'])->latest()]);
        $heldPayments = $request->user()->isProfessional()
            ? Payment::query()
                ->where('status', 'held')
                ->whereHas('booking.service', fn ($query) => $query->where('user_id', $request->user()->id))
                ->with(['booking.service'])
                ->latest('held_at')
                ->get()
            : collect();

        return Inertia::render('Wallet/Index', [
            'wallet' => $wallet,
            'isProfessional' => $request->user()->isProfessional(),
            'heldPayments' => $heldPayments,
        ]);
    }

    public function topUp(DemoTopUpRequest $request): RedirectResponse
    {
        try {
            $wallet = $this->wallets->getOrCreateWallet($request->user());
            $this->authorize('topUp', $wallet);
            $this->wallets->topUpDemo($request->user(), (string) $request->validated('amount'));
        } catch (InvalidArgumentException $exception) {
            return back()->withErrors(['amount' => $exception->getMessage()])->withInput();
        }

        return back()->with('success', 'Saldo simulado acreditado correctamente.');
    }
}