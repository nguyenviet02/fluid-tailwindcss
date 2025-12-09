import Sidebar from './components/Sidebar'
import Hero from './components/Hero'
import Installation from './components/Installation'
import BasicUsage from './components/BasicUsage'
import Configuration from './components/Configuration'
import Advanced from './components/Advanced'
import Integrations from './components/Integrations'
import Limitations from './components/Limitations'
import Troubleshooting from './components/Troubleshooting'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Main layout */}
      <div className="relative max-w-7xl mx-auto fl-px-4/8 fl-py-8/16">
        <div className="flex fl-gap-8/16">
          {/* Sticky sidebar - hidden on mobile */}
          <aside className="hidden lg:block shrink-0">
            <Sidebar />
          </aside>
          
          {/* Main content */}
          <main className="flex-1 min-w-0">
            <Hero />
            <div className="border-t border-slate-800/50 fl-pt-8/12 fl-mt-4/8">
              <Installation />
              <BasicUsage />
              <Configuration />
              <Advanced />
              <Integrations />
              <Limitations />
              <Troubleshooting />
            </div>
            
            {/* Footer */}
            <footer className="border-t border-slate-800 fl-pt-8/12 fl-mt-8/16 text-center">
              <p className="fl-text-sm/base text-slate-500">
                All utilities scale fluidly between 375px and 1440px viewport width
              </p>
              <p className="fl-text-xs/sm text-slate-600 fl-mt-2/3">
                fluid-tailwindcss • MIT License
              </p>
              <div className="flex justify-center fl-gap-4/6 fl-mt-4/6">
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
          </main>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}

function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 fl-px-4/6 fl-py-2/3 z-50">
      <div className="flex justify-around items-center">
        <NavLink href="#installation" label="Install" />
        <NavLink href="#basic-usage" label="Usage" />
        <NavLink href="#configuration" label="Config" />
        <NavLink href="#advanced" label="Advanced" />
      </div>
    </nav>
  )
}

function NavLink({ href, label }) {
  const handleClick = (e) => {
    e.preventDefault()
    const id = href.replace('#', '')
    const element = document.getElementById(id)
    if (element) {
      const offset = 24
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    }
  }

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className="fl-text-xs/sm text-slate-400 hover:text-white fl-px-2/3 fl-py-1/2 transition-colors"
    >
      {label}
    </a>
  )
}
