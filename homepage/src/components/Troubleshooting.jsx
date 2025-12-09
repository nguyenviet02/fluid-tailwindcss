import CodeBlock, { InlineCode } from './CodeBlock'

export default function Troubleshooting() {
  return (
    <section id="troubleshooting" className="fl-mb-12/20 scroll-mt-6">
      <h2 className="fl-text-xl/3xl font-semibold text-white fl-mb-4/6">Troubleshooting</h2>
      
      <p className="fl-text-sm/base text-slate-400 fl-mb-6/8">
        Common issues and their solutions.
      </p>

      {/* Issues */}
      <div className="fl-space-y-6/10">
        <TroubleshootItem
          title="Classes not being generated"
          description="The fluid utilities are not appearing in your CSS output."
          solution={
            <>
              <p className="fl-text-xs/sm text-slate-400 fl-mb-3/4">
                Make sure the plugin is properly installed and configured:
              </p>
              <CodeBlock
                language="css"
                code={`/* Verify your CSS file includes: */
@import "tailwindcss";
@plugin "fluid-tailwindcss";`}
              />
              <p className="fl-text-xs/sm text-slate-400 fl-mt-3/4">
                Also check that your content paths include files using fluid utilities.
              </p>
            </>
          }
        />

        <TroubleshootItem
          title="IntelliSense not working"
          description="Autocomplete suggestions for fl-* utilities don't appear."
          solution={
            <>
              <ol className="fl-text-xs/sm text-slate-400 fl-space-y-2/3 list-decimal list-inside">
                <li>Install the latest{' '}
                  <a 
                    href="https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 underline underline-offset-2"
                  >
                    Tailwind CSS IntelliSense
                  </a>{' '}
                  extension
                </li>
                <li>Restart VS Code after installing the plugin</li>
                <li>Check that your CSS file is being recognized by IntelliSense</li>
                <li>Verify the plugin is loading without errors in the Tailwind output</li>
              </ol>
            </>
          }
        />

        <TroubleshootItem
          title="Unit mismatch errors"
          description="Getting validation errors when using arbitrary values."
          solution={
            <>
              <p className="fl-text-xs/sm text-slate-400 fl-mb-3/4">
                Ensure both min and max values use the same unit:
              </p>
              <div className="grid md:grid-cols-2 fl-gap-3/4">
                <div className="bg-rose-500/5 border border-rose-500/20 fl-rounded-md/lg fl-p-3/4">
                  <div className="fl-text-xs/sm text-rose-300 fl-mb-1/2">✗ Wrong</div>
                  <code className="fl-text-xs/sm text-slate-400">fl-p-[1rem/16px]</code>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 fl-rounded-md/lg fl-p-3/4">
                  <div className="fl-text-xs/sm text-emerald-300 fl-mb-1/2">✓ Correct</div>
                  <code className="fl-text-xs/sm text-slate-400">fl-p-[1rem/2rem]</code>
                </div>
              </div>
            </>
          }
        />

        <TroubleshootItem
          title="Peer dependency warnings"
          description="npm warns about peer dependency conflicts with TailwindCSS v3."
          solution={
            <>
              <p className="fl-text-xs/sm text-slate-400 fl-mb-3/4">
                Install with legacy peer deps flag:
              </p>
              <CodeBlock
                language="bash"
                code={`npm install fluid-tailwindcss --legacy-peer-deps
# or
pnpm add fluid-tailwindcss --ignore-peer-deps`}
              />
            </>
          }
        />

        <TroubleshootItem
          title="tailwind-merge conflicts"
          description="Fluid utilities not properly conflicting with regular utilities."
          solution={
            <>
              <p className="fl-text-xs/sm text-slate-400 fl-mb-3/4">
                Use the provided <InlineCode>twMerge</InlineCode> from the package:
              </p>
              <CodeBlock
                language="javascript"
                code={`// Don't use the regular twMerge for fluid utilities
import { twMerge } from 'fluid-tailwindcss/tailwind-merge'

// Or extend your existing config
import { withFluid } from 'fluid-tailwindcss/tailwind-merge'
import { extendTailwindMerge } from 'tailwind-merge'

const customTwMerge = extendTailwindMerge(withFluid)`}
              />
            </>
          }
        />

        <TroubleshootItem
          title="Values not scaling as expected"
          description="Fluid values don't seem to change when resizing the viewport."
          solution={
            <>
              <p className="fl-text-xs/sm text-slate-400 fl-mb-3/4">
                Check your viewport configuration:
              </p>
              <ul className="fl-text-xs/sm text-slate-400 fl-space-y-1/2 fl-mb-3/4">
                <li>• Default range is 375px - 1440px</li>
                <li>• Values clamp outside this range (no further scaling)</li>
                <li>• Ensure your browser viewport falls within the range</li>
              </ul>
              <CodeBlock
                language="css"
                code={`/* Adjust viewport range if needed */
@plugin "fluid-tailwindcss" {
  minViewport: 320;
  maxViewport: 1920;
}`}
              />
            </>
          }
        />
      </div>

      {/* Still need help */}
      <div className="bg-slate-900/50 border border-slate-800 fl-rounded-lg/xl fl-p-4/6 fl-mt-8/12">
        <h3 className="fl-text-base/lg font-medium text-slate-200 fl-mb-2/3">Still need help?</h3>
        <p className="fl-text-sm/base text-slate-400">
          Open an issue on{' '}
          <a 
            href="https://github.com/nguyenviet02/fluid-tailwindcss/issues" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
          >
            GitHub
          </a>{' '}
          with a reproduction example and we'll help you out.
        </p>
      </div>
    </section>
  )
}

function TroubleshootItem({ title, description, solution }) {
  return (
    <div className="bg-slate-900/30 border border-slate-800 fl-rounded-lg/xl fl-p-4/6">
      <h3 className="fl-text-sm/base font-medium text-slate-200 fl-mb-1/2">{title}</h3>
      <p className="fl-text-xs/sm text-slate-500 fl-mb-3/4">{description}</p>
      <div className="border-t border-slate-800 fl-pt-3/4">
        <div className="fl-text-xs/sm text-cyan-400 fl-mb-2/3 font-medium">Solution:</div>
        {solution}
      </div>
    </div>
  )
}

