import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, ArrowRight, MessageSquare, HelpCircle } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Frequently Asked Questions (FAQ) | Dr. Melwin Vincent',
  description: 'Find answers about 1-on-1 strategy consulting, executive personal branding, creator growth, and startup advisory with Dr. Melwin Vincent.',
}

const faqs = [
  {
    id: '1',
    category: 'Consultation & Strategy',
    question: 'I want to start a business or side hustle but I don’t know where to begin.',
    answer: 'That’s one of the main reasons people book this. The consultation helps you identify realistic opportunities, business models, positioning, and execution strategies based on your strengths and goals.',
  },
  {
    id: '2',
    category: 'Branding & Growth',
    question: 'Can you help me build a personal brand or grow on social media?',
    answer: 'Yes. From content strategy and niche positioning to audience growth, monetization, and digital presence, this is heavily focused on modern internet-based growth.',
  },
  {
    id: '3',
    category: 'Clarity & Ideation',
    question: 'I have too many ideas and zero clarity. What do I do?',
    answer: 'We simplify the chaos. The goal is to help you focus on the right opportunity, avoid distraction loops, and build a practical execution plan instead of mentally launching 14 startups before breakfast.',
  },
  {
    id: '4',
    category: 'Monetization & Skills',
    question: 'Can you help me monetize my skills or knowledge?',
    answer: 'Absolutely. Whether it’s freelancing, digital products, consulting, content, services, or online businesses, the consultation focuses on turning skills into income streams.',
  },
  {
    id: '5',
    category: 'Existing Businesses',
    question: 'What if I already run a business?',
    answer: 'Then the discussion becomes more strategic. We can work on branding, growth systems, offers, content, positioning, audience building, scalability, and digital expansion.',
  },
  {
    id: '6',
    category: 'Creator Strategy',
    question: 'Can you help with content creation and creator business strategy?',
    answer: 'Yes. This includes creator positioning, content systems, audience psychology, niche strategy, monetization pathways, and building a brand people actually remember.',
  },
  {
    id: '7',
    category: 'Consulting Approach',
    question: 'What makes Build With Melwin different from regular business coaching?',
    answer: 'This is built around practical execution, modern digital opportunities, internet leverage, and scalable systems, not recycled corporate motivation quotes floating on LinkedIn sunsets.',
  },
  {
    id: '8',
    category: 'Eligibility',
    question: 'Is this only for entrepreneurs?',
    answer: 'No. Students, creators, freelancers, professionals, aspiring founders, and people exploring new opportunities can all benefit from the consultation.',
  },
  {
    id: '9',
    category: 'Career & Higher Studies',
    question: 'Do you also help with career direction and higher studies?',
    answer: 'Yes. Career guidance, skill planning, profile building, higher studies, and transition strategy are also part of the consultation where relevant.',
  },
  {
    id: '10',
    category: 'Outcomes & Deliverables',
    question: 'What will I actually gain from the consultation?',
    answer: 'More clarity, stronger direction, actionable next steps, better positioning, and a clearer understanding of how to grow your business, brand, career, or online presence strategically.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-neutral-900 font-sans flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      
      {/* Navigation Header */}
      <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-400">
            Build With Melwin • FAQ
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-16 sm:py-24">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16 space-y-4">
         

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#111111] leading-[1.1]">
            Frequently Asked Questions
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed pt-1">
            Everything you need to know about 1-on-1 strategy sessions, executive personal branding, startup advisory, and collaborations.
          </p>
        </div>

        {/* Accordion List */}
        <div className="w-full">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-zinc-200/90 rounded-2xl px-6 sm:px-8 bg-white data-[state=open]:bg-white shadow-xs hover:shadow-md transition-all"
              >
                <AccordionTrigger className="hover:no-underline py-6 cursor-pointer">
                  <div className="flex flex-col text-left gap-1 pr-4">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-400">
                      {faq.category}
                    </span>
                    <p className="font-sans font-semibold text-base sm:text-lg text-zinc-900 leading-snug">
                      {faq.question}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-zinc-600 text-sm sm:text-base leading-relaxed pb-6 pt-1 border-t border-zinc-100/80 mt-1">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-16 sm:mt-20 p-8 sm:p-10 rounded-3xl bg-[#111111] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Have a specific question or ready to scale?
            </h3>
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              Book a direct consultation or send an inquiry to explore tailored branding & growth strategies.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <Link
              href="/#services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black px-6 py-3.5 rounded-full font-bold text-xs transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  )
}
