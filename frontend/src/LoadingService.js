// counter for active requests
let loadingCount = 0;

// ref set in GlobalLoader.jsx, used to show/hide the overlay
// ref points to the DOM element, so we can alter CSS classes
let overlayRef = null;

// called by GlobalLoader.jsx to register the ref to the overlay element
export const registerLoader = ref => {
  overlayRef = ref;
};

const showLoader = () => {
  if (overlayRef) overlayRef.classList.add('active');
};

const hideLoader = () => {
  if (overlayRef) overlayRef.classList.remove('active');
};

export const startLoading = () => {
  loadingCount++;
  showLoader();
};

export const stopLoading = () => {
  loadingCount = Math.max(0, loadingCount - 1);
  if (loadingCount === 0) hideLoader();
};