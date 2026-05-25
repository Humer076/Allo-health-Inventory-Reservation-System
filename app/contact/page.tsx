import { InfoPage } from "@/components/info-page";

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Contact"
      title="Contact Allo Health"
      description="Reach the operations team for product availability, reservation support, or deployment questions."
    >
      <div className="space-y-4 text-sm leading-7 text-slate-600">
        <p>
          For support, contact your Allo Health operations administrator or inventory systems owner.
        </p>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <p className="font-semibold text-slate-950">Support mailbox</p>
          <p className="mt-1">support@allohealth.example</p>
        </div>
      </div>
    </InfoPage>
  );
}
