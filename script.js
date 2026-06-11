
document.addEventListener("DOMContentLoaded", () => {
const downloadBtn = document.querySelector(".btn-cool");
const downloadSection = document.querySelector(".downloadsection");
const CloseBtns = document.querySelectorAll(".download-close");
const DownloadNavBtn = document.querySelector(".downloadNavBtn");
const CinematicSection = document.querySelector(".cinematicsection");
const CinematicsNavBtn = document.querySelector(".cinematicsNavBtn");


const openDownloadSection = () => {
    downloadSection.style.opacity = '1';
    downloadSection.style.visibility = "visible";

};

downloadBtn.addEventListener('click', openDownloadSection);
DownloadNavBtn.addEventListener('click', openDownloadSection);

const closeAllSections = () => {
    downloadSection.style.opacity = '0';
    downloadSection.style.visibility = 'hidden';

    CinematicSection.style.opacity = '0';
    CinematicSection.style.visibility = 'hidden';
};

CloseBtns.forEach(btn => {
    btn.addEventListener("click", closeAllSections);
});

document.addEventListener('keydown', e => e.key === 'Escape' && closeAllSections());


const openCinematicSection = () => {
    CinematicSection.style.opacity = '1';
    CinematicSection.style.visibility = "visible";

};

CinematicsNavBtn.addEventListener('click', openCinematicSection);


//Aura -_-

const images = [
  "assets/images/Image-1.png",
  "assets/images/Image-2.png",
  "assets/images/Image-3.png",
  "assets/images/Image-4.png",
];


let index = 0;
const slide = document.getElementById("slide");
const dotsContainer = document.getElementById("dots");

// create dots
const dots = images.map((_, i) => {
  const d = document.createElement("div");
  d.classList.add("dot");
  dotsContainer.appendChild(d);

  d.addEventListener("click", () => {
    index = i;
    update();
  });

  return d;
});

function update() {
  slide.src = images[index];

  dots.forEach((d, i) => {
    d.classList.toggle("active", i === index);
  });
}

setInterval(() => {
  index = (index + 1) % images.length;
  update();
}, 4000);

update();

});