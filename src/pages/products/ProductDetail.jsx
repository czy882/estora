import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Minus, Plus, Loader2, X } from "lucide-react";
import Button from "../../components/Button";
import { getProductById } from "../../services/storeApi";
import { useCart } from "../../store/cartStore";

// 中文注释：去除 HTML（用于短简介展示，避免直接渲染 HTML）
const stripHtml = (html) => (html ? html.replace(/<[^>]*>?/gm, "") : "");

// 中文注释：把 Store API 的价格（通常是 cents）转成展示用金额
const formatPrice = (product) => {
  const cents = product?.prices?.price;
  if (cents === undefined || cents === null || cents === "") return "";
  const n = Number(cents);
  if (Number.isNaN(n)) return "";
  return `$${(n / 100).toFixed(2)}`;
};

// ✅ 关键修复：统一得到“可用于 CoCart 的产品数字 ID”
const getNumericProductId = (product, routeId) => {
  // 优先 product.id（Woo Store API 一般有）
  const candidates = [
    product?.id,
    product?.databaseId,
    product?.product_id,
    routeId, // 最后兜底用路由参数
  ];

  for (const v of candidates) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
};

const ProductDetail = () => {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const { addItem, updating: cartUpdating } = useCart(); // ✅ cartStore 里现在用 updating

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [product, setProduct] = useState(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [qty, setQty] = useState(1);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const overlayRef = useRef(null);

  // 拉取产品
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setPageError(null);

        const data = await getProductById(routeId);
        setProduct(data);

        setActiveIndex(0);
        setQty(1);
      } catch (e) {
        console.error(e);
        setPageError(e?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [routeId]);

  // 图片数组
  const images = useMemo(() => {
    const arr = product?.images;
    if (Array.isArray(arr) && arr.length > 0) return arr;
    return [{ src: "https://placehold.co/1200x1600/f8f6f4/7c2b3d?text=No+Image", alt: "No image" }];
  }, [product]);

  const safeActiveIndex = Math.min(activeIndex, images.length - 1);
  const activeImage = images[safeActiveIndex];

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % images.length);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, images.length]);

  const onOverlayMouseDown = (e) => {
    if (e.target === overlayRef.current) setLightboxOpen(false);
  };

  // ✅ 加入购物车（只传数字 id + qty，不再用 fallback）
  const handleAddToCart = async () => {
    setPageError(null);

    const productId = getNumericProductId(product, routeId);
    if (!productId) {
      console.warn("[AddToCart] Missing/invalid product id:", { routeId, product });
      setPageError("This product can't be added to cart (missing product id).");
      return;
    }

    const safeQty = Math.max(1, Number(qty) || 1);

    try {
      await addItem(productId, safeQty);
    } catch (err) {
      console.error("[AddToCart] Failed:", err);
      setPageError(err?.message || "Failed to add item to cart.");
    }
  };

  const decQty = () => setQty((v) => Math.max(1, (Number(v) || 1) - 1));
  const incQty = () => setQty((v) => Math.min(99, (Number(v) || 1) + 1));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f4] pt-32 flex justify-center">
        <Loader2 className="animate-spin text-[#7c2b3d]" size={42} />
      </div>
    );
  }

  if (pageError || !product) {
    return (
      <div className="min-h-screen bg-[#f8f6f4] pt-32 px-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-[#9a8a85] text-sm mb-8 flex items-center hover:text-[#7c2b3d] transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" /> Back
          </button>

          <div className="bg-white rounded-[2.5rem] p-8 border border-[#f0e8e4] text-red-500">
            {pageError || "Product not found."}
          </div>
        </div>
      </div>
    );
  }

  const title = product?.name || "Product";
  const price = formatPrice(product);
  const intro = stripHtml(product?.short_description || product?.description);

  return (
    <div className="min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f]">
      <div className="max-w-[1400px] mx-auto pt-24 md:pt-32 px-6 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="text-[#9a8a85] text-sm mb-8 flex items-center hover:text-[#7c2b3d] transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* 左侧：图片 */}
          <div>
            <div className="bg-white rounded-[2.5rem] border border-[#f0e8e4] shadow-sm overflow-hidden">
              <div className="relative aspect-4/5 bg-[#f9f9f9] flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="relative z-0 w-full h-full flex items-center justify-center"
                  aria-label="Open image"
                >
                  <img
                    src={activeImage?.src}
                    alt={activeImage?.alt || title}
                    className="w-full h-full object-contain mix-blend-multiply p-10"
                    draggable="false"
                  />
                </button>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-[#f0e8e4] shadow-sm flex items-center justify-center text-[#1d1d1f] hover:text-[#7c2b3d] transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-[#f0e8e4] shadow-sm flex items-center justify-center text-[#1d1d1f] hover:text-[#7c2b3d] transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="px-8 py-6 flex items-center justify-center gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === safeActiveIndex ? "bg-[#7c2b3d] scale-110" : "bg-[#e5d5d0] hover:bg-[#cdb6b0]"
                      }`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 右侧：信息 */}
          <div className="flex flex-col">
            <div className="mb-10">
              {product?.categories?.[0]?.name && (
                <div className="text-[#7c2b3d] font-bold tracking-[0.2em] uppercase text-xs mb-4">
                  {product.categories[0].name}
                </div>
              )}

              <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-4">{title}</h1>

              {price && <div className="text-2xl font-medium text-[#7c2b3d] mb-6">{price}</div>}

              <p className="text-[#6e6e73] font-light leading-relaxed">{intro}</p>
            </div>

            {/* ✅ 数量 + 加入购物车 */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-[#f0e8e4] shadow-sm">
              {/* ✅ 让 Quantity 和控件靠近：不再 justify-between */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-sm text-[#9a8a85] shrink-0">Quantity</div>

                <div className="flex items-center gap-4 bg-[#f8f6f4] rounded-full px-4 py-2 border border-[#efe6e4]">
                  <button
                    type="button"
                    onClick={decQty}
                    disabled={qty <= 1}
                    className="text-[#1d1d1f] hover:text-[#7c2b3d] disabled:opacity-30 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="font-medium text-sm w-6 text-center">{qty}</span>

                  <button
                    type="button"
                    onClick={incQty}
                    className="text-[#1d1d1f] hover:text-[#7c2b3d] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-lg shadow-xl shadow-[#7c2b3d]/20"
                onClick={handleAddToCart}
                disabled={cartUpdating}
              >
                {cartUpdating ? (
                  <span className="inline-flex items-center gap-2">
                    Adding <Loader2 className="animate-spin" size={18} />
                  </span>
                ) : (
                  "Add to Bag"
                )}
              </Button>

              <div className="mt-4 text-xs text-[#9a8a85]">Complimentary shipping on orders over $50.</div>

              {/* 中文注释：把错误展示在按钮下方，方便你调试 */}
              {pageError && (
                <div className="mt-4 text-sm text-red-500">
                  {pageError}
                </div>
              )}
            </div>

            {stripHtml(product?.description) && (
              <div className="mt-10">
                <h3 className="text-lg font-serif font-medium mb-3">Details</h3>
                <p className="text-[#6e6e73] font-light leading-relaxed">{stripHtml(product.description)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          ref={overlayRef}
          onMouseDown={onOverlayMouseDown}
          className="fixed inset-0 z-999 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <div className="relative w-full max-w-5xl bg-[#0b0b0c]/30 rounded-3xl border border-white/10 overflow-hidden">
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 border border-white/20 flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Close"
            >
              <X size={18} className="text-[#1d1d1f]" />
            </button>

            <div className="relative w-full aspect-16/10 flex items-center justify-center">
              <img
                src={activeImage?.src}
                alt={activeImage?.alt || title}
                className="max-w-full max-h-full object-contain"
                draggable="false"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 border border-white/20 flex items-center justify-center hover:bg-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} className="text-[#1d1d1f]" />
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 border border-white/20 flex items-center justify-center hover:bg-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} className="text-[#1d1d1f]" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="px-6 py-5 flex justify-center gap-2 bg-black/20">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === safeActiveIndex ? "bg-white scale-110" : "bg-white/30 hover:bg-white/60"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;