'use client'

import Image from 'next/image'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  {
    id: '1',
    question: 'What can I expect from a 30-minute consultation?',
    answer:
      'A focused, execution-oriented conversation. You come with a specific challenge—whether it&apos;s GTM strategy, pitch deck structure, or career direction—and we dive deep. I don&apos;t offer theory; I offer frameworks you can implement immediately.',
  },
  {
    id: '2',
    question: 'How do you approach zero-capital ventures?',
    answer:
      'By identifying assets and networks you already have and architecting them into distribution channels. Capital is a tool, not a prerequisite. We focus on leverage: your expertise, existing relationships, and market timing.',
  },
  {
    id: '3',
    question: 'What happens after I book a consultation?',
    answer:
      'You&apos;ll receive a confirmation email with pre-call preparation tips. We&apos;ll meet at the scheduled time, work through your challenge, and I&apos;ll send you a follow-up summary with next steps and resources.',
  },
  {
    id: '4',
    question: 'Can we discuss infrastructure partnerships before committing financially?',
    answer:
      'Absolutely. Submit an inquiry, and we&apos;ll have a preliminary conversation to explore fit. Partnerships should be mutually beneficial—I&apos;ll only proceed if I see real value for both sides.',
  },
]

export function FAQ() {
  return (
    <section className="py-20 max-md:py-16 md:py-32 px-4 md:px-8 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="w-full">
          <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest mb-12">// FAQ</p>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-zinc-200 rounded-2xl px-6 bg-white data-[state=open]:bg-white shadow-sm"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <p className="font-sans font-medium text-lg max-md:text-base text-zinc-900 text-left">{faq.question}</p>
                </AccordionTrigger>
                <AccordionContent className="text-zinc-600 pb-6 pt-0">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="w-full max-w-md mx-auto relative lg:ml-auto lg:mr-0 max-md:mt-8">
          <div className="relative rounded-[2.5rem] max-md:rounded-2xl p-3 bg-white/30 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] overflow-hidden">
            <div className="relative w-full rounded-[2rem] overflow-hidden flex items-center justify-center bg-white/10">
              <Image 
                src="/cash-guru.jpeg" 
                alt="FAQ related" 
                width={600}
                height={600}
                className="w-full h-auto object-contain"
                sizes="(max-width: 1024px) 100vw, 400px"
                priority
              />
            </div>
            
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-zinc-300/30 blur-3xl rounded-full -z-10" />
            <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-zinc-200/40 blur-3xl rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
