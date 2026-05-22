type Driver = {
  id: string;
  lat: number;
  lng: number;
  active?: boolean;

  // 🧠 NEW: reliability score (0 - 1)
  reliability?: number;

  // 🧠 NEW: rejection tracking
  rejectedOrders?: number;
};

type Order = {
  pickup_lat: number;
  pickup_lng: number;
  drop_lat: number;
  drop_lng: number;

  // 🧠 NEW: priority level
  priority?: "low" | "normal" | "high";
};

const EARTH_RADIUS_KM = 6371;

const AVG_SPEED_KMH = 40;

// 📍 Haversine Distance Formula
export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;
  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(
      (lat1 * Math.PI) / 180
    ) *
      Math.cos(
        (lat2 * Math.PI) / 180
      ) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return EARTH_RADIUS_KM * c;
}

// 🧠 DRIVER SCORING ENGINE (UPGRADED)
function scoreDriver(
  driver: Driver,
  order: Order
) {
  const distance = getDistance(
    driver.lat,
    driver.lng,
    order.pickup_lat,
    order.pickup_lng
  );

  // 🧠 reliability boost
  const reliability =
    driver.reliability ?? 1;

  // 🧠 rejection penalty
  const rejectionPenalty =
    (driver.rejectedOrders ?? 0) *
    5;

  // 🧠 priority boost
  const priorityBoost =
    order.priority === "high"
      ? 10
      : order.priority === "low"
      ? -5
      : 0;

  // FINAL SCORE ENGINE
  const score =
    (100 - distance * 10) *
      reliability +
    priorityBoost -
    rejectionPenalty;

  return {
    score,
    distance,
    reliability,
  };
}

// 🚗 MAIN AI DISPATCH ENGINE (UPGRADED)
export function assignBestDriver(
  drivers: Driver[],
  order: Order
) {
  const availableDrivers =
    drivers.filter((d) => d.active);

  if (
    availableDrivers.length === 0
  )
    return null;

  let bestDriver: Driver | null =
    null;

  let bestScore = -Infinity;

  for (const driver of availableDrivers) {
    const { score } = scoreDriver(
      driver,
      order
    );

    if (score > bestScore) {
      bestScore = score;
      bestDriver = driver;
    }
  }

  return bestDriver;
}

// ⏱ ETA ENGINE (UPGRADED)
export function calculateETA(
  driver: Driver,
  order: Order
) {
  const distance = getDistance(
    driver.lat,
    driver.lng,
    order.pickup_lat,
    order.pickup_lng
  );

  // 🧠 dynamic speed adjustment
  const speedMultiplier =
    driver.reliability ?? 1;

  const etaMinutes =
    (distance / (AVG_SPEED_KMH * speedMultiplier)) *
    60;

  return Math.max(
    1,
    Math.round(etaMinutes)
  );
}

// 🔁 FAILOVER SYSTEM (REASSIGN LOGIC)
export function penalizeDriver(
  driver: Driver,
  drivers: Driver[]
) {
  return drivers.map((d) => {
    if (d.id === driver.id) {
      return {
        ...d,
        rejectedOrders:
          (d.rejectedOrders ?? 0) +
          1,
        reliability:
          Math.max(
            0.3,
            (d.reliability ?? 1) -
              0.1
          ),
      };
    }
    return d;
  });
}