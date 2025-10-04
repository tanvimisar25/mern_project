/**
 * This function is used to measure and report on key web performance metrics,
 * known as Web Vitals. These metrics help in understanding the real-world
 * user experience of your application.
 *
 * @param {Function} onPerfEntry - A callback function that will be called with
 * the performance metric data once it's measured.
 */
const reportWebVitals = onPerfEntry => {
  // First, check if the onPerfEntry callback is actually a function.
  // This prevents errors if the function is called without a valid argument.
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import the 'web-vitals' library.
    // This is done to avoid including this library in the main bundle if it's not needed,
    // which helps keep the initial application size smaller.
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Once the library is loaded, call each of its metric-gathering functions,
      // passing the user's callback to each one.

      // Measures Cumulative Layout Shift (CLS) - visual stability.
      getCLS(onPerfEntry);
      
      // Measures First Input Delay (FID) - interactivity.
      getFID(onPerfEntry);

      // Measures First Contentful Paint (FCP) - loading performance.
      getFCP(onPerfEntry);

      // Measures Largest Contentful Paint (LCP) - loading performance.
      getLCP(onPerfEntry);

      // Measures Time to First Byte (TTFB) - server response time.
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;