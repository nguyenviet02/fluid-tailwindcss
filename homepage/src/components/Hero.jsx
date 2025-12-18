export default function Hero() {
  return (
    <section className="fl-mb-12/20">
      {/* Badge */}
      <div className="flex items-center fl-gap-2/3 fl-mb-4/6">
        <span className="fl-text-xs/sm font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 fl-px-2.5/3.5 fl-py-1/1.5 rounded-full">
          v1.0.5
        </span>
        <span className="fl-text-xs/sm text-slate-500">
          TailwindCSS v4 Ready
        </span>
      </div>

      {/* Title */}
      <h1 className="fl-text-4xl/7xl font-bold tracking-tight fl-mb-4/6">
        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          fluid-tailwindcss
        </span>
      </h1>

      {/* Description */}
      <p className="fl-text-lg/2xl text-slate-400 fl-mb-6/10 max-w-2xl leading-relaxed">
        Build better responsive designs in less code using CSS{' '}
        <code className="text-cyan-400 bg-cyan-500/10 fl-px-1.5/2 fl-py-0.5/1 rounded">clamp()</code>{' '}
        for TailwindCSS v3 & v4.
      </p>

      {/* Install command */}
      <div className="flex items-center fl-gap-3/4 fl-mb-8/12">
        <div className="flex items-center bg-slate-900/80 border border-slate-800 fl-rounded-md/lg fl-px-3/5 fl-py-2/3">
          <span className="text-slate-500 fl-mr-2/3 fl-text-sm/base">$</span>
          <code className="fl-text-sm/base text-slate-300 font-mono">npm install fluid-tailwindcss</code>
        </div>
        <a 
          href="https://github.com/nguyenviet02/fluid-tailwindcss"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center fl-gap-1.5/2 fl-px-3/4 fl-py-2/3 bg-slate-800 hover:bg-slate-700 border border-slate-700 fl-rounded-md/lg fl-text-sm/base text-slate-300 transition-colors"
        >
          <svg className="fl-w-4/5 fl-h-4/5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          GitHub
        </a>
      </div>

      {/* Features highlight */}
      <div className="fl-mb-8/14">
        <h2 className="fl-text-xl/3xl font-semibold text-white fl-mb-4/6">Features</h2>
        <ul className="fl-space-y-2/3">
          <FeatureItem>
            Works with <strong className="text-white">every utility</strong> (including other plugins)
          </FeatureItem>
          <FeatureItem>
            Full <strong className="text-white">IntelliSense</strong> support
          </FeatureItem>
          <FeatureItem>
            First-class <a href="#integrations" className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300">tailwind-merge support</a>
          </FeatureItem>
          <FeatureItem>
            Ensures fluid type meets <a href="#limitations" className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300">accessibility requirements</a>
          </FeatureItem>
          <FeatureItem>
            <strong className="text-white">Flexible</strong> enough to handle advanced use cases
          </FeatureItem>
        </ul>
      </div>
    </section>
  )
}

function FeatureItem({ children }) {
  return (
    <li className="flex items-start fl-gap-2/3 fl-text-sm/base text-slate-400">
      <span className="text-cyan-400 mt-1">•</span>
      <span>{children}</span>
    </li>
  )
}

