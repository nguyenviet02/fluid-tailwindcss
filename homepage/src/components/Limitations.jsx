import CodeBlock, { InlineCode } from './CodeBlock'

export default function Limitations() {
  return (
    <section id="limitations" className="fl-mb-12/20 scroll-mt-6">
      <h2 className="fl-text-xl/3xl font-semibold text-white fl-mb-4/6">Limitations & Notices</h2>
      
      <p className="fl-text-sm/base text-slate-400 fl-mb-6/8">
        Important considerations when using fluid utilities.
      </p>

      {/* Accessibility */}
      <div className="fl-mb-8/12">
        <h3 className="fl-text-base/lg font-medium text-amber-300 fl-mb-3/4 flex items-center fl-gap-2/3">
          <span className="fl-w-2/3 fl-h-2/3 rounded-full bg-amber-400"></span>
          Accessibility (WCAG)
        </h3>
        
        <div className="bg-amber-500/5 border border-amber-500/20 fl-rounded-lg/xl fl-p-4/6 fl-mb-4/6">
          <div className="flex fl-gap-3/4">
            <span className="fl-text-2xl/3xl">♿</span>
            <div>
              <h4 className="fl-text-sm/base font-medium text-amber-300 fl-mb-2/3">Font Size Warnings</h4>
              <p className="fl-text-xs/sm text-slate-400 fl-mb-3/4">
                When <InlineCode>checkAccessibility: true</InlineCode> (default), the plugin warns if fluid typography 
                minimum sizes are below recommended thresholds:
              </p>
              <ul className="fl-text-xs/sm text-slate-400 fl-space-y-1/2">
                <li>• <strong className="text-amber-300">Below 12px:</strong> Warning issued (may be too small for readability)</li>
                <li>• <strong className="text-amber-300">WCAG 1.4.4:</strong> Text should scale up to 200% without loss of content</li>
              </ul>
            </div>
          </div>
        </div>

        <CodeBlock
          language="css"
          title="Disable accessibility checks"
          code={`@plugin "fluid-tailwindcss" {
  checkAccessibility: false;
}`}
        />
      </div>

      {/* Unit Compatibility */}
      <div className="fl-mb-8/12">
        <h3 className="fl-text-base/lg font-medium text-rose-300 fl-mb-3/4 flex items-center fl-gap-2/3">
          <span className="fl-w-2/3 fl-h-2/3 rounded-full bg-rose-400"></span>
          Unit Compatibility
        </h3>
        
        <p className="fl-text-sm/base text-slate-400 fl-mb-4/6">
          Arbitrary values require matching units on both sides:
        </p>

        <div className="grid md:grid-cols-2 fl-gap-4/6">
          <div className="bg-emerald-500/5 border border-emerald-500/20 fl-rounded-lg/xl fl-p-4/6">
            <h4 className="fl-text-sm/base font-medium text-emerald-300 fl-mb-2/3 flex items-center fl-gap-2/3">
              <span>✓</span> Valid
            </h4>
            <ul className="fl-text-xs/sm text-slate-400 fl-space-y-1/2">
              <li><InlineCode className="text-emerald-400">fl-p-[1rem/3rem]</InlineCode></li>
              <li><InlineCode className="text-emerald-400">fl-w-[100px/300px]</InlineCode></li>
              <li><InlineCode className="text-emerald-400">fl-text-[0.875em/1.25em]</InlineCode></li>
            </ul>
          </div>
          <div className="bg-rose-500/5 border border-rose-500/20 fl-rounded-lg/xl fl-p-4/6">
            <h4 className="fl-text-sm/base font-medium text-rose-300 fl-mb-2/3 flex items-center fl-gap-2/3">
              <span>✗</span> Invalid (mixed units)
            </h4>
            <ul className="fl-text-xs/sm text-slate-400 fl-space-y-1/2">
              <li><InlineCode className="text-rose-400">fl-p-[1rem/16px]</InlineCode></li>
              <li><InlineCode className="text-rose-400">fl-w-[100px/20rem]</InlineCode></li>
              <li><InlineCode className="text-rose-400">fl-text-[14px/1.5em]</InlineCode></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Browser Support */}
      <div className="fl-mb-8/12">
        <h3 className="fl-text-base/lg font-medium text-sky-300 fl-mb-3/4 flex items-center fl-gap-2/3">
          <span className="fl-w-2/3 fl-h-2/3 rounded-full bg-sky-400"></span>
          Browser Support
        </h3>
        
        <p className="fl-text-sm/base text-slate-400 fl-mb-4/6">
          CSS <InlineCode>clamp()</InlineCode> is supported in all modern browsers:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 fl-gap-3/4">
          <BrowserCard name="Chrome" version="79+" />
          <BrowserCard name="Firefox" version="75+" />
          <BrowserCard name="Safari" version="13.1+" />
          <BrowserCard name="Edge" version="79+" />
        </div>

        <div className="bg-slate-900/50 border border-slate-800 fl-rounded-lg/xl fl-p-4/6 fl-mt-4/6">
          <h4 className="fl-text-sm/base font-medium text-slate-300 fl-mb-2/3">Legacy Browser Support</h4>
          <p className="fl-text-xs/sm text-slate-400">
            For older browsers, consider using a PostCSS plugin like{' '}
            <a 
              href="https://github.com/nicksheffield/postcss-clamp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
            >
              postcss-clamp
            </a>.
          </p>
        </div>
      </div>

      {/* Scale Limitations */}
      <div>
        <h3 className="fl-text-base/lg font-medium text-violet-300 fl-mb-3/4 flex items-center fl-gap-2/3">
          <span className="fl-w-2/3 fl-h-2/3 rounded-full bg-violet-400"></span>
          Scale Limitations
        </h3>
        
        <p className="fl-text-sm/base text-slate-400 fl-mb-4/6">
          Keep in mind these constraints when designing fluid layouts:
        </p>

        <ul className="fl-space-y-2/3 fl-text-sm/base text-slate-400">
          <li className="flex fl-gap-2/3">
            <span className="text-violet-400">•</span>
            <span>Min value must be smaller than max value</span>
          </li>
          <li className="flex fl-gap-2/3">
            <span className="text-violet-400">•</span>
            <span>Values must use Tailwind scale names or valid CSS units</span>
          </li>
          <li className="flex fl-gap-2/3">
            <span className="text-violet-400">•</span>
            <span>Not all utilities support all scale values (e.g., typography scales)</span>
          </li>
          <li className="flex fl-gap-2/3">
            <span className="text-violet-400">•</span>
            <span>Percentage values are not supported for fluid calculations</span>
          </li>
        </ul>
      </div>
    </section>
  )
}

function BrowserCard({ name, version }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/lg fl-p-3/4 text-center">
      <div className="fl-text-sm/base font-medium text-slate-300">{name}</div>
      <div className="fl-text-xs/sm text-emerald-400">{version}</div>
    </div>
  )
}

