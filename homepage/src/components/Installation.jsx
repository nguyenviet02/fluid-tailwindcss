import CodeBlock from './CodeBlock'

export default function Installation() {
  return (
    <section id="installation" className="fl-mb-12/20 scroll-mt-6">
      <h2 className="fl-text-xl/3xl font-semibold text-white fl-mb-4/6">Installation</h2>
      
      <p className="fl-text-sm/base text-slate-400 fl-mb-4/6">
        Install the package via npm, pnpm, or yarn:
      </p>

      <CodeBlock
        language="bash"
        title="Terminal"
        code={`npm install fluid-tailwindcss
# or
pnpm add fluid-tailwindcss
# or
yarn add fluid-tailwindcss`}
        className="fl-mb-6/8"
      />

      {/* TailwindCSS v4 Setup */}
      <div className="fl-mb-6/10">
        <h3 className="fl-text-base/lg font-medium text-slate-200 fl-mb-3/4">
          TailwindCSS v4 (CSS-first)
        </h3>
        <p className="fl-text-sm/base text-slate-400 fl-mb-3/4">
          Add the plugin to your CSS file using the <code className="text-cyan-400">@plugin</code> directive:
        </p>
        <CodeBlock
          language="css"
          title="app.css"
          code={`@import "tailwindcss";
@plugin "fluid-tailwindcss";`}
        />
      </div>

      {/* TailwindCSS v3 Setup */}
      <div className="bg-slate-900/50 border border-slate-800 fl-rounded-lg/xl fl-p-4/6">
        <h3 className="fl-text-base/lg font-medium text-slate-200 fl-mb-3/4">
          TailwindCSS v3 (JavaScript config)
        </h3>
        <p className="fl-text-sm/base text-slate-400 fl-mb-3/4">
          For v3, install with legacy peer deps and add to your config:
        </p>
        <CodeBlock
          language="bash"
          code={`npm install fluid-tailwindcss --legacy-peer-deps`}
          className="fl-mb-3/4"
        />
        <CodeBlock
          language="javascript"
          title="tailwind.config.js"
          code={`module.exports = {
  plugins: [
    require('fluid-tailwindcss')({
      minViewport: 375,
      maxViewport: 1440,
    })
  ]
}`}
        />
      </div>
    </section>
  )
}

