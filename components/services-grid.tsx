'use client'

import { motion } from 'framer-motion'

const services = [
  {
    id: 'strategy',
    title: 'Strategy Consultation',
    tags: 'Data-driven insights • Startup challenges • Navigation',
    link: '/services#consultation',
  },
  {
    id: 'brand',
    title: 'Brand Collaborations',
    tags: 'Infrastructure • Mutual growth • Partnerships',
    link: '/services#partnerships',
  },
  {
    id: 'career',
    title: 'Career Repositioning',
    tags: 'Calculated moves • Technical professionals',
    link: '/services#career',
  },
  {
    id: 'coming-soon',
    title: 'Expanding Infrastructure',
    tags: 'Proprietary services • Launching 2026 Q3',
    link: '#',
    comingSoon: true,
  },
]

export function ServicesGrid() {
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
    <section className="py-24 max-md:py-16 md:py-32 px-6 max-md:px-4 md:px-16 w-full text-[#111111]">
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
          {services.map((service, idx) => (
            <motion.a
              variants={itemVars}
              key={service.id}
              href={service.link}
              className={`group flex flex-col md:flex-row justify-between items-start md:items-center py-8 max-md:py-6 md:py-12 border-b border-[#dddddd] transition-colors ${service.comingSoon ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-black'}`}
            >
              <h3 className="text-2xl max-md:text-xl md:text-3xl font-medium tracking-tight mb-2 md:mb-0 group-hover:pl-2 transition-all duration-300">
                {service.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-[#777777]">
                <span className="group-hover:text-black transition-colors">{service.tags}</span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
