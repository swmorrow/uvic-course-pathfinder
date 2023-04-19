import { ReportCallback } from 'web-vitals';

export default function reportWebVitals(onPerfEntry?: ReportCallback): void {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      const functions = [
        getCLS,
        getFID,
        getFCP,
        getLCP,
        getTTFB,
      ];
      functions.map((fn) => fn instanceof Function ? fn(onPerfEntry) : null);
    });
  }
}