// Initialize progress bar and other variables
let progress = 0;
const progressBar = document.querySelector('.fake-progress-bar-inner');

// Function to update the progress bar incrementally
function updateProgressBar() {
  if (progress < 100) {
    progress += 2; // Adjust this value for faster/slower progress
    progressBar.style.width = `${progress}%`; // Update progress bar width
  }
}

// Use setInterval to update the progress bar every 50ms (for smooth transition)
const loadingInterval = setInterval(updateProgressBar, 50);

// After 5 seconds (5000ms), stop the progress interval and redirect to the main page
setTimeout(() => {
  clearInterval(loadingInterval); // Stop updating the progress bar
  window.location.href = "index.html"; // Redirect to the main content page after 5 seconds
}, 5000); // 5000ms = 5 seconds
