# TODO: Feature Roadmap for `fluid-tailwindcss`

> Last updated: 2025-12-22

This document outlines potential features and improvements for the fluid-tailwindcss plugin.

---

## 🔥 High Priority / High Impact

### 1. Per-Utility Breakpoint Override

- [ ] **Implement per-utility breakpoint customization via modifiers**

| Attribute | Details |
| --- | --- |
| **Name** | Per-utility breakpoint customization via modifiers |
| **Function** | Allow users to specify different min/max viewports for specific utilities using modifiers like `fl-text-base/2xl@sm-lg` or `fl-p-4/8@[400px-1200px]` |
| **Why needed** | Different design elements may need different scaling ranges. Typography might need to scale from tablet (768px) to desktop, while padding might scale from mobile (375px) to tablet |
| **Complexity** | ⭐⭐⭐ (Medium-High) |
| **Estimated Effort** | 3-5 days |
| **Example** | `fl-text-base/3xl@md-xl` → scales from `md` breakpoint to `xl` breakpoint |

**Implementation Notes:**

- Requires parsing new modifier syntax
- Integrate with existing clamp calculation
- Need to support both Tailwind breakpoint names and arbitrary pixel values

---

### 2. Fluid Line Height with Font Size Coupling

- [ ] **Support coupled font-size and line-height scaling**

| Attribute            | Details                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**             | `fl-text` with automatic fluid line-height pairing                                                                                                             |
| **Function**         | Support syntax like `fl-text-base/2xl:leading-5/7` or `fl-text-base/2xl/leading` to couple fluid font-size with fluid line-height                              |
| **Why needed**       | Typography best practices require line-height to scale proportionally with font-size. Currently users need to manually add both `fl-text-*` and `fl-leading-*` |
| **Complexity**       | ⭐⭐⭐ (Medium)                                                                                                                                                |
| **Estimated Effort** | 2-4 days                                                                                                                                                       |
| **Example**          | `fl-text-sm/xl:tight/normal` → font-size clamps from sm to xl AND line-height clamps from tight to normal                                                      |

**Implementation Notes:**

- Extend the parser to handle combined syntax
- Need to output multiple CSS properties from single utility
- Consider using Tailwind's existing font-size with line-height syntax as reference

---

### 3. Non-Linear Scaling / Easing Functions

- [ ] **Support non-linear fluid scaling curves**

| Attribute            | Details                                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Name**             | Non-linear fluid scaling curves                                                                                                                              |
| **Function**         | Allow users to specify easing for the fluid transitions like `fl-p-4/8:ease-out` or configure globally                                                       |
| **Why needed**       | Linear scaling isn't always optimal. Sometimes you want values to change more rapidly at smaller viewports and slow down at larger viewports (or vice versa) |
| **Complexity**       | ⭐⭐⭐⭐ (High)                                                                                                                                              |
| **Estimated Effort** | 5-7 days                                                                                                                                                     |

**Possible Approaches:**

- Use stepped clamps to approximate curves
- CSS math functions for curve approximation
- Consider CSS Houdini / custom properties for advanced cases

---

## 🚀 Medium Priority / Good Additions

### 4. Interactive Playground on Homepage

- [ ] **Build an interactive calculator/playground**

| Attribute            | Details                                                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**             | Enhanced homepage with interactive playground                                                                                                 |
| **Function**         | Add an interactive calculator where users can: input values, see generated CSS, preview fluid behavior in real-time, and copy utility classes |
| **Why needed**       | Helps users understand the plugin, experiment with values, and see exactly what CSS gets generated                                            |
| **Complexity**       | ⭐⭐ (Low-Medium)                                                                                                                             |
| **Estimated Effort** | 3-5 days                                                                                                                                      |

**Features to include:**

- Real-time preview with resizable viewport
- CSS output display with syntax highlighting
- Copy-to-clipboard for utility classes
- Visual graph showing the fluid scaling curve

---

### 5. Fluid Shadows (`fl-shadow-*`)

- [ ] **Implement fluid box-shadow utilities**

| Attribute            | Details                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| **Name**             | Fluid box-shadow utility                                                                               |
| **Function**         | Scale box-shadows fluidly: `fl-shadow-md/2xl` would scale shadow size, blur, and spread proportionally |
| **Why needed**       | Shadows should scale with their elements for visual consistency across viewports                       |
| **Complexity**       | ⭐⭐⭐ (Medium)                                                                                        |
| **Estimated Effort** | 2-3 days                                                                                               |

**Implementation Notes:**

- Box-shadow has multiple values (x, y, blur, spread, color) that need coordinated scaling
- Color values should remain static while size values scale
- Consider creating shadow scale similar to Tailwind's default shadow scale

---

### 6. Aspect Ratio Aware Sizing

- [ ] **Implement fluid aspect ratio transitions**

| Attribute            | Details                                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Name**             | `fl-aspect-*` utilities                                                                                                            |
| **Function**         | Fluid aspect ratio handling that maintains proportions while scaling: `fl-aspect-[1/1]-[16/9]` transitioning between aspect ratios |
| **Why needed**       | Hero sections and media elements often need different aspect ratios on different devices                                           |
| **Complexity**       | ⭐⭐⭐⭐ (High)                                                                                                                    |
| **Estimated Effort** | 4-6 days                                                                                                                           |

**Implementation Notes:**

- CSS aspect-ratio doesn't natively support transitions
- May need to use padding-bottom technique for older browser support
- Research techniques for smooth aspect ratio transitions

---

### 7. Clamp Expression Optimization

- [ ] **Implement smart clamp simplification**

| Attribute            | Details                                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**             | Smart clamp simplification                                                                                                                               |
| **Function**         | Automatically simplify clamp expressions when possible. When min === result at minViewport, use `min()`. When max === result at maxViewport, use `max()` |
| **Why needed**       | Smaller CSS output, better developer experience when inspecting elements                                                                                 |
| **Complexity**       | ⭐⭐ (Low)                                                                                                                                               |
| **Estimated Effort** | 1-2 days                                                                                                                                                 |

**Implementation Notes:**

- Pure calculation optimization
- Add option to enable/disable optimization
- Ensure output remains functionally equivalent

---

## 💡 Lower Priority / Nice-to-Have

### 8. Fluid Grid Columns

- [ ] **Implement fluid grid column utilities**

| Attribute            | Details                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Name**             | `fl-grid-cols-*`                                                                                                                |
| **Function**         | Fluid grid column widths that scale based on viewport: `fl-grid-cols-2/4` creates 2 columns at min viewport scaling to 4 at max |
| **Why needed**       | Grid layouts often need fluid column counts without media query breakpoints                                                     |
| **Complexity**       | ⭐⭐⭐ (Medium)                                                                                                                 |
| **Estimated Effort** | 2-3 days                                                                                                                        |

**Implementation Notes:**

- Grid template values are more complex than simple sizing
- May need special handling for fractional column counts
- Consider using repeat() with minmax() for fluid behavior

---

### 9. Preset Modular Scales (Design Tokens)

- [ ] **Add built-in modular scale presets**

| Attribute            | Details                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| **Name**             | Built-in modular scale options                                                                     |
| **Function**         | Add preset configurations for common typographic scales that auto-generate harmonious fluid values |
| **Why needed**       | Makes it easier for designers to maintain consistent visual hierarchy                              |
| **Complexity**       | ⭐⭐ (Low)                                                                                         |
| **Estimated Effort** | 1-2 days                                                                                           |
| **Example**          | `@plugin "fluid-tailwindcss" { scale: "golden-ratio" }`                                            |

**Available Scales to Consider:**

- Minor Second (1.067)
- Major Second (1.125)
- Minor Third (1.2)
- Major Third (1.25)
- Perfect Fourth (1.333)
- Augmented Fourth (1.414)
- Perfect Fifth (1.5)
- Golden Ratio (1.618)

---

### 10. Complete RTL Support

- [ ] **Ensure complete RTL logical property support**

| Attribute            | Details                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**             | Complete RTL logical property support                                                                                                             |
| **Function**         | Ensure all utilities have logical property variants (`fl-ms`, `fl-me`, `fl-ps`, `fl-pe`, `fl-start`, `fl-end`) and work correctly in RTL contexts |
| **Why needed**       | Better internationalization support                                                                                                               |
| **Complexity**       | ⭐ (Low)                                                                                                                                          |
| **Estimated Effort** | 1 day                                                                                                                                             |

**Current Status:**

- ✅ `fl-ps`, `fl-pe` (padding-inline-start/end)
- ✅ `fl-ms`, `fl-me` (margin-inline-start/end)
- ✅ `fl-start`, `fl-end` (inset-inline-start/end)
- [ ] Verify all work correctly in RTL context
- [ ] Add any missing logical properties

---

### 11. PostCSS Output Mode

- [ ] **Add pre-computed CSS output option**

| Attribute            | Details                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------ |
| **Name**             | Pre-computed CSS output                                                                    |
| **Function**         | Option to output static clamp values during build time, reducing runtime computation needs |
| **Why needed**       | Performance optimization for large projects, easier debugging                              |
| **Complexity**       | ⭐⭐ (Low)                                                                                 |
| **Estimated Effort** | 2-3 days                                                                                   |

**Implementation Notes:**

- Create PostCSS integration
- Allow outputting a static CSS file with all used utilities
- Useful for projects that need to ship minimal JavaScript

---

## 📊 Summary Table

| #   | Feature                         | Impact    | Complexity | Effort   | Status         |
| --- | ------------------------------- | --------- | ---------- | -------- | -------------- |
| 1   | Per-utility breakpoint override | 🔥 High   | ⭐⭐⭐     | 3-5 days | ⬜ Not Started |
| 2   | Coupled font-size + line-height | 🔥 High   | ⭐⭐⭐     | 2-4 days | ⬜ Not Started |
| 3   | Non-linear easing               | 🔥 High   | ⭐⭐⭐⭐   | 5-7 days | ⬜ Not Started |
| 4   | Interactive playground          | 🚀 Medium | ⭐⭐       | 3-5 days | ⬜ Not Started |
| 5   | Fluid shadows                   | 🚀 Medium | ⭐⭐⭐     | 2-3 days | ⬜ Not Started |
| 6   | Aspect ratio transitions        | 🚀 Medium | ⭐⭐⭐⭐   | 4-6 days | ⬜ Not Started |
| 7   | Clamp simplification            | 🚀 Medium | ⭐⭐       | 1-2 days | ⬜ Not Started |
| 8   | Fluid grid columns              | 💡 Low    | ⭐⭐⭐     | 2-3 days | ⬜ Not Started |
| 9   | Preset modular scales           | 💡 Low    | ⭐⭐       | 1-2 days | ⬜ Not Started |
| 10  | RTL completion                  | 💡 Low    | ⭐         | 1 day    | ⬜ Not Started |
| 11  | PostCSS output mode             | 💡 Low    | ⭐⭐       | 2-3 days | ⬜ Not Started |

---

## 🐛 Known Issues / Bugs

<!-- Add any known issues here -->

---

## 💬 Community Requests

<!-- Track feature requests from GitHub issues or community feedback here -->

---

## 📝 Notes

- Priorities may change based on community feedback
- Complexity ratings are estimates and may change during implementation
- Consider creating GitHub issues for each feature to track progress
