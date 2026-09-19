// LandingPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

const FEATURES = [
  {
    icon: "🏛️",
    title: "University Management",
    description:
      "Manage faculties, departments, programs, and courses from a single dashboard.",
  },
  {
    icon: "📝",
    title: "Admissions & Applications",
    description:
      "Students apply online, upload documents, and track their application status in real time.",
  },
  {
    icon: "🎓",
    title: "Enrollment & Students",
    description:
      "Convert accepted applicants into enrolled students with automatic ID generation.",
  },
  {
    icon: "📊",
    title: "Grades & Transcripts",
    description:
      "Professors enter grades, the system computes averages, rattrapage, and compensation automatically.",
  },
  {
    icon: "👥",
    title: "Role-Based Access",
    description:
      "Universities, deans, professors, and students each see exactly what they need.",
  },
  {
    icon: "🔒",
    title: "Secure & Reliable",
    description:
      "JWT authentication, role-based authorization, and audit trails on every action.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Sign up as a university admin in under a minute. No credit card required.",
  },
  {
    number: "02",
    title: "Configure your institution",
    description:
      "Add faculties, departments, programs, and courses. Invite deans and professors.",
  },
  {
    number: "03",
    title: "Go live",
    description:
      "Open admissions, receive applications, enroll students, and publish grades.",
  },
];

const ROLES = [
  {
    icon: "🏛️",
    name: "University Admins",
    description: "Oversee every faculty and program from one place.",
  },
  {
    icon: "🎓",
    name: "Faculty Deans",
    description: "Manage departments, professors, and admissions in their faculty.",
  },
  {
    icon: "👨‍🏫",
    name: "Professors",
    description: "See assigned courses and enter grades in seconds.",
  },
  {
    icon: "🎒",
    name: "Students",
    description: "Apply, track status, and view grades anytime.",
  },
];

const STATS = [
  { value: "8+", label: "Faculties managed" },
  { value: "42+", label: "Academic programs" },
  { value: "12,000+", label: "Students enrolled" },
  { value: "99.9%", label: "Uptime" },
];

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.page}>
      {/* ---------- Nav ---------- */}
      <header
        className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}
      >
        <div className={styles.navContainer}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoMark}>U</span>
            <span className={styles.logoText}>MultiVersity</span>
          </Link>

          <nav className={styles.navLinks}>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#roles">For your team</a>
          </nav>

          <div className={styles.navActions}>
            <Link to="/login" className={styles.navSignIn}>
              Sign in
            </Link>
            <Link to="/signup" className={styles.navCta}>
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>
            ✨ Built for Moroccan universities
          </span>

          <h1 className={styles.heroTitle}>
            The complete platform for
            <span className={styles.heroAccent}> modern universities</span>
          </h1>

          <p className={styles.heroSubtitle}>
            MultiVersity handles admissions, enrollments, grades, and everything
            in between — so your team can focus on education, not paperwork.
          </p>

          <div className={styles.heroCtas}>
            <Link to="/signup" className={styles.primaryCta}>
              Start free trial →
            </Link>
            <a href="#how-it-works" className={styles.secondaryCta}>
              See how it works
            </a>
          </div>

          <p className={styles.heroHint}>
            No credit card required · Set up in 5 minutes
          </p>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardHeader}>
              <span className={styles.heroCardDot} />
              <span className={styles.heroCardDot} />
              <span className={styles.heroCardDot} />
            </div>
            <div className={styles.heroCardBody}>
              <div className={styles.heroCardTitle}>Applications this week</div>
              <div className={styles.heroCardNumber}>137</div>
              <div className={styles.heroCardBar}>
                <div className={styles.heroCardBarFill} style={{ width: "72%" }} />
              </div>
              <div className={styles.heroCardRow}>
                <span>Submitted</span>
                <span className={styles.heroCardPillGreen}>72%</span>
              </div>
              <div className={styles.heroCardRow}>
                <span>Under review</span>
                <span className={styles.heroCardPillAmber}>18%</span>
              </div>
              <div className={styles.heroCardRow}>
                <span>Approved</span>
                <span className={styles.heroCardPillBlue}>10%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Trust bar ---------- */}
      <section className={styles.trustBar}>
        <p>Trusted by universities and faculties across Morocco</p>
        <div className={styles.trustLogos}>
          <span>UM5 Rabat</span>
          <span>FSBM Casablanca</span>
          <span>UCA Marrakech</span>
          <span>UIT Kenitra</span>
          <span>FST Settat</span>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section id="features" className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Features</span>
          <h2 className={styles.sectionTitle}>
            Everything your university needs
          </h2>
          <p className={styles.sectionSubtitle}>
            From admission to graduation — one platform, zero spreadsheets.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDescription}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how-it-works" className={styles.sectionAlt}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>How it works</span>
          <h2 className={styles.sectionTitle}>Up and running in 3 steps</h2>
        </div>

        <div className={styles.stepsGrid}>
          {STEPS.map((s, i) => (
            <div key={i} className={styles.stepCard}>
              <div className={styles.stepNumber}>{s.number}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDescription}>{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Roles ---------- */}
      <section id="roles" className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Built for every role</span>
          <h2 className={styles.sectionTitle}>
            One platform, four experiences
          </h2>
        </div>

        <div className={styles.rolesGrid}>
          {ROLES.map((r, i) => (
            <div key={i} className={styles.roleCard}>
              <div className={styles.roleIcon}>{r.icon}</div>
              <h3 className={styles.roleName}>{r.name}</h3>
              <p className={styles.roleDescription}>{r.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className={styles.statsSection}>
        <div className={styles.statsInner}>
          {STATS.map((s, i) => (
            <div key={i} className={styles.statItem}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaInner}>
          <h2 className={styles.finalCtaTitle}>
            Ready to modernize your university?
          </h2>
          <p className={styles.finalCtaSubtitle}>
            Join the institutions already running on MultiVersity.
          </p>

          <div className={styles.finalCtaButtons}>
            <Link to="/signup" className={styles.finalCtaPrimary}>
              Get started free
            </Link>
            <Link to="/login" className={styles.finalCtaSecondary}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.logoMark}>U</span>
            <span className={styles.logoText}>MultiVersity</span>
            <p className={styles.footerTagline}>
              The complete management platform for modern universities.
            </p>
          </div>

          <div className={styles.footerColumns}>
            <div>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#roles">For your team</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#careers">Careers</a>
            </div>
            <div>
              <h4>Account</h4>
              <Link to="/login">Sign in</Link>
              <Link to="/signup">Create account</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} MultiVersity. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;