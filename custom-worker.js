/**
 * Custom Cloudflare Worker for ColorMean
 * Handles www -> root domain redirect and delegates to OpenNextJS
 */

// Import the OpenNextJS worker
import openNextWorker from './.open-next/worker.js';

export default {
  /**
   * Main fetch handler
   * @param {Request} request
   * @param {any} env
   * @param {any} ctx
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // OPTIMIZATION: Handle www redirect at the Worker level for better performance
    if (url.hostname === 'www.colormean.com') {
      // Permanent redirect (301) from www to root domain
      return Response.redirect(`https://colormean.com${url.pathname}${url.search}`, 301);
    }
    
    // Delegate to OpenNextJS worker for normal processing
    return openNextWorker.fetch(request, env, ctx);
  }
};

// Additional event listeners can be added here if needed
// For example, scheduled events, queue consumers, etc.