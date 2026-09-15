const LOCALE = "en-GB";

/** Weather/air-quality categories that should read as a warning. */
const SEVERE_CATEGORIES = new Set([
  "high",
  "very high",
  "extreme",
  "unhealthy for sensitive groups",
  "unhealthy",
  "very unhealthy",
  "hazardous",
]);

/** summary keyword -> icon, in priority order (first match wins). */
const WEATHER_ICONS = [
  ["thunder", "⛈️"],
  ["heavy rain", "🌧️"],
  ["downpour", "🌧️"],
  ["rain", "🌦️"],
  ["shower", "🌦️"],
  ["drizzle", "🌦️"],
  ["snow", "❄️"],
  ["fog", "🌫️"],
  ["haze", "🌫️"],
  ["mist", "🌫️"],
  ["overcast", "☁️"],
  ["partly", "⛅"],
  ["cloud", "☁️"],
  ["clear", "☀️"],
  ["sunny", "☀️"],
];

const PILL_BASE =
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap";

const PILL_TONES = {
  positive: "bg-green-400/10 text-green-400",
  negative: "bg-rose-400/10 text-rose-400",
  neutral: "bg-zinc-800 text-zinc-400",
};

const toDate = (value) => new Date(`${value}T00:00:00`);
const isBlank = (value) => value === null || value === undefined || value === "";

module.exports = function (eleventyConfig) {
  /* ---------------------------------------------------------------- dates */

  // "2026-09-15" -> "15 September 2026"
  eleventyConfig.addFilter("formatDate", (value) =>
    isBlank(value)
      ? "—"
      : toDate(value).toLocaleDateString(LOCALE, {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
  );

  // "2026-09-15" -> "15 Sep" — for section metas, where full dates are too wide.
  eleventyConfig.addFilter("formatDateShort", (value) =>
    isBlank(value)
      ? "—"
      : toDate(value).toLocaleDateString(LOCALE, {
          day: "2-digit",
          month: "short",
        }),
  );

  // { day, month_name, year } -> "3 Rabi' al-thani 1448 AH"
  eleventyConfig.addFilter("formatHijri", (hijri) =>
    hijri ? `${hijri.day} ${hijri.month_name} ${hijri.year} AH` : "",
  );

  /* -------------------------------------------------------------- numbers */

  // 455400 -> "455,400"; 565.46 -> "565.46"
  eleventyConfig.addFilter("formatNumber", (value) => {
    if (isBlank(value)) return "—";
    const num = Number(value);
    return Number.isNaN(num)
      ? value
      : num.toLocaleString("en-US", { maximumFractionDigits: 2 });
  });

  // 455400 -> "Rs. 455,400"
  eleventyConfig.addFilter("formatRupees", function (value) {
    return `Rs. ${eleventyConfig.getFilter("formatNumber")(value)}`;
  });

  // 3315903 -> "3.3M"; 310400 -> "310.4K"
  eleventyConfig.addFilter("formatVolume", (value) => {
    if (isBlank(value)) return "—";
    const num = Number(value);
    if (Number.isNaN(num)) return "—";
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return String(num);
  });

  // 4.42 -> "+4.42"; -2.52 -> "-2.52"; 0 -> "±0.00"
  eleventyConfig.addFilter("formatSigned", (value, decimals = 2) => {
    if (isBlank(value)) return "—";
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    const sign = num > 0 ? "+" : num < 0 ? "" : "±";
    return sign + num.toFixed(decimals);
  });

  /* ------------------------------------------------------- presentational */

  // Maps a weather summary to an icon. Never throws on unknown input.
  eleventyConfig.addFilter("weatherIcon", (summary) => {
    if (!summary) return "🌡️";
    const text = String(summary).toLowerCase();
    const match = WEATHER_ICONS.find(([keyword]) => text.includes(keyword));
    return match ? match[1] : "🌡️";
  });

  // UV / AQI category -> colour class. Keeps the ternaries out of the markup.
  eleventyConfig.addFilter("severityClass", (category) =>
    SEVERE_CATEGORIES.has(String(category || "").toLowerCase())
      ? "text-rose-400"
      : "text-green-400",
  );

  // Signed change -> full class list for a change pill.
  eleventyConfig.addFilter("pillClass", (value) => {
    const num = Number(value);
    const tone =
      !Number.isFinite(num) || num === 0
        ? PILL_TONES.neutral
        : num > 0
          ? PILL_TONES.positive
          : PILL_TONES.negative;
    return `${PILL_BASE} ${tone}`;
  });

  /* ------------------------------------------------------------ shortcode */

  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
