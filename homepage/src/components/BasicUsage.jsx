import CodeBlock, { InlineCode } from './CodeBlock'

export default function BasicUsage() {
  return (
    <section id="basic-usage" className="fl-mb-12/20 scroll-mt-6">
      <h2 className="fl-text-xl/3xl font-semibold text-white fl-mb-4/6">Basic Usage</h2>
      
      <p className="fl-text-sm/base text-slate-400 fl-mb-6/8">
        The fluid utility syntax follows the pattern: <InlineCode>fl-{'{utility}'}-{'{min}'}/{'{max}'}</InlineCode>
      </p>

      {/* Syntax explanation */}
      <div className="bg-slate-900/50 border border-slate-800 fl-rounded-lg/xl fl-p-4/6 fl-mb-6/10">
        <h3 className="fl-text-base/lg font-medium text-slate-200 fl-mb-3/4">Syntax</h3>
        <div className="flex flex-wrap items-center fl-gap-1/2 fl-text-sm/base font-mono">
          <span className="text-cyan-400">fl-</span>
          <span className="text-violet-400">{'{utility}'}</span>
          <span className="text-slate-500">-</span>
          <span className="text-emerald-400">{'{min}'}</span>
          <span className="text-slate-500">/</span>
          <span className="text-amber-400">{'{max}'}</span>
        </div>
        <ul className="fl-mt-3/4 fl-space-y-1/2 fl-text-xs/sm text-slate-400">
          <li><span className="text-cyan-400">fl-</span> → prefix for fluid utilities</li>
          <li><span className="text-violet-400">{'{utility}'}</span> → any Tailwind utility (p, m, text, w, h, gap, etc.)</li>
          <li><span className="text-emerald-400">{'{min}'}</span> → minimum value from Tailwind scale</li>
          <li><span className="text-amber-400">{'{max}'}</span> → maximum value from Tailwind scale</li>
        </ul>
      </div>

      {/* Typography Example */}
      <div className="fl-mb-6/10">
        <h3 className="fl-text-base/lg font-medium text-slate-200 fl-mb-3/4">Typography</h3>
        <div className="grid lg:grid-cols-2 fl-gap-4/6">
          <div>
            <CodeBlock
              language="html"
              code={`<h1 class="fl-text-2xl/5xl">
  Fluid Typography
</h1>`}
            />
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-lg/xl fl-p-4/6 flex items-center">
            <div>
              <p className="fl-text-xs/sm text-slate-500 fl-mb-2/3">Result (resize to see):</p>
              <h1 className="fl-text-2xl/5xl font-bold text-cyan-400">Fluid Typography</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing Example */}
      <div className="fl-mb-6/10">
        <h3 className="fl-text-base/lg font-medium text-slate-200 fl-mb-3/4">Spacing</h3>
        <div className="grid lg:grid-cols-2 fl-gap-4/6">
          <div>
            <CodeBlock
              language="html"
              code={`<div class="fl-p-4/12 fl-m-2/8">
  Fluid padding & margin
</div>`}
            />
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-lg/xl fl-p-4/6">
            <p className="fl-text-xs/sm text-slate-500 fl-mb-2/3">Result:</p>
            <div className="bg-slate-800 rounded-lg p-2">
              <div className="fl-p-4/12 fl-m-2/8 bg-violet-500/20 border border-violet-500/50 rounded-lg">
                <div className="bg-violet-500/30 fl-p-2/4 rounded text-center fl-text-sm/base">
                  Fluid padding & margin
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gap Example */}
      <div className="fl-mb-6/10">
        <h3 className="fl-text-base/lg font-medium text-slate-200 fl-mb-3/4">Layout (Gap)</h3>
        <div className="grid lg:grid-cols-2 fl-gap-4/6">
          <div>
            <CodeBlock
              language="html"
              code={`<div class="flex fl-gap-2/8">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>`}
            />
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-lg/xl fl-p-4/6">
            <p className="fl-text-xs/sm text-slate-500 fl-mb-2/3">Result:</p>
            <div className="flex fl-gap-2/8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="fl-w-10/16 fl-h-10/16 bg-emerald-500/50 rounded-lg flex items-center justify-center font-medium fl-text-sm/base">
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Output */}
      <div className="fl-mb-6/10">
        <h3 className="fl-text-base/lg font-medium text-slate-200 fl-mb-3/4">Generated CSS</h3>
        <p className="fl-text-sm/base text-slate-400 fl-mb-3/4">
          The plugin generates <InlineCode>clamp()</InlineCode> values that smoothly scale between viewports:
        </p>
        <CodeBlock
          language="css"
          title="Generated CSS"
          code={`.fl-text-2xl\\/5xl {
  font-size: clamp(1.5rem, 1.0282rem + 2.0657vw, 3rem);
}

.fl-p-4\\/8 {
  padding: clamp(1rem, 0.5282rem + 2.0657vw, 2rem);
}`}
        />
      </div>

      {/* Quick reference table */}
      <div>
        <h3 className="fl-text-base/lg font-medium text-slate-200 fl-mb-3/4">Quick Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full fl-text-xs/sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left fl-py-2/3 fl-pr-4/6 text-slate-400 font-medium">Class</th>
                <th className="text-left fl-py-2/3 fl-pr-4/6 text-slate-400 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800/50">
                <td className="fl-py-2/3 fl-pr-4/6"><InlineCode>fl-p-4/8</InlineCode></td>
                <td className="fl-py-2/3">Fluid padding from 1rem to 2rem</td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="fl-py-2/3 fl-pr-4/6"><InlineCode>fl-text-base/2xl</InlineCode></td>
                <td className="fl-py-2/3">Fluid font-size from 1rem to 1.5rem</td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="fl-py-2/3 fl-pr-4/6"><InlineCode>fl-m-2/6</InlineCode></td>
                <td className="fl-py-2/3">Fluid margin from 0.5rem to 1.5rem</td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="fl-py-2/3 fl-pr-4/6"><InlineCode>fl-gap-4/8</InlineCode></td>
                <td className="fl-py-2/3">Fluid gap from 1rem to 2rem</td>
              </tr>
              <tr>
                <td className="fl-py-2/3 fl-pr-4/6"><InlineCode>fl-w-64/96</InlineCode></td>
                <td className="fl-py-2/3">Fluid width from 16rem to 24rem</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

