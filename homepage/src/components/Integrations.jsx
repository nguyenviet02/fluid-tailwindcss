import CodeBlock, { InlineCode } from './CodeBlock'

export default function Integrations() {
  return (
    <section id="integrations" className="fl-mb-12/20 scroll-mt-6">
      <h2 className="fl-text-xl/3xl font-semibold text-white fl-mb-4/6">Integrations</h2>
      
      <p className="fl-text-sm/base text-slate-400 fl-mb-6/8">
        First-class support for popular Tailwind ecosystem tools.
      </p>

      {/* tailwind-merge */}
      <div className="fl-mb-8/12">
        <h3 className="fl-text-base/lg font-medium text-orange-300 fl-mb-3/4 flex items-center fl-gap-2/3">
          <span className="fl-w-2/3 fl-h-2/3 rounded-full bg-orange-400"></span>
          tailwind-merge
        </h3>
        <p className="fl-text-sm/base text-slate-400 fl-mb-4/6">
          Proper conflict resolution between fluid and regular utilities.
        </p>
        
        <div className="grid lg:grid-cols-2 fl-gap-4/6 fl-mb-4/6">
          <CodeBlock
            language="javascript"
            title="Basic Usage"
            code={`import { twMerge } from 'fluid-tailwindcss/tailwind-merge'

// Fluid utility wins (last one)
twMerge('p-4', 'fl-p-4/8')
// => 'fl-p-4/8'

// Regular utility wins (last one)
twMerge('fl-p-4/8', 'p-4')
// => 'p-4'

// Different utilities preserved
twMerge('fl-p-4/8', 'fl-m-2/6', 'text-lg')
// => 'fl-p-4/8 fl-m-2/6 text-lg'`}
          />
          <div className="fl-space-y-4/6">
            <CodeBlock
              language="javascript"
              title="Extend Your Own"
              code={`import { extendTailwindMerge } from 'tailwind-merge'
import { withFluid } from 'fluid-tailwindcss/tailwind-merge'

const twMerge = extendTailwindMerge(withFluid, {
  // Your additional config
})`}
            />
            <CodeBlock
              language="javascript"
              title="Custom Instance"
              code={`import { createTwMerge } from 'fluid-tailwindcss/tailwind-merge'

const twMerge = createTwMerge({
  // Additional tailwind-merge config
})`}
            />
          </div>
        </div>

        {/* Conflict resolution examples */}
        <div className="bg-slate-900/50 border border-orange-800/30 fl-rounded-lg/xl fl-p-4/6">
          <h4 className="fl-text-sm/base font-medium text-orange-300 fl-mb-3/4">Conflict Resolution Examples</h4>
          <div className="fl-space-y-2/3 fl-text-xs/sm font-mono">
            <div className="flex items-center fl-gap-2/3">
              <span className="text-slate-400">twMerge("p-4", "fl-p-4/8")</span>
              <span className="text-emerald-400">→</span>
              <span className="text-emerald-400">"fl-p-4/8"</span>
            </div>
            <div className="flex items-center fl-gap-2/3">
              <span className="text-slate-400">twMerge("fl-p-4/8", "p-4")</span>
              <span className="text-emerald-400">→</span>
              <span className="text-emerald-400">"p-4"</span>
            </div>
            <div className="flex items-center fl-gap-2/3">
              <span className="text-slate-400">twMerge("fl-m-2/4", "neg-fl-m-4/8")</span>
              <span className="text-emerald-400">→</span>
              <span className="text-emerald-400">"neg-fl-m-4/8"</span>
            </div>
            <div className="flex items-center fl-gap-2/3">
              <span className="text-slate-400">twMerge("px-4", "fl-px-2/8")</span>
              <span className="text-emerald-400">→</span>
              <span className="text-emerald-400">"fl-px-2/8"</span>
            </div>
          </div>
        </div>
      </div>

      {/* Validation */}
      <div className="fl-mb-8/12">
        <h3 className="fl-text-base/lg font-medium text-sky-300 fl-mb-3/4 flex items-center fl-gap-2/3">
          <span className="fl-w-2/3 fl-h-2/3 rounded-full bg-sky-400"></span>
          Validation Utilities
        </h3>
        <p className="fl-text-sm/base text-slate-400 fl-mb-4/6">
          Programmatically validate fluid class names:
        </p>
        
        <CodeBlock
          language="javascript"
          title="Validation API"
          code={`import { 
  twMergeWithValidation,
  validateFluidClass 
} from 'fluid-tailwindcss/tailwind-merge'

// Validate a fluid class
const result = validateFluidClass('fl-p-4/8')
// { valid: true, utility: 'p', min: '4', max: '8' }

const invalid = validateFluidClass('fl-p-[1rem/16px]')
// { valid: false, error: 'Units must match' }

// Merge with validation warnings
twMergeWithValidation('p-4', 'fl-p-4/8')
// Logs warnings for invalid classes`}
        />
      </div>

      {/* IntelliSense */}
      <div className="fl-mb-8/12">
        <h3 className="fl-text-base/lg font-medium text-violet-300 fl-mb-3/4 flex items-center fl-gap-2/3">
          <span className="fl-w-2/3 fl-h-2/3 rounded-full bg-violet-400"></span>
          IntelliSense Support
        </h3>
        <p className="fl-text-sm/base text-slate-400 fl-mb-4/6">
          The plugin automatically works with the official Tailwind CSS IntelliSense extension.
        </p>
        
        <div className="bg-slate-900/50 border border-violet-800/30 fl-rounded-lg/xl fl-p-4/6">
          <div className="flex items-start fl-gap-3/4">
            <div className="fl-text-2xl/3xl">💡</div>
            <div>
              <h4 className="fl-text-sm/base font-medium text-violet-300 fl-mb-1/2">VS Code Setup</h4>
              <p className="fl-text-xs/sm text-slate-400 fl-mb-2/3">
                Install the{' '}
                <a 
                  href="https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
                >
                  Tailwind CSS IntelliSense
                </a>{' '}
                extension for autocomplete with generated CSS values.
              </p>
              <ul className="fl-text-xs/sm text-slate-400 fl-space-y-1/1.5">
                <li>• All <InlineCode>fl-*</InlineCode> utilities appear in autocomplete</li>
                <li>• Preview generated <InlineCode>clamp()</InlineCode> values</li>
                <li>• Works with arbitrary values</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Programmatic API */}
      <div>
        <h3 className="fl-text-base/lg font-medium text-emerald-300 fl-mb-3/4 flex items-center fl-gap-2/3">
          <span className="fl-w-2/3 fl-h-2/3 rounded-full bg-emerald-400"></span>
          Programmatic API
        </h3>
        <p className="fl-text-sm/base text-slate-400 fl-mb-4/6">
          All internal utilities are exported for custom implementations:
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 fl-gap-4/6">
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-lg/xl fl-p-3/5">
            <h4 className="fl-text-sm/base font-medium text-cyan-400 fl-mb-2/3">Clamp Functions</h4>
            <ul className="fl-space-y-0.5/1 fl-text-xs/sm text-slate-400">
              <li>• calculateClamp</li>
              <li>• calculateClampAdvanced</li>
              <li>• createNegatedClamp</li>
              <li>• createContainerClamp</li>
            </ul>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-lg/xl fl-p-3/5">
            <h4 className="fl-text-sm/base font-medium text-violet-400 fl-mb-2/3">Validation</h4>
            <ul className="fl-space-y-0.5/1 fl-text-xs/sm text-slate-400">
              <li>• validateFluidUnits</li>
              <li>• validateUnitsMatch</li>
              <li>• parseAndValidateFluidPair</li>
              <li>• isSupportedUnit</li>
            </ul>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 fl-rounded-lg/xl fl-p-3/5">
            <h4 className="fl-text-sm/base font-medium text-emerald-400 fl-mb-2/3">Utilities</h4>
            <ul className="fl-space-y-0.5/1 fl-text-xs/sm text-slate-400">
              <li>• Length class</li>
              <li>• FluidError class</li>
              <li>• toPrecision</li>
              <li>• checkSC144 (WCAG)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

