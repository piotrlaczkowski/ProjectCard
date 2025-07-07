# Project Card Generator - Feature Update & Fixes

This document outlines the features and fixes implemented in the recent update.

## ✅ Implemented Features

### 1. 🚀 AI-Powered Content Generation
- **Description:** A new "Generate with AI" section has been added to the control panel. Users can input a simple project idea (e.g., "A mobile app for gardeners"), and the Gemini API will generate a creative project name, tag, and description, automatically populating the relevant fields.
- **Implementation:**
  - Integrated the `@google/genai` SDK.
  - Added a new UI section with a prompt input and a "Generate" button.
  - The "Generate" button shows a loading state during the API call.
  - The prompt sent to Gemini requests a response in a structured JSON format.
  - Implemented robust error handling and parsing of the AI-generated response.

### 2. 📋 Copy Screenshot (Export as PNG)
- **Description:** Users can now export the current project card as a high-quality, transparent PNG image directly to their clipboard.
- **Implementation:**
  - Integrated the `html-to-image` library.
  - Added an "Export PNG" button to the control panel.
  - The project card component now uses `React.forwardRef` to get a direct reference to the DOM node.
  - The export function converts the element to a blob and uses the modern Clipboard API (`navigator.clipboard.write`) to copy the image.
  - A notification confirms that the image has been copied.

### 3. 🎨 Enhanced Styling & Effects Controls
- **Description:** Added several new options to give users more granular control over the card's appearance.
- **Implementation:**
  - **Gradient Colors:** The progress bar and tag can now be styled with a two-color linear gradient in addition to a solid color. The UI includes a toggle and two color pickers.
  - **Customizable Border Radius:** A new slider in the "Styling" section allows users to precisely control the card's corner roundness, from sharp corners to fully rounded edges.
  - **Custom Fonts:** Users can now choose from a curated list of Google Fonts (Inter, Roboto Slab, Space Mono) to change the card's typography.

### 4. 📏 Wider Progress Bar
- **Description:** The progress bar's height has been increased to make it more prominent and visually impactful.
- **Implementation:**
  - Increased the Tailwind CSS height class for the progress bar element from `h-4` to `h-5`.

## 🛠️ Bug Fixes & Layout Improvements

### 1. 🌗 Theme Toggle Fixed
- **Problem:** The theme toggle was not working correctly; the application was stuck in dark mode.
- **Fix:** Removed the hardcoded `class="dark"` from the `<html>` tag in `index.html`. The React `useEffect` hook in `App.tsx` now correctly controls the theme, applying the class based on the user's saved preference in `localStorage`.

### 2. 🏷️ Tag Layout Fixed (No Longer Cut Off)
- **Problem:** The project tag was being clipped by the parent card container's `overflow-hidden` property.
- **Fix:** The `ProjectCard` component's structure was refactored. An outer wrapper `div` without `overflow:hidden` was added. The tag is now positioned relative to this new wrapper, allowing it to sit elegantly on the card's edge without being clipped.

### 3. 🖼️ Improved Title Display
- **Problem:** The project title's position would shift jarringly when an image was added or removed from the card.
- **Fix:** The card's internal header layout was stabilized. A consistent structure is now used for the header section, ensuring the title and "Meteo" indicator remain properly aligned regardless of whether a banner image is present. This eliminates layout shifts and improves visual consistency.