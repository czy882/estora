// /src/pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/storeApi";
// 1. 引入图标库 (如果还没安装 lucide-react，请运行 npm install lucide-react)
import { Feather, Wind, Sparkles } from "lucide-react"; 

// =============================
// Fade In Up – 全站统一动效
// =============================
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// =============================
// Home Page – Values-First Narrative
// =============================
const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const arr = await getProducts({ per_page: 4, orderby: "menu_order", order: "asc" });

        const mapped = (Array.isArray(arr) ? arr : []).map((p) => {
          const img0 = p?.images?.[0]?.src || null;
          const cents = p?.prices?.price;
          const price = cents != null && cents !== ""
            ? `$${(Number(cents) / 100).toFixed(2)}`
            : "";
          return {
            id: p?.id,
            name: p?.name,
            slug: p?.slug,
            price,
            image: img0,
          };
        });

        if (mounted) setProducts(mapped.filter(Boolean));
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const openProduct = (p) => {
    if (p?.id) {
      navigate(`/products/${p.id}`);
      return;
    }
    if (p?.slug) {
      navigate(`/products/${p.slug}`);
    }
  };

  return (
    <div className="bg-[#f8f6f4] text-[#1d1d1f] selection:bg-[#7c2b3d] selection:text-white">
      {/* ============================= */}
      {/* HERO SECTION */}
      {/* ============================= */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <picture className="absolute inset-0 block">
          <source
            media="(min-width: 768px)"
            srcSet="https://images.unsplash.com/photo-1600185366117-69b6910f02e4?auto=format&fit=crop&w=1600&q=80"
          />
          <img
            src="https://images.unsplash.com/photo-1598300103736-c23ac68a67dd?auto=format&fit=crop&w=800&q=80"
            alt="Hero visual"
            className="h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8f6f4]/80 via-[#f8f6f4]/20 to-transparent" />
        <div className="relative z-10 min-h-screen flex items-end md:items-center">
          <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 pb-20 md:pb-0">
            <FadeIn>
              <div className="max-w-xl">
                <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[#1d1d1f]/60">
                  Redefining intimate comfort
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-[1.1] mb-6">
                  Silk for your most<br /> personal moments.
                </h1>
                <p className="text-lg text-[#1d1d1f]/70 mb-10">
                  Luxury reimagined with nature’s touch.
                </p>
                <button
                  onClick={() =>
                    window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 border border-[#1d1d1f]/30 px-8 py-4 rounded-full text-sm hover:border-[#1d1d1f]/60 transition"
                >
                  Discover more
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* SECTION 1 */}
      {/* ============================= */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-serif font-medium mb-8">
              A material beloved by skin.
            </h2>
            <p className="text-lg text-[#1d1d1f]/70 leading-relaxed">
              Some fabrics are made for appearances.
              Others are made for how they feel against you.
              Silk belongs to the latter — soft, light, and naturally comforting.
            </p>
          </FadeIn>

          <FadeIn delay={120} className="mt-12">
            <img
              src="https://images.unsplash.com/photo-1581093588401-6558b41bfdc9?auto=format&fit=crop&w=1200&q=80"
              alt="Silk texture"
              className="w-full max-w-4xl mx-auto rounded-2xl object-cover h-[400px] md:h-[500px]"
            />
          </FadeIn>
        </div>
      </section>

      {/* ============================= */}
      {/* SECTION 2 */}
      {/* ============================= */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div>
              <h3 className="text-3xl md:text-4xl font-serif font-medium mb-6">
                Cotton made clothes.
                <br />
                Silk made for feeling.
              </h3>
              <p className="text-[#1d1d1f]/70 text-lg leading-relaxed">
                Everyday fabrics serve everyday uses. But when it comes to what touches
                you intimately, the feel — smoothness, breathability, lightness — matters
                more than utility alone.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <img
              src="https://images.unsplash.com/photo-1603978258538-7b8ad3a3eb40?auto=format&fit=crop&w=1200&q=80"
              alt="Silk vs Cotton feel"
              className="w-full rounded-2xl object-cover aspect-[4/3]"
            />
          </FadeIn>
        </div>
      </section>

      {/* ============================= */}
      {/* SECTION 3 */}
      {/* ============================= */}
      <section className="py-28">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <FadeIn>
            <h3 className="text-3xl md:text-4xl font-serif font-medium mb-6">
              Not about trends, but meaning.
            </h3>
            <p className="text-lg text-[#1d1d1f]/70 leading-relaxed">
              We focus on what you feel — not what you read. Quality is not a slogan,
              but an experience that respects your body and your standards.
            </p>
          </FadeIn>

          <FadeIn delay={120} className="mt-12">
            <img
              src="https://images.unsplash.com/photo-1576765607925-7f169f3c4b8e?auto=format&fit=crop&w=1600&q=80"
              alt="Wellness and craft"
              className="w-full rounded-2xl object-cover aspect-[16/9]"
            />
          </FadeIn>
        </div>
      </section>

      {/* ============================= */}
      {/* SECTION 4 — 信任与细节 (已更新图标) */}
      {/* ============================= */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            {
              title: "Feels light all day",
              Icon: Feather, // 使用羽毛图标代表轻盈
            },
            {
              title: "Breathable comfort",
              Icon: Wind, // 使用风图标代表透气
            },
            {
              title: "Refined design",
              Icon: Sparkles, // 使用闪光/星光图标代表精致设计
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 100}>
              <div className="px-6 flex flex-col items-center">
                {/* 2. 替换 img 标签为 SVG 组件 */}
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f8f6f4] text-[#7c2b3d]">
                   <item.Icon strokeWidth={1} className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium mb-2">{item.title}</p>
                <p className="text-sm text-[#1d1d1f]/60">
                  We design every detail with you in mind.
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ============================= */}
      {/* SECTION 5 — 产品阵列 */}
      {/* ============================= */}
      <section className="py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <FadeIn>
              <h3 className="text-3xl md:text-4xl font-serif font-medium mb-6">
                Explore the collection.
              </h3>
              <p className="text-lg text-[#1d1d1f]/70 mb-12">
                Thoughtfully crafted for every moment of your cycle.
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={120}>
            {loading ? (
              <div className="text-center text-sm text-[#1d1d1f]/60">Loading products…</div>
            ) : error ? (
              <div className="text-center text-sm text-[#1d1d1f]/60">
                Failed to load products. {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((p) => (
                  <button
                    key={String(p.id || p.slug)}
                    type="button"
                    onClick={() => openProduct(p)}
                    className="text-left group"
                  >
                    <div className="rounded-2xl bg-black/5 overflow-hidden">
                      <img
                        src={p.image || "https://images.unsplash.com/photo-1506702315536-dd8b83e2dcf9?auto=format&fit=crop&w=800&q=60"}
                        alt={p.name || "Product"}
                        className="w-full aspect-[4/5] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                    <div className="mt-4">
                      <div className="text-base font-medium leading-snug">
                        {p.name || "Product name"}
                      </div>
                      <div className="mt-1 text-sm text-[#1d1d1f]/60">
                        {p.price ? p.price : "Price upon request"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </FadeIn>

          <div className="text-center mt-14">
            <FadeIn delay={220}>
              <button
                onClick={() => navigate("/products")}
                className="inline-flex items-center gap-2 bg-[#7c2b3d] text-white px-10 py-4 rounded-full text-sm hover:opacity-90 transition"
              >
                View products
              </button>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;