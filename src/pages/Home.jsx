import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Eye } from 'lucide-react';
import { publicApi } from '../services/api';
import { useSite } from '../context/SiteContext';
import SeoHead from '../components/SeoHead';
import ProductDetailModal from '../components/ProductDetailModal';

const WHY_CHOOSE_THEMES = [
  {
    code: '01',
    title: 'Four Focused Product & Service Divisions',
    description:
      'Adhesi Pro adhesives, PCD & TCT saw blades, panel-processing machinery, and PVC edge-banding tapes & furniture hardware structured under dedicated divisions.',
  },
  {
    code: '02',
    title: 'Products for Furniture, Kitchen, Door & Woodworking Applications',
    description:
      'Relevant industrial consumables, cutting tools, machinery, and fittings selected specifically for modular and woodworking production floors.',
  },
  {
    code: '03',
    title: 'Machinery Service & Spare-Parts Support',
    description:
      'Support for panel-processing equipment covering installation assistance, preventive maintenance, troubleshooting, repairs, and spare parts.',
  },
  {
    code: '04',
    title: 'One Point of Contact for Related Requirements',
    description:
      'Coordinate adhesives, blades, machinery, and furniture hardware through a single accountable team rather than fragmented vendors.',
  },
];

const pill =
  'inline-flex items-center gap-2 rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-transform duration-300 hover:-translate-y-0.5';

const SPOTLIGHT_PRODUCTS = [
  {
    slug: 'pcd-pre-milling-cutters',
    name: 'Pre-Milling & Spindle Moulder Cutters',
    category: 'PCD Pre-Milling Cutters',
    shortDescription:
      'Industrial pre-milling and profile cutter sets engineered for clean, chip-free panel edge preparation prior to edge banding.',
    division: { slug: 'pcd-blades' },
    images: [
      {
        url: '/assets/products/pcd-blades/pre-milling-cutters.png',
        alt: 'YASH Industrial Woodworking Pre-Milling & Profile Cutters',
      },
    ],
  },
  {
    slug: 'automatic-edge-banding-machine',
    name: 'Automatic Industrial Edge-Banding Machine',
    category: 'Edge-Banding Machines',
    shortDescription:
      'Enclosed industrial edge-banding machine with swiveling touchscreen operator console for modular furniture and kitchen panel finishing.',
    division: { slug: 'panel-processing' },
    images: [
      {
        url: '/assets/products/panel-processing/edge-banding-machine.png',
        alt: 'Automatic Industrial Edge-Banding Machine',
      },
    ],
  },
  {
    slug: 'pvc-edge-banding-tapes',
    name: 'Woodgrain & Solid-Colour PVC Edge-Banding Tapes',
    category: 'PVC Edge-Banding Tapes',
    shortDescription:
      'PVC edge-banding tapes in natural woodgrain textures and solid colours for modular furniture, kitchen shutters, and panels.',
    division: { slug: 'edge-banding-hardware' },
    images: [
      {
        url: '/assets/products/edge-banding-hardware/pvc-woodgrain-tape.png',
        alt: 'Woodgrain PVC Edge-Banding Tape Roll',
      },
    ],
  },
  {
    slug: 'lockpro-wr-3',
    name: 'Lockpro WR 3 (D3 Water-Resistant Adhesive)',
    category: 'D3 and Commercial D3 Adhesives',
    shortDescription:
      'Water-resistant woodworking adhesive formulated for modular kitchen, door, and furniture bonding applications.',
    division: { slug: 'adhesi-pro' },
    images: [
      {
        url: '/assets/products/adhesi-pro/lockpro-wr3-drum.png',
        alt: 'Adhesi Pro Lockpro WR 3 Drum Packaging',
      },
    ],
  },
  {
    slug: 'industrial-grooving-saw-blade',
    name: 'Industrial Grooving & Slot Cutter Saw Blade (TCT / PCD)',
    category: 'Grooving Saw Blades',
    shortDescription:
      'Precision grooving and panel-saw blade solutions available in TCT and PCD configurations for panel-processing applications.',
    division: { slug: 'pcd-blades' },
    images: [
      {
        url: '/assets/products/pcd-blades/grooving-saw-blade.png',
        alt: 'YASH Industrial Grooving Saw Blade',
      },
    ],
  },
  {
    slug: 'dual-spindle-cnc-machine',
    name: 'Dual-Spindle CNC Router & Nesting Machine',
    category: 'CNC Machines',
    shortDescription:
      'Heavy-duty flatbed CNC routing and nesting machine with standalone control cabinet for precision panel cutting, profiling, and door machining.',
    division: { slug: 'panel-processing' },
    images: [
      {
        url: '/assets/products/panel-processing/cnc-nesting-machine.png',
        alt: 'Dual-Spindle CNC Router & Nesting Machine',
      },
    ],
  },
  {
    slug: 'sliding-table-panel-saw-machine',
    name: 'Sliding Table Panel-Saw Machine',
    category: 'Panel-Saw Machines',
    shortDescription:
      'Precision sliding table panel saw with anodized aluminum carriage, outrigger crosscut fence, and overhead blade dust hood.',
    division: { slug: 'panel-processing' },
    images: [
      {
        url: '/assets/products/panel-processing/sliding-table-panel-saw.png',
        alt: 'Sliding Table Panel-Saw Machine',
      },
    ],
  },
];

export default function Home() {
  const { siteSettings, divisions } = useSite();
  const prefersReducedMotion = useReducedMotion();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [catalogTravel, setCatalogTravel] = useState(0);
  const catalogRef = useRef(null);
  const catalogViewportRef = useRef(null);
  const catalogTrackRef = useRef(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      publicApi.getProducts({ limit: 40 }),
      publicApi.getIndustries(),
    ])
      .then(([prods, inds]) => {
        if (!active) return;
        if (Array.isArray(prods)) setFeaturedProducts(prods);
        if (Array.isArray(inds)) setIndustries(inds);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const spotlightProducts = SPOTLIGHT_PRODUCTS.map((item) => {
    const live = featuredProducts.find((product) => product.slug === item.slug);
    return live || item;
  });

  const { scrollYProgress: catalogProgress } = useScroll({
    target: catalogRef,
    offset: ['start start', 'end end'],
  });
  const catalogX = useTransform(
    catalogProgress,
    [0, 1],
    [0, prefersReducedMotion ? 0 : -catalogTravel]
  );

  useEffect(() => {
    const viewport = catalogViewportRef.current;
    const track = catalogTrackRef.current;
    if (!viewport || !track) return undefined;

    const measure = () => {
      setCatalogTravel(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [spotlightProducts.length]);

  const fadeUp = prefersReducedMotion
    ? { initial: { opacity: 1 }, whileInView: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
      };

  const DIVISION_LUXURY_META = {
    'adhesi-pro': {
      subtitle: 'Industrial Woodworking & Modular Furniture Adhesives',
      signatureLine: 'Lockpro WR 3 · Lockpro 808 · Lockpro 707 · 1K PUR',
      categories: [
        'PVAC White Glue',
        'D3 & Commercial D3 Adhesives',
        'D2 Adhesives',
        'PVC / Acrylic Adhesives',
        'PUR Adhesives',
      ],
      heroImage: '/assets/products/adhesi-pro/lockpro-wr3-drum.png',
      secondaryImage: '/assets/products/adhesi-pro/lockpro-808-drum.png',
    },
    'pcd-blades': {
      subtitle: 'TCT & PCD Precision Tooling for Panel Processing',
      signatureLine: 'Diamond & Carbide Tooling Matched to Your Machinery',
      categories: [
        'PCD Pre-Milling Cutters',
        'Grooving Saw Blades',
        'TCT & PCD Circular Saw Blades',
        'Panel-Sizing & Scoring Blades',
      ],
      heroImage: '/assets/products/pcd-blades/pre-milling-cutters.png',
      secondaryImage: '/assets/products/pcd-blades/grooving-saw-blade.png',
    },
    'panel-processing': {
      subtitle: 'Industrial Woodworking Machinery, Spare Parts & Technical Service',
      signatureLine: 'Installation · Preventive Maintenance · Repairs · Spare Parts',
      categories: [
        'Edge-Banding Machines',
        'Dual-Spindle CNC Routers',
        'Sliding Table Panel Saws',
        'Hydraulic Cold/Hot Presses',
        'Multi-Boring Machines',
      ],
      heroImage: '/assets/products/panel-processing/edge-banding-machine.png',
      secondaryImage: '/assets/products/panel-processing/cnc-nesting-machine.png',
    },
    'edge-banding-hardware': {
      subtitle: 'Architectural PVC Edge-Banding Tapes & Furniture Fittings',
      signatureLine: 'Coordinated Surface Finishes & High-Cycle Cabinet Hardware',
      categories: [
        'Woodgrain PVC Edge Tapes',
        'Solid-Colour PVC Tapes',
        'Telescopic Drawer Channels',
        'Concealed Cup Hinges',
        'Mini Fix KD Fittings',
      ],
      heroImage: '/assets/products/edge-banding-hardware/pvc-woodgrain-tape.png',
      secondaryImage: '/assets/products/edge-banding-hardware/telescopic-drawer-channels.png',
    },
  };

  const divisionCards = (
    divisions && divisions.length > 0
      ? divisions.map((d, idx) => ({
          ...d,
          code: d.code || `0${idx + 1}`,
          displayName:
            d.slug === 'adhesi-pro' && siteSettings?.adhesiBrandSpelling
              ? siteSettings.adhesiBrandSpelling
              : d.name,
        }))
      : [
          {
            code: '01',
            displayName: siteSettings?.adhesiBrandSpelling || 'Adhesi Pro',
            slug: 'adhesi-pro',
            shortDescription:
              'Adhesi Pro is the adhesive brand associated with Modu Pro Innovation Pvt. Ltd. The product range supports furniture, modular-kitchen, door and woodworking applications.',
            heroImage: '/assets/products/adhesi-pro/lockpro-wr3-drum.png',
          },
          {
            code: '02',
            displayName: 'PCD Pre-Milling & Grooving Saw Blades',
            slug: 'pcd-blades',
            shortDescription:
              'Explore PCD pre-milling and grooving saw-blade solutions for woodworking and panel-processing applications.',
            heroImage: '/assets/products/pcd-blades/pre-milling-cutters.png',
          },
          {
            code: '03',
            displayName: 'Panel Processing Machines Division',
            slug: 'panel-processing',
            shortDescription:
              'Modu Pro Innovation Pvt. Ltd. supports woodworking operations with panel-processing machinery, related spare parts and service support.',
            heroImage: '/assets/products/panel-processing/edge-banding-machine.png',
          },
          {
            code: '04',
            displayName: 'PVC Edge-Banding Tapes & Hardware',
            slug: 'edge-banding-hardware',
            shortDescription:
              'This division brings together PVC edge-banding tapes and selected furniture fittings used in modular furniture and kitchen applications.',
            heroImage: '/assets/products/edge-banding-hardware/pvc-woodgrain-tape.png',
          },
        ]
  ).map((d, idx) => {
    const meta = DIVISION_LUXURY_META[d.slug] || {};
    return {
      ...d,
      code: d.code || `0${idx + 1}`,
      subtitle: d.subtitle || meta.subtitle || 'Modu Pro Core Business Division',
      signatureLine: meta.signatureLine || 'Integrated Woodworking & Modular Industry Solutions',
      categories:
        Array.isArray(d.categories) && d.categories.length > 0
          ? d.categories
          : meta.categories || [],
      heroImage: d.heroImage || meta.heroImage,
      secondaryImage: meta.secondaryImage || d.coverImage || d.heroImage,
    };
  });

  const industryCards =
    industries && industries.length > 0
      ? industries
      : [
          {
            name: 'Modular Furniture Manufacturers',
            slug: 'modular-furniture-manufacturing',
            shortDescription:
              'Coordinated adhesives, panel sizing & edge-banding machinery, TCT/PCD blades, PVC edge tapes, and KD fittings.',
            image: '/assets/products/panel-processing/edge-banding-machine.png',
          },
          {
            name: 'Modular Kitchen Manufacturers',
            slug: 'modular-kitchen-manufacturing',
            shortDescription:
              'Water-resistant D3 & PUR adhesives, pre-milling cutters, telescopic drawer channels, and 2D/3D concealed hinges.',
            image: '/assets/products/edge-banding-hardware/telescopic-drawer-channels.png',
          },
          {
            name: 'Door Manufacturers',
            slug: 'door-manufacturing',
            shortDescription:
              'Industrial lamination adhesives, hydraulic cold/hot-press machinery, dual-spindle CNC routers, and panel-saw blades.',
            image: '/assets/products/panel-processing/hydraulic-cold-press.png',
          },
          {
            name: 'Woodworking and Panel-Processing Businesses',
            slug: 'woodworking-and-panel-processing',
            shortDescription:
              'Complete panel-processing equipment, spare parts, preventive maintenance, repairs, and industrial consumables.',
            image: '/assets/products/panel-processing/cnc-nesting-machine.png',
          },
        ];

  return (
    <>
      <SeoHead
        title="Complete Solutions for Woodworking and Modular Industries"
        description={siteSettings?.hero?.supportingText}
        canonicalPath="/"
      />

      <section className="hero-banner-dark relative -mt-[76px] pt-[76px] min-h-[86svh] lg:min-h-[92svh] flex items-center overflow-hidden">
        {/* Full-Width Background Banner */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/full%20backgorund%20banners/homepage%20banner.png"
            alt="Modu Pro Innovation Pvt. Ltd. industrial woodworking and panel-processing facility"
            fetchPriority="high"
            width="1920"
            height="820"
            className="w-full h-full object-cover object-[72%_center] sm:object-center"
          />
          {/* Subtle directional overlay for left-column text contrast while keeping right-side machinery crisp */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#0A1428]/90 via-[#0A1428]/55 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0A1428]/70 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A1428] to-transparent"
          />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl space-y-6 sm:space-y-7"
          >
            <div className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-[1px] w-8 bg-[#D9C08B]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D9C08B]">
                Modu Pro Innovation Pvt. Ltd.
              </p>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.6rem] font-medium text-[#F4EEDF] leading-[0.98] tracking-tight">
              {siteSettings?.hero?.heading ||
                'Complete Solutions for Woodworking and Modular Industries'}
            </h1>

            <p className="text-base sm:text-lg text-[#F4EEDF]/85 leading-relaxed max-w-xl">
              {siteSettings?.hero?.supportingText ||
                'Modu Pro Innovation Pvt. Ltd. brings together adhesive products, precision woodworking blades, panel-processing machinery and furniture hardware to support manufacturers across the woodworking and modular-furniture industry.'}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link to="/divisions" className={`${pill} bg-[#D9C08B] text-[#0A1428]`}>
                <span>{siteSettings?.hero?.primaryCtaLabel || 'Explore Our Divisions'}</span>
                <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className={`${pill} bg-[#16294D] text-[#F4EEDF] border border-[#D9C08B]/35`}
              >
                <span>{siteSettings?.hero?.secondaryCtaLabel || 'Discuss Your Requirement'}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-8 sm:pb-12">
        <motion.p
          {...fadeUp}
          className="max-w-3xl mx-auto px-6 text-center font-display text-2xl sm:text-3xl leading-snug text-[#F4EEDF]/90"
        >
          {siteSettings?.aboutContent?.overviewParagraphTwo ||
            'Our goal is to support manufacturers with relevant products, dependable communication and practical assistance for their woodworking requirements.'}
        </motion.p>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div {...fadeUp} className="lg:col-span-6">
              <div className="lux-curve-alt bg-[#16294D] min-h-[380px] p-10 flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/products/panel-processing/edge-banding-machine.png"
                  alt="Automatic industrial edge-banding machine"
                  loading="lazy"
                  width="560"
                  height="420"
                  className="max-h-80 w-auto object-contain"
                />
              </div>
            </motion.div>
            <motion.div {...fadeUp} className="lg:col-span-6 space-y-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#D9C08B]">
                The Modu Pro advantage
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-medium leading-[1.05] text-[#F4EEDF]">
                Unified product and machinery support for modern woodworking.
              </h2>
              <p className="text-base text-[#F4EEDF]/75 leading-relaxed">
                {siteSettings?.aboutContent?.overviewParagraphOne ||
                  'Modu Pro Innovation Pvt. Ltd. serves the needs of modular furniture, kitchen, door and woodworking manufacturers through a focused range of products and industry solutions. The company brings together adhesive products, woodworking blades, panel-processing machinery and furniture hardware under one business, helping customers explore related products and services through a single point of contact.'}
              </p>
              <Link to="/about" className={`${pill} bg-[#D9C08B] text-[#0A1428]`}>
                <span>Read about Modu Pro</span>
                <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        className="hero-banner-dark relative"
        aria-labelledby="division-stack-heading"
      >
        {/* Pinned Full-Screen Luxury Architectural Background Stage */}
        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-0">
          <img
            src="/assets/full%20backgorund%20banners/landing%20page%20scrolling%20listing.png"
            alt=""
            loading="lazy"
            width="1920"
            height="820"
            className="w-full h-full object-cover object-center scale-[1.03]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#0A1428]/78 backdrop-blur-[1.5px]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[#0A1428] via-transparent to-[#0A1428]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-12 mx-auto max-w-7xl px-8 flex justify-between opacity-35"
          >
            <span className="h-12 w-12 border-t border-l border-[#D9C08B]" />
            <span className="h-12 w-12 border-t border-r border-[#D9C08B]" />
          </div>
        </div>

        {/* Foreground Sticky-Stack Division Showcase (One Grand Listing at a Time) */}
        <div className="relative z-10 -mt-[100vh] pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D9C08B]/25 pb-7">
              <div>
                <div className="inline-flex items-center gap-3">
                  <span aria-hidden="true" className="h-[1px] w-8 bg-[#D9C08B]" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D9C08B]">
                    Four Core Business Divisions
                  </p>
                </div>
                <h2
                  id="division-stack-heading"
                  className="font-display mt-3 text-4xl sm:text-5xl lg:text-[3.4rem] font-medium leading-[1.02] text-[#F4EEDF]"
                >
                  From panel sizing to final assembly.
                </h2>
              </div>
              <Link
                to="/divisions"
                className="inline-flex items-center gap-2 self-start md:self-auto text-xs font-semibold uppercase tracking-[0.2em] text-[#D9C08B] hover:opacity-80"
              >
                <span>View All Divisions</span>
                <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {divisionCards.slice(0, 4).map((div, index) => {
              const tones = [
                {
                  card: 'lux-stack-card-ivory',
                  eyebrow: 'text-[#3F5E8C]',
                  muted: 'text-[#0A1428]/75',
                  ring: 'border-[#0A1428]/25 bg-[#0A1428] text-[#D9C08B]',
                  divider: 'bg-[#0A1428]/15',
                  chip: 'border-[#0A1428]/20 bg-[#0A1428]/[0.05] text-[#0A1428]',
                  cta: 'bg-[#0A1428] text-[#F4EEDF]',
                  stage: 'bg-[#0A1428]/[0.06] border-[#0A1428]/12',
                },
                {
                  card: 'lux-stack-card-gold',
                  eyebrow: 'text-[#0A1428]/80',
                  muted: 'text-[#0A1428]/80',
                  ring: 'border-[#0A1428]/30 bg-[#0A1428] text-[#D9C08B]',
                  divider: 'bg-[#0A1428]/20',
                  chip: 'border-[#0A1428]/25 bg-[#F4EEDF]/45 text-[#0A1428]',
                  cta: 'bg-[#0A1428] text-[#D9C08B]',
                  stage: 'bg-[#F4EEDF]/50 border-[#0A1428]/15',
                },
                {
                  card: 'lux-stack-card-blue',
                  eyebrow: 'text-[#D9C08B]',
                  muted: 'text-[#F4EEDF]/85',
                  ring: 'border-[#D9C08B]/50 bg-[#0A1428]/60 text-[#D9C08B]',
                  divider: 'bg-[#D9C08B]/25',
                  chip: 'border-[#D9C08B]/30 bg-[#0A1428]/35 text-[#F4EEDF]',
                  cta: 'bg-[#D9C08B] text-[#0A1428]',
                  stage: 'bg-[#0A1428]/45 border-[#D9C08B]/25',
                },
                {
                  card: 'lux-stack-card-navy',
                  eyebrow: 'text-[#D9C08B]',
                  muted: 'text-[#F4EEDF]/80',
                  ring: 'border-[#D9C08B]/50 bg-[#D9C08B] text-[#0A1428]',
                  divider: 'bg-[#D9C08B]/25',
                  chip: 'border-[#D9C08B]/30 bg-[#16294D]/70 text-[#F4EEDF]',
                  cta: 'bg-[#D9C08B] text-[#0A1428]',
                  stage: 'bg-[#16294D]/65 border-[#D9C08B]/25',
                },
              ];
              const tone = tones[index] || tones[0];

              return (
                <div
                  key={div.slug}
                  className={
                    prefersReducedMotion
                      ? 'relative mb-12 last:mb-0'
                      : 'sticky mb-[36svh] last:mb-4'
                  }
                  style={
                    prefersReducedMotion
                      ? undefined
                      : { top: `calc(5.25rem + ${index * 16}px)`, zIndex: index + 1 }
                  }
                >
                  <Link
                    to={`/divisions/${div.slug}`}
                    className={`group relative flex flex-col justify-between min-h-[72svh] sm:min-h-[75svh] lg:min-h-[77svh] overflow-hidden rounded-[2.25rem] p-6 sm:p-10 lg:p-12 transition-transform duration-500 ${tone.card}`}
                  >
                    {/* Card Top Editorial Header */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-current/10">
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`inline-flex h-10 px-3.5 items-center justify-center rounded-full border font-mono-code text-xs font-semibold tracking-[0.18em] ${tone.ring}`}
                        >
                          0{index + 1} / 04
                        </span>
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${tone.eyebrow}`}
                        >
                          {div.subtitle}
                        </span>
                      </div>

                      <span
                        className={`hidden sm:inline-block font-mono-code text-[11px] uppercase tracking-[0.16em] ${tone.muted}`}
                      >
                        {div.signatureLine}
                      </span>
                    </div>

                    {/* Main Grand 2-Column Showcase Body */}
                    <div className="relative z-10 my-auto py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                      <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                        <h3 className="font-display text-3xl sm:text-5xl lg:text-[3.35rem] font-medium leading-[1.02] tracking-tight">
                          {div.displayName}
                        </h3>

                        <div className={`h-[1px] w-16 ${tone.divider}`} />

                        <p
                          className={`max-w-xl text-base sm:text-lg leading-relaxed ${tone.muted}`}
                        >
                          {div.shortDescription}
                        </p>

                        {div.categories && div.categories.length > 0 && (
                          <div className="pt-1">
                            <p
                              className={`text-[10px] font-semibold uppercase tracking-[0.24em] mb-2.5 ${tone.eyebrow}`}
                            >
                              Key Product Lines &amp; Capabilities
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {div.categories.slice(0, 5).map((cat) => (
                                <span
                                  key={cat}
                                  className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide ${tone.chip}`}
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-3 flex flex-wrap items-center gap-4">
                          <span className={`${pill} ${tone.cta}`}>
                            <span>Explore Division</span>
                            <ArrowUpRight
                              aria-hidden="true"
                              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                          </span>
                        </div>
                      </div>

                      {/* Sculpted Right-Side Luxury Product Pedestal */}
                      <div className="lg:col-span-5">
                        <div
                          className={`lux-curve relative min-h-[240px] sm:min-h-[320px] lg:min-h-[370px] border p-6 sm:p-8 flex items-center justify-center overflow-hidden ${tone.stage}`}
                        >
                          <img
                            src={div.heroImage}
                            alt={div.displayName}
                            loading="lazy"
                            width="480"
                            height="380"
                            className="max-h-[220px] sm:max-h-[290px] lg:max-h-[330px] w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Bottom Architectural Footer Bar */}
                    <div className="relative z-10 flex items-center justify-between pt-4 border-t border-current/10 text-[11px] font-medium uppercase tracking-[0.2em]">
                      <span className={tone.muted}>Modu Pro Innovation Pvt. Ltd.</span>
                      <span className={`inline-flex items-center gap-1.5 font-semibold ${tone.eyebrow}`}>
                        <span>Dedicated Division Page</span>
                        <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] bg-[#D9C08B] text-[#0A1428] px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#0A1428]/70">
                  Industries we serve
                </p>
                <h2 className="font-display text-4xl sm:text-5xl font-medium leading-[1.05]">
                  Built for the floors that make furniture, kitchens, and doors.
                </h2>
                <p className="text-[#0A1428]/80 leading-relaxed max-w-lg">
                  Adhesives, blades, machinery, and hardware selected for modular furniture,
                  modular kitchens, door manufacturing, and woodworking panel processing.
                </p>
                <Link
                  to="/industries"
                  className={`${pill} bg-[#0A1428] text-[#F4EEDF]`}
                >
                  <span>Explore industries</span>
                  <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
                </Link>
              </div>
              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                {industryCards.slice(0, 4).map((ind, index) => (
                  <div
                    key={ind.slug || ind.name}
                    className={`${index % 2 ? 'lux-curve-alt mt-6' : 'lux-curve'} bg-[#F4EEDF] h-40 sm:h-48 p-4 flex flex-col items-center justify-center text-center`}
                  >
                    <img
                      src={ind.image || '/assets/products/panel-processing/edge-banding-machine.png'}
                      alt=""
                      loading="lazy"
                      className="max-h-24 w-auto object-contain"
                    />
                    <span className="mt-2 text-xs font-semibold leading-snug">{ind.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div {...fadeUp} className="lg:col-span-5">
              <div className="lux-curve bg-[#16294D] min-h-[420px] p-8 flex items-end overflow-hidden">
                <img
                  src="/assets/products/panel-processing/hydraulic-cold-press.png"
                  alt="Hydraulic press used in panel processing"
                  loading="lazy"
                  className="w-full max-h-[380px] object-contain"
                />
              </div>
            </motion.div>
            <motion.div {...fadeUp} className="lg:col-span-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#D9C08B]">
                Why choose Modu Pro
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-medium text-[#F4EEDF] mt-3 mb-8">
                A quieter way to source the whole line.
              </h2>
              <ol className="space-y-0">
                {WHY_CHOOSE_THEMES.map((item) => (
                  <li key={item.code} className="grid grid-cols-[auto_1fr] gap-5 py-5 border-b border-[#F4EEDF]/10 last:border-0">
                    <span className="font-display text-3xl text-[#D9C08B] leading-none">{item.code}</span>
                    <div>
                      <h3 className="font-display text-2xl text-[#F4EEDF]">{item.title}</h3>
                      <p className="text-sm text-[#F4EEDF]/70 mt-1.5 leading-relaxed">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        ref={catalogRef}
        className={`hero-banner-dark ${
          prefersReducedMotion ? 'relative py-20 overflow-hidden' : 'relative h-[280vh] sm:h-[310vh]'
        }`}
        aria-labelledby="featured-products-heading"
      >
        <div
          className={
            prefersReducedMotion
              ? 'relative'
              : 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-[5.25rem]'
          }
        >
          {/* Full-Bleed Architectural Studio Background Banner (Clearly Visible) */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src="/assets/full%20backgorund%20banners/features%20banner.png"
              alt=""
              loading="lazy"
              width="1920"
              height="820"
              className="w-full h-full object-cover object-center"
            />
            {/* Light atmospheric tint so the studio banner remains clearly visible while keeping text crisp */}
            <div aria-hidden="true" className="absolute inset-0 bg-[#0A1428]/44" />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#0A1428] via-[#0A1428]/70 to-transparent"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0A1428] via-[#0A1428]/65 to-transparent"
            />
          </div>

          {/* Section Header + Scroll Progress Rule */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#D9C08B]/30">
              <div>
                <div className="inline-flex items-center gap-3">
                  <span aria-hidden="true" className="h-[1px] w-8 bg-[#D9C08B]" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D9C08B]">
                    Curated Industrial Catalog
                  </p>
                </div>
                <h2
                  id="featured-products-heading"
                  className="font-display mt-2 text-4xl font-medium text-[#F4EEDF] sm:text-5xl leading-[1.02]"
                >
                  Featured products
                </h2>
              </div>

              <Link
                to="/divisions"
                className="shrink-0 self-start sm:self-auto inline-flex items-center gap-2 rounded-full bg-[#0A1428]/80 border border-[#D9C08B]/45 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#D9C08B] backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span>Browse every division</span>
                <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </div>

            {!prefersReducedMotion && (
              <div className="h-[2px] w-full bg-[#F4EEDF]/15 overflow-hidden">
                <motion.div
                  style={{ scaleX: catalogProgress }}
                  className="h-full w-full origin-left bg-[#D9C08B]"
                />
              </div>
            )}
          </div>

          {/* Horizontal Sticky-Scroll Product Track */}
          <div
            ref={catalogViewportRef}
            className={`relative z-10 ${
              prefersReducedMotion ? 'mt-10 overflow-x-auto pb-4' : 'mt-7 overflow-hidden sm:mt-9'
            }`}
          >
            <motion.div
              ref={catalogTrackRef}
              style={prefersReducedMotion ? undefined : { x: catalogX }}
              className="flex w-max gap-6 pl-4 pr-10 sm:gap-7 sm:pl-6 sm:pr-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
            >
              {spotlightProducts.map((product, idx) => (
                <article
                  key={product.slug}
                  className="lux-catalog-card group flex w-[82vw] shrink-0 flex-col justify-between rounded-[1.85rem] p-5 sm:w-[23.5rem] sm:p-6 transition-transform duration-500 hover:-translate-y-1"
                >
                  <div>
                    {/* Card Top Index & Category Row */}
                    <div className="mb-3.5 flex items-center justify-between gap-2">
                      <span className="inline-flex h-7 px-2.5 items-center justify-center rounded-full border border-[#D9C08B]/40 bg-[#0A1428]/70 font-mono-code text-[11px] font-semibold tracking-[0.16em] text-[#D9C08B]">
                        0{idx + 1}
                      </span>
                      <span className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D9C08B]">
                        {product.category}
                      </span>
                    </div>

                    {/* Framed Luxury Product Stage */}
                    <div className="lux-catalog-stage relative flex h-48 items-center justify-center overflow-hidden rounded-[1.35rem] p-5 sm:h-52">
                      <img
                        src={
                          product.images?.[0]?.url ||
                          '/assets/products/panel-processing/edge-banding-machine.png'
                        }
                        alt={product.images?.[0]?.alt || product.name}
                        loading="lazy"
                        width="320"
                        height="220"
                        className="max-h-40 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.06]"
                      />
                    </div>

                    {/* Crisp High-Contrast Typography Inside Card */}
                    <h3 className="font-display mt-4 text-2xl font-medium leading-snug text-[#F4EEDF]">
                      {product.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#F4EEDF]/80">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Card Footer Action Bar */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#D9C08B]/20 pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#D9C08B] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0A1428] transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <Eye aria-hidden="true" className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                    <Link
                      to={`/contact?division=${encodeURIComponent(product.division?.slug || '')}&product=${encodeURIComponent(product.name)}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#F4EEDF] hover:text-[#D9C08B]"
                    >
                      <span>Enquire</span>
                      <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] bg-[#16294D] px-6 py-12 sm:px-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <h2 className="font-display text-4xl sm:text-5xl font-medium leading-[1.05] text-[#F4EEDF]">
                Let&apos;s discuss your woodworking requirements.
              </h2>
              <p className="text-[#F4EEDF]/75 max-w-xl leading-relaxed">
                Tell us what your business needs, and our team can direct your enquiry to the
                relevant division.
              </p>
              <Link to="/contact" className={`${pill} bg-[#D9C08B] text-[#0A1428]`}>
                <span>Send an enquiry</span>
                <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </div>
            <div className="lg:col-span-5">
              <div className="lux-curve bg-[#0A1428] h-64 sm:h-72 p-6 flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/products/adhesi-pro/lockpro-wr3-drum.png"
                  alt="Adhesi Pro adhesive drum"
                  loading="lazy"
                  className="max-h-52 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
}
