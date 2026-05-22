'use client'

import Image from 'next/image'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  {
    id: '1',
    question: 'I want to start a business or side hustle but I don’t know where to begin.',
    answer: 'That’s one of the main reasons people book this. The consultation helps you identify realistic opportunities, business models, positioning, and execution strategies based on your strengths and goals.',
  },
  {
    id: '2',
    question: 'Can you help me build a personal brand or grow on social media?',
    answer: 'Yes. From content strategy and niche positioning to audience growth, monetization, and digital presence, this is heavily focused on modern internet-based growth.',
  },
  {
    id: '3',
    question: 'I have too many ideas and zero clarity. What do I do?',
    answer: 'We simplify the chaos. The goal is to help you focus on the right opportunity, avoid distraction loops, and build a practical execution plan instead of mentally launching 14 startups before breakfast.',
  },
  {
    id: '4',
    question: 'Can you help me monetize my skills or knowledge?',
    answer: 'Absolutely. Whether it’s freelancing, digital products, consulting, content, services, or online businesses, the consultation focuses on turning skills into income streams.',
  },
  {
    id: '5',
    question: 'What if I already run a business?',
    answer: 'Then the discussion becomes more strategic. We can work on branding, growth systems, offers, content, positioning, audience building, scalability, and digital expansion.',
  },
  {
    id: '6',
    question: 'Can you help with content creation and creator business strategy?',
    answer: 'Yes. This includes creator positioning, content systems, audience psychology, niche strategy, monetization pathways, and building a brand people actually remember.',
  },
  {
    id: '7',
    question: 'What makes Build With Melwin different from regular business coaching?',
    answer: 'This is built around practical execution, modern digital opportunities, internet leverage, and scalable systems, not recycled corporate motivation quotes floating on LinkedIn sunsets.',
  },
  {
    id: '8',
    question: 'Is this only for entrepreneurs?',
    answer: 'No. Students, creators, freelancers, professionals, aspiring founders, and people exploring new opportunities can all benefit from the consultation.',
  },
  {
    id: '9',
    question: 'Do you also help with career direction and higher studies?',
    answer: 'Yes. Career guidance, skill planning, profile building, higher studies, and transition strategy are also part of the consultation where relevant.',
  },
  {
    id: '10',
    question: 'What will I actually gain from the consultation?',
    answer: 'More clarity, stronger direction, actionable next steps, better positioning, and a clearer understanding of how to grow your business, brand, career, or online presence strategically.',
  },
]

export function FAQ() {
  return (
    <section className="py-20 max-md:py-16 md:py-32 px-4 md:px-8 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-3xl mx-auto">
        <div className="w-full">
          <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest mb-12 text-center">// FAQ</p>

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
      </div>
    </section>
  )
}
