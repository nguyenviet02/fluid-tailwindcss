/**
 * Test Component for fluid-tailwindcss utilities
 * 
 * This demo showcases all fluid utilities including:
 * - Basic utilities (padding, margin, typography, sizing, etc.)
 * - Advanced features (negative values, arbitrary values, container queries)
 * - Unit validation and compatibility checking
 * - tailwind-merge integration
 * 
 * Configuration in your CSS:
 * @import "tailwindcss";
 * @plugin "fluid-tailwindcss";
 * 
 * Or with options:
 * @plugin "fluid-tailwindcss" {
 *   minViewport: 375;
 *   maxViewport: 1440;
 *   useRem: true;
 *   debug: false;
 * }
 */

export default function FluidUtilitiesDemo() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 fl-p-4/12">
      {/* Header */}
      <header className="fl-mb-8/16 text-center">
        <h1 className="fl-text-3xl/6xl font-bold bg-linear-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent fl-mb-2/4">
          fluid-tailwindcss
        </h1>
        <p className="fl-text-base/xl text-slate-400">
          Fluid responsive utilities using CSS clamp()
        </p>
        <p className="fl-text-sm/base text-slate-500 fl-mt-2/4">
          Resize your browser to see the fluid scaling in action
        </p>
        
        {/* Quick Navigation */}
        <div className="flex flex-wrap justify-center fl-gap-2/4 fl-mt-4/8">
          <span className="fl-text-xs/sm text-slate-600">Jump to:</span>
          <a href="#basic" className="fl-text-xs/sm text-cyan-400 hover:text-cyan-300">Basic</a>
          <span className="text-slate-700">•</span>
          <a href="#advanced" className="fl-text-xs/sm text-pink-400 hover:text-pink-300">Advanced Features</a>
        </div>
      </header>
      
      {/* Basic Utilities Anchor */}
      <div id="basic" className="scroll-mt-4"></div>

      {/* Typography Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-slate-200 border-b border-slate-800 fl-pb-2/4">
          Typography (fl-text, fl-leading, fl-tracking)
        </h2>
        <div className="grid gap-4">
          {/* fl-text */}
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <div className="fl-mb-2/4">
              <code className="fl-text-xs/sm text-cyan-400 bg-cyan-500/10 fl-px-1.5/3 fl-py-0.5/1 rounded">
                fl-text-base/4xl
              </code>
              <span className="fl-text-xs/sm text-slate-500 fl-ml-2/3">Fluid font size</span>
            </div>
            <p className="fl-text-base/4xl font-semibold text-cyan-400">Fluid Typography</p>
          </div>
          {/* fl-text + fl-leading */}
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <div className="fl-mb-2/4">
              <code className="fl-text-xs/sm text-cyan-400 bg-cyan-500/10 fl-px-1.5/3 fl-py-0.5/1 rounded">
                fl-text-sm/2xl fl-leading-5/8
              </code>
              <span className="fl-text-xs/sm text-slate-500 fl-ml-2/3">Font size + line height</span>
            </div>
            <p className="fl-text-sm/2xl fl-leading-5/8 text-violet-400">
              This text has fluid font size and line height. Lorem ipsum dolor sit amet.
            </p>
          </div>
          {/* fl-tracking */}
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <div className="fl-mb-2/4">
              <code className="fl-text-xs/sm text-cyan-400 bg-cyan-500/10 fl-px-1.5/3 fl-py-0.5/1 rounded">
                fl-tracking-tight/widest
              </code>
              <span className="fl-text-xs/sm text-slate-500 fl-ml-2/3">Letter spacing</span>
            </div>
            <p className="fl-text-lg/2xl fl-tracking-tight/widest text-emerald-400 uppercase">
              Letter Spacing
            </p>
          </div>
        </div>
      </section>

      {/* Padding Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-slate-200 border-b border-slate-800 fl-pb-2/4">
          Padding (fl-p, fl-px, fl-py, fl-pt, fl-pr, fl-pb, fl-pl)
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-p-2/8</code>
            <div className="fl-p-2/8 bg-cyan-500/20 border border-cyan-500/50 rounded-lg mt-2">
              <div className="bg-cyan-500/30 p-2 rounded text-center text-sm">Content</div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-px-4/12</code>
            <div className="fl-px-4/12 py-4 bg-violet-500/20 border border-violet-500/50 rounded-lg mt-2">
              <div className="bg-violet-500/30 p-2 rounded text-center text-sm">Content</div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-py-2/10</code>
            <div className="fl-py-2/10 px-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg mt-2">
              <div className="bg-emerald-500/30 p-2 rounded text-center text-sm">Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Margin Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-slate-200 border-b border-slate-800 fl-pb-2/4">
          Margin (fl-m, fl-mx, fl-my, fl-mt, fl-mr, fl-mb, fl-ml)
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-m-2/6</code>
            <div className="bg-slate-800 rounded-lg p-1 mt-2">
              <div className="fl-m-2/6 bg-cyan-500/30 p-4 rounded text-center text-sm">Content</div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-mx-4/12</code>
            <div className="bg-slate-800 rounded-lg p-1 mt-2">
              <div className="fl-mx-4/12 bg-violet-500/30 p-4 rounded text-center text-sm">Content</div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-my-2/8</code>
            <div className="bg-slate-800 rounded-lg p-1 mt-2">
              <div className="fl-my-2/8 bg-emerald-500/30 p-4 rounded text-center text-sm">Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sizing Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-slate-200 border-b border-slate-800 fl-pb-2/4">
          Sizing (fl-w, fl-h, fl-size, fl-min-w, fl-max-w)
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-w-32/64</code>
            <div className="fl-w-32/64 h-16 bg-linear-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center text-sm font-medium mt-2">
              Fluid Width
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-h-16/32</code>
            <div className="w-full fl-h-16/32 bg-linear-to-b from-violet-500 to-violet-600 rounded-lg flex items-center justify-center text-sm font-medium mt-2">
              Fluid Height
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-size-16/32</code>
            <div className="flex justify-center mt-2">
              <div className="fl-size-16/32 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-sm font-medium">
                Square
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-max-w-48/96</code>
            <div className="fl-max-w-48/96 w-full h-16 bg-linear-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-sm font-medium mt-2">
              Max Width
            </div>
          </div>
        </div>
      </section>

      {/* Gap Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-slate-200 border-b border-slate-800 fl-pb-2/4">
          Gap (fl-gap, fl-gap-x, fl-gap-y)
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-gap-2/8</code>
            <div className="flex flex-wrap fl-gap-2/8 mt-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-12 h-12 bg-cyan-500/50 rounded-lg flex items-center justify-center font-medium">
                  {i}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-gap-x-4/12 fl-gap-y-2/6</code>
            <div className="grid grid-cols-3 fl-gap-x-4/12 fl-gap-y-2/6 mt-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-12 bg-violet-500/50 rounded-lg flex items-center justify-center font-medium">
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Space Between Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-slate-200 border-b border-slate-800 fl-pb-2/4">
          Space Between (fl-space-x, fl-space-y)
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-space-x-2/8</code>
            <div className="flex fl-space-x-2/8 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 bg-emerald-500/50 rounded-lg flex items-center justify-center font-medium">
                  {i}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-space-y-2/6</code>
            <div className="flex flex-col fl-space-y-2/6 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-rose-500/50 rounded-lg flex items-center justify-center font-medium">
                  Item {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Border Radius Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-slate-200 border-b border-slate-800 fl-pb-2/4">
          Border Radius (fl-rounded)
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-rounded-sm/2xl</code>
            <div className="w-full h-20 bg-linear-to-br from-cyan-500 to-cyan-600 fl-rounded-sm/2xl mt-2" />
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-rounded-t-sm/xl</code>
            <div className="w-full h-20 bg-linear-to-br from-violet-500 to-violet-600 fl-rounded-t-sm/xl mt-2" />
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-rounded-b-sm/xl</code>
            <div className="w-full h-20 bg-linear-to-br from-emerald-500 to-emerald-600 fl-rounded-b-sm/xl mt-2" />
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-rounded-tl-sm/3xl</code>
            <div className="w-full h-20 bg-linear-to-br from-amber-500 to-amber-600 fl-rounded-tl-sm/3xl mt-2" />
          </div>
        </div>
      </section>

      {/* Border Width Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-slate-200 border-b border-slate-800 fl-pb-2/4">
          Border Width (fl-border)
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-border-0/4</code>
            <div className="w-full h-20 fl-border-0/4 border-cyan-500 rounded-lg bg-cyan-500/10 mt-2" />
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-border-t-0/8</code>
            <div className="w-full h-20 fl-border-t-0/8 border-violet-500 rounded-lg bg-violet-500/10 mt-2" />
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-border-b-0/4</code>
            <div className="w-full h-20 fl-border-b-0/4 border-emerald-500 rounded-lg bg-emerald-500/10 mt-2" />
          </div>
        </div>
      </section>

      {/* Position Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-slate-200 border-b border-slate-800 fl-pb-2/4">
          Position (fl-inset, fl-top, fl-right, fl-bottom, fl-left)
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-inset-2/8</code>
            <div className="relative h-32 bg-slate-800 rounded-lg mt-2">
              <div className="absolute fl-inset-2/8 bg-cyan-500/50 rounded-lg flex items-center justify-center text-sm">
                Positioned
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-top-1/4 fl-right-2/8</code>
            <div className="relative h-32 bg-slate-800 rounded-lg mt-2">
              <div className="absolute fl-top-1/4 fl-right-2/8 w-16 h-16 bg-violet-500/50 rounded-lg flex items-center justify-center text-xs">
                Top Right
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flex Basis Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-slate-200 border-b border-slate-800 fl-pb-2/4">
          Flex Basis (fl-basis)
        </h2>
        <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
          <code className="fl-text-xs/sm text-cyan-400">fl-basis-24/48</code>
          <div className="flex gap-2 mt-2">
            <div className="fl-basis-24/48 shrink-0 h-16 bg-linear-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center text-sm font-medium">
              Fluid Basis
            </div>
            <div className="flex-1 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-sm text-slate-400">
              Remaining
            </div>
          </div>
        </div>
      </section>

      {/* Transform Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-slate-200 border-b border-slate-800 fl-pb-2/4">
          Transform (fl-translate-x, fl-translate-y)
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-translate-x-2/12</code>
            <div className="h-20 bg-slate-800 rounded-lg overflow-hidden mt-2">
              <div className="fl-translate-x-2/12 w-16 h-16 mt-2 bg-linear-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-sm">
                →
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-cyan-400">fl-translate-y-1/8</code>
            <div className="h-24 bg-slate-800 rounded-lg overflow-hidden flex justify-center mt-2">
              <div className="fl-translate-y-1/8 w-16 h-16 bg-linear-to-b from-rose-500 to-rose-600 rounded-lg flex items-center justify-center text-sm">
                ↓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-slate-200 border-b border-slate-800 fl-pb-2/4">
          Scroll (fl-scroll-m, fl-scroll-p)
        </h2>
        <div className="bg-slate-900/50 border border-slate-800 fl-rounded-md/xl fl-p-3/6">
          <code className="fl-text-xs/sm text-cyan-400">fl-scroll-p-4/12</code>
          <div className="fl-scroll-p-4/12 overflow-x-auto flex gap-4 snap-x snap-mandatory pb-4 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-48 h-32 bg-linear-to-br from-sky-500 to-sky-600 rounded-lg flex items-center justify-center text-xl font-bold"
              >
                Card {i}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">← Scroll horizontally →</p>
        </div>
      </section>

      {/* ============================================= */}
      {/* ADVANCED FEATURES SECTION */}
      {/* ============================================= */}
      
      <div id="advanced" className="scroll-mt-4 fl-my-8/16 fl-py-4/8 border-y border-dashed border-pink-500/50">
        <h2 className="fl-text-2xl/4xl font-bold text-center bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Advanced Features
        </h2>
        <p className="fl-text-sm/base text-center text-slate-400 fl-mt-2/4">
          New capabilities from fluid-tailwindcss optimization
        </p>
      </div>

      {/* Negative Values Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-pink-300 border-b border-pink-800 fl-pb-2/4">
          Negative Values (neg-fl-m, neg-fl-translate, neg-fl-inset)
        </h2>
        <p className="fl-text-xs/sm text-slate-400 fl-mb-4/6">
          Fluid utilities support negative values using <code className="text-pink-400">neg-</code> prefix for Tailwind v4 compatibility.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Negative Margin */}
          <div className="bg-slate-900/50 border border-pink-800/50 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-pink-400">neg-fl-mt-2/6</code>
            <span className="fl-text-xs/sm text-slate-500 fl-ml-2/3">Negative margin-top</span>
            <div className="bg-slate-800 rounded-lg p-4 mt-4">
              <div className="bg-pink-500/30 p-4 rounded text-center text-sm">Reference</div>
              <div className="neg-fl-mt-2/6 bg-pink-500/60 p-4 rounded text-center text-sm border-2 border-pink-400">
                Overlapping with neg-fl-mt
              </div>
            </div>
          </div>
          
          {/* Negative Translate X */}
          <div className="bg-slate-900/50 border border-pink-800/50 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-pink-400">neg-fl-translate-x-4/12</code>
            <span className="fl-text-xs/sm text-slate-500 fl-ml-2/3">Negative translate</span>
            <div className="h-24 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-end mt-2 pr-4">
              <div className="neg-fl-translate-x-4/12 w-16 h-16 bg-linear-to-l from-pink-500 to-pink-600 rounded-lg flex items-center justify-center text-sm">
                ←
              </div>
            </div>
          </div>
          
          {/* Negative Inset */}
          <div className="bg-slate-900/50 border border-pink-800/50 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-pink-400">neg-fl-left-2/8</code>
            <span className="fl-text-xs/sm text-slate-500 fl-ml-2/3">Negative position</span>
            <div className="relative h-28 bg-slate-800 rounded-lg mt-2 overflow-visible">
              <div className="absolute neg-fl-left-2/8 top-4 w-20 h-20 bg-pink-500/70 rounded-lg flex items-center justify-center text-xs border border-pink-400">
                Outside
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Arbitrary Values Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-purple-300 border-b border-purple-800 fl-pb-2/4">
          Arbitrary Values with Unit Validation
        </h2>
        <p className="fl-text-xs/sm text-slate-400 fl-mb-4/6">
          Use arbitrary values like <code className="text-purple-400">[1rem/2rem]</code> for precise control. 
          Values with mismatched units (e.g., <code className="text-red-400">[1rem/16px]</code>) are validated and rejected.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Valid Arbitrary - Same Units */}
          <div className="bg-slate-900/50 border border-purple-800/50 fl-rounded-md/xl fl-p-3/6">
            <div className="flex items-center gap-2 fl-mb-2/4">
              <code className="fl-text-xs/sm text-purple-400 bg-purple-500/10 fl-px-1.5/3 fl-py-0.5/1 rounded">
                fl-p-[1rem/3rem]
              </code>
              <span className="fl-text-xs/sm text-emerald-400">✓ Valid - same units</span>
            </div>
            <div className="fl-p-[1rem/3rem] bg-purple-500/20 border border-purple-500/50 rounded-lg">
              <div className="bg-purple-500/30 p-2 rounded text-center text-sm">
                Precise 1rem → 3rem padding
              </div>
            </div>
          </div>
          
          {/* Valid Arbitrary - Width */}
          <div className="bg-slate-900/50 border border-purple-800/50 fl-rounded-md/xl fl-p-3/6">
            <div className="flex items-center gap-2 fl-mb-2/4">
              <code className="fl-text-xs/sm text-purple-400 bg-purple-500/10 fl-px-1.5/3 fl-py-0.5/1 rounded">
                fl-w-[100px/300px]
              </code>
              <span className="fl-text-xs/sm text-emerald-400">✓ Valid - px units</span>
            </div>
            <div className="fl-w-[100px/300px] h-16 bg-linear-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-sm font-medium">
              100px → 300px
            </div>
          </div>

          {/* Validation Info Card */}
          <div className="md:col-span-2 bg-slate-900/50 border border-amber-800/50 fl-rounded-md/xl fl-p-3/6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h4 className="fl-text-sm/base font-semibold text-amber-300 fl-mb-1/2">
                  Unit Validation
                </h4>
                <p className="fl-text-xs/sm text-slate-400">
                  Fluid utilities require start/end values to be length literals with the <strong className="text-amber-300">same unit</strong>. 
                  For example, <code className="text-red-400">fl-p-[1rem/16px]</code> will be rejected because rem ≠ px.
                  Use <code className="text-emerald-400">fl-p-[1rem/2rem]</code> or <code className="text-emerald-400">fl-p-[16px/32px]</code> instead.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Container Queries Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-indigo-300 border-b border-indigo-800 fl-pb-2/4">
          Container Queries (cqw units)
        </h2>
        <p className="fl-text-xs/sm text-slate-400 fl-mb-4/6">
          Enable <code className="text-indigo-400">useContainerQuery: true</code> in plugin options to use <code className="text-indigo-400">cqw</code> units 
          instead of <code className="text-slate-400">vw</code> for container-relative fluid sizing.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Container Query Demo */}
          <div className="bg-slate-900/50 border border-indigo-800/50 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-indigo-400">@container + fluid</code>
            <div className="mt-2 p-4 bg-slate-800 rounded-lg" style={{ containerType: 'inline-size' }}>
              <p className="fl-text-xs/sm text-slate-500 mb-2">Resize this container:</p>
              <div className="resize-x overflow-auto min-w-[150px] max-w-full bg-slate-700 rounded p-3" style={{ containerType: 'inline-size' }}>
                <div className="bg-indigo-500/50 fl-p-2/6 rounded text-center text-sm">
                  Container-aware padding
                </div>
              </div>
            </div>
          </div>
          
          {/* Config Example */}
          <div className="bg-slate-900/50 border border-indigo-800/50 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-indigo-400">Configuration</code>
            <div className="mt-2 bg-slate-800 rounded-lg p-4 overflow-x-auto">
              <pre className="fl-text-xs/sm text-slate-300">
{`@plugin "fluid-tailwindcss" {
  useContainerQuery: true;
  minViewport: 320;
  maxViewport: 1200;
}`}
              </pre>
            </div>
            <p className="fl-text-xs/sm text-slate-500 mt-2">
              Output uses <code className="text-indigo-400">cqw</code> instead of <code className="text-slate-400">vw</code>
            </p>
          </div>
        </div>
      </section>

      {/* Combining with Media Queries Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-teal-300 border-b border-teal-800 fl-pb-2/4">
          Combining with Media Queries
        </h2>
        <p className="fl-text-xs/sm text-slate-400 fl-mb-4/6">
          Fluid utilities work seamlessly with Tailwind's responsive variants for precise control at different breakpoints.
        </p>
        <div className="grid gap-4">
          <div className="bg-slate-900/50 border border-teal-800/50 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-teal-400">
              fl-p-2/4 md:fl-p-4/8 lg:fl-p-6/12
            </code>
            <span className="fl-text-xs/sm text-slate-500 fl-ml-2/3">Different fluid ranges per breakpoint</span>
            <div className="fl-p-2/4 md:fl-p-4/8 lg:fl-p-6/12 bg-teal-500/20 border border-teal-500/50 rounded-lg mt-2">
              <div className="bg-teal-500/30 p-3 rounded text-center">
                <span className="fl-text-sm/lg">
                  Responsive + Fluid
                </span>
                <p className="fl-text-xs/sm text-teal-200 mt-1">
                  <span className="md:hidden">Mobile: 2/4</span>
                  <span className="hidden md:inline lg:hidden">Tablet: 4/8</span>
                  <span className="hidden lg:inline">Desktop: 6/12</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 border border-teal-800/50 fl-rounded-md/xl fl-p-3/6">
              <code className="fl-text-xs/sm text-teal-400">
                fl-text-base/xl md:fl-text-lg/3xl
              </code>
              <p className="fl-text-base/xl md:fl-text-lg/3xl text-teal-400 font-semibold mt-2">
                Responsive Typography
              </p>
            </div>
            <div className="bg-slate-900/50 border border-teal-800/50 fl-rounded-md/xl fl-p-3/6">
              <code className="fl-text-xs/sm text-teal-400">
                fl-gap-2/4 lg:fl-gap-4/8
              </code>
              <div className="flex fl-gap-2/4 lg:fl-gap-4/8 mt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 bg-teal-500/50 rounded-lg flex items-center justify-center font-medium">
                    {i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tailwind Merge Integration Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-orange-300 border-b border-orange-800 fl-pb-2/4">
          Enhanced tailwind-merge Integration
        </h2>
        <p className="fl-text-xs/sm text-slate-400 fl-mb-4/6">
          Proper conflict resolution between fluid and regular utilities, with support for arbitrary values and negative classes.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Merge Examples */}
          <div className="bg-slate-900/50 border border-orange-800/50 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-orange-400">Conflict Resolution</code>
            <div className="mt-2 bg-slate-800 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <code className="fl-text-xs/sm text-slate-400">twMerge("p-4", "fl-p-4/8")</code>
                <span className="text-emerald-400">→</span>
                <code className="fl-text-xs/sm text-emerald-400">"fl-p-4/8"</code>
              </div>
              <div className="flex items-center gap-2">
                <code className="fl-text-xs/sm text-slate-400">twMerge("fl-p-4/8", "p-4")</code>
                <span className="text-emerald-400">→</span>
                <code className="fl-text-xs/sm text-emerald-400">"p-4"</code>
              </div>
              <div className="flex items-center gap-2">
                <code className="fl-text-xs/sm text-slate-400">twMerge("fl-m-2/4", "neg-fl-m-4/8")</code>
                <span className="text-emerald-400">→</span>
                <code className="fl-text-xs/sm text-emerald-400">"neg-fl-m-4/8"</code>
              </div>
            </div>
          </div>
          
          {/* Import Example */}
          <div className="bg-slate-900/50 border border-orange-800/50 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-orange-400">Usage</code>
            <div className="mt-2 bg-slate-800 rounded-lg p-4 overflow-x-auto">
              <pre className="fl-text-xs/sm text-slate-300">
{`import { twMerge } from 
  'fluid-tailwindcss/tailwind-merge'

// With validation
import { 
  twMergeWithValidation,
  validateFluidClass 
} from 'fluid-tailwindcss/tailwind-merge'

// Custom prefix support
import { createPrefixedTwMerge } 
  from 'fluid-tailwindcss/tailwind-merge'

const merge = createPrefixedTwMerge({ 
  prefix: 'tw-' 
})`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Debug Mode Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-rose-300 border-b border-rose-800 fl-pb-2/4">
          Debug Mode
        </h2>
        <p className="fl-text-xs/sm text-slate-400 fl-mb-4/6">
          Enable <code className="text-rose-400">debug: true</code> to add CSS comments showing the fluid calculation details.
        </p>
        <div className="bg-slate-900/50 border border-rose-800/50 fl-rounded-md/xl fl-p-3/6">
          <code className="fl-text-xs/sm text-rose-400">CSS Output with Debug</code>
          <div className="mt-2 bg-slate-800 rounded-lg p-4 overflow-x-auto">
            <pre className="fl-text-xs/sm text-slate-300">
{`.fl-p-4\\/8 {
  padding: clamp(1rem, 0.53rem + 2.07vw, 2rem)
  /* fluid from 1rem at 375px to 2rem at 1440px */
}`}
            </pre>
          </div>
          <p className="fl-text-xs/sm text-slate-500 mt-2">
            Debug comments help identify the original values and breakpoints in DevTools.
          </p>
        </div>
      </section>

      {/* Custom Breakpoints Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-lime-300 border-b border-lime-800 fl-pb-2/4">
          Custom Breakpoints Configuration
        </h2>
        <p className="fl-text-xs/sm text-slate-400 fl-mb-4/6">
          Configure global breakpoints or use per-utility custom breakpoints for fine-grained control.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-lime-800/50 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-lime-400">Global Config</code>
            <div className="mt-2 bg-slate-800 rounded-lg p-4 overflow-x-auto">
              <pre className="fl-text-xs/sm text-slate-300">
{`@plugin "fluid-tailwindcss" {
  minViewport: 320;   // Mobile
  maxViewport: 1920;  // Large desktop
  useRem: true;
  rootFontSize: 16;
  checkAccessibility: true;
}`}
              </pre>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-lime-800/50 fl-rounded-md/xl fl-p-3/6">
            <code className="fl-text-xs/sm text-lime-400">Programmatic API</code>
            <div className="mt-2 bg-slate-800 rounded-lg p-4 overflow-x-auto">
              <pre className="fl-text-xs/sm text-slate-300">
{`import { calculateClampAdvanced } 
  from 'fluid-tailwindcss'

// Per-utility custom breakpoints
const clamp = calculateClampAdvanced(
  '1rem', '3rem', options,
  { 
    minViewport: 480,  // Override
    maxViewport: 1200  // Override
  }
)`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* API Exports Section */}
      <section className="fl-mb-8/16">
        <h2 className="fl-text-lg/2xl font-bold fl-mb-4/6 text-sky-300 border-b border-sky-800 fl-pb-2/4">
          Exported Utilities for Advanced Usage
        </h2>
        <p className="fl-text-xs/sm text-slate-400 fl-mb-4/6">
          All internal utilities are exported for custom implementations.
        </p>
        <div className="bg-slate-900/50 border border-sky-800/50 fl-rounded-md/xl fl-p-3/6 overflow-x-auto">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <code className="fl-text-xs/sm text-sky-400">Clamp Functions</code>
              <ul className="fl-text-xs/sm text-slate-400 mt-2 space-y-1">
                <li>• calculateClamp</li>
                <li>• calculateClampAdvanced</li>
                <li>• createNegatedClamp</li>
                <li>• createContainerClamp</li>
              </ul>
            </div>
            <div>
              <code className="fl-text-xs/sm text-sky-400">Validation</code>
              <ul className="fl-text-xs/sm text-slate-400 mt-2 space-y-1">
                <li>• validateFluidUnits</li>
                <li>• validateUnitsMatch</li>
                <li>• parseAndValidateFluidPair</li>
                <li>• isSupportedUnit</li>
              </ul>
            </div>
            <div>
              <code className="fl-text-xs/sm text-sky-400">Utilities</code>
              <ul className="fl-text-xs/sm text-slate-400 mt-2 space-y-1">
                <li>• Length class</li>
                <li>• FluidError class</li>
                <li>• toPrecision</li>
                <li>• checkSC144 (WCAG)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center fl-pt-8/16 border-t border-slate-800">
        <p className="fl-text-sm/base text-slate-500">
          All utilities scale fluidly between 375px and 1440px viewport width
        </p>
        <p className="fl-text-xs/sm text-slate-600 fl-mt-2/4">
          fluid-tailwindcss • MIT License
        </p>
        <div className="flex justify-center fl-gap-4/8 fl-mt-4/6">
          <a 
            href="https://github.com/nguyenviet02/fluid-tailwindcss" 
            className="fl-text-xs/sm text-slate-500 hover:text-cyan-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a 
            href="https://www.npmjs.com/package/fluid-tailwindcss" 
            className="fl-text-xs/sm text-slate-500 hover:text-cyan-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            npm
          </a>
        </div>
      </footer>
    </div>
  )
}

