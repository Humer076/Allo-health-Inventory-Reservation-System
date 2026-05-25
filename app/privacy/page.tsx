import { InfoPage } from "@/components/info-page";

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Privacy"
      title="Privacy Policy"
      description="How Allo Health handles operational inventory and reservation information."
    >
      <div className="space-y-4 text-sm leading-7 text-slate-600">
        <p>
          Allo Health uses reservation and inventory data only to support product availability,
          fulfillment visibility, and reservation workflows.
        </p>
        <p>
          Access should be limited to authorized team members, and production deployments should use
          secure environment variables for database credentials and automation secrets.
        </p>
      </div>
    </InfoPage>
  );
}
