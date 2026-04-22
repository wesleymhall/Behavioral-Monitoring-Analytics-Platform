// counter for active requests
let loadingCount = 0;

// ref set in GlobalLoader.jsx, used to show/hide the overlay
// ref points to the DOM element, so we can alter CSS classes
let overlayRef = null;

// wait to see if server has wound down
// send user message that server needs to boot up
let sleepTimer = null;

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
  
  if (loadingCount === 1) {
    sleepTimer = setTimeout(() => {
      if (loadingCount > 0 && overlayRef) {
        overlayRef.classList.add('asleep'); 
        // alert user that server may need to boot up
      }
    }, 100); // if loading more than 5 seconds
  }
};

export const stopLoading = () => {
  loadingCount = Math.max(0, loadingCount - 1);
  
  if (loadingCount === 0) {
    hideLoader();
    
    // clear timer
    if (sleepTimer) {
      clearTimeout(sleepTimer);
      sleepTimer = null;
    }
    // remove sleep state
    if (overlayRef) {
      overlayRef.classList.remove('asleep');
    }
  }
};
