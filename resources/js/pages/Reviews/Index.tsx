import { Head, Link, usePage, router } from '@inertiajs/react';
import { Review, User, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import ReviewList from '@/components/review-list';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface IndexProps {
    reviews: Review[];
    mine?: boolean;
    auth?: {
        user?: User;
    };
}

export default function Index({ reviews, mine, auth }: IndexProps) {
    const page = usePage();
    const flash = page.props.flash as { success?: string; error?: string } | undefined;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: mine ? 'Mis reseñas' : 'Reseñas',
            href: '/reviews',
        },
    ];

    const handleDelete = (reviewId: number) => {
        if (!window.confirm('¿Deseas eliminar esta reseña?')) {
            return;
        }

        router.delete(route('reviews.destroy', reviewId), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={mine ? 'Mis reseñas' : 'Reseñas'} />

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">{mine ? 'Mis reseñas' : 'Reseñas del Marketplace'}</h1>
                        <p className="text-sm text-gray-500">
                            {mine
                                ? 'Gestiona tus reseñas y actualiza tus experiencias recientes.'
                                : 'Consulta todas las opiniones publicadas en el marketplace.'}
                        </p>
                    </div>
                    {auth?.user && (
                        <Link
                            href={route('reviews.create')}
                            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Crear reseña
                        </Link>
                    )}
                </div>

                {flash?.success && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {flash?.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                <ReviewList
                    reviews={reviews}
                    currentUserId={auth?.user?.id}
                    onEditReview={(review) => {
                        router.visit(route('reviews.edit', review.id));
                    }}
                    onDeleteReview={handleDelete}
                    emptyMessage="Aún no hay reseñas disponibles. Sé el primero en compartir tu experiencia."
                />
            </div>
        </AppLayout>
    );
}
