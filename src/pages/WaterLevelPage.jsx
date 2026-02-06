// src/pages/WaterLevelPage.jsx
import WaterLevel from "../components/WaterLevel";
import SmsSignup from "../components/sms_signup";

export default function WaterLevelPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <WaterLevel />
      <SmsSignup />
    </main>
  );
}
