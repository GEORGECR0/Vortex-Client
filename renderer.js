// Load URL on button click
document.getElementById('loadButton').addEventListener('click', () => {
  const url = 'https://bloxd.io'; // This is the URL you want to load
  // Send the URL to the main process via ipcRenderer (using preload.js)
  window.electron.loadUrl(url); 
});

document.querySelectorAll('.join-btn').forEach(button => {
  button.addEventListener('click', () => {
    const mapId = button.id; // Gets the ID like 'boat_race_v7' or '-bloxdpvp-'
    const url = `https://bloxd.io/play/classic/${mapId}`;
    window.electron.loadUrl(url); // Send to main process via preload.js
  });
});


document.getElementById('DiscBtn').onclick = function() {
  window.open('https://discord.com/invite/NdpwX4FBaB', '_blank'); // Replace with your desired URL
};

document.getElementById('YoutubeBtn').onclick = function() {
  window.open('https://www.youtube.com/@_GEORGECR_', '_blank'); // Replace with your desired URL
};

document.getElementById('StoreBtn').onclick = function() {
  window.open('https://georgecr0.github.io/DeepSpaceClient/index.html', '_blank'); // Replace with your desired URL
};


const loginBtn = document.getElementById('loginBtn');
const loginDiv = document.getElementById('Login-Div');
const closeBtn = document.getElementById('closeBtn');
const submitBtn = document.getElementById('submit');

const usernameInput = document.querySelector('input[type="username"]');
const loginUsernameSpan = document.getElementById('loginUsername');
const loginAvatar = document.getElementById('loginAvatar');
const loginIcon = document.getElementById('loginIcon');

// Show login form
loginBtn.addEventListener('click', () => {
  loginDiv.classList.add('show');
});

// Close login form
closeBtn.addEventListener('click', () => {
  loginDiv.classList.remove('show');
});



// Handle login submit
submitBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  if (username) {
    localStorage.setItem('vortexUser', username);

    loginUsernameSpan.textContent = username;

    // Adjust font size based on length
    if (username.length > 8) {
      loginUsernameSpan.classList.add('small-username');
    } else {
      loginUsernameSpan.classList.remove('small-username');
    }

    loginAvatar.style.display = 'inline-block';
    loginIcon.style.display = 'none';
    loginDiv.classList.remove('show');
  }
});

// On page load, restore login state if saved
window.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('vortexUser');

  if (savedUser) {
    loginUsernameSpan.textContent = savedUser;

    if (savedUser.length > 8) {
      loginUsernameSpan.classList.add('small-username');
    } else {
      loginUsernameSpan.classList.remove('small-username');
    }

    loginAvatar.style.display = 'inline-block';
    loginIcon.style.display = 'none';
  } else {
    loginUsernameSpan.textContent = 'Sign up';
    loginUsernameSpan.classList.remove('small-username');

    loginAvatar.style.display = 'none';
    loginIcon.style.display = 'inline-block';
  }
});


const inviteBtn = document.getElementById('InviteF');
const inviteDiv = document.getElementById('Invite-Div');
const closeIBtn = document.getElementById('closeIBtn');

document.getElementById("CopyBtn").addEventListener("click", function () {
  const textarea = document.getElementById("copyText");
  textarea.select();
  textarea.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text silently
  navigator.clipboard.writeText(textarea.value).catch(err => {
    console.error("Failed to copy: ", err);
  });
});

inviteBtn.addEventListener('click', () => {
  inviteDiv.classList.add('show');
});

// Close login form
closeIBtn.addEventListener('click', () => {
  inviteDiv.classList.remove('show');
});
