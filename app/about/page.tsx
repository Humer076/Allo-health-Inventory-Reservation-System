import { InfoPage } from "@/components/info-page";

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="About Allo Health"
      title="Healthcare inventory that stays ready for care."
      description="Allo Health helps care teams reserve, track, and release critical inventory with simple real-time controls."
    >
      <div className="space-y-4 text-sm leading-7 text-slate-600">
        <p>
          Allo Health is built for healthcare operations teams that need clear visibility into
          product availability across medical hubs, fulfillment centers, and care locations.
        </p>
        <p>
          The reservation workflow helps prevent overselling, keeps reserved stock accountable, and
          releases expired holds back into available inventory.
        </p>
      </div>
    </InfoPage>
  );
}
