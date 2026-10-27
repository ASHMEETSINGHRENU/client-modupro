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

  const divisionCards =
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
        ];

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

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-14 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 space-y-7"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D9C08B]">
                Modu Pro Innovation Pvt. Ltd.
              </p>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.6rem] font-medium text-[#F4EEDF] leading-[0.98] tracking-tight">
                {siteSettings?.hero?.heading ||
                  'Complete Solutions for Woodworking and Modular Industries'}
              </h1>
              <p className="text-base sm:text-lg text-[#F4EEDF]/75 leading-relaxed max-w-xl">
                {siteSettings?.hero?.supportingText ||
                  'Modu Pro Innovation Pvt. Ltd. brings together adhesive products, precision woodworking blades, panel-processing machinery and furniture hardware to support manufacturers across the woodworking and modular-furniture industry.'}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link to="/divisions" className={`${pill} bg-[#D9C08B] text-[#0A1428]`}>
                  <span>{siteSettings?.hero?.primaryCtaLabel || 'Explore Our Divisions'}</span>
                  <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className={`${pill} bg-[#16294D] text-[#F4EEDF]`}
                >
                  <span>{siteSettings?.hero?.secondaryCtaLabel || 'Discuss Your Requirement'}</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6"
            >
              <div className="lux-curve bg-[#16294D] min-h-[340px] sm:min-h-[440px] p-8 sm:p-12 flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/products/panel-processing/cnc-nesting-machine.png"
                  alt="Modu Pro dual-spindle CNC router and panel processing equipment"
                  fetchPriority="high"
                  width="720"
                  height="520"
                  className={`max-h-[340px] w-auto object-contain ${prefersReducedMotion ? '' : 'lux-float'}`}
                />
              </div>
            </motion.div>
          </div>
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

      <section className="relative py-10 sm:py-16" aria-labelledby="division-stack-heading">
        <h2 id="division-stack-heading" className="visually-hidden">
          From panel sizing to final assembly
        </h2>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {divisionCards.slice(0, 4).map((div, index) => {
            const tones = [
              {
                card: 'bg-[#F4EEDF] text-[#0A1428]',
                muted: 'text-[#0A1428]/70',
                ring: 'border-[#D9C08B] text-[#3F5E8C]',
              },
              {
                card: 'bg-[#D9C08B] text-[#0A1428]',
                muted: 'text-[#0A1428]/75',
                ring: 'border-[#0A1428]/35 text-[#0A1428]',
              },
              {
                card: 'bg-[#3F5E8C] text-[#F4EEDF]',
                muted: 'text-[#F4EEDF]/80',
                ring: 'border-[#D9C08B] text-[#D9C08B]',
              },
              {
                card: 'bg-[#F4EEDF] text-[#0A1428]',
                muted: 'text-[#0A1428]/70',
                ring: 'border-[#D9C08B] text-[#3F5E8C]',
              },
            ];
            const tone = tones[index] || tones[0];
            return (
              <div
                key={div.slug}
                className={prefersReducedMotion ? 'relative mb-4' : 'sticky mb-4'}
                style={
                  prefersReducedMotion
                    ? undefined
                    : { top: `calc(5.25rem + ${index * 14}px)`, zIndex: index + 1 }
                }
              >
                <Link
                  to={`/divisions/${div.slug}`}
                  className={`group relative grid min-h-[230px] grid-cols-1 overflow-hidden rounded-[1.75rem] sm:min-h-[250px] sm:grid-cols-[1.35fr_0.85fr] ${tone.card}`}
                >
                  <div className="relative z-10 flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border bg-transparent text-sm font-medium ${tone.ring}`}
                    >
                      {index + 1}
                    </span>
                    <h3 className="mt-6 max-w-xl text-[1.65rem] font-semibold leading-tight tracking-tight sm:text-[1.85rem]">
                      {div.displayName}
                    </h3>
                    <p className={`mt-3 max-w-lg text-sm leading-relaxed sm:text-[15px] ${tone.muted}`}>
                      {div.shortDescription}
                    </p>
                  </div>
                  <div className="relative h-48 sm:h-auto">
                    <img
                      src={div.heroImage}
                      alt=""
                      loading="lazy"
                      width="420"
                      height="320"
                      className="absolute inset-y-3 right-2 h-[calc(100%-1.5rem)] w-auto max-w-[92%] object-contain object-right transition-transform duration-700 group-hover:scale-[1.04] sm:inset-y-4 sm:right-4"
                    />
                  </div>
                </Link>
              </div>
            );
          })}
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
        className={prefersReducedMotion ? 'relative py-16' : 'relative h-[260vh] sm:h-[300vh]'}
        aria-labelledby="featured-products-heading"
      >
        <div
          className={
            prefersReducedMotion
              ? 'relative'
              : 'sticky top-[5.25rem] flex h-[calc(100svh-5.25rem)] flex-col justify-center overflow-hidden'
          }
        >
          <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-6 px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#D9C08B]">
                Catalog
              </p>
              <h2
                id="featured-products-heading"
                className="font-display mt-2 text-4xl font-medium text-[#F4EEDF] sm:text-5xl"
              >
                Featured products
              </h2>
            </div>
            <Link
              to="/divisions"
              className="shrink-0 text-sm font-semibold text-[#D9C08B] inline-flex items-center gap-1.5"
            >
              Browse every division
              <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
            </Link>
          </div>

          <div
            ref={catalogViewportRef}
            className={prefersReducedMotion ? 'mt-10 overflow-x-auto' : 'mt-8 overflow-hidden sm:mt-10'}
          >
            <motion.div
              ref={catalogTrackRef}
              style={prefersReducedMotion ? undefined : { x: catalogX }}
              className="flex w-max gap-6 pl-4 pr-10 sm:gap-8 sm:pl-6 sm:pr-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
            >
              {spotlightProducts.map((product) => (
                <article key={product.slug} className="w-[78vw] shrink-0 sm:w-[22.5rem]">
                  <div className="flex h-56 items-center justify-center overflow-hidden rounded-[1.35rem] bg-[#16294D] p-6 sm:h-64">
                    <img
                      src={
                        product.images?.[0]?.url ||
                        '/assets/products/panel-processing/edge-banding-machine.png'
                      }
                      alt={product.images?.[0]?.alt || product.name}
                      loading="lazy"
                      className="max-h-44 w-auto object-contain"
                    />
                  </div>
                  <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[#D9C08B]">
                    {product.category}
                  </p>
                  <h3 className="font-display mt-1 text-2xl leading-tight text-[#F4EEDF]">
                    {product.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#F4EEDF]/70">
                    {product.shortDescription}
                  </p>
                  <div className="mt-4 flex items-center gap-5">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#D9C08B]"
                    >
                      <Eye aria-hidden="true" className="w-3.5 h-3.5" />
                      Details
                    </button>
                    <Link
                      to={`/contact?division=${encodeURIComponent(product.division?.slug || '')}&product=${encodeURIComponent(product.name)}`}
                      className="text-xs uppercase tracking-widest text-[#F4EEDF]/80 hover:text-[#D9C08B]"
                    >
                      Enquire
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
