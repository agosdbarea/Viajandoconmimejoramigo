/**
 * Utility for sending tracking events to the server-side statistics engine.
 */
export async function trackEvent(
  type: "pageview" | "click" | "search",
  details?: Record<string, any>
) {
  try {
    const res = await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, details }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.warn("Tracking failed with status:", res.status, text);
    }
  } catch (err) {
    // Fail silently in client console to avoid distracting visual warnings
    console.error("Failed to register tracking event:", err);
  }
}
