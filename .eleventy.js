module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");

  eleventyConfig.addFilter("formatDate", function (dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  });

  // Short date, e.g. "04 Sep" — used in section metas where full dates are too wide
  eleventyConfig.addFilter("formatDateShort", function (dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  });

  // Maps a weather summary string to a functional emoji icon.
  // Falls back to a generic sun/cloud if nothing matches, never errors on unknown input.
  eleventyConfig.addFilter("weatherIcon", function (summary) {
    if (!summary) return "🌡️";
    const s = summary.toLowerCase();
    if (s.includes("thunder")) return "⛈️";
    if (s.includes("heavy rain") || s.includes("downpour")) return "🌧️";
    if (s.includes("rain") || s.includes("shower")) return "🌦️";
    if (s.includes("drizzle")) return "🌦️";
    if (s.includes("snow")) return "❄️";
    if (s.includes("fog") || s.includes("haze") || s.includes("mist")) return "🌫️";
    if (s.includes("overcast")) return "☁️";
    if (s.includes("partly")) return "⛅";
    if (s.includes("cloud")) return "☁️";
    if (s.includes("clear") || s.includes("sunny")) return "☀️";
    return "🌡️";
  });

  // Formats a raw share-volume integer into a compact "8.5M" / "310.4K" style string.
  eleventyConfig.addFilter("formatVolume", function (value) {
    if (value === null || value === undefined) return "—";
    const num = Number(value);
    if (Number.isNaN(num)) return "—";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return String(num);
  });

  // Formats a plain number with thousands separators, preserving decimals.
  // 470000 -> "470,000", 565.46 -> "565.46", 411250 -> "411,250"
  eleventyConfig.addFilter("formatNumber", function (value) {
    if (value === null || value === undefined) return "—";
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
  });

  // Formats a signed change value with an explicit +/- prefix, e.g. 3.74 -> "+3.74", -3.13 -> "-3.13"
  eleventyConfig.addFilter("formatSigned", function (value, decimals = 2) {
    if (value === null || value === undefined) return "—";
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    const sign = num > 0 ? "+" : num < 0 ? "" : "±";
    return sign + num.toFixed(decimals);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};