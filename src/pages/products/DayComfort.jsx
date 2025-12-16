// src/pages/DayComfort.jsx
import React, { useEffect, useMemo, useState } from "react";
import FadeIn from "../../components/FadeIn";
import { fetchProductBySlug } from "../../lib/wpProducts";


// --- WhyDifferent icons (module-scope: do NOT define components during render) ---
const IconSilk = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M3 9c3-2 6-2 9 0s6 2 9 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 13c3-2 6-2 9 0s6 2 9 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.8"
    />
    <path
      d="M3 17c3-2 6-2 9 0s6 2 9 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.6"
    />
  </svg>
);

const IconAir = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M4 10h10c2 0 3-1 3-2 0-1.4-1.2-2.5-2.8-2.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 14h12c2 0 3 1 3 2 0 1.4-1.2 2.5-2.8 2.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.8"
    />
    <path
      d="M4 18h8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.6"
    />
  </svg>
);

const IconClean = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M12 3l7 4v5c0 5-3 8-7 9-4-1-7-4-7-9V7l7-4z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12.2l2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
// ✅ 改成你 Woo 后台 DayComfort 的真实 slug
const DAY_COMFORT_SLUG = "day-comfort";


// ✅ 页面图片资源（统一在顶部管理，便于替换与复用）
const HERO_IMAGE = "https://estora.au/wp-content/uploads/2025/12/hero-image.jpg";
const BREADTH_SCALED = "https://estora.au/wp-content/uploads/2025/12/breadth-scaled.jpg";
const COCOON = "https://estora.au/wp-content/uploads/2025/12/cocoon.jpg";
const CLEAN = "https://estora.au/wp-content/uploads/2025/12/clean.jpg";
const BREATH_COMFORT_SCALED = "https://estora.au/wp-content/uploads/2025/12/breath-comfort-scaled.jpg";
const STAYS_IN_PLACE = "https://estora.au/wp-content/uploads/2025/12/stays-in-place.webp";
const DRY_FEEL_SCALED = "https://estora.au/wp-content/uploads/2025/12/dry-feel-scaled.webp";
const UNNOTICED_COMFORT = "https://estora.au/wp-content/uploads/2025/12/unnoticed-comfort.png";
const MATERIAL_AB = "https://estora.au/wp-content/uploads/2025/12/material-ab.webp"
const MATERIAL_LAYERS = "https://estora.au/wp-content/uploads/2025/12/layers.webp"

// 中文注释：把 Woo / Store API 返回的各种价格结构统一成可展示的字符串
function formatWooPrice(p) {
  if (!p) return "";

  // 1) Woo/自定义接口可能直接给 string，例如 "$24.99" 或 "24.99"
  const direct = p.price ?? p.regular_price ?? p.sale_price;
  if (typeof direct === "string") return direct;

  // 2) Woo Store API（/wc/store/v1）常见结构：p.prices.price 是 cents（字符串/数字）
  const centsLike = p?.prices?.price ?? p?.prices?.regular_price ?? p?.prices?.sale_price;
  if (centsLike !== undefined && centsLike !== null && centsLike !== "") {
    const n = Number(centsLike);
    if (!Number.isNaN(n)) return `$${(n / 100).toFixed(2)}`;
  }

  // 3) Woo REST Products（/wc/v3）常见结构：p.price 是数字字符串（不一定带货币符号）
  if (typeof direct === "number") return `$${direct.toFixed(2)}`;

  // 4) 兜底：如果有 price_html（含 HTML），尽量去掉标签
  if (typeof p.price_html === "string") {
    return p.price_html.replace(/<[^>]*>?/gm, "").trim();
  }

  return "";
}

export default function DayComfort() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchProductBySlug(DAY_COMFORT_SLUG)
      .then((p) => mounted && setProduct(p))
      .catch(() => mounted && setProduct(null));
    return () => {
      mounted = false;
    };
  }, []);

  const buyUrl = useMemo(() => {
    // ✅ 最稳：直接跳 Woo 原生产品购买页
    // 如果没拉到，就用 fallback（也能先跑起来）
    return product?.permalink || `https://estora.au/product/${DAY_COMFORT_SLUG}/`;
  }, [product]);

  const displayPrice = useMemo(() => formatWooPrice(product), [product]);

  return (
    <div className="bg-[#f8f6f4] text-[#1d1d1f]">
      {/* 0. PageShell / 页面壳与全局节奏 */}
      <div className="mx-auto max-w-[2400px] px-6 md:px-10">
        {/* 1. HeroIntro / 首屏产品宣言 */}
        <section className="pt-24 pb-10 md:pt-26 md:pb-14">
          <FadeIn>
            {/* Hero：以情绪大图为主，产品信息作为轻提示（更符合高端品牌节奏） */}
            <div className="relative mt-2 overflow-hidden rounded-3xl border border-[#1d1d1f]/10 bg-white/30">
              {/* 背景图：你后续可以替换成真实主视觉链接 */}
              <img
                src={HERO_IMAGE}
                alt="DayComfort hero"
                className="absolute inset-0 h-full w-full object-cover object-[70%_center] scale-[1.12] md:scale-100"
                loading="eager"
                decoding="async"
              />

              {/* 轻遮罩：只在左侧做渐变提亮，避免整张图发白/变暗 */}
              <div className="absolute inset-0 bg-linear-to-r from-white/65 via-white/25 to-transparent" />

              <div className="relative px-6 py-10 md:px-12 md:py-16 min-h-[58vh] md:min-h-[72vh] flex items-center">
                <div
                  className="max-w-[520px] md:max-w-[640px] space-y-6
                             [text-shadow:0_1px_12px_rgba(255,255,255,0.35)]"
                >
                  <div className="text-[10px] md:text-xs tracking-[0.22em] uppercase text-[#1d1d1f]/70">
                    {/* 轻提示：让用户立刻知道这是“日用 250mm” */}
                    Mulberry silk-touch · 250mm
                  </div>

                  <h1 className="text-3xl md:text-6xl font-semibold tracking-tight leading-[1.02]">
                    DayComfort
                  </h1>

                  <p className="text-base md:text-xl leading-relaxed text-[#1d1d1f]/80 max-w-[34ch] md:max-w-[46ch]">
                    {/* 更克制的分行文案：强调蚕丝触感与干净配方取向 */}
                    Mulberry silk-touch comfort.<br />
                    Breathable, gentle, made<br />
                    without optical brighteners.
                  </p>
                  <div
                    className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4 pt-3"
                  >
                    {/* ✅ 去购买（联动 Woo 产品 permalink） */}
                    <a
                      href={buyUrl}
                      className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium
                                 bg-[#7c2b3d] text-white hover:opacity-90 transition"
                    >
                      Shop
                    </a>

                    {displayPrice ? (
                      <span
                        className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium
                                   border border-[#1d1d1f]/15 bg-white/50 text-[#1d1d1f]/70"
                        aria-label={`Price ${displayPrice}`}
                      >
                        {displayPrice}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* 2. WhyDifferent / 为什么会感觉不一样（承接 Hero，进入理性解释） */}
        <section className="py-7 md:py-10 border-t border-[#1d1d1f]/10">
          {/* 轻量 SVG 图标：不引入新依赖 */}
          {(() => {
            return (
              <>
                <FadeIn>
                  <div className="max-w-[920px]">
                    <h2 className="text-2xl md:text-4xl font-semibold tracking-tight leading-tight">
                      Why it feels different
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-[#1d1d1f]/70 max-w-[70ch] leading-relaxed">
                      Comfort is not one feature. It’s the result of surface feel, airflow, and careful material choices working together.
                    </p>
                  </div>
                </FadeIn>

                {/* 三段式：图文绑定（避免“文字和图片割裂”） */}
                <div className="mt-10 md:mt-12 space-y-10 md:space-y-12">
                  {/* A) Breathable：16:9 大图 + 图内文案（作为段落锚点） */}
                  <FadeIn>
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-[#1d1d1f]/10 bg-black/5">
                      <img
                        src={BREADTH_SCALED}
                        alt="Breathable layering — airy light through translucent layers"
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />

                      {/* 轻遮罩：保证文字可读但不压暗整张图 */}
                      <div className="absolute inset-0 bg-linear-to-r from-white/75 via-white/35 to-transparent" />

                      <div className="absolute inset-0 flex items-end md:items-center">
                        <div className="w-full md:w-[56%] p-6 md:p-10">
                          <div className="flex items-center gap-3 text-[#1d1d1f]/80">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 shrink-0">
                              <IconAir className="h-6 w-6" />
                            </span>
                            <div className="text-[11px] md:text-xs tracking-[0.22em] uppercase text-[#1d1d1f]/60">
                              Breathable layering
                            </div>
                          </div>

                          <h3 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight leading-tight">
                            Airy by design.
                          </h3>
                          <p className="mt-4 text-sm md:text-lg text-[#1d1d1f]/70 leading-relaxed max-w-[60ch]">
                            An airy structure that supports everyday freshness. So comfort feels light and less stuffy through the day.
                          </p>
                        </div>
                      </div>
                    </div>
                  </FadeIn>

                  {/* B) Silk-touch：4:3 左图右文（桌面），移动端纵向 */}
                  <FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
                      <div className="space-y-4 md:space-y-5 md:order-2">
                        <div className="flex items-center gap-3 text-[#1d1d1f]/80">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 shrink-0">
                            <IconSilk className="h-6 w-6" />
                          </span>
                          <div className="text-[11px] md:text-xs tracking-[0.22em] uppercase text-[#1d1d1f]/60">
                            Mulberry silk-touch surface
                          </div>
                        </div>

                        <h3 className="text-2xl md:text-4xl font-semibold tracking-tight leading-tight">
                          Calm, low-friction comfort.
                        </h3>
                        <p className="text-sm md:text-lg text-[#1d1d1f]/70 leading-relaxed max-w-[62ch]">
                          Naturally smooth and refined for a gentle, low-friction feel. Designed to stay calm against the skin.
                        </p>
                      </div>
                      <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-[#1d1d1f]/10 bg-black/5 md:order-1">
                        <img
                          src={COCOON}
                          alt="Mulberry silk fibres — cocoon texture on soft ivory fabric"
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  </FadeIn>

                  {/* C) Clean：1:1 交错（桌面：左文右图），移动端纵向 */}
                  <FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
                      <div className="space-y-4 md:space-y-5 order-1 md:order-1">
                        <div className="flex items-center gap-3 text-[#1d1d1f]/80">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 shrink-0">
                            <IconClean className="h-6 w-6" />
                          </span>
                          <div className="text-[11px] md:text-xs tracking-[0.22em] uppercase text-[#1d1d1f]/60">
                            Made without optical brighteners
                          </div>
                        </div>

                        <h3 className="text-2xl md:text-4xl font-semibold tracking-tight leading-tight">
                          A cleaner material direction.
                        </h3>
                        <p className="text-sm md:text-lg text-[#1d1d1f]/70 leading-relaxed max-w-[62ch]">
                          No fluorescent whitening additives. A cleaner material direction, thoughtfully finished.
                        </p>
                      </div>

                      <div className="relative aspect-square rounded-3xl overflow-hidden border border-[#1d1d1f]/10 bg-black/5 order-2 md:order-2">
                        <img
                          src={CLEAN}
                          alt="Clean material direction — calm, neutral fibres without optical brighteners"
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  </FadeIn>
                </div>
              </>
            );
          })()}
        </section>

        {/* 3. FeatureSectionA / 核心卖点 A：触感与透气（大图段落） */}
        <section id="section-a" className="py-8 md:py-12 border-t border-[#1d1d1f]/10">
          <FadeIn>
            <div className="space-y-6 max-w-[760px]">
              <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">
                Breathable comfort, all day.
              </h3>
              <p className="text-base md:text-lg text-[#1d1d1f]/70 leading-relaxed">
                A silk-touch surface paired with an airy structure that helps reduce that “stuffy” feeling. Designed to stay light and comfortable through everyday hours.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={120} className="mt-7 md:mt-10">
            <div className="relative aspect-square md:aspect-video rounded-3xl bg-black/5 overflow-hidden border border-[#1d1d1f]/10">
              {/* Image: Breathable comfort (16:9) */}
              <img
                src={BREATH_COMFORT_SCALED}
                alt="Breathable comfort — airy light passing through layered silk-touch materials"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </FadeIn>
        </section>

        {/* 4. FeatureSectionB / 核心卖点 B：贴合与稳定（两栏） */}
        <section className="py-8 md:py-12 border-t border-[#1d1d1f]/10">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr] gap-8 md:gap-10 items-start">
            <FadeIn>
              <div className="max-w-[560px] space-y-4 md:pt-2">
                <div className="text-[10px] md:text-xs tracking-[0.22em] uppercase text-[#1d1d1f]/55">
                  Secure fit
                </div>

                <h3 className="text-2xl md:text-4xl font-semibold tracking-tight leading-tight">
                  Stays in place. Feels effortless.
                </h3>

                {/* 更克制的“要点”：弱化列表感，强调轻声补充 */}
                <div className="mt-1 space-y-3 text-base md:text-lg text-[#1d1d1f]/70">
                  <div className="flex items-start gap-3">
                    <span className="mt-[0.65em] h-1.5 w-1.5 rounded-full bg-[#1d1d1f]/30 shrink-0" />
                    <p>Secure fit that stays put</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-[0.65em] h-1.5 w-1.5 rounded-full bg-[#1d1d1f]/30 shrink-0" />
                    <p>Thin, flexible feel</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-[0.65em] h-1.5 w-1.5 rounded-full bg-[#1d1d1f]/30 shrink-0" />
                    <p>Comfortable through everyday movement</p>
                  </div>
                </div>

                <p className="pt-1 text-sm md:text-base text-[#1d1d1f]/55 leading-relaxed max-w-[62ch]">
                  Engineered layering supports a comfortable, drier surface feel.<br /> Without adding a heavy, bulky finish.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <div className="relative aspect-4/3 rounded-3xl bg-black/5 overflow-hidden border border-[#1d1d1f]/10 md:-ml-2">
                {/* Image: stays-in-place (4:3) */}
                <img
                  src={STAYS_IN_PLACE}
                  alt="Stays in place — secure fit through everyday movement"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 5. FeatureSectionC / Dry feel — 图文合一叙事（文字置于图片中） */}
        <section className="py-8 md:py-12 border-t border-[#1d1d1f]/10">
          <FadeIn>
            <div className="mx-auto max-w-[2400px]">
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-[#1d1d1f]/10 bg-black/5">
                {/* Image */}
                <img
                  src={DRY_FEEL_SCALED}
                  alt="Dry feel — refined matte surface texture with a quiet, lightweight finish"
                  className="absolute inset-0 h-full w-full object-cover object-[60%_55%]"
                  loading="lazy"
                  decoding="async"
                />

                {/* Subtle matte / dry highlight */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/25 via-white/5 to-white/20" />

                {/* Copy overlay */}
                <div className="absolute inset-0 flex items-end md:items-center">
                  <div className="w-full md:w-[58%] p-6 md:p-10">
                    <div className="text-[10px] md:text-xs tracking-[0.22em] uppercase text-[#1d1d1f]/60">
                      Dry feel
                    </div>

                    <h3 className="mt-2 text-2xl md:text-4xl font-semibold tracking-tight leading-tight">
                      Dry feel. Without the heavy finish
                    </h3>

                    <p className="mt-3 text-sm md:text-lg text-[#1d1d1f]/75 leading-relaxed max-w-[48ch]">
                      Clean, matte comfort that stays light. Designed to feel calm,
                      breathable, and unobtrusive through the day.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* 6. Unnoticed comfort / 情绪过渡段：沉浸式全宽画面（更强代入感） */}
        <section className="py-10 md:py-14 border-t border-[#1d1d1f]/10">
          <FadeIn>
            <div className="mx-auto max-w-[2400px]">
              <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden border border-[#1d1d1f]/10 bg-black/5">
                {/* Background image */}
                <img
                  src={UNNOTICED_COMFORT}
                  alt="Unnoticed comfort — a quiet everyday moment in a refined home"
                  className="absolute inset-0 h-full w-full object-cover object-[60%_55%]"
                  loading="lazy"
                  decoding="async"
                />

                {/* Soft highlight mask (left-to-right) */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-white/75 via-white/30 to-transparent" />

                {/* Gentle bottom lift for readability */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/0 via-white/0 to-white/12" />

                {/* Copy overlay */}
                <div className="relative h-full flex items-end md:items-center">
                  <div className="w-full md:w-[56%] p-6 md:p-12">
                    <div className="text-[10px] md:text-xs tracking-[0.22em] uppercase text-[#1d1d1f]/60">
                      Unnoticed comfort
                    </div>

                    <h3 className="mt-3 text-2xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
                      Designed to disappear
                      <br className="hidden md:block" />
                      under your day.
                    </h3>

                    <p className="mt-4 text-sm md:text-lg text-[#1d1d1f]/75 leading-relaxed max-w-[52ch]">
                      Quiet comfort that stays out of your thoughts.
                    </p>

                    {/* Keywords */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {["Low-profile", "No-adjust", "All-day calm"].map((k) => (
                        <span
                          key={k}
                          className="inline-flex items-center rounded-full border border-[#1d1d1f]/10 bg-white/65 px-3 py-1 text-xs text-[#1d1d1f]/65"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
        
        {/* 7. Everyday Moments / 日常场景：方案三 - 垂直堆叠，保持左右对齐 */}
          <section className="py-10 md:py-14 border-t border-[#1d1d1f]/10">
              <FadeIn>
                  <div className="mx-auto max-w-[2400px] px-6">
                      
                      {/* Section Header */}
                      <div className="max-w-[780px] mb-8 md:mb-12">
                          <div className="text-[10px] md:text-xs tracking-[0.22em] uppercase text-[#1d1d1f]/60">
                              Everyday moments
                          </div>
                          <h3 className="mt-3 text-2xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
                              Made for real days.
                          </h3>
                          <p className="mt-4 text-sm md:text-lg text-[#1d1d1f]/75 leading-relaxed max-w-[62ch]">
                              A quiet rhythm — designed to feel light, calm, and easy to forget.
                          </p>
                      </div>

                      {/* Main Layout: Top Full-Width Hero + Bottom Full-Width Small Cards */}
                      <div className="grid grid-cols-1 gap-6 items-start">
                          
                          {/* 1. TOP ROW: Full-Width Main Card (Image + Text Side-by-Side) */}
                          <FadeIn className="w-full">
                              <div className="group overflow-hidden rounded-3xl border border-[#1d1d1f]/10 bg-white flex flex-col lg:flex-row">
                                  
                                  {/* A. Image Area — 强制 4:3 */}
                                  <div className="relative aspect-4/3 w-full lg:w-[65%] bg-black/5 overflow-hidden shrink-0 ">
                                    {/* Image Placeholder */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-[#f0f0f0]">
                                      <span className="text-xs text-[#1d1d1f]/40">
                                        Big Image (4:3) – Work & Focus
                                      </span>
                                    </div>

                                    {/* subtle overlay */}
                                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/5 to-transparent" />
                                  </div>

                                  {/* B. Text Content (30% Width on Desktop, Bottom on Mobile) */}
                                  {/* 强制文字区域高度等于图片，并居中文字 */}
                                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-center"> 
                                      <div>
                                          <div className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-[#1d1d1f]/55 mb-2">
                                              Work & Focus
                                          </div>
                                          {/* 修正文字大小和溢出问题 */}
                                          <h4 className="text-xl md:text-2xl font-semibold tracking-tight text-[#1d1d1f] whitespace-normal">
                                              Calm when focus matters.
                                          </h4>
                                          <p className="mt-3 text-sm md:text-base text-[#1d1d1f]/70 leading-relaxed max-w-full">
                                              A clean, matte feel that stays light through the longest days. Designed to be forgotten.
                                          </p>
                                      </div>
                                      
                                      {/* Tags */}
                                      <div className="mt-6 flex flex-wrap gap-2">
                                          {["All-day calm", "Clean feel"].map((tag) => (
                                              <span key={tag} className="px-3 py-1 rounded-full border border-[#1d1d1f]/10 text-[10px] uppercase tracking-wider text-[#1d1d1f]/70">
                                                  {tag}
                                              </span>
                                          ))}
                                      </div>
                                  </div>
                              </div>
                          </FadeIn>

                          {/* 2. BOTTOM ROW: Two Small Cards (Full Width Side-by-Side) */}
                          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                              
                              {/* Left Small Card: Morning */}
                              <FadeIn delay={150} className="w-full">
                                  <div className="group overflow-hidden rounded-3xl border border-[#1d1d1f]/10 bg-white flex flex-col">
                                      
                                      {/* Image Area (Top) - Flatter Aspect Ratio (16:9) */}
                                      <div className="relative aspect-video w-full bg-black/5 overflow-hidden">
                                          <div className="absolute inset-0 flex items-center justify-center bg-[#f4f4f4]">
                                              <span className="text-xs text-[#1d1d1f]/40">Small Image 1 (16:9) - Morning Routine</span>
                                          </div>
                                      </div>

                                      {/* Text Content (Bottom) */}
                                      <div className="p-6">
                                          <div className="text-[10px] tracking-[0.22em] uppercase text-[#1d1d1f]/55 mb-2">
                                              Morning Routine
                                          </div>
                                          <h4 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">
                                              Low-profile start.
                                          </h4>
                                          <p className="mt-2 text-sm text-[#1d1d1f]/70 leading-relaxed">
                                              Quiet under everyday clothing, seamless integration.
                                          </p>
                                      </div>
                                  </div>
                              </FadeIn>

                              {/* Right Small Card: Movement */}
                              <FadeIn delay={250} className="w-full">
                                  <div className="group overflow-hidden rounded-3xl border border-[#1d1d1f]/10 bg-white flex flex-col">
                                      
                                      {/* Image Area (Top) - Flatter Aspect Ratio (16:9) */}
                                      <div className="relative aspect-video w-full bg-black/5 overflow-hidden">
                                          <div className="absolute inset-0 flex items-center justify-center bg-[#f4f4f4]">
                                              <span className="text-xs text-[#1d1d1f]/40">Small Image 2 (16:9) - On the Move</span>
                                          </div>
                                      </div>

                                      {/* Text Content (Bottom) */}
                                      <div className="p-6">
                                          <div className="text-[10px] tracking-[0.22em] uppercase text-[#1d1d1f]/55 mb-2">
                                              On the Move
                                          </div>
                                          <h4 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">
                                              Secure movement.
                                          </h4>
                                          <p className="mt-2 text-sm text-[#1d1d1f]/70 leading-relaxed">
                                              Unobtrusive through your pace, wherever you go.
                                          </p>
                                      </div>
                                  </div>
                              </FadeIn>
                              
                          </div>

                      </div>
                  </div>
              </FadeIn>
          </section>

        {/* 8. Materials / 结构材质图：情绪后给“理性锚点” */}
        <section className="py-10 md:py-14 border-t border-[#1d1d1f]/10">
          <FadeIn>
            <div className="mx-auto max-w-[2400px]">
              {/* Section header */}
              <div className="max-w-[780px] mb-8 md:mb-12">
                <div className="text-[10px] md:text-xs tracking-[0.22em] uppercase text-[#1d1d1f]/60">
                  Materials
                </div>
                <h3 className="mt-3 text-2xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
                  Engineered with intention.
                </h3>
                <p className="mt-4 text-sm md:text-lg text-[#1d1d1f]/75 leading-relaxed max-w-[62ch]">
                  Thoughtful layers, quietly designed for comfort that feels light and unobtrusive.
                </p>
              </div>

              {/* A/B surfaces: centered image, copy below (no side text) */}
              <div className="grid grid-cols-1 gap-6 md:gap-8">
                <FadeIn>
                  <div
                    className="
                      relative aspect-square overflow-hidden bg-black/5
                      border border-[#1d1d1f]/10
                      rounded-2xl md:rounded-3xl

                      /* 📱 Mobile：放大，接近全屏，方便看材质 */
                      w-[92vw] max-w-none mx-auto

                      /* 💻 Desktop：收敛显示，保持高级留白 */
                      md:w-full md:max-w-[420px]
                      lg:max-w-[480px]
                      xl:max-w-[520px]
                    "
                  >
                    <img
                      src={MATERIAL_AB}
                      alt="Material structure — surface and support sides"
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </FadeIn>
              </div>

              {/* Spacer to create “breathing room” between the two explanations */}
              <div className="h-10 md:h-14" />

              {/* Layers diagram: centered image + 3 bullets */}
              <div className="grid grid-cols-1 gap-6 md:gap-8">
                <FadeIn>
                  <div className="max-w-[780px]">
                    <div className="text-[10px] md:text-xs tracking-[0.22em] uppercase text-[#1d1d1f]/55">
                      Built in layers — not bulk
                    </div>
                    <h3 className="mt-3 text-2xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
                      Lightweight, by construction.
                    </h3>
                    <p className="mt-3 text-sm md:text-lg text-[#1d1d1f]/70 leading-relaxed max-w-[62ch]">
                      Layered design supports absorption and airflow — without a heavy, bulky feel.
                    </p>
                  </div>
                </FadeIn>

                <FadeIn delay={120}>
                <div
                  className="
                    relative aspect-square overflow-hidden bg-black/5
                    border border-[#1d1d1f]/10
                    rounded-2xl md:rounded-3xl

                    /* 📱 Mobile：放大，接近全屏 */
                    w-[92vw] max-w-none mx-auto

                    /* 💻 Desktop：收敛，有留白 */
                    md:w-full md:max-w-[420px]
                    lg:max-w-[480px]
                    xl:max-w-[520px]
                  "
                >
                      <img
                        src={MATERIAL_LAYERS}
                        alt="Layered structure — absorbent core and breathable base"
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                  </div>
                </FadeIn>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* 9. Comparison / 对比：蚕丝卫生巾 vs 普通（棉/植物纤维）卫生巾 */}
        <section className="py-10 md:py-14 border-t border-[#1d1d1f]/10">
          <FadeIn>
            <div className="mx-auto max-w-[2400px]">
              {/* Header */}
              <div className="max-w-[780px] mb-5 md:mb-7">
                <div className="text-[10px] md:text-xs tracking-[0.22em] uppercase text-[#1d1d1f]/60">
                  Comparison
                </div>
                <h3 className="mt-3 text-2xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
                  Silk-touch vs. regular pads.
                </h3>
                <p className="mt-4 text-sm md:text-lg text-[#1d1d1f]/75 leading-relaxed max-w-[70ch]">
                  Two materials, two surface feels — shown side by side.
                </p>
              </div>

              {/* Layout:
                  - Mobile/Tablet (lg:hidden): 文案在上，拼接对比图在下（左右两半拼成一张）
                  - Desktop (hidden lg:grid): 保持你现有的左右卡片 + 中间拼接视觉逻辑 */}

              {/* ✅ Mobile / Tablet: text ABOVE, stitched images BELOW */}
              <div className="lg:hidden">
                {/* 文案区：两列（小屏会自动变一列），放在图片上方 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 items-stretch">
                  {/* Regular pads text */}
                  <div className="rounded-3xl border border-[#1d1d1f]/15 bg-[#f1f0ee] p-5">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1.5
                                 text-[11px] font-semibold tracking-[0.14em] uppercase
                                 border border-[#1d1d1f]/15 bg-[#1d1d1f]/[0.06] text-[#1d1d1f]/85"
                    >
                      Regular pads
                    </span>
                    <h4 className="mt-3 text-base font-semibold tracking-tight text-[#1d1d1f]/90">
                      Cotton / plant-fibre blends
                    </h4>
                    <div className="mt-3 space-y-2 text-sm text-[#1d1d1f]/75 leading-relaxed">
                      <p>• Placeholder — common surface texture.</p>
                      <p>• Placeholder — airflow depends on build.</p>
                      <p>• Placeholder — feel varies across brands.</p>
                    </div>
                  </div>

                  {/* Silk-touch pads text */}
                  <div className="rounded-3xl border border-[#1d1d1f]/15 bg-white p-5">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1.5
                                 text-[11px] font-semibold tracking-[0.14em] uppercase
                                 border border-[#7c2b3d]/20 bg-[#7c2b3d]/[0.08] text-[#7c2b3d]"
                    >
                      Mulberry silk-touch
                    </span>
                    <h4 className="mt-3 text-base font-semibold tracking-tight text-[#1d1d1f]">
                      Smoother, calmer feel
                    </h4>
                    <div className="mt-3 space-y-2 text-sm text-[#1d1d1f]/75 leading-relaxed">
                      <p>• Placeholder — silk-touch against skin.</p>
                      <p>• Placeholder — breathable, less stuffy feel.</p>
                      <p>• Placeholder — designed to stay unobtrusive.</p>
                    </div>
                  </div>
                </div>

                {/* 拼接对比图：两张图左右拼接成一张（不再上下堆叠） */}
                <div className="mt-5 md:mt-6 overflow-hidden rounded-3xl border border-[#1d1d1f]/15 bg-black/5">
                  <div className="grid grid-cols-2">
                    {/* Left half — other pads */}
                    <div className="relative aspect-[3/4] bg-black/5">
                      <img
                        src="https://estora.au/wp-content/uploads/2025/12/other-sp.webp"
                        alt="Regular pads — cotton or plant-fibre surface texture"
                        className="absolute inset-0 h-full w-full object-cover
                                   brightness-[0.82] contrast-[0.95] saturate-[0.88]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {/* Right half — silk pads */}
                    <div className="relative aspect-[3/4] bg-black/5">
                      <img
                        src="https://estora.au/wp-content/uploads/2025/12/silk-sp.webp"
                        alt="Mulberry silk-touch pad — smooth, refined surface texture"
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ Desktop: keep your existing side-by-side cards */}
              <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 items-stretch">
                {/* Left: Regular pads (text + image on the RIGHT edge) */}
                <FadeIn className="w-full">
                  <div className="group h-full overflow-hidden rounded-3xl lg:rounded-r-none border border-[#1d1d1f]/15
                bg-[#f1f0ee] text-[#1d1d1f]/85
                flex flex-col lg:flex-row
                lg:min-h-[500px] xl:min-h-[540px]
                transition duration-500 ease-out
                hover:bg-[#e7e5e1]">
                    {/* Text */}
                    <div className="flex-1 p-5 md:p-6">
                      {/* 更醒目的品类标签：让用户一眼看出“对比的两类卫生巾” */}
                      <div className="inline-flex items-center">
                        <span
                          className="inline-flex items-center rounded-full px-3 py-1.5
                                     text-[11px] md:text-xs font-semibold
                                     tracking-[0.14em] uppercase
                                     border border-[#1d1d1f]/15
                                     bg-[#1d1d1f]/[0.06]
                                     text-[#1d1d1f]/85"
                        >
                          Regular pads
                        </span>
                      </div>
                      <h4 className="mt-3 text-lg md:text-xl font-semibold tracking-tight">
                        Cotton / plant-fibre blends
                      </h4>

                      <div className="mt-4 space-y-3 text-sm md:text-base text-[#1d1d1f]/80 leading-relaxed">
                        <p>• Placeholder — common surface texture.</p>
                        <p>• Placeholder — airflow depends on build.</p>
                        <p>• Placeholder — feel varies across brands.</p>
                      </div>
                    </div>

                    {/* Image (RIGHT) — other pads */}
                    <div className="relative w-full lg:w-[48%] aspect-[4/5] lg:aspect-auto lg:h-full bg-black/5 border-t lg:border-t-0 lg:border-l border-[#1d1d1f]/10 overflow-hidden">
                      <img
                        src="https://estora.au/wp-content/uploads/2025/12/other-sp.webp"
                        alt="Regular pads — cotton or plant-fibre surface texture"
                        className="absolute inset-0 h-full w-full object-cover scale-[1.08]
           brightness-[0.85] contrast-[0.95] saturate-[0.85]
           transition duration-500 ease-out
           group-hover:brightness-[0.8]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </FadeIn>

                {/* Right: Silk-touch pads (image on the LEFT edge + text) */}
                <FadeIn delay={120} className="w-full">
                  <div className="group h-full overflow-hidden rounded-3xl lg:rounded-l-none border border-[#1d1d1f]/15
                bg-white
                flex flex-col lg:flex-row
                lg:min-h-[500px] xl:min-h-[540px]
                transition duration-500 ease-out
                hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]
                hover:-translate-y-[2px]">
                    {/* Image (LEFT) — silk pads */}
                    <div className="relative w-full lg:w-[48%] aspect-[4/5] lg:aspect-auto lg:h-full bg-black/5 border-b lg:border-b-0 lg:border-r border-[#1d1d1f]/10 overflow-hidden">
                      <img
                        src="https://estora.au/wp-content/uploads/2025/12/silk-sp.webp"
                        alt="Mulberry silk-touch pad — smooth, refined surface texture"
                        className="absolute inset-0 h-full w-full object-cover scale-[1.05]
           transition duration-500 ease-out
           group-hover:scale-[1.08]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1 p-5 md:p-6">
                      {/* 更醒目的品类标签：突出 Mulberry Silk-touch 的“高级感” */}
                      <div className="inline-flex items-center">
                        <span
                          className="inline-flex items-center rounded-full px-3 py-1.5
                                     text-[11px] md:text-xs font-semibold
                                     tracking-[0.14em] uppercase
                                     border border-[#7c2b3d]/20
                                     bg-[#7c2b3d]/[0.08]
                                     text-[#7c2b3d]"
                        >
                          Mulberry silk-touch
                        </span>
                      </div>
                      <h4 className="mt-3 text-lg md:text-xl font-semibold tracking-tight">
                        Smoother, calmer feel
                      </h4>

                      <div className="mt-4 space-y-3 text-sm md:text-base text-[#1d1d1f]/75 leading-relaxed">
                        <p>• Placeholder — silk-touch against skin.</p>
                        <p>• Placeholder — breathable, less stuffy feel.</p>
                        <p>• Placeholder — designed to stay unobtrusive.</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </FadeIn>
        </section>

      </div>
    </div>
  );
}