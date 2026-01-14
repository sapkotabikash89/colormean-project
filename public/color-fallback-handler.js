// Client-side color page handler for unknown color paths
(function() {
  console.log('[Color Fallback Handler] Initializing...');
  
  // Check if we're on a color page that needs handling
  function needsColorHandling() {
    const path = window.location.pathname;
    const isColorPath = /^\/colors\/[0-9a-fA-F]{3,6}\/?$/i.test(path);
    
    if (!isColorPath) {
      console.log('[Color Fallback Handler] Not a color path:', path);
      return false;
    }
    
    console.log('[Color Fallback Handler] Detected color path:', path);
    
    // Check if we're on a 404 page or showing homepage content
    const title = document.title?.toLowerCase();
    const is404 = title?.includes('404') || title?.includes('not found');
    
    const mainContent = document.querySelector('main');
    const hasHomepageContent = mainContent?.textContent?.includes('Turn ideas into visuals with confidence');
    
    console.log('[Color Fallback Handler] Is 404 page:', is404);
    console.log('[Color Fallback Handler] Has homepage content:', hasHomepageContent);
    
    // Handle if it's a 404 or showing homepage content for a color path
    return is404 || hasHomepageContent;
  }

  // Handle unknown color page by showing appropriate content
  function handleUnknownColor() {
    const path = window.location.pathname;
    const hexMatch = path.match(/^\/colors\/([0-9a-fA-F]{3,6})\/?$/i);
    
    if (hexMatch) {
      const hex = hexMatch[1].toUpperCase();
      console.log('[Color Fallback Handler] Handling unknown color:', hex);
      
      // Instead of redirecting, let's modify the page content to show the color info
      showColorInfo(hex);
    }
  }
  
  // Show color information for unknown hex codes
  function showColorInfo(hex) {
    console.log('[Color Fallback Handler] Showing color info for:', hex);
    
    // Find the main content area
    const main = document.querySelector('main');
    if (!main) {
      console.error('[Color Fallback Handler] Could not find main element');
      return;
    }
    
    // Create color page content
    const colorContent = `
      <div class="flex flex-col min-h-screen">
        <!-- Color Hero Section -->
        <section class="py-12 px-4" style="background-color: #${hex}; color: ${getContrastColor('#' + hex)};">
          <div class="container mx-auto">
            <div class="text-center space-y-4">
              <h1 class="text-4xl md:text-5xl font-bold">#${hex} Color Information</h1>
              <p class="max-w-3xl mx-auto text-sm md:text-base opacity-90">
                Information about the color #${hex} including conversions, harmonies, and usage.
              </p>
              <div class="max-w-4xl mx-auto">
                <div class="font-mono text-xs md:text-sm flex flex-wrap justify-center gap-4">
                  <button onclick="navigator.clipboard.writeText('#${hex}')" class="bg-black/20 hover:bg-black/30 px-3 py-1 rounded transition-colors">HEX: #${hex}</button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Main Content -->
        <main class="container mx-auto px-4 py-12">
          <div class="flex flex-col lg:flex-row gap-8">
            <div class="flex-1">
              <div class="space-y-8">
                <div class="bg-card border border-border rounded-lg p-6">
                  <h2 class="text-2xl font-bold mb-4">Color Information</h2>
                  <p>This color (#${hex}) is not in our predefined color database, but here's what we know:</p>
                  
                  <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-muted p-4 rounded">
                      <h3 class="font-semibold mb-2">HEX</h3>
                      <p class="font-mono">#${hex}</p>
                    </div>
                    <div class="bg-muted p-4 rounded">
                      <h3 class="font-semibold mb-2">RGB</h3>
                      <p class="font-mono">${(() => {
                        const rgb = hexToRgb('#' + hex);
                        return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'Invalid hex';
                      })()}</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-card border border-border rounded-lg p-6">
                  <h2 class="text-2xl font-bold mb-4">What You Can Do</h2>
                  <ul class="list-disc list-inside space-y-2">
                    <li>Use this color in your designs</li>
                    <li>Copy the hex code for use in CSS, design tools, or code</li>
                    <li>Explore color harmonies using our <a href="/color-wheel" class="text-primary hover:underline">Color Wheel tool</a></li>
                    <li>Check contrast ratios with our <a href="/contrast-checker" class="text-primary hover:underline">Contrast Checker</a></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <!-- Sidebar -->
            <div class="lg:w-80">
              <div class="bg-card border border-border rounded-lg p-6 sticky top-4">
                <h3 class="text-lg font-bold mb-4">Color Tools</h3>
                <div class="space-y-3">
                  <a href="/color-picker" class="block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity">
                    Color Picker
                  </a>
                  <a href="/color-wheel" class="block w-full text-center py-2 px-4 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">
                    Color Wheel
                  </a>
                  <a href="/contrast-checker" class="block w-full text-center py-2 px-4 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">
                    Contrast Checker
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
    
    // Replace the main content
    main.innerHTML = colorContent;
  }
  
  // Helper function to get contrast color
  function getContrastColor(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return '#000000';
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  }
  
  // Helper function to convert hex to RGB
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Run on page load
  function runHandler() {
    console.log('[Color Fallback Handler] Running handler...');
    if (needsColorHandling()) {
      handleUnknownColor();
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('[Color Fallback Handler] DOMContentLoaded event fired');
      runHandler();
    });
  } else {
    // DOM is already loaded
    console.log('[Color Fallback Handler] DOM already loaded');
    runHandler();
  }
  
  // Also run on Next.js route changes
  let lastPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      console.log('[Color Fallback Handler] Route changed to:', lastPath);
      runHandler();
    }
  }, 100);
})();