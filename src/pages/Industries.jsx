import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Layers } from 'lucide-react';
import { publicApi } from '../services/api';
import SeoHead from '../components/SeoHead';

export default function Industries() {
  const prefersReducedMotion = useReducedMotion();
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    publicApi
      .getIndustries()
      .then((data) => {
        if (active && Array.isArray(data)) {
          setIndustries(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const fadeUp = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 },
      };

  return (
    <>
      <SeoHead
        title="Industries We Serve"
        description="Modu Pro Innovation Pvt. Ltd. supports Modular Furniture Manufacturing, Modular Kitchen Manufacturing, Door Manufacturing, and Woodworking & Panel Processing businesses."
        canonicalPath="/industries"
      />

      {/* Page Hero */}
      <section className="py-16 sm:py-24 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <p className="font-mono-code text-xs uppercase tracking-[0.22em] text-[#D9C08B]">
              Industrial Sectors
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#F4EEDF] leading-tight">
              Industries We Serve
            </h1>
            <div className="w-20 h-[1.5px] bg-[#D9C08B]" />
            <p className="text-base sm:text-lg text-[#F4EEDF]/85 leading-relaxed">
              Modu Pro Innovation Pvt. Ltd. connects industrial adhesives, precision cutting tools,
              panel-processing machinery, and furniture hardware to support four core manufacturing
              sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Industry Sectors List */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {loading ? (
            <div className="bg-[#16294D] rounded-[1.5rem] p-12 text-center">
              <p className="text-sm text-[#F4EEDF]/75">Loading industry sectors...</p>
            </div>
          ) : (
            industries.map((industry, idx) => (
              <motion.article
                key={industry._id || industry.slug}
                {...fadeUp}
                className="bg-[#16294D] rounded-[1.75rem] p-8 sm:p-10 lg:p-12"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  {/* Image Panel */}
                  <div className="lg:col-span-4 bg-[#0A1428] rounded-[1.5rem] p-6 flex flex-col justify-between aspect-square">
                    <span className="font-mono-code text-xs text-[#D9C08B]">
                      SECTOR 0{idx + 1}
                    </span>
                    <div className="my-4 flex items-center justify-center">
                      <img
                        src={
                          industry.image ||
                          '/assets/products/panel-processing/edge-banding-machine.png'
                        }
                        alt={industry.name}
                        loading={idx === 0 ? undefined : 'lazy'}
                        width="320"
                        height="260"
                        className="max-h-52 w-auto object-contain"
                      />
                    </div>
                    <span className="font-mono-code text-[11px] text-[#F4EEDF]/60 uppercase">
                      {industry.slug}
                    </span>
                  </div>

                  {/* Content Panel */}
                  <div className="lg:col-span-8 space-y-6">
                    <div>
                      <p className="font-mono-code text-xs uppercase tracking-[0.2em] text-[#D9C08B]">
                        Manufacturing Sector 0{idx + 1}
                      </p>
                      <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F4EEDF] mt-1">
                        {industry.name}
                      </h2>
                    </div>

                    <p className="text-base text-[#F4EEDF]/85 leading-relaxed">
                      {industry.description || industry.shortDescription}
                    </p>

                    {industry.keyApplications && industry.keyApplications.length > 0 && (
                      <div>
                        <h3 className="text-xs font-mono-code uppercase tracking-[0.18em] text-[#D9C08B] mb-3">
                          Typical Production Workflows Supported
                        </h3>
                        <ul className="space-y-2 text-sm text-[#F4EEDF]/85">
                          {industry.keyApplications.map((app) => (
                            <li key={app} className="flex items-start gap-2.5">
                              <CheckCircle2
                                aria-hidden="true"
                                className="w-4 h-4 text-[#D9C08B] shrink-0 mt-0.5"
                              />
                              <span>{app}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Relevant Divisions */}
                    {industry.relatedDivisions && industry.relatedDivisions.length > 0 && (
                      <div className="pt-4">
                        <h3 className="text-xs font-mono-code uppercase tracking-[0.18em] text-[#D9C08B] mb-3">
                          Relevant Modu Pro Divisions
                        </h3>
                        <div className="flex flex-wrap gap-2.5">
                          {industry.relatedDivisions.map((div) => (
                            <Link
                              key={div._id || div.slug}
                              to={`/divisions/${div.slug}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A1428] rounded-[1.5rem] text-xs text-[#F4EEDF] hover:text-[#D9C08B] transition-colors"
                            >
                              <Layers aria-hidden="true" className="w-3.5 h-3.5 text-[#D9C08B]" />
                              <span>{div.name}</span>
                              <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <Link
                        to={`/contact?product=${encodeURIComponent(industry.name)}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#D9C08B] text-[#0A1428] text-xs font-semibold uppercase tracking-[0.18em] rounded-[1.75rem] hover:bg-[#F4EEDF] transition-colors"
                      >
                        <span>Discuss Your {industry.name} Requirement</span>
                        <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </section>
    </>
  );
}
