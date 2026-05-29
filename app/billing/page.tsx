"use client";

export default function BillingPage() {
  const handleCheckout = async () => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        SmartBite Billing
      </h1>

      <button
        onClick={handleCheckout}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Pay with Stripe
      </button>
    </div>
  );
}