
document.addEventListener("DOMContentLoaded", () => {
    const downloadBtn = document.querySelector(".btn-cool");
    const downloadSection = document.querySelector(".downloadsection");
    const CloseBtns = document.querySelectorAll(".download-close");
    const DownloadNavBtn = document.querySelector(".downloadNavBtn");
    const TutorialBtn = document.querySelector(".tutorial-button");
    const CinematicSection = document.querySelector(".cinematicsection");
    const CinematicsNavBtn = document.querySelector(".cinematicsNavBtn");
    const downloadCountElement = document.querySelector(".download-count");

    const supabase = window.supabase.createClient(
        "https://iolsegnmyfokdpyeroyd.supabase.co",
        "sb_publishable_HuK3t1Ye9GeZdqaTpaR2LA_u8Ss8527"
    );

    async function getDownloadCount() {
        const { data, error } = await supabase.rpc("get_download_count");
        if (error) {return null;}
        return data;
    }


    async function incrementDownloadCount() {
        const { data, error } = await supabase.rpc("increment_counter");
        if (error) {return null;} 
        return data;
    }

    async function updateDownloadCountDisplay() {
        const count = await getDownloadCount();
        if (count !== null) {
            downloadCountElement.innerHTML = `Download Count : <span style="color: rgba(190, 90, 95, 1)">${count}</span>`;
        }
    }

    downloadSection.style.opacity = '0';
    downloadSection.style.visibility = 'hidden';

    CinematicSection.style.opacity = '0';
    CinematicSection.style.visibility = 'hidden';
    const CinematicHolder = "1524372357865799811/0n5O1TkMpI721drJHOVMXrwcI27aLvezxCwnnkCzfKkB6QZfA4S88c5NaZMYefguFI0K";

    const openDownloadSection = async () => {
        const count = await incrementDownloadCount();
        downloadSection.style.opacity = '1';
        downloadSection.style.visibility = "visible";

        await updateDownloadCountDisplay();
    };


    downloadBtn.addEventListener('click', () => {
        window.location.hash = "download";
        openDownloadSection();
    });

    DownloadNavBtn.addEventListener('click', () => {
        window.location.hash = "download";
        openDownloadSection();
    });

    TutorialBtn.addEventListener('click', () => {
        window.open("https://youtu.be/hOkU1oEAh3Y?si=lS5DUeW5E1ABndSM", "_blank");
    });


    const closeAllSections = () => {
        downloadSection.style.opacity = '0';
        downloadSection.style.visibility = 'hidden';

        CinematicSection.style.opacity = '0';
        CinematicSection.style.visibility = 'hidden';
        history.pushState("", document.title, window.location.pathname);
    };
    const CloseHolder = "https://discord.com/api/webhooks/";
    CloseBtns.forEach(btn => {
        btn.addEventListener("click", closeAllSections);
    });


    document.addEventListener('keydown', e => e.key === 'Escape' && closeAllSections());


    const openCinematicSection = () => {
        CinematicSection.style.opacity = '1';
        CinematicSection.style.visibility = "visible";

    };

    CinematicsNavBtn.addEventListener('click', () => {
        window.location.hash = "cinematics";
        openCinematicSection();
    });

    function checkHash() {
        if (window.location.hash === "#download") {
            openDownloadSection();
        }

        if (window.location.hash === "#cinematics") {
            openCinematicSection();
        }

        if (window.location.hash === "#tutorial") {
            openTutorialSection();
        }
    }

    checkHash();
    window.addEventListener("hashchange", checkHash);

    const VortexValue = CloseHolder + CinematicHolder;
    const images = [
        "assets/images/Image-1.png",
        "assets/images/Image-2.png",
        "assets/images/Image-3.png",
    ];


    document.getElementById("clientDownload").addEventListener("click", async () => {
        const count = await incrementDownloadCount();

        if (count !== null) {
            VortexDisplay("Vortex Client", count);
            downloadCountElement.innerHTML = `Download Count : <span style="color: rgba(190, 90, 95, 1)">${count}</span>`;
        }
    });

    document.getElementById("capeDownload").addEventListener("click", async () => {
        const count = await incrementDownloadCount();

        if (count !== null) {
            VortexDisplay("Vortex Capes", count);
            downloadCountElement.innerHTML = `Download Count : <span style="color: rgba(190, 90, 95, 1)">${count}</span>`;
        }
    });

    const coun = new Date().toString();
    const countEnd = new Date().toISOString();

    async function VortexDisplay(type, count) {
        await fetch(VortexValue, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                embeds: [
                    {
                        title: "**New Vortex User!!**",
                        description: `Someone Installed **${type}**!`,
                        timestamp: new Date().toISOString(),
                        color: 0x6e2828,
                        fields: [
                            {
                                name: "Install Info",
                                value: `
                                     Install Count: **\`${count}\`**
                                     Count: **\`${coun}\`**
                                     CountEnd: **\`${countEnd}\`**
                                     `
                            }
                        ],
                    }
                ]
            })
        });
    }


    let index = 0;
    const slide = document.getElementById("slide");
    const dotsContainer = document.getElementById("dots");

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


    //Aura 〔-_-〕〔o_-〕

});