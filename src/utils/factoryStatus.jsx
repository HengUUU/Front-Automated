import factoriesKh from "./real_factory_info.json";

export function categorizeFactories(data) {
  const thresholds = { ph: { min: 5.5, max: 9 }, cod: 120, ss: 100 };
  const green = [], yellow = [], red = [], gray = [];

  data.forEach(factory => {
    const { avg_parame } = factory;
    const mapLatLong = factoriesKh.find(kh => kh.Id === factory.device_ids)?.mapLatLong;

    if (!avg_parame || avg_parame.ph == null || avg_parame.cod == null || avg_parame.ss == null ||
      (avg_parame.ph === 0 && avg_parame.cod === 0 && avg_parame.ss === 0)) {
      gray.push({ ...factory, mapLatLong });
      return;
    }

    let exceedCount = 0;
    if (avg_parame.ph < thresholds.ph.min || avg_parame.ph > thresholds.ph.max) exceedCount++;
    if (avg_parame.cod >= thresholds.cod) exceedCount++;
    if (avg_parame.ss >= thresholds.ss) exceedCount++;

    if (exceedCount === 1) {
      yellow.push({ ...factory, mapLatLong });
    } else if (exceedCount >= 2) {
      red.push({ ...factory, mapLatLong });
    } else {
      green.push({ ...factory, mapLatLong });
    }
  });

  return { green, yellow, red, gray };
}