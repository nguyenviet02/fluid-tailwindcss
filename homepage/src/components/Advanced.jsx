import CodeBlock, { InlineCode } from './CodeBlock'

export default function Advanced() {
  return (
    <section id="advanced" className="fl-mb-12/20 scroll-mt-6">
      <h2 className="fl-text-xl/3xl font-semibold text-white fl-mb-4/6">Advanced Features</h2>
      
      <p className="fl-text-sm/base text-slate-400 fl-mb-6/8">
        Powerful features for complex responsive designs.
      </p>

      {/* Negative Values */}
      <div className="fl-mb-8/12">
        <h3 className="fl-text-base/lg font-medium text-pink-300 fl-mb-3/4 flex items-center fl-gap-2/3">
          <span className="fl-w-2/3 fl-h-2/3 rounded-full bg-pink-400"></span>
          Negative Values
        </h3>
        <p className="fl-text-sm/base text-slate-400 fl-mb-4/6">
          Use the <InlineCode className="text-pink-400 bg-pink-500/10">neg-</InlineCode> prefix for negative fluid values:
        </p>
        
        <div className="grid lg:grid-cols-2 fl-gap-4/6 fl-mb-4/6">
          <CodeBlock
            language="html"
            code={`<!-- Negative margin -->
<div class="neg-fl-mt-2/6">Overlapping</div>

<!-- Negative translate -->
<div class="neg-fl-translate-x-4/12">←</div>

<!-- Negative position -->
<div class="absolute neg-fl-left-2/8">Outside</div>`}
          />
          <div className="bg-slate-900/50 border border-pink-800/30 fl-rounded-lg/xl fl-p-4/6">
            <p className="fl-text-xs/sm text-slate-500 fl-mb-3/4">Negative margin demo:</p>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="bg-pink-500/30 fl-p-3/5 rounded text-center fl-text-sm/base">Reference</div>
              <div className="neg-fl-mt-2/6 bg-pink-500/60 fl-p-3/5 rounded text-center fl-text-sm/base border-2 border-pink-400">
                Overlapping with neg-fl-mt
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Arbitrary Values */}
      <div className="fl-mb-8/12">
        <h3 className="fl-text-base/lg font-medium text-purple-300 fl-mb-3/4 flex items-center fl-gap-2/3">
          <span className="fl-w-2/3 fl-h-2/3 rounded-full bg-purple-400"></span>
          Arbitrary Values
        </h3>
        <p className="fl-text-sm/base text-slate-400 fl-mb-4/6">
          Use bracket notation for precise control: <InlineCode className="text-purple-400 bg-purple-500/10">[min/max]</InlineCode>
        </p>
        
        <div className="grid lg:grid-cols-2 fl-gap-4/6 fl-mb-4/6">
          <CodeBlock
            language="html"
            code={`<!-- Precise rem values -->
<div class="fl-p-[1rem/3rem]">
  Padding from 1rem to 3rem
</div>

<!-- Pixel values -->
<div class="fl-w-[100px/300px]">
  Width from 100px to 300px
</div>`}
          />
          <div className="bg-slate-900/50 border border-purple-800/30 fl-rounded-lg/xl fl-p-4/6">
            <p className="fl-text-xs/sm text-slate-500 fl-mb-3/4">Result:</p>
            <div className="fl-p-[1rem/3rem] bg-purple-500/20 border border-purple-500/50 rounded-lg">
              <div className="bg-purple-500/30 fl-p-2/4 rounded text-center fl-text-sm/base text-purple-300">
                1rem → 3rem padding
              </div>
            </div>
          </div>
        </div>

        {/* Unit validation warning */}
        <div className="bg-amber-500/5 border border-amber-500/20 fl-rounded-lg/xl fl-p-4/6">
          <div className="flex fl-gap-3/4">
            <span className="fl-text-lg/xl">⚠️</span>
            <div>
              <h4 className="fl-text-sm/base font-medium text-amber-300 fl-mb-1/2">Unit Validation</h4>
              <p className="fl-text-xs/sm text-slate-400">
                Both values must use the <strong className="text-amber-300">same unit</strong>. 
                Mismatched units like <InlineCode className="text-red-400">[1rem/16px]</InlineCode> will be rejected.
                Use <InlineCode className="text-emerald-400">[1rem/2rem]</InlineCode> or <InlineCode className="text-emerald-400">[16px/32px]</InlineCode> instead.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Variants */}
      <div className="fl-mb-8/12">
        <h3 className="fl-text-base/lg font-medium text-teal-300 fl-mb-3/4 flex items-center fl-gap-2/3">
          <span className="fl-w-2/3 fl-h-2/3 rounded-full bg-teal-400"></span>
          Responsive Variants
        </h3>
        <p className="fl-text-sm/base text-slate-400 fl-mb-4/6">
          Combine fluid utilities with Tailwind's responsive prefixes:
        </p>
        
        <div className="grid lg:grid-cols-2 fl-gap-4/6">
          <CodeBlock
            language="html"
            code={`<div class="fl-p-2/4 md:fl-p-4/8 lg:fl-p-6/12">
  Different fluid ranges per breakpoint
</div>

<h1 class="fl-text-base/xl md:fl-text-lg/3xl">
  Responsive fluid typography
</h1>`}
          />
          <div className="bg-slate-900/50 border border-teal-800/30 fl-rounded-lg/xl fl-p-4/6">
            <p className="fl-text-xs/sm text-slate-500 fl-mb-3/4">Result:</p>
            <div className="fl-p-2/4 md:fl-p-4/8 lg:fl-p-6/12 bg-teal-500/20 border border-teal-500/50 rounded-lg">
              <div className="bg-teal-500/30 fl-p-2/3 rounded text-center">
                <span className="fl-text-sm/lg text-teal-300">Responsive + Fluid</span>
                <p className="fl-text-xs/sm text-teal-200 mt-1">
                  <span className="md:hidden">Mobile: 2/4</span>
                  <span className="hidden md:inline lg:hidden">Tablet: 4/8</span>
                  <span className="hidden lg:inline">Desktop: 6/12</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Utilities */}
      <div>
        <h3 className="fl-text-base/lg font-medium text-slate-200 fl-mb-3/4">All Supported Utilities</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 fl-gap-4/6">
          <UtilityCategory
            title="Spacing"
            color="cyan"
            utilities={['fl-p', 'fl-px', 'fl-py', 'fl-pt/r/b/l', 'fl-m', 'fl-mx', 'fl-my', 'fl-mt/r/b/l']}
          />
          <UtilityCategory
            title="Typography"
            color="violet"
            utilities={['fl-text', 'fl-leading', 'fl-tracking']}
          />
          <UtilityCategory
            title="Sizing"
            color="emerald"
            utilities={['fl-w', 'fl-h', 'fl-size', 'fl-min-w', 'fl-max-w', 'fl-min-h', 'fl-max-h']}
          />
          <UtilityCategory
            title="Layout"
            color="amber"
            utilities={['fl-gap', 'fl-gap-x', 'fl-gap-y', 'fl-inset', 'fl-top/right/bottom/left', 'fl-space-x/y']}
          />
          <UtilityCategory
            title="Border"
            color="rose"
            utilities={['fl-rounded', 'fl-rounded-t/r/b/l', 'fl-rounded-tl/tr/br/bl', 'fl-border']}
          />
          <UtilityCategory
            title="Transform"
            color="sky"
            utilities={['fl-translate-x', 'fl-translate-y', 'fl-scroll-m', 'fl-scroll-p', 'fl-basis']}
          />
        </div>
      </div>
    </section>
  )
}

function UtilityCategory({ title, color, utilities }) {
  const colorClasses = {
    cyan: 'border-cyan-800/30 text-cyan-400',
    violet: 'border-violet-800/30 text-violet-400',
    emerald: 'border-emerald-800/30 text-emerald-400',
    amber: 'border-amber-800/30 text-amber-400',
    rose: 'border-rose-800/30 text-rose-400',
    sky: 'border-sky-800/30 text-sky-400',
  }

  return (
    <div className={`bg-slate-900/50 border ${colorClasses[color].split(' ')[0]} fl-rounded-lg/xl fl-p-3/5`}>
      <h4 className={`fl-text-sm/base font-medium ${colorClasses[color].split(' ')[1]} fl-mb-2/3`}>{title}</h4>
      <ul className="fl-space-y-0.5/1 fl-text-xs/sm text-slate-400">
        {utilities.map((util, i) => (
          <li key={i}><code>{util}</code></li>
        ))}
      </ul>
    </div>
  )
}

