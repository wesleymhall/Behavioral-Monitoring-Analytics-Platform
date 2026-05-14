import { useRef, useEffect } from "react";
import { registerLoader } from "../../LoadingService";

/* 
GlobalLoader component that shows a full-screen overlay with a spinner when loading is active.
- uses a ref to get the DOM element for the overlay, and registers it with loadingService.
- LoadingService will add/remove CSS classes to show/hide the overlay when startLoading/stopLoading are called.
*/
export default function GlobalLoader() {
  const overlayRef = useRef(null);

  useEffect(() => {
    // register this ref with LoadingService
    registerLoader(overlayRef.current);
  }, []);

  return (
    <div ref={overlayRef} className='global-loader'>
      <div className='load-display'></div>
      <div className='sleep-message'>
        i run this server on a free tier service that turns off when inactive, this may take ~2 minute
      </div>
    </div>
  );
}
