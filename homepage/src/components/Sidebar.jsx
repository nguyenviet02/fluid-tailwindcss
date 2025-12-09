import { useState, useEffect } from 'react'

const navItems = [
  { id: 'installation', label: 'Installation' },
  { id: 'basic-usage', label: 'Basic usage' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
]

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState('installation')

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(item => item.element)

      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (e, id) => {
    e.preventDefault()
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
    <nav className="sticky top-8 fl-w-40/52">
      <div className="border-l-2 border-slate-800">
        <ul className="fl-space-y-0.5/1">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`
                  block fl-py-1.5/2 fl-pl-3/4 fl-pr-2/3 fl-text-sm/base transition-all duration-200
                  ${activeSection === item.id
                    ? 'text-white border-l-2 border-white -ml-[2px] font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:border-l-2 hover:border-slate-600 hover:-ml-[2px]'
                  }
                `}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

