// src/components/FadeIn.jsx
import { useEffect, useRef, useState } from "react";

/**
 * FadeIn
 * Apple-style slow fade-up reveal using IntersectionObserver
 *
 * Props:
 * - delay (number, ms): animation delay
 * - className (string): extra wrapper classes
 */
export default function FadeIn({ children, delay = 0, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-16"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}