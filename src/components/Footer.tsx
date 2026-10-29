import { memo } from 'react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

// 1. Pixel Mosaic Block (Col 2, 3 rows from bottom in PC)
function PixelMosaicBlock() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full block" preserveAspectRatio="none">
      <rect width="100" height="100" fill="#7928CA" />
      {/* Scattered white pixel tapestry */}
      <rect x="12" y="10" width="10" height="10" fill="#ffffff" />
      <rect x="34" y="10" width="10" height="10" fill="#ffffff" />
      <rect x="56" y="10" width="10" height="10" fill="#ffffff" />
      <rect x="78" y="10" width="10" height="10" fill="#ffffff" />
      <rect x="23" y="21" width="10" height="10" fill="#ffffff" />
      <rect x="45" y="21" width="10" height="10" fill="#ffffff" />
      <rect x="89" y="21" width="10" height="10" fill="#ffffff" />
      <rect x="12" y="32" width="10" height="10" fill="#ffffff" />
      <rect x="67" y="32" width="10" height="10" fill="#ffffff" />
      <rect x="23" y="43" width="10" height="10" fill="#ffffff" />
      <rect x="45" y="43" width="10" height="10" fill="#ffffff" />
      <rect x="78" y="43" width="10" height="10" fill="#ffffff" />
      <rect x="34" y="54" width="10" height="10" fill="#ffffff" />
      <rect x="56" y="54" width="10" height="10" fill="#ffffff" />
      <rect x="89" y="54" width="10" height="10" fill="#ffffff" />
      <rect x="12" y="65" width="10" height="10" fill="#ffffff" />
      <rect x="45" y="65" width="10" height="10" fill="#ffffff" />
      <rect x="67" y="65" width="10" height="10" fill="#ffffff" />
      <rect x="34" y="76" width="10" height="10" fill="#ffffff" />
      <rect x="78" y="76" width="10" height="10" fill="#ffffff" />
      <rect x="23" y="87" width="10" height="10" fill="#ffffff" />
      <rect x="56" y="87" width="10" height="10" fill="#ffffff" />
    </svg>
  );
}

// 2. Horizontal Bars Left (Col 1, 2 rows from bottom in PC)
function StripesCellLeft() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full block" preserveAspectRatio="none">
      <rect width="100" height="100" fill="#7928CA" />
      <rect x="0" y="24" width="60" height="13" fill="#ffffff" />
      <rect x="30" y="44" width="70" height="13" fill="#ede9fe" />
    </svg>
  );
}

// 3. Checkered & Horizontal Stripes Cell (Col 2, 2 rows from bottom in PC)
function CheckeredStripesCell() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full block" preserveAspectRatio="none">
      <rect width="100" height="100" fill="#09090c" />
      {/* Checkered pattern in top right */}
      <rect x="62" y="8" width="9" height="9" fill="#7928CA" />
      <rect x="80" y="8" width="9" height="9" fill="#7928CA" />
      <rect x="71" y="8" width="9" height="9" fill="#ffffff" />
      <rect x="89" y="8" width="9" height="9" fill="#ffffff" />

      <rect x="62" y="17" width="9" height="9" fill="#ffffff" />
      <rect x="80" y="17" width="9" height="9" fill="#ffffff" />
      <rect x="71" y="17" width="9" height="9" fill="#7928CA" />
      <rect x="89" y="17" width="9" height="9" fill="#7928CA" />

      <rect x="62" y="26" width="9" height="9" fill="#7928CA" />
      <rect x="80" y="26" width="9" height="9" fill="#7928CA" />
      <rect x="71" y="26" width="9" height="9" fill="#ffffff" />
      <rect x="89" y="26" width="9" height="9" fill="#ffffff" />

      {/* Horizontal stripes on left */}
      <rect x="0" y="10" width="30" height="7" fill="#ede9fe" />
      <rect x="0" y="22" width="54" height="9" fill="#7928CA" />
      <rect x="0" y="42" width="32" height="11" fill="#ffffff" />
      <rect x="0" y="58" width="32" height="8" fill="#ede9fe" />
      <rect x="32" y="58" width="68" height="42" fill="#7928CA" />
    </svg>
  );
}

// 4. Geometric Lavender & Purple Blocks (Col 2, 1 row from bottom in PC)
function GeometricBlockCell() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full block" preserveAspectRatio="none">
      <rect width="100" height="100" fill="#ede9fe" />
      <rect x="0" y="38" width="36" height="52" fill="#7928CA" />
      <rect x="36" y="0" width="64" height="100" fill="#7928CA" />
      <rect x="36" y="38" width="64" height="62" fill="#ede9fe" />
    </svg>
  );
}

// 5. Bottom Lavender Segment (Col 2, bottom-most row in PC)
function BottomBlockCell() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full block" preserveAspectRatio="none">
      <rect width="100" height="100" fill="#ede9fe" />
      <rect x="0" y="45" width="36" height="55" fill="#7928CA" />
    </svg>
  );
}

// 6. Data Stream Striped Bars 1 (Col 3, bottom-most row in PC)
function DataStripesCell1() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full block" preserveAspectRatio="none">
      <rect width="100" height="100" fill="#7928CA" />
      <rect x="10" y="8" width="85" height="7" fill="#ffffff" />
      <rect x="0" y="22" width="68" height="8" fill="#ede9fe" />
      <rect x="25" y="38" width="75" height="8" fill="#ffffff" />
      <rect x="10" y="54" width="55" height="7" fill="#ede9fe" />
      <rect x="42" y="68" width="58" height="8" fill="#ffffff" />
      <rect x="0" y="84" width="72" height="7" fill="#ede9fe" />
    </svg>
  );
}

// 7. Data Stream Striped Bars 2 (Col 4, bottom-most row in PC)
function DataStripesCell2() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full block" preserveAspectRatio="none">
      <rect width="100" height="100" fill="#7928CA" />
      <rect x="0" y="8" width="62" height="7" fill="#ede9fe" />
      <rect x="32" y="22" width="68" height="8" fill="#ffffff" />
      <rect x="0" y="38" width="88" height="8" fill="#ede9fe" />
      <rect x="40" y="54" width="60" height="7" fill="#ffffff" />
      <rect x="0" y="68" width="75" height="8" fill="#ede9fe" />
      <rect x="20" y="84" width="80" height="7" fill="#ffffff" />
    </svg>
  );
}

// 8. Right Corner Cell (Col 8, bottom-most row in PC)
function RightCornerCell() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full block" preserveAspectRatio="none">
      <rect width="100" height="100" fill="#7928CA" />
      <rect x="0" y="65" width="80" height="7" fill="#ffffff" />
      <rect x="0" y="78" width="80" height="7" fill="#ede9fe" />
      {/* 3x3 checkered corner bottom right */}
      <rect x="80" y="65" width="10" height="10" fill="#ffffff" />
      <rect x="90" y="65" width="10" height="10" fill="#7928CA" />
      <rect x="80" y="75" width="10" height="10" fill="#7928CA" />
      <rect x="90" y="75" width="10" height="10" fill="#ffffff" />
      <rect x="80" y="85" width="10" height="10" fill="#ffffff" />
      <rect x="90" y="85" width="10" height="10" fill="#7928CA" />
    </svg>
  );
}

interface LinkItem {
  label: string;
  onClick?: () => void;
  href?: string;
}

function Footer({ onNavigate }: FooterProps) {
  // 1. BBD Website Info
  const bbdInfo: LinkItem[] = [
    { label: 'BBD University Portal', href: 'https://bbdu.ac.in' },
    { label: 'School of Engineering', href: 'https://bbdu.ac.in' },
    { label: 'Campus: Faizabad Road, Lucknow', href: 'https://bbdu.ac.in' },
    { label: 'Admissions & Academic Wings', href: 'https://bbdu.ac.in' },
    { label: 'Helpline: +91 (522) 6196222', href: 'tel:+915226196222' },
    { label: 'Contact: info@bbdu.org', href: 'mailto:info@bbdu.org' },
  ];

  // 2. Our Website Pages
  const ourPages: LinkItem[] = [
    { label: 'Home Page', onClick: () => onNavigate('home') },
    { label: 'Events & Highlights', onClick: () => onNavigate('events') },
    { label: 'Office Bearers & Team', onClick: () => onNavigate('team') },
    { label: 'Moments & Gallery', onClick: () => onNavigate('gallery') },
    { label: 'Newsletters & Research', onClick: () => onNavigate('newsletter') },
    { label: 'Contact Secretariat', onClick: () => onNavigate('contact') },
    { label: 'Admin Event Studio', onClick: () => onNavigate('admin-events') },
  ];

  // 3. IEEE Official Pages
  const ieeeOfficial: LinkItem[] = [
    { label: 'IEEE Global Portal', href: 'https://www.ieee.org' },
    { label: 'IEEE Xplore Digital Library', href: 'https://ieeexplore.ieee.org' },
    { label: 'IEEE Region 10 (Asia-Pacific)', href: 'https://www.ieeer10.org' },
    { label: 'IEEE Uttar Pradesh Section', href: 'https://ieeeup.org' },
    { label: 'IEEE Computer Society', href: 'https://www.computer.org' },
    { label: 'IEEE Women in Engineering', href: 'https://wie.ieee.org' },
    { label: 'IEEE Collabratec', href: 'https://ieee-collabratec.ieee.org' },
  ];

  // 4. Social Handles (LinkedIn & Insta prioritized as requested)
  const socials: LinkItem[] = [
    { label: 'LinkedIn (IEEE BBDU)', href: 'https://www.linkedin.com/company/ieee-bbdu/' },
    { label: 'Instagram (@ieeebbdu)', href: 'https://www.instagram.com/ieeebbdu' },
    { label: 'GitHub Organization', href: 'https://github.com' },
    { label: 'Discord Community', href: 'https://discord.com' },
    { label: 'YouTube Channel', href: 'https://youtube.com' },
  ];

  // 5. Branch Highlights & Code
  const branchHighlights: LinkItem[] = [
    { label: 'Branch Code: STB99214', onClick: () => onNavigate('about') },
    { label: 'IEEE UP Section R10', href: 'https://ieeeup.org' },
    { label: 'IEEE Code of Ethics', href: 'https://www.ieee.org/about/ethics.html' },
    { label: 'Member Benefits Guide', onClick: () => onNavigate('about') },
    { label: 'Event Certifications', onClick: () => onNavigate('events') },
  ];

  const renderLink = (item: LinkItem, idx: number) => {
    if (item.onClick) {
      return (
        <li key={idx}>
          <button
            onClick={item.onClick}
            className="hover:text-white transition-colors text-left truncate w-full block cursor-pointer"
          >
            {item.label}
          </button>
        </li>
      );
    }
    return (
      <li key={idx}>
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors truncate block"
        >
          {item.label}
        </a>
      </li>
    );
  };

  return (
    <footer id="main-footer" className="w-full bg-[#0a0a0c] text-white border-t border-zinc-700/25 relative overflow-hidden select-none">
      
      {/* ========================================================================= */}
      {/* 1. PC / DESKTOP LAYOUT (Matching user image_b9cfd5ae.png exactly)        */}
      {/* ========================================================================= */}
      <div className="hidden lg:grid w-full grid-cols-8">
        
        {/* ROW 1: Top row of 8 empty grid boxes with light greyish lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`top-cell-${i}`}
            className="h-14 md:h-18 border-r border-b border-zinc-700/25 last:border-r-0"
          />
        ))}

        {/* Col 1: Leftmost track with purple horizontal stripe near bottom */}
        <div className="col-span-1 border-r border-zinc-700/25 flex flex-col justify-end">
          <div className="h-20 sm:h-24 md:h-28 border-t border-zinc-700/25 overflow-hidden">
            <StripesCellLeft />
          </div>
          <div className="h-20 sm:h-24 md:h-28 border-t border-zinc-700/25" />
        </div>

        {/* Col 2: BBD WEBSITE INFO + Tapestry stack on bottom */}
        <div className="col-span-1 border-r border-zinc-700/25 pt-6 pb-2 px-3 flex flex-col justify-between">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white mb-4 font-mono">
              BBD UNIVERSITY
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400 font-sans">
              {bbdInfo.map(renderLink)}
            </ul>
          </div>

          {/* Col 2 Tapestry Stack: Mosaic, Checkered, Geometric, Bottom segment */}
          <div className="mt-8 pt-4">
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25 overflow-hidden">
              <PixelMosaicBlock />
            </div>
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25 overflow-hidden">
              <CheckeredStripesCell />
            </div>
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25 overflow-hidden">
              <GeometricBlockCell />
            </div>
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25 overflow-hidden">
              <BottomBlockCell />
            </div>
          </div>
        </div>

        {/* Col 3: OUR WEBSITE PAGES + Data Stripes 1 on bottom */}
        <div className="col-span-1 border-r border-zinc-700/25 pt-6 pb-2 px-3 flex flex-col justify-between">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white mb-4 font-mono">
              OUR PAGES
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400 font-sans">
              {ourPages.map(renderLink)}
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25 overflow-hidden">
              <DataStripesCell1 />
            </div>
          </div>
        </div>

        {/* Col 4: IEEE OFFICIAL PAGES + Data Stripes 2 on bottom */}
        <div className="col-span-1 border-r border-zinc-700/25 pt-6 pb-2 px-3 flex flex-col justify-between">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white mb-4 font-mono">
              IEEE OFFICIAL
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400 font-sans">
              {ieeeOfficial.map(renderLink)}
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25 overflow-hidden">
              <DataStripesCell2 />
            </div>
          </div>
        </div>

        {/* Col 5: SOCIAL HANDLES (LinkedIn & Insta) */}
        <div className="col-span-1 border-r border-zinc-700/25 pt-6 pb-2 px-3 flex flex-col justify-between">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white mb-4 font-mono">
              SOCIAL HANDLES
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400 font-sans">
              {socials.map(renderLink)}
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
          </div>
        </div>

        {/* Col 6: STUDENT BRANCH INFO & ETHICS */}
        <div className="col-span-1 border-r border-zinc-700/25 pt-6 pb-2 px-3 flex flex-col justify-between">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white mb-4 font-mono">
              BRANCH INFO
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400 font-sans">
              {branchHighlights.map(renderLink)}
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
          </div>
        </div>

        {/* Col 7: CHAPTERS & CONTACT */}
        <div className="col-span-1 border-r border-zinc-700/25 pt-6 pb-2 px-3 flex flex-col justify-between">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white mb-4 font-mono">
              CHAPTERS
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400 font-sans">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors text-left truncate w-full block">
                  Computer Society (CS)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors text-left truncate w-full block">
                  Women in Engineering (WIE)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('team')} className="hover:text-white transition-colors text-left truncate w-full block">
                  Executive Officers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors text-left truncate w-full block">
                  Join Secretariat
                </button>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
            <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
          </div>
        </div>

        {/* Col 8: Rightmost track with Corner Glitch Art in bottom cell */}
        <div className="col-span-1 flex flex-col justify-end">
          <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
          <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
          <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25" />
          <div className="h-16 sm:h-20 md:h-24 border-t border-zinc-700/25 overflow-hidden">
            <RightCornerCell />
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE LAYOUT (Matching user image_3bbf9195.png exactly)               */}
      {/* Left vertical grid column + All content stacked in one column on right    */}
      {/* ========================================================================= */}
      <div className="block lg:hidden w-full">
        {/* Top row of grid boxes across width */}
        <div className="grid grid-cols-6 border-b border-zinc-700/25">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`m-top-${i}`} className="h-10 border-r border-zinc-700/25 last:border-r-0" />
          ))}
        </div>

        {/* Two-column layout: Left grid track + Right single-column content stack */}
        <div className="flex w-full">
          {/* Left Grid Track with light grey borders and purple stripe decorative cell */}
          <div className="w-12 sm:w-16 shrink-0 border-r border-zinc-700/25 flex flex-col justify-between">
            <div className="divide-y divide-zinc-700/25">
              <div className="h-16" />
              <div className="h-16" />
              <div className="h-16" />
              <div className="h-16" />
              <div className="h-16" />
              <div className="h-16" />
              <div className="h-16" />
            </div>
            
            {/* Lower decorative purple striped cell */}
            <div className="divide-y divide-zinc-700/25 border-t border-zinc-700/25">
              <div className="h-16 overflow-hidden">
                <StripesCellLeft />
              </div>
              <div className="h-16 overflow-hidden">
                <PixelMosaicBlock />
              </div>
              <div className="h-16" />
            </div>
          </div>

          {/* Right Content Area: All sections stacked in one column one below the other */}
          <div className="flex-1 py-8 px-5 sm:px-8 space-y-8">
            {/* Section 1: BBD University Info */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
                BBD UNIVERSITY INFO
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400 font-sans">
                {bbdInfo.map(renderLink)}
              </ul>
            </div>

            {/* Section 2: Our Website Pages */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
                OUR WEBSITE PAGES
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400 font-sans">
                {ourPages.map(renderLink)}
              </ul>
            </div>

            {/* Section 3: IEEE Official Pages */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
                IEEE OFFICIAL PAGES
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400 font-sans">
                {ieeeOfficial.map(renderLink)}
              </ul>
            </div>

            {/* Section 4: Social Handles of LinkedIn & Insta */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
                SOCIAL HANDLES
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400 font-sans">
                {socials.map(renderLink)}
              </ul>
            </div>

            {/* Section 5: Branch Code & Chapters */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
                BRANCH HIGHLIGHTS
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400 font-sans">
                {branchHighlights.map(renderLink)}
              </ul>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default memo(Footer);
