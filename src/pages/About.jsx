import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Layers, CheckCircle2, Compass, ShieldCheck } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import SeoHead from '../components/SeoHead';

export default function About() {
  const { siteSettings, divisions } = useSite();
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 },
      };

  const divisionList =
    divisions && divisions.length > 0
      ? divisions.map((d, idx) => ({
          code: d.code || `0${idx + 1}`,
          name:
            d.slug === 'adhesi-pro' && siteSettings?.adhesiBrandSpelling
              ? siteSettings.adhesiBrandSpelling
              : d.name,
          slug: d.slug,
          shortDescription: d.shortDescription,
          heroImage: d.heroImage,
        }))
      : [
          {
            code: '01',
            name: siteSettings?.adhesiBrandSpelling || 'Adhesi Pro',
            slug: 'adhesi-pro',
            shortDescription:
              'Adhesi Pro is the adhesive brand associated with Modu Pro Innovation Pvt. Ltd. The product range supports furniture, modular-kitchen, door and woodworking applications.',
            heroImage: '/assets/products/adhesi-pro/lockpro-wr3-drum.png',
          },
          {
            code: '02',
            name: 'PCD Pre-Milling & Grooving Saw Blades',
            slug: 'pcd-blades',
            shortDescription:
              'Explore PCD pre-milling and grooving saw-blade solutions for woodworking and panel-processing applications.',
            heroImage: '/assets/products/pcd-blades/pre-milling-cutters.png',
          },
          {
            code: '03',
            name: 'Panel Processing Machines Division',
            slug: 'panel-processing',
            shortDescription:
              'Modu Pro Innovation Pvt. Ltd. supports woodworking operations with panel-processing machinery, related spare parts and service support.',
            heroImage: '/assets/products/panel-processing/edge-banding-machine.png',
          },
          {
            code: '04',
            name: 'PVC Edge-Banding Tapes & Hardware',
            slug: 'edge-banding-hardware',
            shortDescription:
              'This division brings together PVC edge-banding tapes and selected furniture fittings used in modular furniture and kitchen applications.',
            heroImage: '/assets/products/edge-banding-hardware/pvc-woodgrain-tape.png',
          },
        ];

  return (
    <>
      <SeoHead
        title="About Us"
        description={siteSettings?.aboutContent?.overviewParagraphOne}
        canonicalPath="/about"
      />

      {/* Editorial Hero */}
      <section className="py-16 sm:py-24 border-b border-[#D9C08B]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <p className="font-mono-code text-xs uppercase tracking-[0.22em] text-[#D9C08B]">
              About the Company
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#F4EEDF] leading-tight">
              {siteSettings?.companyName || 'Modu Pro Innovation Pvt. Ltd.'}
            </h1>
            <div className="w-20 h-[1.5px] bg-[#D9C08B]" />
            <p className="font-display italic text-xl text-[#D9C08B]">
              &ldquo;{siteSettings?.tagline || 'Faithfully Delivering Excellence'}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview (Exact Approved Draft) */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div {...fadeUp} className="lg:col-span-7 space-y-6">
              <p className="font-mono-code text-xs uppercase tracking-[0.2em] text-[#D9C08B]">
                Company Overview
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F4EEDF]">
                Bringing Related Woodworking Products & Machinery Under One Business
              </h2>
              <p className="text-base sm:text-lg text-[#F4EEDF]/90 leading-relaxed">
                {siteSettings?.aboutContent?.overviewParagraphOne ||
                  'Modu Pro Innovation Pvt. Ltd. serves the needs of modular furniture, kitchen, door and woodworking manufacturers through a focused range of products and industry solutions. The company brings together adhesive products, woodworking blades, panel-processing machinery and furniture hardware under one business, helping customers explore related products and services through a single point of contact.'}
              </p>
              <p className="text-base sm:text-lg text-[#F4EEDF]/85 leading-relaxed">
                {siteSettings?.aboutContent?.overviewParagraphTwo ||
                  'Our goal is to support manufacturers with relevant products, dependable communication and practical assistance for their woodworking requirements.'}
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="lg:col-span-5">
              <div className="bg-[#16294D] border border-[#D9C08B]/25 rounded-[1.75rem] p-8 space-y-6">
                <div className="bg-[#F4EEDF] p-6 rounded-[1.75rem] flex items-center justify-center">
                  <img
                    src={siteSettings?.logoUrl || '/assets/logo/modu-pro-logo.png'}
                    alt={siteSettings?.companyName || 'Modu Pro Innovation Pvt. Ltd.'}
                    width="180"
                    height="140"
                    className="max-h-28 w-auto object-contain"
                  />
                </div>
                <div className="space-y-3 pt-2">
                  <p className="font-mono-code text-xs uppercase tracking-[0.2em] text-[#D9C08B]">
                    Core Business Focus
                  </p>
                  <ul className="space-y-2.5 text-sm text-[#F4EEDF]/85">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2
                        aria-hidden="true"
                        className="w-4 h-4 text-[#D9C08B] shrink-0 mt-0.5"
                      />
                      <span>Adhesive products under the Adhesi Pro brand</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2
                        aria-hidden="true"
                        className="w-4 h-4 text-[#D9C08B] shrink-0 mt-0.5"
                      />
                      <span>PCD pre-milling, grooving, and TCT/PCD panel-saw blades</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2
                        aria-hidden="true"
                        className="w-4 h-4 text-[#D9C08B] shrink-0 mt-0.5"
                      />
                      <span>Panel-processing machinery, spare parts, and service support</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2
                        aria-hidden="true"
                        className="w-4 h-4 text-[#D9C08B] shrink-0 mt-0.5"
                      />
                      <span>PVC edge-banding tapes and modular furniture hardware fittings</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Four-Division Overview */}
      <section className="py-20 sm:py-24 bg-[#16294D]/35 border-y border-[#D9C08B]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <p className="font-mono-code text-xs uppercase tracking-[0.22em] text-[#D9C08B]">
              Organizational Structure
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F4EEDF] mt-1">
              Four Integrated Business Divisions
            </h2>
            <p className="text-sm sm:text-base text-[#F4EEDF]/80 mt-2">
              Each division addresses a critical stage of modular furniture, kitchen, door, and
              panel-processing operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {divisionList.map((div) => (
              <motion.div
                key={div.slug}
                {...fadeUp}
                className="bg-[#16294D] border border-[#D9C08B]/24 hover:border-[#D9C08B]/45 transition-colors rounded-[1.5rem] p-7 flex flex-col sm:flex-row gap-6 items-center"
              >
                <div className="w-28 h-28 bg-[#0A1428] rounded-[1.5rem] p-3 shrink-0 flex items-center justify-center">
                  <img
                    src={div.heroImage}
                    alt={div.name}
                    loading="lazy"
                    width="96"
                    height="96"
                    className="max-h-20 w-auto object-contain"
                  />
                </div>
                <div className="space-y-2.5 flex-1">
                  <span className="font-mono-code text-xs text-[#D9C08B]">
                    DIVISION {div.code}
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-[#F4EEDF]">
                    {div.name}
                  </h3>
                  <p className="text-sm text-[#F4EEDF]/80 leading-relaxed">
                    {div.shortDescription}
                  </p>
                  <div className="pt-1">
                    <Link
                      to={`/divisions/${div.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#D9C08B] hover:underline"
                    >
                      <span>View Division</span>
                      <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Served & Approach to Customer Requirements */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div
              {...fadeUp}
              className="bg-[#16294D] border border-[#D9C08B]/25 rounded-[1.75rem] p-8 sm:p-10 space-y-5"
            >
              <div className="w-11 h-11 bg-[#0A1428] rounded-[1.75rem] flex items-center justify-center">
                <Layers aria-hidden="true" className="w-5 h-5 text-[#D9C08B]" />
              </div>
              <p className="font-mono-code text-xs uppercase tracking-[0.2em] text-[#D9C08B]">
                Who We Serve
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F4EEDF]">
                Focused on Four Manufacturing Sectors
              </h2>
              <p className="text-sm sm:text-base text-[#F4EEDF]/80 leading-relaxed">
                Our products and machinery services are structured around the practical needs of:
              </p>
              <ul className="space-y-3 text-sm text-[#F4EEDF]/90 pt-2">
                <li className="flex items-center gap-3 p-3 bg-[#0A1428] rounded-[1.5rem]">
                  <span className="font-mono-code text-xs text-[#D9C08B]">01</span>
                  <span>Modular Furniture Manufacturers</span>
                </li>
                <li className="flex items-center gap-3 p-3 bg-[#0A1428] rounded-[1.5rem]">
                  <span className="font-mono-code text-xs text-[#D9C08B]">02</span>
                  <span>Modular Kitchen Manufacturers</span>
                </li>
                <li className="flex items-center gap-3 p-3 bg-[#0A1428] rounded-[1.5rem]">
                  <span className="font-mono-code text-xs text-[#D9C08B]">03</span>
                  <span>Door Manufacturers</span>
                </li>
                <li className="flex items-center gap-3 p-3 bg-[#0A1428] rounded-[1.5rem]">
                  <span className="font-mono-code text-xs text-[#D9C08B]">04</span>
                  <span>Woodworking and Panel-Processing Businesses</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/industries"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D9C08B] hover:underline"
                >
                  <span>Explore Industries We Serve</span>
                  <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="bg-[#16294D] border border-[#D9C08B]/25 rounded-[1.75rem] p-8 sm:p-10 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="w-11 h-11 bg-[#0A1428] rounded-[1.75rem] flex items-center justify-center">
                  <Compass aria-hidden="true" className="w-5 h-5 text-[#D9C08B]" />
                </div>
                <p className="font-mono-code text-xs uppercase tracking-[0.2em] text-[#D9C08B]">
                  Our Approach
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F4EEDF]">
                  Practical Consultation & Single-Point Coordination
                </h2>
                <p className="text-sm sm:text-base text-[#F4EEDF]/85 leading-relaxed">
                  {siteSettings?.aboutContent?.approachText ||
                    'Every manufacturing floor operates with distinct panel substrates, production volumes, and machinery setups. Rather than offering generic off-the-shelf packages, our four divisions coordinate to help furniture, kitchen, and door manufacturers identify suitable adhesives, tooling, panel-processing equipment, spare parts, and hardware fittings through structured consultation.'}
                </p>
              </div>

              <div className="p-5 bg-[#0A1428] border border-[#D9C08B]/18 rounded-[1.5rem] flex items-start gap-3.5 mt-6">
                <ShieldCheck aria-hidden="true" className="w-5 h-5 text-[#D9C08B] shrink-0 mt-0.5" />
                <p className="text-xs text-[#F4EEDF]/80 leading-relaxed">
                  Have a multi-division requirement? Submit a single enquiry and our team will
                  coordinate across Adhesi Pro, PCD Blades, Panel Processing Machines, and PVC
                  Edge-Banding & Hardware.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enquiry CTA */}
      <section className="py-16 sm:py-20 bg-[#16294D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F4EEDF]">
            Connect With Modu Pro Innovation Pvt. Ltd.
          </h2>
          <p className="text-sm sm:text-base text-[#F4EEDF]/80 max-w-xl mx-auto">
            Share your business requirements with our team in Nagpur, and we will direct your
            enquiry to the relevant division.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-4 bg-[#D9C08B] text-[#0A1428] text-xs font-semibold uppercase tracking-[0.18em] rounded-[1.75rem] hover:bg-[#F4EEDF] transition-colors"
            >
              <span>Send an Enquiry</span>
              <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
