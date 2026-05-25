import { InfoPage } from "@/components/info-page";

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Terms"
      title="Terms of Use"
      description="Operational terms for using the Allo Health inventory reservation dashboard."
    >
      <div className="space-y-4 text-sm leading-7 text-slate-600">
        <p>
          The dashboard is intended for authorized healthcare inventory workflows, including stock
          review, reservation creation, confirmation, and release.
        </p>
        <p>
          Users are responsible for validating stock movement, reservation outcomes, and fulfillment
          procedures according to their organization&apos;s operating policies.
        </p>
      </div>
    </InfoPage>
  );
}
