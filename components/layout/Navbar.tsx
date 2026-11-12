"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiGlobe, FiMenu, FiUser, FiX } from "react-icons/fi";
import type { Locale } from "@/lib/i18n/config";
import { getTranslations } from "@/lib/i18n/translations";
import Image from "next/image";
import Logo from "@/public/images/logo.webp";
import { CgMenuRightAlt } from "react-icons/cg";

interface NavbarProps {
  locale: Locale;
  companyProfileUrl: string | null;
}

export default function Navbar({ locale, companyProfileUrl }: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = getTranslations(locale);
  const isArabic = locale === "ar";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    {
      label: t.nav.home,
      href: isArabic ? "/" : "/en/",
    },
    {
      label: t.nav.about,
      href: isArabic ? "/about/" : "/en/about/",
    },
    {
      label: t.nav.services,
      href: isArabic ? "/services/" : "/en/services/",
    },
    {
      label: t.nav.exhibitions,
      href: isArabic ? "/exhibitions/" : "/en/exhibitions/",
    },
    {
      label: t.nav.blog,
      href: isArabic ? "/blog/" : "/en/blog/",
    },
    {
      label: t.nav.contact,
      href: isArabic ? "/contact/" : "/en/contact/",
    },
  ];

  const pathSegments = pathname.split("/").filter(Boolean);

  // Remove locale prefixes to get the public path.
  while (
    pathSegments.length > 0 &&
    (pathSegments[0] === "ar" || pathSegments[0] === "en")
  ) {
    pathSegments.shift();
  }

  const cleanPath = pathSegments.length
    ? `/${pathSegments.join("/")}/`
    : "/";

  const languageHref =
    locale === "ar"
      ? cleanPath === "/"
        ? "/en/"
        : `/en${cleanPath}`
      : cleanPath;

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function normalizeComparablePath(path: string) {
    const segments = path.split("/").filter(Boolean);

    while (
      segments.length > 0 &&
      (segments[0] === "ar" || segments[0] === "en")
    ) {
      segments.shift();
    }

    return segments.length
      ? `/${segments.join("/")}/`
      : "/";
  }

  function isActive(href: string) {
    const currentPath = normalizeComparablePath(pathname);
    const targetPath = normalizeComparablePath(href);

    return (
      currentPath === targetPath ||
      (targetPath !== "/" && currentPath.startsWith(targetPath))
    );
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 
                ${isScrolled ? "border-b border-white/20 bg-slate-900/95 shadow-sm backdrop-blur-xl" : "border-transparent bg-transparent"}`}
    >
      <nav className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link
          href={isArabic ? "/" : "/en/"}
          onClick={closeMenu}
          dir="ltr"
          className="flex shrink-0 items-center gap-1"
        >
          {/* Logo Symbol */}
          <div className="h-12 w-10 shrink-0 overflow-hidden">
            <Image
              src={Logo}
              alt="Event Maker"
              width={150}
              height={100}
              priority
              className="h-12 w-auto max-w-none"
            />
          </div>

          {/* Logo Text */}
          <span
            className={`flex flex-col text-left text-[22px] font-semibold leading-[0.95] transition-colors duration-300 text-white!`}
          >
            <span>EVENT</span>
            <span>MAKER</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-4 py-2 text-[14px] font-medium transition-all duration-200 ${active
                  ? isScrolled
                    ? "bg-slate-100 text-slate-900"
                    : "bg-white/15 text-white"
                  : isScrolled
                    ? "text-white hover:bg-slate-100 hover:text-slate-950"
                    : "text-white hover:bg-white/10 hover:text-white"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Company Profile */}
          {companyProfileUrl && (
            <a
              href={companyProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-orange-600"
            >
              <span>{isArabic ? "بروفايل" : "Profile"}</span>
            </a>
          )}

          {/* Language Switcher */}
          <Link
            href={languageHref}
            onClick={closeMenu}
            aria-label={t.nav.language}
            className={`ml-1 flex h-10 items-center gap-2 rounded-full border px-4 text-[16px] font-semibold transition-all duration-300 border-slate-200 text-white`}
          >
            <FiGlobe className="text-base" />
            <span>{t.nav.language}</span>
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Language */}
          <Link
            href={languageHref}
            onClick={closeMenu}
            aria-label={t.nav.language}
            className={`flex h-10 items-center gap-2 rounded-full text-[18px] border px-3 text-sm font-semibold transition-all duration-300 border-slate-200 text-white `}
          >
            <FiGlobe className="text-base" />
            <span>{t.nav.language}</span>
          </Link>

          {/* Menu Button */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 border-slate-200 text-white`}
          >
            {isMenuOpen ? (
              <FiX className="text-xl" />
            ) : (
              <CgMenuRightAlt
                className={`text-[35px] ${isArabic && "rotate-180"}`}
              />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          className={`border-t backdrop-blur-xl lg:hidden ${isScrolled ? "border-slate-200 bg-white/95" : "border-white/10 bg-slate-950/90"}`}
        >
          <div className="mx-auto flex max-w-7xl flex-col px-5 py-4">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`rounded-xl px-4 py-3 text-[15px] font-medium transition-all ${active
                    ? isScrolled
                      ? "bg-slate-900 text-white"
                      : "bg-white/15 text-white"
                    : isScrolled
                      ? "text-slate-700 hover:bg-slate-100"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Company Profile */}
            {companyProfileUrl && (
              <a
                href={companyProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-orange-600"
              >
                <span>{isArabic ? "بروفايل" : "Profile"}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
