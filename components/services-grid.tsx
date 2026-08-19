'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ConsultationBooking } from '@/components/consultation-booking'
import { BrandPartnerships } from '@/components/brand-partnerships'
import { CareerAdvice } from '@/components/career-advice'
import { InviteMelwin } from '@/components/invite-melwin'
import { PersonalBrandingDropdown } from '@/components/personal-branding-dropdown'
import { ChevronDown } from 'lucide-react'

const services: {
  id: string
  title: string
  tags: string
  component?: React.ElementType
  comingSoon?: boolean
}[] = [
  {
    id: 'strategy',
    title: 'Business Consultation',
    tags: 'Data-driven insights • Startup challenges • Navigation',
    component: ConsultationBooking,
  },
  {
    id: 'personal-branding',
    title: 'Personal Branding',
    tags: 'Content strategy • Video production • Executive presence',
    component: PersonalBrandingDropdown,
  },
  {
    id: 'brand',
    title: 'Brand Collaborations',
    tags: 'Infrastructure • Mutual growth • Partnerships',
    component: BrandPartnerships,
  },
  {
    id: 'career',
    title: 'Career Guidance',
    tags: 'Calculated moves • Technical professionals',
    component: CareerAdvice,
  },
  {
    id: 'invite',
    title: 'Invite Melwin',
    tags: 'Keynotes • Guest Lectures • Panel Discussions',
    component: InviteMelwin,
  },
]

export function ServicesGrid() {
  const [activeService, setActiveService] = useState<string | null>(null)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (hash === 'consultation' || hash === 'strategy') {
        setActiveService('strategy');
      } else if (hash === 'personal-branding' || hash === 'personalbranding' || hash === 'branding') {
        setActiveService('personal-branding');
      } else if (hash === 'partnerships' || hash === 'partnership' || hash === 'brand') {
        setActiveService('brand');
      } else if (hash === 'career') {
        setActiveService('career');
      } else if (hash === 'invite' || hash === 'invitemelwin') {
        setActiveService('invite');
      }
    };

    const handleOpenService = (e: CustomEvent<string>) => {
      const id = e.detail;
      if (id === 'consultation' || id === 'strategy') {
        setActiveService('strategy');
      } else if (id === 'personal-branding' || id === 'personalbranding' || id === 'branding') {
        setActiveService('personal-branding');
      } else if (id === 'partnerships' || id === 'partnership' || id === 'brand') {
        setActiveService('brand');
      } else if (id === 'career') {
        setActiveService('career');
      } else if (id === 'invite' || id === 'invitemelwin') {
        setActiveService('invite');
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    // Listen for custom openService event
    window.addEventListener('openService', handleOpenService as EventListener);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('openService', handleOpenService as EventListener);
    };
  }, []);

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  }

  return (
    <section id="services" className="py-24 max-md:py-16 md:py-32 px-6 max-md:px-4 md:px-16 w-full text-[#111111] scroll-mt-24">
      <div className="max-w-[1400px] mx-auto">
        
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[4rem] max-md:text-[3rem] md:text-[6rem] leading-[1] font-black tracking-tight mb-16 max-md:mb-10 md:mb-24"
        >
          Services
        </motion.h2>

        <motion.div 
          variants={containerVars}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col w-full"
        >
          {services.map((service, idx) => {
            const isActive = activeService === service.id;
            const Component = service.component;

            return (
              <motion.div
                variants={itemVars}
                key={service.id}
                id={service.id === 'strategy' ? 'consultation' : service.id === 'brand' ? 'partnerships' : service.id}
                className={`flex flex-col border-b border-[#dddddd] transition-colors ${service.comingSoon ? 'opacity-50' : 'hover:border-black'} scroll-mt-32`}
              >
                <div
                  onClick={() => {
                    if (!service.comingSoon) {
                      setActiveService(isActive ? null : service.id)
                    }
                  }}
                  className={`group flex flex-row justify-between items-center py-8 max-md:py-6 md:py-12 ${service.comingSoon ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between flex-1 md:pr-8">
                    <h3 className="text-2xl max-md:text-xl md:text-3xl font-medium tracking-tight mb-2 md:mb-0 group-hover:pl-2 transition-all duration-300">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-[#777777]">
                      <span className="group-hover:text-black transition-colors">{service.tags}</span>
                    </div>
                  </div>
                  {!service.comingSoon && (
                    <div className="md:hidden flex-shrink-0 ml-4">
                      <ChevronDown className={`w-6 h-6 text-[#111111] opacity-50 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {isActive && Component && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-12">
                        <Component />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
