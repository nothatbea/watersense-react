// src/components/sms_signup.jsx
import { useState } from "react";
import { SMS_API } from "../services/api";

export default function SmsSignup() {
  const [phone, setPhone] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(SMS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phone,
          location: "Barangay Lingga"
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed");
      }

      alert("✅ " + data.message);
      setPhone("");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="card card-comfortable">
      <h3 className="text-lg font-semibold mb-2">
        Get Water Level Alerts
      </h3>

      <form onSubmit={submit} className="space-y-4">
        <input
          className="input"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="09XXXXXXXXX"
          required
          pattern="[0-9]{11}"
          maxLength={11}
        />

        <button className="btn btn-primary w-full">
          Sign Up for Alerts
        </button>
      </form>
    </div>
  );
}
