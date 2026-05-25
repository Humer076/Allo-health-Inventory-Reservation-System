import { InfoPage } from "@/components/info-page";

export default function ServicesPage() {
  return (
    <InfoPage
      eyebrow="Services"
      title="Inventory reservation services for healthcare teams."
      description="Coordinate stock reservations, fulfillment availability, and reservation activity from one operational dashboard."
    >
      <div className="grid gap-4 text-sm leading-7 text-slate-600 sm:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-base font-semibold text-slate-950">Real-time reservations</h2>
          <p className="mt-2">Hold units during checkout and release expired reservations automatically.</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-base font-semibold text-slate-950">Warehouse visibility</h2>
          <p className="mt-2">Track available, reserved, and total stock across healthcare locations.</p>
        </div>
      </div>
    </InfoPage>
  );
}
