import { ReservationDetail } from "@/components/reservation-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReservationPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-8">
      <header className="border-b border-black/10 pb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">Checkout</p>
        <h1 className="mt-2 text-3xl font-semibold">Reservation details</h1>
      </header>
      <ReservationDetail reservationId={id} />
    </main>
  );
}
