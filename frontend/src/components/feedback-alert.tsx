import { FeedbackState } from "../lib/types";

type FeedbackAlertProps = {
  feedback: FeedbackState;
};

export default function FeedbackAlert({ feedback }: FeedbackAlertProps) {
  if (!feedback) {
    return null;
  }

  return (
    <div
      className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
        feedback.type === "success"
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      {feedback.message}
    </div>
  );
}
