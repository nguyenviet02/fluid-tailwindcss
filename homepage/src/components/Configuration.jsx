import CodeBlock, { InlineCode } from './CodeBlock'

export default function Configuration() {
  return (
    <section id="configuration" className="fl-mb-12/20 scroll-mt-6">
      <h2 className="fl-text-xl/3xl font-semibold text-white fl-mb-4/6">Configuration</h2>
      
      <p className="fl-text-sm/base text-slate-400 fl-mb-6/8">
        Customize the plugin behavior with various options.
      </p>

      {/* Default Options */}
      <div className="fl-mb-6/10">
        <h3 className="fl-text-base/lg font-medium text-slate-200 fl-mb-3/4">Default Options</h3>
        <CodeBlock
          language="javascript"
          code={`{
  minViewport: 375,        // Min viewport width (px)
  maxViewport: 1440,       // Max viewport width (px)
  useRem: true,            // Use rem units (vs px)
  rootFontSize: 16,        // Root font size for rem
  checkAccessibility: true // Warn about small font sizes
}`}
        />
      </div>

      {/* CSS Configuration */}
      <div className="fl-mb-6/10">
        <h3 className="fl-text-base/lg font-medium text-slate-200 fl-mb-3/4">
          CSS-based Configuration (TailwindCSS v4)
        </h3>
        <p className="fl-text-sm/base text-slate-400 fl-mb-3/4">
          Pass options directly in your CSS file:
        </p>
        <div className="grid lg:grid-cols-2 fl-gap-4/6">
          <CodeBlock
            language="css"
            title="app.css"
            code={`@import "tailwindcss";
@plugin "fluid-tailwindcss" {
  minViewport: 320;
  maxViewport: 1920;
  useRem: true;
  rootFontSize: 16;
  checkAccessibility: true;
}`}
          />
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-lg/xl fl-p-4/6">
            <h4 className="fl-text-sm/base font-medium text-slate-300 fl-mb-2/3">Option Details</h4>
            <ul className="fl-space-y-2/3 fl-text-xs/sm text-slate-400">
              <li>
                <InlineCode>minViewport</InlineCode> - The viewport width where scaling starts
              </li>
              <li>
                <InlineCode>maxViewport</InlineCode> - The viewport width where scaling stops
              </li>
              <li>
                <InlineCode>useRem</InlineCode> - Output rem instead of px values
              </li>
              <li>
                <InlineCode>rootFontSize</InlineCode> - Base font size for rem calculations
              </li>
              <li>
                <InlineCode>checkAccessibility</InlineCode> - Enable WCAG font size warnings
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Container Queries */}
      <div className="fl-mb-6/10">
        <h3 className="fl-text-base/lg font-medium text-slate-200 fl-mb-3/4">Container Queries</h3>
        <p className="fl-text-sm/base text-slate-400 fl-mb-3/4">
          Enable container-relative scaling with <InlineCode>useContainerQuery</InlineCode>:
        </p>
        <div className="grid lg:grid-cols-2 fl-gap-4/6">
          <CodeBlock
            language="css"
            title="app.css"
            code={`@plugin "fluid-tailwindcss" {
  useContainerQuery: true;
  minViewport: 320;
  maxViewport: 1200;
}`}
          />
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-lg/xl fl-p-4/6">
            <p className="fl-text-xs/sm text-slate-500 fl-mb-2/3">Demo (resize the container):</p>
            <div className="resize-x overflow-auto min-w-[150px] max-w-full bg-slate-800 rounded-lg p-3" style={{ containerType: 'inline-size' }}>
              <div className="bg-indigo-500/30 fl-p-2/6 rounded text-center fl-text-sm/base text-indigo-300">
                Container-aware
              </div>
            </div>
            <p className="fl-text-xs/sm text-slate-500 fl-mt-2/3">
              Uses <InlineCode>cqw</InlineCode> instead of <InlineCode>vw</InlineCode>
            </p>
          </div>
        </div>
      </div>

      {/* Debug Mode */}
      <div className="fl-mb-6/10">
        <h3 className="fl-text-base/lg font-medium text-slate-200 fl-mb-3/4">Debug Mode</h3>
        <p className="fl-text-sm/base text-slate-400 fl-mb-3/4">
          Enable <InlineCode>debug: true</InlineCode> to add CSS comments showing calculation details:
        </p>
        <CodeBlock
          language="css"
          title="Output with debug: true"
          code={`.fl-p-4\\/8 {
  padding: clamp(1rem, 0.53rem + 2.07vw, 2rem);
  /* fluid from 1rem at 375px to 2rem at 1440px */
}`}
        />
      </div>

      {/* JavaScript Configuration */}
      <div className="bg-amber-500/5 border border-amber-500/20 fl-rounded-lg/xl fl-p-4/6">
        <div className="flex fl-gap-3/4">
          <span className="fl-text-lg/xl">⚠️</span>
          <div>
            <h4 className="fl-text-sm/base font-medium text-amber-300 fl-mb-1/2">
              JavaScript Configuration (Legacy)
            </h4>
            <p className="fl-text-xs/sm text-slate-400 fl-mb-3/4">
              If you need JavaScript-based configuration, use the <InlineCode>@config</InlineCode> directive:
            </p>
            <CodeBlock
              language="javascript"
              title="tailwind.config.js"
              code={`module.exports = {
  plugins: [
    require('fluid-tailwindcss')({
      minViewport: 320,
      maxViewport: 1920,
      debug: true,
    })
  ]
}`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

