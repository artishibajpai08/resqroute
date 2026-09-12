import { SiteHeader } from '@/components/site-header'
import { ResqApp } from '@/components/resq-app'
import { AiDiagnosis } from '@/components/ai-diagnosis'
import { EmergencyFooter } from '@/components/emergency-footer'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <ResqApp />

      <section
        id="assistant"
        className="border-t border-border bg-secondary/40 py-16 md:py-24"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 lg:grid-cols-2">
          <div>
            <span className="font-display text-sm font-bold uppercase tracking-widest text-primary">
              AI Assistant
            </span>
            <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
              Not sure what&apos;s wrong? Ask before you act.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground text-pretty leading-relaxed">
              Describe your breakdown in plain words. Our AI assistant gives you
              immediate safety steps first, then the most probable causes and
              whether you need a mechanic, a tow, or a rental car.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                'Safety-first guidance for roadside situations',
                'Plain-language likely causes for your symptoms',
                'Tells you which service to call next',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <AiDiagnosis />
        </div>
      </section>

      <EmergencyFooter />
    </main>
  )
}
