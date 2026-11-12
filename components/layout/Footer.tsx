import Image from "next/image";
import Link from "next/link";

import {
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
  FiYoutube,
} from "react-icons/fi";
import { FaTiktok, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import type { Locale } from "@/lib/i18n/config";
import type { ContactSettings, SocialLink } from "@/types/siteSettings";
import { Service } from "@/types/service";
import CookieSettingsLink from "./CookieSettingsLink";

interface FooterProps {
  locale: Locale;
  contact: ContactSettings;
  socials: {
    socials: SocialLink[];
  };
  services: Service[];
  currentYear: number;
}

export default function Footer({ locale, contact, socials, services, currentYear, }: FooterProps) {
  const isArabic = locale === "ar";
  const activePhones = contact.phones.filter((phone) => phone.active);
  const activeEmails = contact.emails.filter((email) => email.active);
  const activeSocials = socials.socials.filter((social) => social.active);
  const links = [
    {
      label: isArabic ? "الرئيسية" : "Home",
      href: isArabic ? "/" : "/en/",
    },
    {
      label: isArabic ? "من نحن" : "About Us",
      href: isArabic ? "/about/" : "/en/about/",
    },
    {
      label: isArabic ? "خدماتنا" : "Services",
      href: isArabic ? "/services/" : "/en/services/",
    },
    {
      label: isArabic ? "معارضنا" : "Exhibitions",
      href: isArabic ? "/exhibitions/" : "/en/exhibitions/",
    },
    {
      label: isArabic ? "المدونة" : "Blog",
      href: isArabic ? "/blog/" : "/en/blog/",
    },
    {
      label: isArabic ? "تواصل معنا" : "Contact Us",
      href: isArabic ? "/contact/" : "/en/contact/",
    },
  ];

  return (
    <footer className="bg-slate-950 text-white" dir={isArabic ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Main Footer */}
        <div className="grid gap-12 border-b border-white/10 py-14 sm:py-16 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12 lg:py-20">
          {/* Brand */}
          <div>
            <Link
              href={isArabic ? "/" : "/en/"}
              className="flex shrink-0 items-center gap-1"
              dir="rtl"
            >
              {/* Logo Text */}
              <span
                className={`flex flex-col text-left text-[22px] font-semibold leading-[0.95] transition-colors duration-300 text-white!`}
              >
                <span>EVENT</span>
                <span>MAKER</span>
              </span>

              <div className="h-12 w-10 shrink-0 overflow-hidden">
                <Image
                  src="/images/logo.webp"
                  alt="Event Maker"
                  width={150}
                  height={100}
                  priority
                  className="h-12 w-auto max-w-none"
                />
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
              {isArabic
                ? "نصنع تجارب استثنائية في عالم المعارض والمؤتمرات والفعاليات، من الفكرة والتخطيط إلى التنفيذ وصناعة الأثر."
                : "We create exceptional experiences in exhibitions, conferences, and events, from concept and planning to execution and impact."}
            </p>

            {/* Social Media */}
            {activeSocials.length > 0 && (
              <div className="mt-7 flex items-center gap-2">
                {activeSocials.map((social) => (
                  <SocialLink key={social.id} social={social} />
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <FooterTitle>
              {isArabic ? "روابط سريعة" : "Quick Links"}
            </FooterTitle>

            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-300 hover:text-white"
                  >
                    {isArabic ? (
                      <FiChevronLeft className="text-xs opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                    ) : (
                      <FiChevronRight className="text-xs opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100" />
                    )}

                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <FooterTitle>{isArabic ? "خدماتنا" : "Our Services"}</FooterTitle>

            <ul className="space-y-3">
              {services.map((service) => {
                const title = service.title[isArabic ? "ar" : "en"];

                return (
                  <li key={service.id}>
                    <Link
                      href={
                        isArabic
                          ? `/services/${service.slug}/`
                          : `/en/services/${service.slug}/`
                      }
                      className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-300 hover:text-white"
                    >
                      {isArabic ? (
                        <FiChevronLeft className="text-xs opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                      ) : (
                        <FiChevronRight className="text-xs opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100" />
                      )}

                      <span>{title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <FooterTitle>
              {isArabic ? "تواصل معنا" : "Get In Touch"}
            </FooterTitle>

            <div className="space-y-5">
              {/* Location */}
              <ContactItem
                icon={<FiMapPin />}
                text={
                  isArabic
                    ? "جدة - المملكة العربية السعودية"
                    : "Jeddah - Saudi Arabia"
                }
              />

              {/* Phones */}
              {activePhones.map((phone) => (
                <a
                  key={phone.id}
                  href={`tel:${phone.number}`}
                  className="group flex items-start gap-3 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <span
                    className="mt-0.5 shrink-0"
                    style={{
                      color: "var(--theme-primary)",
                    }}
                  >
                    <FiPhone />
                  </span>

                  <span>
                    <span className="block text-xs text-slate-500">
                      {phone.label}
                    </span>

                    <span dir="ltr" className="mt-1 block">
                      {phone.number}
                    </span>
                  </span>
                </a>
              ))}

              {/* Emails */}
              {activeEmails.map((email) => (
                <a
                  key={email.id}
                  href={`mailto:${email.email}`}
                  className="group flex items-start gap-3 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <span
                    className="mt-0.5 shrink-0"
                    style={{
                      color: "var(--theme-primary)",
                    }}
                  >
                    <FiMail />
                  </span>

                  <span>
                    <span className="block text-xs text-slate-500">
                      {email.label}
                    </span>

                    <span dir="ltr" className="mt-1 block break-all">
                      {email.email}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} Event Maker.{" "}
            {isArabic ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>

          <div className="flex items-center gap-5">
            <Link
              href={isArabic ? "/terms/" : "/en/terms/"}
              className="transition-colors hover:text-white"
            >
              {isArabic ? "الشروط والأحكام" : "Terms & Conditions"}
            </Link>

            <Link
              href={isArabic ? "/privacy-policy/" : "/en/privacy-policy/"}
              className="transition-colors hover:text-white"
            >
              {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>

            <CookieSettingsLink locale={locale} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="mb-6 text-sm font-bold"
      style={{
        color: "var(--theme-primary)",
      }}
    >
      {children}
    </h3>
  );
}

function FooterServiceLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-slate-400 transition-colors hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

function ContactItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 text-sm text-slate-400">
      <span
        className="mt-0.5 shrink-0"
        style={{
          color: "var(--theme-primary)",
        }}
      >
        {icon}
      </span>

      <span className="leading-6">{text}</span>
    </div>
  );
}

function SocialLink({ social }: { social: SocialLink }) {
  const icon = getSocialIcon(social.platform);

  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      title={social.label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-sm text-slate-400 transition-all duration-300 hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)]"
    >
      {icon}
    </a>
  );
}

function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <FiInstagram />;

    case "facebook":
      return <FiFacebook />;

    case "linkedin":
      return <FiLinkedin />;

    case "youtube":
      return <FiYoutube />;

    case "x":
    case "twitter":
      return <FaXTwitter />;

    case "whatsapp":
      return <FaWhatsapp />;

    case "tiktok":
      return <FaTiktok />;

    default:
      return <FiArrowUpRight />;
  }
}
