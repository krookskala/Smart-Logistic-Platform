const DELIVERY_STEPS = ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];

type DeliveryStageStripProps = {
  status: string;
};

function getStepIndex(status: string) {
  return DELIVERY_STEPS.indexOf(status);
}

export default function DeliveryStageStrip({
  status
}: DeliveryStageStripProps) {
  const currentStepIndex = getStepIndex(status);

  return (
    <div className="mt-4 grid gap-2 md:grid-cols-4">
      {DELIVERY_STEPS.map((step, index) => {
        const isCurrent = step === status;
        const isCompleted = currentStepIndex >= index && currentStepIndex !== -1;

        return (
          <div
            key={step}
            className={`rounded-[18px] border px-3 py-3 text-center ${
              isCurrent
                ? "border-slate-900 bg-slate-900"
                : isCompleted
                ? "border-teal-200 bg-teal-50"
                : "border-slate-200 bg-slate-50/80"
            }`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-[0.14em] ${
                isCurrent
                  ? "text-white"
                  : isCompleted
                  ? "text-teal-800"
                  : "text-slate-500"
              }`}
            >
              {step.replace("_", " ")}
            </p>
          </div>
        );
      })}
    </div>
  );
}
