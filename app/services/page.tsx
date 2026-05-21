'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ConsultationBooking } from '@/components/consultation-booking'
import { BrandPartnerships } from '@/components/brand-partnerships'
import { CareerAdvice } from '@/components/career-advice'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<'consultation' | 'partnership' | 'career'>('consultation')

  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden pt-24">
      <div className="grain-overlay" />
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 mb-4">
        <h1 className="text-[4rem] md:text-[6rem] leading-[1] font-black tracking-tight">
          Services
        </h1>
        <p className="text-xl md:text-2xl text-neutral-500 mt-6 max-w-2xl">
          Strategic infrastructure, brand collaborations, and career repositioning for focused growth.
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-6 md:gap-12 mt-16 border-b border-neutral-200 pb-px">
          {['consultation', 'partnership', 'career'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`text-lg md:text-xl font-semibold pb-4 transition-colors relative capitalize ${activeTab === tab ? 'text-black' : 'text-neutral-400 hover:text-neutral-700'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-black"
                />
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="min-h-[800px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'consultation' && <ConsultationBooking />}
            {activeTab === 'partnership' && <BrandPartnerships />}
            {activeTab === 'career' && <CareerAdvice />}
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  )
}
