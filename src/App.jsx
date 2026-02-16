import { useState, useEffect, useRef } from "react";

// ─── Color Tokens (WCAG 2.1 AA: 4.5:1 normal text, 3:1 large text; navy/gold palette retained) ───
const C = {
  navy: "#0A1628",
  navyMid: "#0F2035",
  navyLight: "#152A42",
  steel: "#1C3450",
  accent: "#C7963E",
  accentLight: "#D4A957",
  accentDim: "rgba(199,150,62,0.15)",
  white: "#F0EDE8",
  offWhite: "#E8E4DD",
  gray: "#8A9AB5",
  grayLight: "#B0BFCF",
  grayDark: "#5A6A80",
  bg: "#060E1A",
  cardBg: "rgba(15,32,53,0.6)",
  glassBorder: "rgba(199,150,62,0.12)",
};

// ─── Fonts (Google) ───
const fontLink = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap";

// ─── Styles ───
const globalCSS = `
@import url('${fontLink}');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;background:${C.bg};color:${C.white};overflow-x:hidden}
::selection{background:${C.accent};color:${C.navy}}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:${C.bg}}
::-webkit-scrollbar-thumb{background:${C.steel};border-radius:3px}

/* Accessibility: visible focus indicators for keyboard users (WCAG 2.4.7) */
a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid #FFD700;outline-offset:2px}

/* Skip link: visually hidden until focused */
.skip-link{position:absolute;left:-9999px;z-index:9999;padding:12px 24px;background:${C.accent};color:${C.navy};font-weight:700;text-decoration:none;font-size:14px;border-radius:4px}
.skip-link:focus{position:static;left:auto;margin:8px 0 0 8px;display:inline-block}

/* Reduced motion: disable animations for users who prefer it (WCAG 2.3.3) */
@media (prefers-reduced-motion: no-preference) {
  @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideLeft{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
  @keyframes lineGrow{from{width:0}to{width:60px}}
  @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .fade-up{animation:fadeUp 0.7s ease both}
  .fade-in{animation:fadeIn 0.6s ease both}
  .slide-left{animation:slideLeft 0.7s ease both}
  .section-reveal{transition:opacity 0.7s ease, transform 0.7s ease}
  .animate-pulse{animation:pulse 2s ease infinite}
}
`;

// ─── Skip Link ───
function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
}

// ─── Navigation ───
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const mobileMenuId = "mobile-menu";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  const links = [
    { key: "home", label: "Home" },
    { key: "about", label: "About" },
    { key: "services", label: "Services" },
    { key: "contact", label: "Contact" },
  ];

  const navigate = (key) => {
    setPage(key);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header style={{ position: "relative" }}>
    <nav aria-label="Main navigation" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(6,14,26,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
      borderBottom: scrolled ? `1px solid ${C.glassBorder}` : "1px solid transparent",
      transition: "all 0.4s ease",
      padding: scrolled ? "12px 0" : "20px 0",
    }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          type="button"
          onClick={() => navigate("home")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", padding: 0 }}
          aria-label="Stanchion Security home"
        >
          <div style={{
            width: 36, height: 36, border: `2px solid ${C.accent}`, borderRadius: 4,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: C.accent
          }}>S</div>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, letterSpacing: 2, color: C.white, textTransform: "uppercase" }}>
            Stanchion
          </span>
        </button>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="desktop-nav">
          {links.map(l => (
            <button
              key={l.key}
              onClick={() => navigate(l.key)}
              aria-current={page === l.key ? "page" : undefined}
              style={{
              background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              fontSize: 14, fontWeight: 500, letterSpacing: 1.2, textTransform: "uppercase",
              color: page === l.key ? C.accent : C.grayLight,
              borderBottom: page === l.key ? `2px solid ${C.accent}` : "2px solid transparent",
              paddingBottom: 4, transition: "all 0.3s ease",
            }}>{l.label}</button>
          ))}
          <button onClick={() => navigate("contact")} style={{
            background: "none", border: `1px solid ${C.accent}`, borderRadius: 4, padding: "8px 20px",
            color: C.accent, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
            letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s",
          }}>Get Started</button>
        </div>

        {/* Mobile hamburger */}
        <button
          ref={hamburgerRef}
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls={mobileMenuId}
          aria-label={mobileOpen ? "Close main menu" : "Open main menu"}
          style={{
          display: "none", background: "none", border: "none", cursor: "pointer", padding: 8,
          flexDirection: "column", gap: 5,
        }} className="mobile-hamburger">
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 24, height: 2, background: C.accent, transition: "all 0.3s",
              transform: mobileOpen ? (i===0?"rotate(45deg) translate(5px,5px)":i===1?"scale(0)":"rotate(-45deg) translate(5px,-5px)") : "none"
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id={mobileMenuId} role="menu" style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "rgba(6,14,26,0.97)", backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.glassBorder}`, padding: "24px 32px",
        }}>
          {links.map(l => (
            <button key={l.key} type="button" role="menuitem" onClick={() => navigate(l.key)} style={{
              display: "block", width: "100%", textAlign: "left", background: "none", border: "none",
              padding: "14px 0", fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 500,
              color: page === l.key ? C.accent : C.grayLight, cursor: "pointer",
              borderBottom: `1px solid ${C.glassBorder}`,
            }}>{l.label}</button>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .desktop-nav{display:none !important}
          .mobile-hamburger{display:flex !important}
        }
      `}</style>
    </nav>
    </header>
  );
}

// ─── Section Wrapper with Scroll Animation ───
function Section({ children, style = {}, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="section-reveal" style={{
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
      transitionDelay: `${delay}s`, ...style
    }}>{children}</div>
  );
}

// ─── Decorative Line ───
function GoldLine({ width = 60, style = {} }) {
  return <div style={{ width, height: 2, background: `linear-gradient(90deg, ${C.accent}, transparent)`, marginBottom: 20, ...style }} />;
}

// ─── Section Heading ───
function SectionHeading({ label, title, subtitle, center, level = 2 }) {
  const HeadingTag = level === 1 ? "h1" : "h2";
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 48 }}>
      {label && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 12 }}>{label}</div>}
      <GoldLine width={center ? 60 : 60} style={center ? { margin: "0 auto 16px" } : { marginBottom: 16 }} />
      <HeadingTag style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 600, color: C.white, lineHeight: 1.2, marginBottom: subtitle ? 16 : 0 }}>{title}</HeadingTag>
      {subtitle && <p style={{ fontSize: 17, color: C.gray, maxWidth: 640, margin: center ? "0 auto" : 0, lineHeight: 1.7 }}>{subtitle}</p>}
    </div>
  );
}

// ─── Shield Icon (SVG) ───
function ShieldIcon({ size = 24, color = C.accent }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

// ═══════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════
function HomePage({ setPage }) {
  const navigate = (key) => { setPage(key); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const services = [
    { icon: "🛡️", title: "Virtual CISO", desc: "Fractional security leadership for organizations that need executive-level guidance without the full-time overhead." },
    { icon: "🤖", title: "AI Governance", desc: "Risk frameworks, policy development, and security assessments for organizations deploying AI and LLM systems." },
    { icon: "📋", title: "Compliance Programs", desc: "SOC 2, HIPAA, and regulatory compliance program design, implementation, and ongoing management." },
    { icon: "🔍", title: "Security Assessments", desc: "Architecture reviews, incident response planning, and vendor risk evaluations across cloud and hybrid environments." },
  ];

  const stats = [
    { number: "15+", label: "Years in Enterprise Security" },
    { number: "3", label: "Regulated Industries" },
    { number: "100%", label: "Client Retention Rate" },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden",
        background: `radial-gradient(ellipse at 20% 50%, rgba(28,52,80,0.4) 0%, transparent 60%),
                     radial-gradient(ellipse at 80% 20%, rgba(199,150,62,0.06) 0%, transparent 50%),
                     ${C.bg}`,
      }}>
        {/* Grid pattern overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: `linear-gradient(${C.accent} 1px, transparent 1px), linear-gradient(90deg, ${C.accent} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "140px 32px 80px", position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ maxWidth: 720 }}>
            <div className="fade-up" style={{ animationDelay: "0.1s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div className="animate-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent }} aria-hidden="true" />
                <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: C.accent }}>Cybersecurity & AI Governance Advisory</span>
              </div>
            </div>
            <h1 className="fade-up" style={{
              animationDelay: "0.25s",
              fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(40px,6vw,72px)", fontWeight: 600,
              lineHeight: 1.08, color: C.white, marginBottom: 28,
            }}>
              Security leadership<br />
              <span style={{ color: C.accent }}>built to stand.</span>
            </h1>
            <p className="fade-up" style={{
              animationDelay: "0.4s",
              fontSize: 19, lineHeight: 1.75, color: C.gray, maxWidth: 560, marginBottom: 40,
            }}>
              Stanchion Security delivers fractional CISO services, AI governance, and compliance program leadership to organizations navigating complex regulatory and threat landscapes.
            </p>
            <div className="fade-up" style={{ animationDelay: "0.55s", display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button onClick={() => navigate("contact")} style={{
                background: C.accent, color: C.navy, border: "none", borderRadius: 4,
                padding: "14px 32px", fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
                cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.3s",
              }}>Schedule a Consultation</button>
              <button onClick={() => navigate("services")} style={{
                background: "none", color: C.white, border: `1px solid ${C.grayDark}`, borderRadius: 4,
                padding: "14px 32px", fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
                cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.3s",
              }}>View Services →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ background: C.navy, borderTop: `1px solid ${C.glassBorder}`, borderBottom: `1px solid ${C.glassBorder}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px", display: "flex", justifyContent: "center", gap: 80, flexWrap: "wrap" }}>
          {stats.map((s, i) => (
            <Section key={i} delay={i * 0.15}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 700, color: C.accent }}>{s.number}</div>
                <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", color: C.grayLight }}>{s.label}</div>
              </div>
            </Section>
          ))}
        </div>
      </section>

      {/* ── Services Overview ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 32px" }}>
        <Section>
          <SectionHeading label="What We Do" title="Strategic Security Services" subtitle="We bridge the gap between traditional security governance and the emerging AI threat landscape." center />
        </Section>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {services.map((s, i) => (
            <Section key={i} delay={i * 0.12}>
              <div style={{
                background: C.cardBg, border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: 32,
                transition: "all 0.4s ease", cursor: "pointer", height: "100%",
              }} onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "translateY(-4px)"; }}
                 onMouseLeave={e => { e.currentTarget.style.borderColor = C.glassBorder; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: 32, marginBottom: 16 }} aria-hidden="true">{s.icon}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: C.white, marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: C.gray, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </Section>
          ))}
        </div>
        <Section delay={0.4}>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button onClick={() => navigate("services")} style={{
              background: "none", border: `1px solid ${C.accent}`, borderRadius: 4, padding: "12px 28px",
              color: C.accent, fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}>Explore All Services →</button>
          </div>
        </Section>
      </section>

      {/* ── Why Stanchion ── */}
      <section style={{ background: `linear-gradient(180deg, ${C.bg} 0%, ${C.navyMid} 50%, ${C.bg} 100%)`, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Section>
            <SectionHeading label="Why Stanchion" title="Not Another Checkbox Audit" subtitle="We build security programs that actually work — grounded in operational reality, regulatory expertise, and emerging AI risk." />
          </Section>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            {[
              { title: "Military Precision", desc: "Navy and Coast Guard security background brings discipline, clearability, and a mission-first mindset to every engagement." },
              { title: "Regulated Industry Depth", desc: "15+ years across healthcare (HIPAA), financial services (SOC 2, SOX), and defense — not theoretical compliance, but operational programs." },
              { title: "AI-Forward Thinking", desc: "Deep expertise in NIST AI RMF, LLM security risks, and AI governance frameworks while the market is still catching up." },
            ].map((item, i) => (
              <Section key={i} delay={i * 0.15}>
                <div style={{ padding: "0 0 0 24px", borderLeft: `2px solid ${C.accent}` }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, color: C.white, marginBottom: 12 }}>{item.title}</h3>
                  <p style={{ fontSize: 15, color: C.gray, lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "100px 32px" }}>
        <Section>
          <div style={{
            maxWidth: 800, margin: "0 auto", textAlign: "center",
            background: C.cardBg, border: `1px solid ${C.glassBorder}`, borderRadius: 12,
            padding: "64px 48px", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${C.accentDim}, transparent)` }} />
            <ShieldIcon size={40} />
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 600, color: C.white, margin: "24px 0 16px" }}>Ready to fortify your security posture?</h2>
            <p style={{ fontSize: 17, color: C.gray, marginBottom: 32, lineHeight: 1.7 }}>Let's discuss how Stanchion Security can protect your organization and prepare you for what's next.</p>
            <button onClick={() => navigate("contact")} style={{
              background: C.accent, color: C.navy, border: "none", borderRadius: 4,
              padding: "14px 36px", fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}>Start a Conversation</button>
          </div>
        </Section>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════
function AboutPage({ setPage }) {
  const navigate = (key) => { setPage(key); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: "160px 32px 80px",
        background: `radial-gradient(ellipse at 60% 30%, rgba(28,52,80,0.5) 0%, transparent 60%), ${C.bg}`,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Section>
            <SectionHeading label="About" title="A Different Kind of Security Practice" subtitle="Founded on the belief that security leadership should be accessible, practical, and forward-looking." level={1} />
          </Section>
        </div>
      </section>

      {/* Founder */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <Section>
            <div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: C.accent, marginBottom: 12 }}>Founder</div>
              <GoldLine />
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 600, color: C.white, marginBottom: 24 }}>Tom Tolleson</h2>
              <div style={{ fontSize: 16, color: C.gray, lineHeight: 1.8 }}>
                <p style={{ marginBottom: 16 }}>Tom Tolleson brings over 15 years of enterprise security and IT leadership across three of the most heavily regulated industries in America: healthcare, financial services, and defense.</p>
                <p style={{ marginBottom: 16 }}>His career began in regulatory work as a contractor for the Social Security Administration and the United States Navy, where he developed the discipline, security clearances, and mission-critical mindset that defines his approach to cybersecurity leadership today. He currently works with the United States Coast Guard Auxilliary.</p>
                <p style={{ marginBottom: 16 }}>From there, Tom Tolleson led enterprise IT and security programs at organizations including Aetna/CVS Health and AIG, managing complex technology transformations while maintaining compliance with HIPAA, SOC 2, and various security requirements.</p>
                <p>Now, through Stanchion Security, he delivers that same level of strategic security leadership to organizations that need it most — on their terms and within their budget.</p>
              </div>
            </div>
          </Section>
          <Section delay={0.2}>
            <div style={{ background: C.cardBg, border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: 40 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, color: C.white, marginBottom: 24 }}>Credentials & Background</h3>
              {[
                { label: "Certifications", value: "CompTIA Security+ · CISSP (in progress) · CPP (planned)" },
                { label: "Military/Government Contracting", value: "United States Navy · Social Security Administration · United States Coast Guard" },
                { label: "Industry Experience", value: "Healthcare · Financial Services · Defense" },
                { label: "Compliance Expertise", value: "HIPAA · SOC 2 · NIST · AI RMF · CMMC" },
                { label: "Technology", value: "AWS · Azure · Enterprise Architecture · AI/LLM Systems" },
                { label: "Domain Focus", value: "vCISO · AI Governance · Security Program Design · Privacy" },
              ].map((item, i) => (
                <div key={i} style={{ padding: "16px 0", borderBottom: i < 5 ? `1px solid ${C.glassBorder}` : "none" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: C.accent, marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 15, color: C.grayLight, lineHeight: 1.6 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>
        <style>{`@media(max-width:768px){section > div > div{grid-template-columns:1fr !important}}`}</style>
      </section>

      {/* Philosophy */}
      <section style={{ background: C.navyMid, padding: "80px 32px", borderTop: `1px solid ${C.glassBorder}`, borderBottom: `1px solid ${C.glassBorder}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Section>
            <SectionHeading label="Philosophy" title="Why 'Stanchion'?" center />
            <div style={{ textAlign: "center", fontSize: 18, color: C.gray, lineHeight: 1.8 }}>
              <p style={{ marginBottom: 16 }}>A stanchion is a vertical structural support — a pillar that holds firm under pressure. In naval architecture, stanchions are the posts that keep guardrails standing, protecting the crew even in the roughest seas.</p>
              <p style={{ marginBottom: 16 }}>That's what security leadership should be: a firm, reliable structure that stands between your organization and the threats coming at it — steady when everything else is in motion.</p>
              <p style={{ color: C.accent, fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontStyle: "italic", marginTop: 32 }}>
                "We don't just check boxes. We build the structure that holds."
              </p>
            </div>
          </Section>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 32px" }}>
        <Section>
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 600, color: C.white, marginBottom: 16 }}>Let's talk about your security needs.</h2>
            <p style={{ fontSize: 16, color: C.gray, marginBottom: 32 }}>Every engagement starts with a conversation — no pressure, no sales pitch. Just an honest assessment of where you are and where you need to be.</p>
            <button onClick={() => navigate("contact")} style={{
              background: C.accent, color: C.navy, border: "none", borderRadius: 4,
              padding: "14px 32px", fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}>Get in Touch</button>
          </div>
        </Section>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════
// SERVICES PAGE
// ═══════════════════════════════════════════
function ServicesPage({ setPage }) {
  const navigate = (key) => { setPage(key); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const [activeTab, setActiveTab] = useState(0);

  const categories = [
    {
      label: "vCISO", title: "Virtual CISO Services",
      intro: "Fractional security leadership calibrated to your organization's size, risk profile, and regulatory environment. Every engagement is led personally by Tom Tolleson — not handed off to junior staff.",
      tiers: [
        { name: "Essentials", hours: "8–10 hrs/mo", features: ["Quarterly risk reviews & reporting", "Security policy maintenance", "Board & leadership briefings", "Incident escalation point of contact"] },
        { name: "Standard", hours: "16–20 hrs/mo", features: ["Weekly security steering sessions", "Incident response planning & tabletops", "Vendor risk management program", "Compliance roadmap & audit prep", "Security awareness oversight"], popular: true },
        { name: "Executive", hours: "30–40 hrs/mo", features: ["Full integration with leadership team", "Tool selection & architecture guidance", "Board-level reporting & presentations", "Regulatory audit management", "Security hiring & team building advisory"] },
      ]
    },
    {
      label: "AI Security", title: "AI Security & Governance",
      intro: "Most organizations are deploying AI faster than they're governing it. We help you build the guardrails before — or alongside — the innovation, leveraging NIST AI RMF, ISO 42001, and OWASP LLM Top 10 frameworks.",
      tiers: [
        { name: "AI Governance Assessment", hours: "4–6 weeks", features: ["Complete AI use case inventory", "Risk classification & prioritization", "Gap analysis against NIST AI RMF", "Executive-ready findings report", "Remediation roadmap"] },
        { name: "AI Policy Development", hours: "4–8 weeks", features: ["Acceptable use policies for AI/LLMs", "Data handling & privacy frameworks", "Model risk management policies", "Third-party AI vendor evaluation criteria", "Employee training materials"], popular: true },
        { name: "AI Governance Retainer", hours: "Ongoing", features: ["Continuous AI risk monitoring", "New use case security review", "Policy updates for evolving threats", "Regulatory tracking (EU AI Act, etc.)", "Board-level AI risk reporting"] },
      ]
    },
    {
      label: "Compliance", title: "Compliance Programs",
      intro: "We've built and maintained compliance programs at some of the largest organizations in healthcare and financial services. Now we bring that enterprise-grade methodology to the mid-market.",
      tiers: [
        { name: "SOC 2 Readiness", hours: "4–8 weeks", features: ["Gap analysis against Trust Services Criteria", "Control mapping & documentation", "Remediation roadmap & prioritization", "Auditor coordination & prep"] },
        { name: "HIPAA Risk Assessment", hours: "4–6 weeks", features: ["Security Rule risk analysis", "Privacy Rule compliance review", "BAA inventory & assessment", "Remediation plan with timelines", "OCR audit preparation"], popular: true },
        { name: "Full Program Buildout", hours: "3–6 months", features: ["Complete policy & procedure suite", "Control implementation & testing", "Evidence collection systems", "Employee training program", "Ongoing compliance monitoring plan"] },
      ]
    },
    {
      label: "Assessments", title: "Security Assessments",
      intro: "Targeted evaluations that give you a clear picture of your security posture and a concrete plan to improve it.",
      tiers: [
        { name: "Architecture Review", hours: "2–4 weeks", features: ["Cloud infrastructure review (AWS/Azure)", "Network security assessment", "Identity & access management audit", "Findings report with priorities"] },
        { name: "Incident Response Planning", hours: "2–4 weeks", features: ["IR playbook development", "Tabletop exercise facilitation", "Communication plan templates", "Regulatory notification procedures", "Post-incident review framework"], popular: true },
        { name: "Vendor Risk Program", hours: "1–2 weeks", features: ["Third-party risk framework", "Vendor tiering methodology", "Security questionnaire development", "Risk assessment templates", "Ongoing monitoring recommendations"] },
      ]
    },
  ];

  const cat = categories[activeTab];

  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: "160px 32px 60px",
        background: `radial-gradient(ellipse at 30% 40%, rgba(28,52,80,0.5) 0%, transparent 60%), ${C.bg}`,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Section>
            <SectionHeading label="Services" title="What We Deliver" subtitle="Every engagement is scoped to your needs, led by senior expertise, and designed to produce measurable outcomes." level={1} />
          </Section>
        </div>
      </section>

      {/* Tabs */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div role="tablist" aria-label="Service categories">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", borderBottom: `1px solid ${C.glassBorder}`, paddingBottom: 0 }}>
          {categories.map((cat, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={activeTab === i}
              aria-controls={`panel-${i}`}
              id={`tab-${i}`}
              onClick={() => setActiveTab(i)}
              style={{
              background: activeTab === i ? C.accentDim : "transparent",
              border: "none", borderBottom: activeTab === i ? `2px solid ${C.accent}` : "2px solid transparent",
              padding: "14px 24px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
              color: activeTab === i ? C.accent : C.grayDark, transition: "all 0.3s",
            }}>{cat.label}</button>
          ))}
          </div>
        </div>
      </section>

      {/* Active Category */}
      <section id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} tabIndex={0} style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 100px" }}>
        <Section key={activeTab}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 600, color: C.white, marginBottom: 16 }}>{cat.title}</h2>
          <p style={{ fontSize: 16, color: C.gray, lineHeight: 1.7, maxWidth: 700, marginBottom: 48 }}>{cat.intro}</p>
        </Section>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {cat.tiers.map((tier, i) => (
            <Section key={`${activeTab}-${i}`} delay={i * 0.12}>
              <div style={{
                background: C.cardBg, border: `1px solid ${tier.popular ? C.accent : C.glassBorder}`,
                borderRadius: 8, padding: 32, position: "relative", height: "100%",
                display: "flex", flexDirection: "column",
              }}>
                {tier.popular && (
                  <div style={{
                    position: "absolute", top: -1, left: 32, right: 32,
                    height: 3, background: C.accent, borderRadius: "0 0 3px 3px",
                  }} />
                )}
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, color: C.white, marginBottom: 8 }}>{tier.name}</h3>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.accent, marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>{tier.price}</div>
                <div style={{ fontSize: 13, color: C.grayDark, marginBottom: 24 }}>{tier.hours}</div>
                <div style={{ flex: 1 }}>
                  {tier.features.map((f, fi) => (
                    <div key={fi} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                      <span style={{ color: C.accent, fontSize: 14, marginTop: 2, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 14, color: C.grayLight, lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate("contact")} style={{
                  marginTop: 24, width: "100%", padding: "12px",
                  background: tier.popular ? C.accent : "transparent",
                  color: tier.popular ? C.navy : C.accent,
                  border: `1px solid ${C.accent}`, borderRadius: 4,
                  fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
                  cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                }}>Get Started</button>
              </div>
            </Section>
          ))}
        </div>
      </section>

      {/* Advisory Hours */}
      <section style={{ background: C.navyMid, padding: "64px 32px", borderTop: `1px solid ${C.glassBorder}`, borderBottom: `1px solid ${C.glassBorder}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
          <div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 600, color: C.white, marginBottom: 8 }}>Need something more targeted?</h3>
            <p style={{ fontSize: 15, color: C.gray }}>Advisory hours are available at <span style={{ color: C.accent, fontWeight: 700 }}>$275/hour</span> for ad-hoc consultations, security reviews, and strategic guidance.</p>
          </div>
          <button onClick={() => navigate("contact")} style={{
            background: "none", border: `1px solid ${C.accent}`, borderRadius: 4, padding: "12px 28px",
            color: C.accent, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
            cursor: "pointer", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap",
          }}>Book Advisory Time</button>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════
// CONTACT PAGE
// ═══════════════════════════════════════════
function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", phone: "", service: "", message: "" });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "", message: "" });

    const payload = {
      name: e.target.elements.name?.value ?? formData.name,
      email: e.target.elements.email?.value ?? formData.email,
      company: e.target.elements.company?.value ?? formData.company,
      phone: e.target.elements.phone?.value ?? "",
      service: e.target.elements.service?.value ?? formData.service,
      message: e.target.elements.message?.value ?? formData.message,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormStatus({ type: "success", message: data.message });
        setFormData({ name: "", email: "", company: "", phone: "", service: "", message: "" });
        e.target.reset();
      } else {
        setFormStatus({ type: "error", message: data.error || "Something went wrong. Please try again." });
      }
    } catch (error) {
      setFormStatus({
        type: "error",
        message: "Unable to submit the form. Please email us directly at tom@stanchionsecurity.com.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", background: C.navyLight, border: `1px solid ${C.glassBorder}`,
    borderRadius: 4, color: C.white, fontSize: 15, fontFamily: "'DM Sans',sans-serif",
    outline: "none", transition: "border-color 0.3s",
  };

  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: "160px 32px 60px",
        background: `radial-gradient(ellipse at 70% 30%, rgba(28,52,80,0.5) 0%, transparent 60%), ${C.bg}`,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Section>
            <SectionHeading label="Contact" title="Start a Conversation" subtitle="Every engagement begins with a straightforward discussion about your security needs. No pressure, no sales pitch." level={1} />
          </Section>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
          <Section>
            {formStatus.type === "success" ? (
              <div style={{ background: C.cardBg, border: `1px solid ${C.accent}`, borderRadius: 8, padding: 48, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 600, color: C.white, marginBottom: 12 }}>Message received.</h3>
                <p style={{ fontSize: 16, color: C.gray, lineHeight: 1.7 }}>Thank you for reaching out. Tom Tolleson will review your inquiry and respond within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label htmlFor="contact-name" style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: C.grayLight, marginBottom: 8 }}>Name *</label>
                    <input id="contact-name" name="name" required aria-required="true" style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Your name" onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.glassBorder} />
                  </div>
                  <div>
                    <label htmlFor="contact-email" style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: C.grayLight, marginBottom: 8 }}>Email *</label>
                    <input id="contact-email" name="email" required type="email" aria-required="true" style={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="you@company.com" onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.glassBorder} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label htmlFor="phone" style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: C.grayLight, marginBottom: 8 }}>Phone (optional)</label>
                  <input type="tel" id="phone" name="phone" aria-label="Phone number (optional)" style={inputStyle} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Optional — for a faster response" onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.glassBorder} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label htmlFor="contact-company" style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: C.grayLight, marginBottom: 8 }}>Company</label>
                  <input id="contact-company" name="company" style={inputStyle} value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Your organization" onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.glassBorder} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label htmlFor="contact-service" style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: C.grayLight, marginBottom: 8 }}>Service Interest</label>
                  <select id="contact-service" name="service" style={{ ...inputStyle, cursor: "pointer", appearance: "auto" }} value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.glassBorder}>
                    <option value="" style={{ background: C.navyLight }}>Select a service...</option>
                    <option value="vciso" style={{ background: C.navyLight }}>Virtual CISO</option>
                    <option value="ai" style={{ background: C.navyLight }}>AI Security & Governance</option>
                    <option value="compliance" style={{ background: C.navyLight }}>Compliance Programs (SOC 2 / HIPAA)</option>
                    <option value="assessment" style={{ background: C.navyLight }}>Security Assessment</option>
                    <option value="advisory" style={{ background: C.navyLight }}>Advisory Hours</option>
                    <option value="other" style={{ background: C.navyLight }}>Other / Not Sure</option>
                  </select>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label htmlFor="contact-message" style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: C.grayLight, marginBottom: 8 }}>Message *</label>
                  <textarea id="contact-message" name="message" required rows={5} aria-required="true" style={{ ...inputStyle, resize: "vertical" }} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Tell us about your security needs, timeline, and any specific challenges you're facing." onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.glassBorder} />
                </div>
                {formStatus.type === "error" && formStatus.message && (
                  <div
                    role="alert"
                    aria-live="polite"
                    style={{
                      marginBottom: "1rem",
                      padding: "1rem",
                      borderRadius: 8,
                      backgroundColor: "rgba(198, 40, 40, 0.15)",
                      color: "#f5c6cb",
                      border: "1px solid rgba(245, 198, 203, 0.3)",
                    }}
                  >
                    {formStatus.message}
                  </div>
                )}
                <button type="submit" disabled={isSubmitting} style={{
                  width: "100%", padding: "14px", background: C.accent, color: C.navy, border: "none",
                  borderRadius: 4, fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
                  cursor: isSubmitting ? "wait" : "pointer", fontFamily: "'DM Sans',sans-serif",
                  opacity: isSubmitting ? 0.8 : 1,
                }}>{isSubmitting ? "Sending..." : "Send Message"}</button>
              </form>
            )}
          </Section>

          <Section delay={0.2}>
            <div>
              <div style={{ background: C.cardBg, border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: 32, marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: C.white, marginBottom: 20 }}>What to Expect</h3>
                {[
                  { step: "01", title: "Initial Conversation", desc: "A 30-minute call to understand your security landscape, regulatory requirements, and goals." },
                  { step: "02", title: "Scoping & Proposal", desc: "A tailored proposal with clear deliverables, timeline, and investment — no boilerplate." },
                  { step: "03", title: "Engagement Kickoff", desc: "We hit the ground running with a structured onboarding and immediate-priority assessment." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, marginBottom: i < 2 ? 20 : 0, paddingBottom: i < 2 ? 20 : 0, borderBottom: i < 2 ? `1px solid ${C.glassBorder}` : "none" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: "'DM Sans',sans-serif", marginTop: 2, flexShrink: 0 }}>{item.step}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: C.white, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 14, color: C.gray, lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: C.cardBg, border: `1px solid ${C.glassBorder}`, borderRadius: 8, padding: 32 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: C.white, marginBottom: 20 }}>Direct Contact</h3>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: C.accent, marginBottom: 4 }}>Email</div>
                  <a href="mailto:tom@stanchionsecurity.com" style={{ fontSize: 15, color: C.grayLight, textDecoration: "underline", textUnderlineOffset: 2 }}>tom@stanchionsecurity.com</a>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: C.accent, marginBottom: 4 }}>Phone</div>
                  <a href="tel:+12125882920" aria-label="Phone: (212) 588-2920" style={{ fontSize: 15, color: C.grayLight, textDecoration: "underline", textUnderlineOffset: 2 }}>(212) 588-2920</a>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: C.accent, marginBottom: 4 }}>Web</div>
                  <a href="https://stanchionsecurity.com" style={{ fontSize: 15, color: C.grayLight, textDecoration: "underline", textUnderlineOffset: 2 }} rel="noopener noreferrer" aria-label="Stanchion Security website (opens in new tab)" target="_blank">stanchionsecurity.com</a>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: C.accent, marginBottom: 4 }}>LinkedIn</div>
                  <a href="https://linkedin.com/in/tomtolleson" style={{ fontSize: 15, color: C.grayLight, textDecoration: "underline", textUnderlineOffset: 2 }} rel="noopener noreferrer" aria-label="Tom Tolleson LinkedIn profile (opens in new tab)" target="_blank">linkedin.com/in/tomtolleson</a>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: C.accent, marginBottom: 4 }}>Response Time</div>
                  <div style={{ fontSize: 15, color: C.grayLight }}>Within 1 business day</div>
                </div>
              </div>
            </div>
          </Section>
        </div>
        <style>{`@media(max-width:768px){section > div{grid-template-columns:1fr !important}}`}</style>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════
function Footer({ setPage }) {
  const navigate = (key) => { setPage(key); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <footer style={{ background: C.navy, borderTop: `1px solid ${C.glassBorder}`, padding: "48px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 28, height: 28, border: `1.5px solid ${C.accent}`, borderRadius: 3,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 700, color: C.accent
            }}>S</div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, letterSpacing: 2, color: C.grayLight, textTransform: "uppercase" }}>Stanchion Security</span>
          </div>
          <p style={{ fontSize: 13, color: C.grayDark }}>Cybersecurity & AI Governance Advisory</p>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {["home", "about", "services", "contact"].map(key => (
            <button key={key} onClick={() => navigate(key)} style={{
              background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              fontSize: 13, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", color: C.grayDark,
              transition: "color 0.3s",
            }}>{key}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="https://www.w3.org/WAI/WCAG21/quickref/?levels=aaa" rel="noopener noreferrer" target="_blank" aria-label="WCAG 2.1 AA compliant (opens in new tab)">
              <img src="https://img.shields.io/badge/WCAG-2.1%20AA-0077C8?style=flat" alt="WCAG 2.1 AA compliant" width={95} height={20} style={{ display: "block" }} />
            </a>
            <a href="https://www.section508.gov/" rel="noopener noreferrer" target="_blank" aria-label="Section 508 compliant (opens in new tab)">
              <img src="https://img.shields.io/badge/Section-508%20Compliant-0B3D91?style=flat" alt="Section 508 compliant" width={125} height={20} style={{ display: "block" }} />
            </a>
          </div>
          <div style={{ fontSize: 12, color: C.grayDark }}>© 2026 Stanchion Security LLC. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════
// APP
// ═══════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <style>{globalCSS}</style>
      <SkipLink />
      <Nav page={page} setPage={setPage} />
      <main id="main-content">
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "about" && <AboutPage setPage={setPage} />}
        {page === "services" && <ServicesPage setPage={setPage} />}
        {page === "contact" && <ContactPage setPage={setPage} />}
      </main>
      <Footer setPage={setPage} />
    </>
  );
}
