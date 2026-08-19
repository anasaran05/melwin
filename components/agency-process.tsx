'use client'

import { motion } from 'framer-motion'

export function AgencyProcess() {
  const steps = [
    {
      step: '01',
      title: 'Prep your Content',
      description:
        'Define the structure of your content, leverage the capabilities of creator studio and expert guidance to ensure your content meets your goals effectively.',
      image: '/images/agency /step 1.png',
    },
    {
      step: '02',
      title: 'Content Blueprint & Scripts',
      description:
        'Our lead team crafts custom high-converting scripts, viral hooks, and a tailored multi-platform content strategy for your brand.',
      image: '/images/agency /step 2.png',
    },
    {
      step: '03',
      title: 'Trial Production & Edit Run',
      description:
        'Record footage (or shoot remotely with guided directions) for 4K video editing, motion graphics, dynamic subtitles, and thumbnails.',
      image: '/images/agency /step 3.png',
    },
    {
      step: '04',
      title: 'Review & Retainer Transition',
      description:
        'Analyze initial content traction, review metrics with our team, and transition seamlessly to a full long-term retainer plan.',
      image: '/images/agency /step 4.png',
    },
  ]

  return (
    <section id="agency-process" className="py-12 md:py-28 px-4 sm:px-6 md:px-12 w-full text-[#111111] scroll-mt-24">
      <div className="max-w-[1100px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/10 text-[#666666] text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
            <span>HOW YOUR TRIAL ONBOARDING WORKS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-[#111111]">
            Step-by-Step Execution
          </h2>
          <p className="text-[#666666] text-xs sm:text-sm md:text-base">
            From initial strategy setup to final production and performance review.
          </p>
        </div>

        {/* Central Vertical Timeline Section */}
        <div className="relative">
          {/* Central Neutral Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-[3px] bg-[#111111] -translate-x-1/2 z-0 rounded-full" />

          {/* Timeline Items */}
          <div className="space-y-12 md:space-y-24 relative z-10">
            {steps.map((item, index) => {
              const isEven = index % 2 === 1 // Step 02 & Step 04: Card on left, Image on right

              return (
                <div key={item.step} className="relative">
                  {/* Central Node Circle Dot on the Timeline Line */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#111111] border-4 border-white shadow-md z-20" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-center">
                    {/* Left Column */}
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className={isEven ? 'order-1 md:order-1' : 'order-2 md:order-1'}
                    >
                      {!isEven ? (
                        /* Step 1 & 3: Image on Left (Order 2 on mobile -> below card) */
                        <div className="flex justify-center pt-2 md:pt-0">
                          <img
                            src={encodeURI(item.image)}
                            alt={item.title}
                            className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] h-auto object-contain rounded-2xl drop-shadow-xl hover:scale-[1.02] transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        /* Step 2 & 4: Card on Left (Order 1 on mobile -> above image) */
                        <div className="bg-white rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl border border-black/5 flex flex-col justify-center relative group hover:shadow-2xl transition-all max-w-[440px] mx-auto w-full">
                          <span className="text-4xl sm:text-5xl md:text-6xl font-black text-[#111111] mb-2 sm:mb-3 tracking-tight block">
                            {item.step}
                          </span>
                          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#111111] mb-2 sm:mb-3">
                            {item.title}
                          </h3>
                          <p className="text-[#555555] text-xs sm:text-sm md:text-base leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </motion.div>

                    {/* Right Column */}
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className={isEven ? 'order-2 md:order-2' : 'order-1 md:order-2'}
                    >
                      {!isEven ? (
                        /* Step 1 & 3: Card on Right (Order 1 on mobile -> above image) */
                        <div className="bg-white rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl border border-black/5 flex flex-col justify-center relative group hover:shadow-2xl transition-all max-w-[440px] mx-auto w-full">
                          <span className="text-4xl sm:text-5xl md:text-6xl font-black text-[#111111] mb-2 sm:mb-3 tracking-tight block">
                            {item.step}
                          </span>
                          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#111111] mb-2 sm:mb-3">
                            {item.title}
                          </h3>
                          <p className="text-[#555555] text-xs sm:text-sm md:text-base leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ) : (
                        /* Step 2 & 4: Image on Right (Order 2 on mobile -> below card) */
                        <div className="flex justify-center pt-2 md:pt-0">
                          <img
                            src={encodeURI(item.image)}
                            alt={item.title}
                            className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] h-auto object-contain rounded-2xl drop-shadow-xl hover:scale-[1.02] transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
