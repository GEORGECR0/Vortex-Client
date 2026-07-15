// ==UserScript==
// @name         Vortex Client
// @namespace    http://tampermonkey.net/
// @version      Rebound
// @description  Vortex Client is a project to make Bloxd fun again...
// @author       GEORGECR
// @homepageURL  https://georgecr0.github.io/Vortex-Client/
// @icon         https://i.postimg.cc/fRpcmPqN/Vortex-Logo.png
// @match        https://bloxd.io/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    //if you wanna steal the code just dm me in discord: [ ge0rgecr_ ]

    /* MODULES (this is not ai bruh its just so its more clean) */
    const modules = {
        'Combat': [
            {
                name: 'Keystrokes', description: 'Shows your key presses', hasSettings: true, enabled: false,
                onEnable: () => { keystrokesModule.start() },
                onDisable: () => { keystrokesModule.stop() },
                settings: [

                ]
            },
        ],
        'Visual': [
            {
                name: 'Armour View', description: 'Shows your armor status', hasSettings: true, enabled: false,
                onEnable: () => { armorDisplayModule.start() },
                onDisable: () => { armorDisplayModule.stop() },
                settings: [
                    { id: 'armourview_scale', label: 'Scale', type: 'slider', min: 0.5, max: 2.0, step: 0.1, defaultValue: 1.0 },
                    { id: 'armourview_orientation', label: 'Orientation', type: 'dropdown', options: ['Horizontal', 'Vertical'], defaultValue: 'Horizontal' }
                ]
            },
            {
                name: 'Cps Counter', description: 'Displays your clicks (CPS)', enabled: false,
                onEnable: () => { cpsModule.start() },
                onDisable: () => { cpsModule.stop() }
            },
            {
                name: 'Ping Counter', description: 'Shows your current ping', enabled: false,
                onEnable: () => { pingModule.start() },
                onDisable: () => { pingModule.stop() }
            },
        ],
        'Player': [
            {
                name: 'Cinematic Mode', description: 'Hides your UI for cinematics' , hasSettings: true, enabled: false,
                onEnable: () => { cinematicModule.start() },
                onDisable: () => { cinematicModule.stop() },
                settings: [
                    { id: 'cinematic_key', label: 'Action Key', type: 'input' , defaultValue: 'H' },
                ]
            }
        ],

        'Utility': [
            {
                name: 'Death Info', description: 'Displays death location', hasSettings: true, enabled: false,
                onEnable: () => { deathinfoModule.start() },
                onDisable: () => { deathinfoModule.stop() },
                settings: [
                    { id: 'last_death', label: 'Your Last Death Was At', type: 'text', placeholder: 'X: ?, Y: ?, Z: ?', defaultValue: '' },
                ]
            },
        ],
        'Cosmetics': [
            {
                name: 'Custom Capes', description: 'Personalize Your Look',
            },
        ],
        'Settings': [

        ]
    };


    const storageKey = 'vms--thugs';

    function getModuleByName(moduleName) {
        for (const category of Object.values(modules)) {
            const foundModule = category.find(m => m.name === moduleName);
            if (foundModule) {
                return foundModule;
            }
        }
        return null;
    }

    function initializeModules() {
        const savedData = JSON.parse(localStorage.getItem(storageKey)) || {};
        Object.values(modules).flat().forEach(module => {
            const moduleData = savedData[module.name] || {};
            const isEnabled = moduleData.enabled !== undefined ? moduleData.enabled : module.enabled;
            if (isEnabled && typeof module.onEnable === 'function') {
                module.onEnable(moduleData.settings || {});
            }
        });
    }

    /* CLIENT UI & SHIT (this is not ai bruh its just so its more clean) */
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/remixicon@4.7.0/fonts/remixicon.css';
    document.head.appendChild(link);

    const gameui = document.querySelector('.WholeAppWrapper');
    gameui.style.display = 'block';
    gameui.style.filter = 'grayscale(80%) brightness(0.6)';
    gameui.style.transition = 'all 0.2s ease';

    const ClientHud = document.createElement('div');
    ClientHud.style.position = 'fixed';
    ClientHud.style.left = '0px';
    ClientHud.style.top = '0px';
    ClientHud.style.backgroundColor = 'transparent';
    ClientHud.style.opacity = '1';
    ClientHud.style.width = '100%';
    ClientHud.style.height = '100%';
    ClientHud.style.display = 'block';
    ClientHud.style.zIndex = '1';
    ClientHud.style.pointerEvents = 'none';
    document.body.appendChild(ClientHud);

    const Notification = document.createElement('div');
    Notification.style.position = 'fixed';
    Notification.style.top = '5px';
    Notification.style.right = '5px';
    Notification.style.backdropFilter = 'blur(14px)';
    Notification.style.backgroundColor = 'rgba(10, 12, 16, 0.7)';
    Notification.style.borderRadius = '0.8rem';
    Notification.style.width = 'fit-content';
    Notification.style.height = 'fit-content';
    Notification.style.padding = '20px';
    Notification.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    Notification.style.border = '1px solid rgba(255, 255, 255, 0.07)';
    Notification.style.display = 'none';
    Notification.style.opacity = '0';
    Notification.style.zIndex = '9999';
    Notification.style.color = 'white';
    Notification.style.textAlign = "center";
    Notification.style.pointerEvents = 'none';
    Notification.style.transition = 'all 0.5s ease';
    ClientHud.appendChild(Notification);

    /* GET CANVAS CONTENT FUNCTIONS username and coords (this is not ai bruh its just so its more clean) */
    let username = null;
    let usernameNoti = 'nah';

    let coords = [];
    let coordsEnabled = false;

    const originalGetContext = HTMLCanvasElement.prototype.getContext;

    HTMLCanvasElement.prototype.getContext = function (...args) {
        const ctx = originalGetContext.apply(this, args);
        if (args[0] === '2d' && !ctx.__textHooked) {
            ctx.__textHooked = true;

            const originalFillText = ctx.fillText;
            ctx.fillText = function (text, x, y, ...rest) {
                const str = String(text).trim();
                const isNumber = str !== '' && !isNaN(str);
                if (!isNumber && username === null) {
                    username = str;
                }

                if (coordsEnabled) {
                    if (/^-?\d+\.\d+$/.test(str)) {
                        coords.push(Number(str));
                        if (coords.length > 3) {
                            coords.shift();
                        }
                    }
                }

                return originalFillText.call(this, text, x, y, ...rest);
            };
        }

        return ctx;
    };


    function checkState() {
        const Ingame = document.querySelector(".InGameHeader");


        if (Ingame && window.getComputedStyle(Ingame).display !== "none") {
            ClientHud.style.display = 'block';
            setTimeout(() => {
                if (usernameNoti === 'nah' && username !== null) {
                    usernameNoti = 'done';

                    Notification.style.display = 'block';
                    Notification.style.opacity = '1';
                    Notification.innerHTML = `Welcome to Vortex Client <span style="color: rgba(190, 90, 95, 1); font-weight: bolder ;">${username}</span> !!!`;
                    setTimeout(() => {
                        Notification.style.opacity = '0';
                        setTimeout(() => {
                            Notification.style.display = 'none';
                        }, 500);
                    }, 7000);
                }
            }, 1000);

        } else {
            usernameNoti = 'nah';
            ClientHud.style.display = 'none';
            document.title = "Bloxd.io - Vortex Client";

            document.querySelectorAll("link[rel*='icon']").forEach(logo => logo.remove());
            const logo = document.createElement("link");
            logo.rel = "icon";
            logo.href = "https://raw.githubusercontent.com/GEORGECR0/Vortex-Client/refs/heads/main/assets/vortex/blxd_logo.png";
            document.head.appendChild(logo);

        }
    }
    checkState();
    setInterval(checkState, 2000);

    const hud = document.createElement('div');
    hud.style.position = 'fixed';
    hud.style.top = '0';
    hud.style.left = '0';
    hud.style.width = '100%';
    hud.style.height = '100%';
    hud.style.zIndex = '999999';
    hud.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    hud.style.pointerEvents = 'auto';
    hud.style.backdropFilter = 'blur(5px)';
    hud.style.transition = 'all 0.2s ease';
    document.body.appendChild(hud);

    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '50%';
    menu.style.left = '50%';
    menu.style.transform = 'translate(-50%, -50%)';
    menu.style.width = '30vw';
    menu.style.height = '40vh';
    menu.style.maxWidth = '500px';
    menu.style.maxHeight = '400px';
    menu.style.minWidth = '300px';
    menu.style.minHeight = '250px';
    menu.style.zIndex = '1000000';
    menu.style.display = 'flex';
    menu.style.flexDirection = 'column';
    menu.style.justifyContent = 'center';
    menu.style.alignItems = 'center';
    menu.style.backgroundImage = 'url(https://i.postimg.cc/fyR7DMPB/Vortex-Client-png.png)';
    menu.style.backgroundRepeat = 'no-repeat';
    menu.style.backgroundSize = '265px 230px';
    menu.style.backgroundPosition = 'center calc(50% - 70px)';
    hud.appendChild(menu);

    const mainMenuCon = document.createElement('div');
    mainMenuCon.style.width = '50vw';
    mainMenuCon.style.height = '65vh';
    mainMenuCon.style.position = 'fixed';
    mainMenuCon.style.top = '50%';
    mainMenuCon.style.left = '50%';
    mainMenuCon.style.transform = 'translate(-50%, -50%)';
    mainMenuCon.style.display = 'none';
    mainMenuCon.style.flexDirection = 'column';
    mainMenuCon.style.justifyContent = 'center';
    mainMenuCon.style.alignItems = 'center';
    mainMenuCon.style.maxWidth = '1000px';
    mainMenuCon.style.maxHeight = '800px';
    mainMenuCon.style.minWidth = '900px';
    mainMenuCon.style.minHeight = '700px';
    hud.appendChild(mainMenuCon);

    const mainMenu = document.createElement('div');
    mainMenu.style.width = '50vw';
    mainMenu.style.height = '45vh';
    mainMenu.style.zIndex = '999999';
    mainMenu.style.position = 'relative';
    mainMenu.style.backdropFilter = 'blur(14px)';
    mainMenu.style.backgroundColor = 'rgba(10, 12, 16, 0.6)';
    mainMenu.style.borderRadius = '1rem';
    mainMenu.style.padding = '20px';
    mainMenu.style.border = '1px solid rgba(255, 255, 255, 0.07)';
    mainMenu.style.display = 'flex';
    mainMenu.style.justifyContent = 'center';
    mainMenu.style.alignItems = 'center';
    mainMenu.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    mainMenu.style.maxWidth = '1000px';
    mainMenu.style.maxHeight = '550px';
    mainMenu.style.minWidth = '900px';
    mainMenu.style.minHeight = '550px';
    mainMenuCon.appendChild(mainMenu);

    const contentArea = document.createElement('div');
    contentArea.style.marginLeft = '230px';
    contentArea.style.padding = '20px';
    contentArea.style.width = 'calc(100% - 230px)';
    contentArea.style.height = '100%';
    contentArea.style.display = 'flex';
    contentArea.style.flexDirection = 'column';
    contentArea.style.alignItems = 'flex-start';
    contentArea.style.justifyContent = 'flex-start';
    contentArea.style.color = 'white';
    contentArea.style.fontSize = '18px';
    contentArea.style.fontWeight = 'bold';
    mainMenu.appendChild(contentArea);

    const tabBar = document.createElement('div');
    tabBar.style.width = '240px';
    tabBar.style.height = '100%';
    tabBar.style.display = 'flex';
    tabBar.style.flexDirection = 'column';
    tabBar.style.justifyContent = 'flex-start';
    tabBar.style.alignItems = 'center';
    tabBar.style.gap = '15px';
    tabBar.style.position = 'absolute';
    tabBar.style.top = '0';
    tabBar.style.left = '0';
    tabBar.style.borderRight = '1.4px solid rgba(255, 255, 255, 0.07)';
    tabBar.style.backgroundColor = 'rgba(0, 4, 9, 0.7)';
    tabBar.style.borderTopLeftRadius = '1rem';
    tabBar.style.borderBottomLeftRadius = '1rem';
    mainMenu.appendChild(tabBar);

    const logoWrapper = document.createElement('div');
    logoWrapper.style.display = 'flex';
    logoWrapper.style.flexDirection = 'column';
    logoWrapper.style.alignItems = 'center';
    logoWrapper.style.marginTop = '20px';
    tabBar.appendChild(logoWrapper);

    const sidebarLogo = document.createElement('img');
    sidebarLogo.src = 'https://i.postimg.cc/rwqnpQbv/logo-v2.png';
    sidebarLogo.style.width = '200px';
    sidebarLogo.style.height = 'auto';
    sidebarLogo.style.borderRadius = '0.4rem';
    logoWrapper.appendChild(sidebarLogo);

    const versionLabel = document.createElement('div');
    versionLabel.textContent = 'Version Rebound';
    versionLabel.style.fontSize = '13px';
    versionLabel.style.fontWeight = 'lighter';
    versionLabel.style.color = 'rgba(255, 255, 255, 0.3)';
    versionLabel.style.marginTop = '-2px';
    logoWrapper.appendChild(versionLabel);

    const separator = document.createElement('div');
    separator.style.width = '85%';
    separator.style.height = '1px';
    separator.style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
    separator.style.marginBottom = '5px';
    tabBar.appendChild(separator);

    const tabs = [
        { name: 'Combat', icon: 'ri-sword-fill' },
        { name: 'Visual', icon: 'ri-eye-fill', },
        { name: 'Player', icon: 'ri-walk-fill', },
        { name: 'Utility', icon: 'ri-tools-fill', },
        { name: 'Cosmetics', icon: 'ri-magic-fill', }
    ];

    const tabButtons = [];
    let currentTabName = tabs[0].name;

    tabs.forEach((tab, index) => {
        const tabBtn = document.createElement('button');
        tabBtn.innerHTML = `<i class="${tab.icon}" style="margin-right:8px; font-size:18px;"></i> ${tab.name}`;
        tabBtn.style.width = '80%';
        tabBtn.style.height = '50px';
        tabBtn.style.display = 'flex';
        tabBtn.style.alignItems = 'center';
        tabBtn.style.justifyContent = 'flex-start';
        tabBtn.style.gap = '8px';
        tabBtn.style.padding = '10px';
        tabBtn.style.borderRadius = '12px';
        tabBtn.style.cursor = 'pointer';
        tabBtn.style.fontSize = '14px';
        tabBtn.style.fontWeight = 'bold';
        tabBtn.style.color = 'rgba(255, 255, 255, 0.35)';
        tabBtn.style.backgroundColor = 'transparent';
        tabBtn.style.border = 'none';
        tabBtn.style.boxShadow = 'none';
        if (index === 0) setActive(tabBtn);
        tabBtn.addEventListener('mouseover', () => { if (!tabBtn.classList.contains('active')) {tabBtn.style.transition = 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)'; tabBtn.style.border = '1px solid rgba(255, 255, 255, 0.1)'; tabBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.005)'; tabBtn.style.color = 'rgba(255, 255, 255, 0.6)'; } });
        tabBtn.addEventListener('mouseout', () => { if (!tabBtn.classList.contains('active')) { tabBtn.style.border = 'none'; tabBtn.style.backgroundColor = 'transparent'; tabBtn.style.color = 'rgba(255, 255, 255, 0.35)'; } });
        tabBtn.addEventListener('click', () => {
            tabButtons.forEach(btn => { btn.classList.remove('active'); btn.style.backgroundColor = 'transparent'; btn.style.border = 'none'; btn.style.boxShadow = 'none'; btn.style.color = 'rgba(255, 255, 255, 0.35)'; });
            setActive(tabBtn);
            setContent(tab.name);
        });
        tabButtons.push(tabBtn);
        tabBar.appendChild(tabBtn);
    });

    function setActive(btn) {
        btn.classList.add('active');
        btn.style.backgroundColor = 'rgba(110, 40, 40, 0.8)';
        btn.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        btn.style.boxShadow = '0px 0px 15px -3px rgb(110, 40, 40)';
        btn.style.color = 'white';
    }

    const bottomSeparator = document.createElement('div');
    bottomSeparator.style.width = '85%';
    bottomSeparator.style.height = '1px';
    bottomSeparator.style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
    tabBar.appendChild(bottomSeparator);

    const footerButtons = [{ name: 'Settings', icon: 'ri-settings-5-fill' }, { name: 'Discord', icon: 'ri-discord-fill' }];
    footerButtons.forEach(footer => {
        const fBtn = document.createElement('button');
        fBtn.innerHTML = `<i class="${footer.icon}" style="margin-right:8px; font-size:18px;"></i> ${footer.name}`;
        fBtn.style.width = '80%';
        fBtn.style.height = '50px';
        fBtn.style.display = 'flex';
        fBtn.style.alignItems = 'center';
        fBtn.style.justifyContent = 'flex-start';
        fBtn.style.gap = '8px';
        fBtn.style.padding = '8px';
        fBtn.style.borderRadius = '12px';
        fBtn.style.cursor = 'pointer';
        fBtn.style.fontSize = '14px';
        fBtn.style.fontWeight = 'bold';
        fBtn.style.color = 'rgba(255, 255, 255, 0.35)';
        fBtn.style.backgroundColor = 'transparent';
        fBtn.style.border = 'none';
        if (footer.name === 'Discord') {
            fBtn.style.color = '#5865F2';
            fBtn.addEventListener('click', () => {window.open('https://discord.gg/M6RTaEGPrY', '_blank');});
            fBtn.addEventListener('mouseover', () => { if (!fBtn.classList.contains('active')) {fBtn.style.transition = 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)'; fBtn.style.border = '1px solid rgba(255, 255, 255, 0.1)'; fBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.005)'; } });
            fBtn.addEventListener('mouseout', () => { if (!fBtn.classList.contains('active')) { fBtn.style.backgroundColor = 'transparent'; fBtn.style.border = 'none'; } });
        }
        if (footer.name === 'Settings') {
            fBtn.addEventListener('mouseover', () => { if (!fBtn.classList.contains('active')) {fBtn.style.transition = 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)'; fBtn.style.border = '1px solid rgba(255, 255, 255, 0.1)'; fBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.005)'; fBtn.style.color = 'rgba(255, 255, 255, 0.6)'; } });
            fBtn.addEventListener('mouseout', () => { if (!fBtn.classList.contains('active')) { fBtn.style.backgroundColor = 'transparent'; fBtn.style.color = 'rgba(255, 255, 255, 0.35)'; fBtn.style.border = 'none'; } });
            fBtn.addEventListener('click', () => {
                setContent('Settings (none)');
                tabButtons.forEach(btn => { btn.classList.remove('active'); btn.style.backgroundColor = 'transparent'; btn.style.border = 'none'; btn.style.boxShadow = 'none'; btn.style.color = 'rgba(255, 255, 255, 0.35)'; });
            });
        }
        tabBar.appendChild(fBtn);
    });

    function createModuleCard(moduleName, iconClass, descriptionText, hasSettings = false, isEnabled = false) {
        const card = document.createElement('div');
        card.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        card.style.borderRadius = '12px';
        card.style.padding = '20px';
        card.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        card.style.textAlign = 'center';
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.justifyContent = 'space-between';
        const textWrapper = document.createElement('div');
        const name = document.createElement('div');
        name.textContent = moduleName;
        name.style.marginTop = '10px';
        name.style.fontSize = '16px';
        name.style.fontWeight = 'bold';
        name.style.color = 'white';
        textWrapper.appendChild(name);
        const desc = document.createElement('div');
        desc.textContent = descriptionText;
        desc.style.fontSize = '12px';
        desc.style.color = 'rgba(255, 255, 255, 0.6)';
        desc.style.marginTop = '5px';
        textWrapper.appendChild(desc);
        card.appendChild(textWrapper);
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.justifyContent = 'center';
        controls.style.alignItems = 'center';
        controls.style.marginTop = '15px';
        controls.style.gap = '10px';
        if (moduleName === "Custom Capes") {
            const Capebtn = document.createElement("button");
            Capebtn.textContent = "Install";
            Capebtn.style.padding = "8px 16px";
            Capebtn.style.border = "none";
            Capebtn.style.borderRadius = "8px";
            Capebtn.style.cursor = "pointer";
            Capebtn.style.backgroundColor = "rgba(110, 40, 40, 0.8)";
            Capebtn.style.color = "white";

            Capebtn.addEventListener("click", () => {
                window.open("https://georgecr0.github.io/Vortex-Client/#download", "_blank");
            });
            controls.appendChild(Capebtn);
            card.appendChild(controls);

            card.addEventListener('mouseover', () => {
                card.style.transform = 'translateY(-4px) scale(1.02)';
            });
            card.addEventListener('mouseout', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });

            return card;
        }
        const switchLabel = document.createElement('label');
        switchLabel.style.position = 'relative';
        switchLabel.style.display = 'inline-block';
        switchLabel.style.width = '54px';
        switchLabel.style.height = '28px';
        controls.appendChild(switchLabel);
        const switchInput = document.createElement('input');
        switchInput.type = 'checkbox';
        switchInput.style.opacity = '0';
        switchInput.style.width = '0';
        switchInput.style.height = '0';
        switchLabel.appendChild(switchInput);
        const slider = document.createElement('span');
        slider.style.position = 'absolute';
        slider.style.cursor = 'pointer';
        slider.style.top = '0';
        slider.style.left = '0';
        slider.style.right = '0';
        slider.style.bottom = '0';
        slider.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        slider.style.transition = '.4s';
        slider.style.borderRadius = '34px';
        switchLabel.appendChild(slider);
        const sliderKnob = document.createElement('span');
        sliderKnob.style.position = 'absolute';
        sliderKnob.style.content = '""';
        sliderKnob.style.height = '20px';
        sliderKnob.style.width = '20px';
        sliderKnob.style.left = '4px';
        sliderKnob.style.bottom = '4px';
        sliderKnob.style.backgroundColor = 'white';
        sliderKnob.style.transition = '.4s';
        sliderKnob.style.borderRadius = '50%';
        slider.appendChild(sliderKnob);
        if (isEnabled) {
            switchInput.checked = true;
            slider.style.backgroundColor = 'rgba(110, 40, 40, 0.8)';
            sliderKnob.style.transform = 'translateX(26px)';
        }
        switchInput.addEventListener('change', () => {
            const isChecked = switchInput.checked;
            if (isChecked) {
                slider.style.backgroundColor = 'rgba(110, 40, 40, 0.8)';
                sliderKnob.style.transform = 'translateX(26px)';
            } else {
                slider.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                sliderKnob.style.transform = 'translateX(0)';
            }
            let savedStates = JSON.parse(localStorage.getItem(storageKey)) || {};
            if (!savedStates[moduleName]) {
                savedStates[moduleName] = {enabled: false, settings: {} };
            }

            savedStates[moduleName].enabled = isChecked;
            localStorage.setItem(storageKey, JSON.stringify(savedStates));
            const module = getModuleByName(moduleName);
            if (!module) return;
            if (isChecked && typeof module.onEnable === 'function') {
                module.onEnable();
            } else if (!isChecked && typeof module.onDisable === 'function') {
                module.onDisable();
            }
        });
        if (hasSettings) {
            const settingsBtn = document.createElement('button');
            settingsBtn.innerHTML = '<i class="ri-settings-4-fill"></i>';
            settingsBtn.style.width = '28px';
            settingsBtn.style.height = '28px';
            settingsBtn.style.borderRadius = '10px';
            settingsBtn.style.border = 'none';
            settingsBtn.style.cursor = 'pointer';
            settingsBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            settingsBtn.style.color = 'white';
            settingsBtn.style.fontSize = '18px';
            settingsBtn.style.transition = 'background-color 0.3s ease';
            settingsBtn.style.display = 'flex';
            settingsBtn.style.alignItems = 'center';
            settingsBtn.style.justifyContent = 'center';
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const module = getModuleByName(moduleName);
                if (module) { showSettingsPanel(module); }
            });
            settingsBtn.addEventListener('mouseover', () => { settingsBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; });
            settingsBtn.addEventListener('mouseout', () => { settingsBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; });
            controls.appendChild(settingsBtn);
        }
        card.appendChild(controls);
        card.addEventListener('mouseover', () => { card.style.transform = 'translateY(-4px) scale(1.02)'; });
        card.addEventListener('mouseout', () => { card.style.transform = 'translateY(0) scale(1)'; });
        return card;
    }

    function saveSetting(moduleName, id, value) {

        const savedData = JSON.parse(localStorage.getItem(storageKey)) || {};
        if (!savedData[moduleName]) {
            savedData[moduleName] = {enabled: false,settings: {}};
        }
        savedData[moduleName].settings[id] = value;
        localStorage.setItem(storageKey,JSON.stringify(savedData));
    }

    function showSettingsPanel(module) {
        contentArea.innerHTML = '';
        contentArea.style.display = 'flex';
        contentArea.style.flexDirection = 'column';
        contentArea.style.alignItems = 'flex-start';

        const headerContainer = document.createElement('div');
        headerContainer.style.display = 'flex';
        headerContainer.style.alignItems = 'center';
        headerContainer.style.width = '100%';
        headerContainer.style.marginBottom = '20px';
        contentArea.appendChild(headerContainer);

        const backButton = document.createElement('button');
        backButton.innerHTML = `<i class="ri-arrow-left-line"></i>`;
        backButton.style.fontSize = '20px';
        backButton.style.color = 'white';
        backButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        backButton.style.border = '1px solid rgba(255, 255, 255, 0.15)';
        backButton.style.borderRadius = '8px';
        backButton.style.width = '40px';
        backButton.style.height = '40px';
        backButton.style.cursor = 'pointer';
        backButton.style.marginRight = '15px';
        backButton.style.transition = 'background-color 0.3s ease';
        backButton.style.display = 'flex';
        backButton.style.alignItems = 'center';
        backButton.style.justifyContent = 'center';
        backButton.addEventListener('mouseover', () => { backButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; });
        backButton.addEventListener('mouseout', () => { backButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; });
        backButton.addEventListener('click', () => { setContent(currentTabName); });
        headerContainer.appendChild(backButton);

        const title = document.createElement('div');
        title.textContent = `${module.name} Settings`;
        title.style.fontSize = '22px';
        title.style.fontWeight = 'bold';
        headerContainer.appendChild(title);

        const settingsContentArea = document.createElement('div');
        settingsContentArea.style.width = '100%';
        settingsContentArea.style.display = 'flex';
        settingsContentArea.style.flexDirection = 'column';
        settingsContentArea.style.gap = '20px';
        contentArea.appendChild(settingsContentArea);

        module.settings.forEach(setting => {
            const savedData = JSON.parse(localStorage.getItem(storageKey)) || {};
            const moduleData = savedData[module.name] || {};
            const settingsData = moduleData.settings || {};
            const value = settingsData[setting.id] !== undefined ? settingsData[setting.id] : setting.defaultValue;
            const settingWrapper = document.createElement('div');
            settingWrapper.style.display = 'flex';
            settingWrapper.style.justifyContent = 'space-between';
            settingWrapper.style.alignItems = 'center';
            settingWrapper.style.width = '100%';

            const label = document.createElement('label');
            label.textContent = setting.label;
            label.style.fontSize = '16px';
            settingWrapper.appendChild(label);

            switch (setting.type) {
                case 'slider': {
                    const controlWrapper = document.createElement('div');
                    controlWrapper.style.display = 'flex';
                    controlWrapper.style.alignItems = 'center';
                    controlWrapper.style.gap = '10px';
                    const slider = document.createElement('input');
                    slider.type = 'range';
                    slider.min = setting.min;
                    slider.max = setting.max;
                    slider.step = setting.step;
                    slider.value = value;
                    const valueLabel = document.createElement('span');
                    valueLabel.textContent = parseFloat(value).toFixed(1);
                    valueLabel.style.minWidth = '30px';
                    slider.addEventListener('input', () => {
                        valueLabel.textContent = parseFloat(slider.value).toFixed(1);
                        saveSetting(module.name, setting.id, parseFloat(slider.value));
                    });
                    controlWrapper.appendChild(slider);
                    controlWrapper.appendChild(valueLabel);
                    settingWrapper.appendChild(controlWrapper);
                    break;
                }
                case 'toggle': {
                    const switchLabel = document.createElement('label');
                    switchLabel.style.position = 'relative';
                    switchLabel.style.display = 'inline-block';
                    switchLabel.style.width = '54px';
                    switchLabel.style.height = '28px';
                    const switchInput = document.createElement('input');
                    switchInput.type = 'checkbox';
                    switchInput.style.opacity = '0';
                    switchInput.style.width = '0';
                    switchInput.style.height = '0';
                    const sliderSpan = document.createElement('span');
                    sliderSpan.style.position = 'absolute';
                    sliderSpan.style.cursor = 'pointer';
                    sliderSpan.style.top = '0';
                    sliderSpan.style.left = '0';
                    sliderSpan.style.right = '0';
                    sliderSpan.style.bottom = '0';
                    sliderSpan.style.transition = '.4s';
                    sliderSpan.style.borderRadius = '34px';
                    const sliderKnob = document.createElement('span');
                    sliderKnob.style.position = 'absolute';
                    sliderKnob.style.height = '20px';
                    sliderKnob.style.width = '20px';
                    sliderKnob.style.left = '4px';
                    sliderKnob.style.bottom = '4px';
                    sliderKnob.style.backgroundColor = 'white';
                    sliderKnob.style.transition = '.4s';
                    sliderKnob.style.borderRadius = '50%';

                    function updateToggle(checked) {
                        if (checked) {
                            sliderSpan.style.backgroundColor = 'rgba(110, 40, 40, 0.8)';
                            sliderKnob.style.transform = 'translateX(26px)';
                        } else {
                            sliderSpan.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            sliderKnob.style.transform = 'translateX(0)';
                        }
                    }
                    switchInput.checked = value;
                    updateToggle(value);
                    switchInput.addEventListener('change', () => {
                        updateToggle(switchInput.checked);
                        saveSetting(module.name, setting.id, switchInput.checked);
                    });
                    sliderSpan.appendChild(sliderKnob);
                    switchLabel.appendChild(switchInput);
                    switchLabel.appendChild(sliderSpan);
                    settingWrapper.appendChild(switchLabel);
                    break;
                }
                case 'color': {
                    const colorInput = document.createElement('input');
                    colorInput.type = 'color';
                    colorInput.value = value;
                    colorInput.style.border = 'none';
                    colorInput.style.background = 'none';
                    colorInput.style.width = '40px';
                    colorInput.style.height = '40px';
                    colorInput.addEventListener('input', () => {
                        saveSetting(module.name, setting.id, colorInput.value);
                    });
                    settingWrapper.appendChild(colorInput);
                    break;
                }
                case 'dropdown': {
                    const select = document.createElement('select');
                    select.id = setting.id;
                    select.style.backgroundColor = 'rgba(0,0,0,0.3)';
                    select.style.color = 'white';
                    select.style.border = '1px solid rgba(255,255,255,0.1)';
                    select.style.borderRadius = '5px';
                    select.style.padding = '5px';
                    setting.options.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt;
                        option.textContent = opt;
                        select.appendChild(option);
                    });
                    select.value = value;
                    select.addEventListener('change', () => {
                        saveSetting(module.name, setting.id, select.value);
                    });
                    settingWrapper.appendChild(select);
                    break;
                }
                case 'input': {
                    const textInput = document.createElement('input');
                    textInput.type = 'input';
                    textInput.placeholder = setting.placeholder;
                    textInput.value = value;
                    textInput.maxLength = 1;
                    textInput.style.backgroundColor = 'rgba(0,0,0,0.3)';
                    textInput.style.color = 'white';
                    textInput.style.border = '1px solid rgba(255,255,255,0.1)';
                    textInput.style.borderRadius = '5px';
                    textInput.style.padding = '8px';
                    textInput.style.textAlign = 'center';
                    textInput.addEventListener('change', () => {
                        saveSetting(module.name, setting.id, textInput.value);
                    });
                    settingWrapper.appendChild(textInput);
                    break;
                }
                case 'text': {
                    const textDisplay = document.createElement('div');

                    textDisplay.textContent = value || setting.placeholder || '';
                    textDisplay.style.backgroundColor = 'rgba(0,0,0,0.2)';
                    textDisplay.style.color = 'rgba(255,255,255,0.8)';
                    textDisplay.style.border = '1px solid rgba(255,255,255,0.08)';
                    textDisplay.style.borderRadius = '8px';
                    textDisplay.style.padding = '8px 12px';
                    textDisplay.style.textAlign = 'center';
                    textDisplay.style.fontSize = '14px';
                    textDisplay.style.minWidth = '150px';
                    textDisplay.style.userSelect = 'text';

                    settingWrapper.appendChild(textDisplay);
                    break;
                }
            }
            settingsContentArea.appendChild(settingWrapper);
        });
    }

    function setContent(tabName) {
        currentTabName = tabName;
        contentArea.innerHTML = '';
        contentArea.style.position = 'relative';
        const tabLabel = document.createElement('div');
        tabLabel.style.textAlign = 'center';
        tabLabel.style.width = '100%';
        tabLabel.style.marginBottom = '15px';
        tabLabel.textContent = tabName;
        tabLabel.style.fontSize = '22px';
        tabLabel.style.fontWeight = 'bold';
        tabLabel.style.color = 'white';
        tabLabel.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.2)';
        tabLabel.style.transition = 'all 0.4s ease-in-out';
        contentArea.appendChild(tabLabel);
        const gridContainer = document.createElement('div');
        gridContainer.style.width = '100%';
        gridContainer.style.maxHeight = 'calc(100% - 100px)';
        gridContainer.style.overflowY = 'auto';
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
        gridContainer.style.gap = '20px';
        gridContainer.style.padding = '10px';
        contentArea.appendChild(gridContainer);
        let savedStates = JSON.parse(localStorage.getItem(storageKey)) || {};
        const currentModules = modules[tabName] || [];
        currentModules.forEach(module => {
            const isEnabled = (savedStates[module.name] && savedStates[module.name].enabled !== undefined) ? savedStates[module.name].enabled : module.enabled;
            const card = createModuleCard(module.name, module.icon, module.description, module.hasSettings, isEnabled);
            gridContainer.appendChild(card);
        });
    }

    const createStyledButton = (options = {}) => {
        const btn = document.createElement('button');
        btn.style.width = options.width || '60px';
        btn.style.height = options.height || '60px';
        btn.style.backgroundImage = 'linear-gradient(45deg, rgba(0, 4, 9, 1) 40%, rgba(14, 14, 19, 1) 100%)';
        btn.style.backgroundSize = 'cover';
        btn.style.backgroundPosition = '0% 0%';
        btn.style.backgroundRepeat = 'repeat';
        btn.style.backgroundColor = 'transparent';
        btn.style.border = '1.5px solid rgba(255, 255, 255, 0.08)';
        btn.style.borderRadius = '0.8rem';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = 'none';
        btn.style.fontSize = options.fontSize || '20px';
        btn.style.color = 'white';
        btn.style.transition = 'box-shadow 0.3s ease';
        btn.addEventListener('mouseover', function () { btn.style.transition = 'background-image 0.3s ease, box-shadow 0.3s ease'; btn.style.backgroundImage = 'linear-gradient(45deg, rgba(110, 40, 40, 1) 40%, rgba(124, 54, 59, 1) 100%)'; btn.style.boxShadow = '0px 0px 15px -4px rgb(110, 40, 40)'; });
        btn.addEventListener('mouseout', function () { btn.style.transition = 'none'; btn.style.backgroundImage = 'linear-gradient(45deg, rgba(0, 4, 9, 1) 40%, rgba(14, 14, 19, 1) 100%)'; btn.style.boxShadow = 'none'; });
        if (options.text) btn.textContent = options.text;
        if (options.html) btn.innerHTML = options.html;
        return btn;
    };

    const VortexContainer = document.createElement('div');
    VortexContainer.style.display = 'flex';
    VortexContainer.style.flexDirection = 'column';
    VortexContainer.style.alignItems = 'center';
    VortexContainer.style.gap = '10px';
    menu.appendChild(VortexContainer);

    const VortexSettingsBtn = createStyledButton({ width: '250px', height: '60px', fontSize: '16px', text: 'Vortex Settings' });
    VortexSettingsBtn.style.marginTop = '120px';
    VortexSettingsBtn.addEventListener('click', function () { mainMenuCon.style.display = 'flex'; menu.style.display = 'none'; gameui.style.display = ''; });
    VortexContainer.appendChild(VortexSettingsBtn);

    const VortexMenuBtnDiv = document.createElement('div');
    VortexMenuBtnDiv.style.width = '250px';
    VortexMenuBtnDiv.style.height = '60px';
    VortexMenuBtnDiv.style.display = 'flex';
    VortexMenuBtnDiv.style.flexDirection = 'row';
    VortexMenuBtnDiv.style.alignItems = 'center';
    VortexMenuBtnDiv.style.marginTop = '10px';
    VortexMenuBtnDiv.style.gap = '10px';
    menu.appendChild(VortexMenuBtnDiv);

    const icons = ['ri-pencil-fill', 'ri-group-fill', 'ri-magic-fill', 'ri-settings-5-fill'];
    icons.forEach(icon => {
        const btn = createStyledButton({ html: `<i class="${icon}"></i>` });
        VortexMenuBtnDiv.appendChild(btn);
        btn.addEventListener('click', function () { mainMenuCon.style.display = 'flex'; menu.style.display = 'none'; gameui.style.display = ''; });
    });

    let menuVisible = true;
    const toggleMenuKey = 'KeyK';
    window.addEventListener('keydown', function (e) {
        if (e.code === toggleMenuKey) {
            menuVisible = !menuVisible;
            menu.style.display = menuVisible ? 'flex' : 'none';
            hud.style.backgroundColor = menuVisible ? 'rgba(0, 0, 0, 0.8)' : 'transparent';
            hud.style.backdropFilter = menuVisible ? 'blur(5px)' : 'blur(0px)';
            hud.style.pointerEvents = menuVisible ? 'auto' : 'none';
            mainMenuCon.style.display = 'none';
            gameui.style.display = 'block';
            gameui.style.filter = menuVisible ? 'grayscale(80%) brightness(0.6)' : 'grayscale(0%) brightness(1)';
        }
    });

    setContent(tabs[0].name, tabs[0].description);
    setTimeout(initializeModules, 2000);

    /* CPS COUNTER MODULE (this is not ai bruh its just so its more clean) */
    const cpsModule = (function () {
        let cpsHud = null;
        let clicksTextSpan = null;
        let clickListener = null;
        let updateIntervalId = null;
        let positionIntervalId = null;

        let leftClicks = 0;
        let rightClicks = 0;
        let lastLeftClickTime = 0;
        let lastRightClickTime = 0;

        const start = () => {
            if (cpsHud) return;
            cpsHud = document.createElement("div");
            cpsHud.style.position = "fixed";
            cpsHud.id = 'cpsDisplay';
            cpsHud.style.background = "rgba(0, 0, 0, 0.6)";
            cpsHud.style.color = "#fff";
            cpsHud.style.alignItems = 'center';
            cpsHud.style.justifyContent = 'center';
            cpsHud.style.fontWeight = '500';
            cpsHud.style.zIndex = '0.5';
            cpsHud.style.display = 'none';
            cpsHud.style.pointerEvents = 'none';
            cpsHud.style.boxSizing = "border-box";
            const cpsTextSpan = document.createElement("span");
            cpsTextSpan.style.color = "#cfcfcf";
            cpsTextSpan.innerText = "CPS ";
            cpsTextSpan.style.marginRight = '5px';
            cpsTextSpan.style.fontSize = "12px";
            clicksTextSpan = document.createElement("span");
            clicksTextSpan.style.color = "#fff";
            clicksTextSpan.innerText = "0 │ 0";
            clicksTextSpan.style.fontSize = "12px";
            cpsHud.appendChild(cpsTextSpan);
            cpsHud.appendChild(clicksTextSpan);
            ClientHud.appendChild(cpsHud);
            lastLeftClickTime = Date.now();
            lastRightClickTime = Date.now();
            clickListener = (e) => {
                if (e.button === 0) {
                    leftClicks++;
                } else if (e.button === 2) {
                    rightClicks++;
                }
            };
            document.addEventListener("mousedown", clickListener);

            const updateBoxPosition = () => {
                if (!cpsHud) return;

                const header = document.querySelector('.InGameHeader');
                if (!header || header.offsetHeight === 0) {
                    cpsHud.style.display = 'none';
                    return;
                }
                cpsHud.style.display = 'flex';

                const fps = document.querySelector('.FpsWrapperDiv');
                const coords = document.querySelectorAll('.CoordinateUI');
                const fpsVisible = fps && window.getComputedStyle(fps).display !== 'none';
                const visibleCoords = Array.from(coords).filter(c => window.getComputedStyle(c).display !== 'none');
                let targetRect = null;

                if (visibleCoords.length > 0) {
                    const rightmostCoord = visibleCoords.reduce((a, b) => a.getBoundingClientRect().right > b.getBoundingClientRect().right ? a : b);
                    targetRect = rightmostCoord.getBoundingClientRect();
                } else if (fpsVisible) {
                    targetRect = fps.getBoundingClientRect();
                } else {
                    targetRect = header.getBoundingClientRect();
                }

                cpsHud.style.top = `${targetRect.top}px`;
                cpsHud.style.left = `${targetRect.right + 5}px`;
                cpsHud.style.height = `${header.offsetHeight}px`;
                const headerStyle = window.getComputedStyle(header);
                cpsHud.style.background = headerStyle.backgroundColor;
                cpsHud.style.border = headerStyle.border;
                cpsHud.style.borderRadius = headerStyle.borderRadius;
                cpsHud.style.width = 'auto';
                cpsHud.style.width = `${cpsHud.offsetWidth + 10}px`;
            };

            setInterval(() => {
                clicksTextSpan.innerText = `${leftClicks} │ ${rightClicks}`;
                leftClicks = 0;
                rightClicks = 0;
            }, 1000);

            positionIntervalId = setInterval(updateBoxPosition, 250);
        };

        const stop = () => {
            clearInterval(updateIntervalId);
            clearInterval(positionIntervalId);
            updateIntervalId = positionIntervalId = null;

            if (clickListener) {
                document.removeEventListener("mousedown", clickListener);
                clickListener = null;
            }

            if (cpsHud) {
                cpsHud.remove();
                cpsHud = null;
            }

            leftClicks = 0;
            rightClicks = 0;
        };

        return {
            start,
            stop
        };
    })();

    /* PING COUNTER MODULE (this is not ai bruh its just so its more clean) */
    const pingModule = (function () {
        let pingHud = null;
        let msTextSpan = null;
        let pingUpdateIntervalId = null;
        let textUpdateIntervalId = null;
        let positionIntervalId = null;
        let ping = 0;

        const start = () => {
            if (pingHud) return;
            pingHud = document.createElement("div");
            pingHud.style.position = "fixed";
            pingHud.style.color = "#fff";
            pingHud.style.display = 'none';
            pingHud.style.alignItems = 'center';
            pingHud.style.justifyContent = 'center';
            pingHud.style.fontWeight = '500';
            pingHud.style.zIndex = '0.5';
            pingHud.style.pointerEvents = 'none';
            pingHud.style.boxSizing = "border-box";
            const pingTextSpan = document.createElement("span");
            pingTextSpan.style.color = "#cfcfcf";
            pingTextSpan.innerText = "PING ";
            pingTextSpan.style.marginRight = '5px';
            pingTextSpan.style.fontSize = "12px";
            msTextSpan = document.createElement("span");
            msTextSpan.style.color = "#fff";
            msTextSpan.innerText = "--ms";
            msTextSpan.style.fontSize = "12px";
            pingHud.appendChild(pingTextSpan);
            pingHud.appendChild(msTextSpan);
            ClientHud.appendChild(pingHud);

            const updatePing = () => {
                const startTime = Date.now();
                fetch(window.location.origin, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' })
                    .then(() => {
                    ping = Date.now() - startTime;
                })
                    .catch(() => {
                    ping = -1;
                });
            };
            const updateBoxPosition = () => {
                if (!pingHud) return;

                const header = document.querySelector('.InGameHeader');
                if (!header || header.offsetHeight === 0) {
                    pingHud.style.display = 'none';
                    return;
                }
                pingHud.style.display = 'flex';

                const fps = document.querySelector('.FpsWrapperDiv');
                const coords = document.querySelectorAll('.CoordinateUI');
                const cpsElement = document.getElementById('cpsDisplay');

                const fpsVisible = fps && window.getComputedStyle(fps).display !== 'none';
                const visibleCoords = Array.from(coords).filter(c => window.getComputedStyle(c).display !== 'none');
                const cpsVisible = cpsElement && window.getComputedStyle(cpsElement).display !== 'none';

                let targetRect = null;

                if (cpsVisible) {
                    targetRect = cpsElement.getBoundingClientRect();
                } else if (visibleCoords.length > 0) {
                    targetRect = visibleCoords.reduce((rightmost, c) => {
                        const rect = c.getBoundingClientRect();
                        return !rightmost || rect.right > rightmost.right ? rect : rightmost;
                    }, null);
                } else if (fpsVisible) {
                    targetRect = fps.getBoundingClientRect();
                } else {
                    targetRect = header.getBoundingClientRect();
                }

                pingHud.style.top = `${targetRect.top}px`;
                pingHud.style.left = `${targetRect.right + 5}px`;
                pingHud.style.height = `${header.offsetHeight}px`;

                const headerStyle = window.getComputedStyle(header);
                pingHud.style.background = headerStyle.backgroundColor;
                pingHud.style.border = headerStyle.border;
                pingHud.style.borderRadius = headerStyle.borderRadius;
                pingHud.style.width = 'auto';
                pingHud.style.width = `${pingHud.offsetWidth + 10}px`;
            };

            textUpdateIntervalId = setInterval(() => {
                if (msTextSpan) {
                    msTextSpan.innerText = ping >= 0 ? `${ping}ms` : "--";
                }
            }, 1000);
            pingUpdateIntervalId = setInterval(updatePing, 2500);
            positionIntervalId = setInterval(updateBoxPosition, 300);
            updatePing();
            updateBoxPosition();
        };

        const stop = () => {
            clearInterval(pingUpdateIntervalId);
            clearInterval(textUpdateIntervalId);
            clearInterval(positionIntervalId);
            pingUpdateIntervalId = textUpdateIntervalId = positionIntervalId = null;
            if (pingHud) {
                pingHud.remove();
                pingHud = null;
            }

            msTextSpan = null;
            ping = 0;
        };

        return {
            start,
            stop
        };


    })();

    /* ARMOUR VIEW  MODULE (this is not ai bruh its just so its more clean) */
    const armorDisplayModule = (function() {
        const ARMOR_IMG_URL = 'https://i.postimg.cc/5t7RH0NN/Untitledyjffggggg.png';
        const ARMOR_INDEXES = [46, 47, 48, 49, 50];
        let displayBox = null;
        let overrideStyleSheet = null;
        let updateIntervalId = null;

        const setStyles = (element, styles) => {
            Object.assign(element.style, styles);
        };

        const getSettings = () => {
            const savedData = JSON.parse(localStorage.getItem(storageKey)) || {};
            const savedSettings = savedData['Armour View']?.settings || {};
            return {
                scale: savedSettings.armourview_scale !== undefined ? savedSettings.armourview_scale : 1.0,
                orientation: savedSettings.armourview_orientation || 'Horizontal'
            };
        };

        const injectOverrideCSS = () => {
            if (overrideStyleSheet) return;
            overrideStyleSheet = document.createElement('style');
            overrideStyleSheet.innerHTML = `
                .InvenItem.inven-item-clone {
                    background: none !important;
                    background-color: transparent !important;
                    border: none !important;
                    outline: none !important;
                    background-image: none !important;
                }
            `;
            document.head.appendChild(overrideStyleSheet);
        };

        const createDisplayBox = () => {
            displayBox = document.createElement('div');
            const initialStyles = {
                position: 'fixed', zIndex: '0.5', display: 'flex', padding: '5px',
                backgroundColor: 'transparent', pointerEvents: 'none'
            };

            Object.assign(initialStyles, {
                bottom: '20px',
                right: '20px',
                transformOrigin: 'bottom right'
            });

            setStyles(displayBox, initialStyles);
            ClientHud.appendChild(displayBox);
        };

        const applyStylesFromSettings = () => {
            if (!displayBox) return;
            const settings = getSettings();

            if (settings.orientation === 'Horizontal') {
                setStyles(displayBox, { flexDirection: 'row', width: 'auto', height: '60px', alignItems: 'center' });
            } else {
                setStyles(displayBox, { flexDirection: 'column', width: '60px', height: 'auto', alignItems: 'center' });
            }
            displayBox.style.transform = `scale(${settings.scale})`;
        };

        const updateItems = () => {
            if (!displayBox) return;
            applyStylesFromSettings();
            displayBox.querySelectorAll('.inven-item-clone').forEach(item => item.remove());
            ARMOR_INDEXES.forEach(idx => {
                const originalItem = document.querySelector(`.InvenItem[data-inven-idx="${idx}"]`);
                if (!originalItem) return;
                const clone = originalItem.cloneNode(true);
                clone.className = 'InvenItem inven-item-clone';
                clone.removeAttribute('id');
                setStyles(clone, { backgroundColor: 'transparent', border: 'none', marginBottom: '-7px', transform: 'scale(1.0)' });
                const unfilledSlot = clone.querySelector('.InvenItemUnfilled');
                if (unfilledSlot) {
                    unfilledSlot.style.backgroundImage = `url("${ARMOR_IMG_URL}")`;
                }
                displayBox.appendChild(clone);
            });
        };

        const start = () => {
            if (displayBox) return;
            injectOverrideCSS();
            createDisplayBox();
            updateItems();
            updateIntervalId = setInterval(updateItems, 500);
        };

        const stop = () => {
            clearInterval(updateIntervalId);
            updateIntervalId = null;
            if (displayBox) {
                displayBox.remove();
                displayBox = null;
            }
            if (overrideStyleSheet) {
                overrideStyleSheet.remove();
                overrideStyleSheet = null;
            }
        };

        return {
            start,
            stop,
        };
    })();


    /* KEYSTROKES MODULE (this is not ai bruh its just so its more clean) */
    const keystrokesModule = (function () {
        let keystrokesHud = null;
        let keyElements = {};
        let keyDownListener = null;
        let keyUpListener = null;
        let mouseDownListener = null;
        let mouseUpListener = null;

        const createKey = (label, width = 60, height = 60) => {
            const key = document.createElement("div");
            key.innerText = label;
            key.style.width = `${width}px`;
            key.style.height = `${height}px`;
            key.style.display = "flex";
            key.style.alignItems = "center";
            key.style.justifyContent = "center";
            key.style.borderRadius = '2px';
            key.style.background = "rgba(0,0,0,0.6)";
            key.style.color = "#fff";
            key.style.fontSize = "20px";
            key.style.fontWeight = "500";
            key.style.transition = "0.05s";
            return key;
        };

        const setPressed = (name, pressed) => {
            const key = keyElements[name];
            if (!key) return;

            key.style.background = pressed ? "rgba(169, 45, 54, 0.6)": "rgba(0,0,0,0.6)";
        };

        const start = () => {
            if (keystrokesHud) return;

            keystrokesHud = document.createElement("div");
            keystrokesHud.style.position = "fixed";
            keystrokesHud.style.bottom = "65px";
            keystrokesHud.style.left = "20px";
            keystrokesHud.style.display = "flex";
            keystrokesHud.style.flexDirection = "column";
            keystrokesHud.style.gap = "4px";
            keystrokesHud.style.transform = 'scale(1.0)';
            keystrokesHud.style.zIndex = "1000";
            keystrokesHud.style.pointerEvents = "none";

            const row1 = document.createElement("div");
            row1.style.display = "flex";
            row1.style.justifyContent = "center";

            keyElements.W = createKey("W");
            row1.appendChild(keyElements.W);

            const row2 = document.createElement("div");
            row2.style.display = "flex";
            row2.style.gap = "4px";

            keyElements.A = createKey("A");
            keyElements.S = createKey("S");
            keyElements.D = createKey("D");

            row2.append(
                keyElements.A,
                keyElements.S,
                keyElements.D
            );

            const row3 = document.createElement("div");
            row3.style.display = "flex";
            row3.style.justifyContent = "center";

            keyElements.Space = createKey("───", 188, 30);
            row3.appendChild(keyElements.Space);

            const row4 = document.createElement("div");
            row4.style.display = "flex";
            row4.style.gap = "4px";

            keyElements.LMB = createKey("LMB", 92, 60);
            keyElements.RMB = createKey("RMB", 92, 60);

            row4.append(
                keyElements.LMB,
                keyElements.RMB
            );

            keystrokesHud.append(
                row1,
                row2,
                row4,
                row3
            );

            ClientHud.appendChild(keystrokesHud);

            keyDownListener = (e) => {
                switch (e.code) {
                    case "KeyW":
                        setPressed("W", true);
                        break;
                    case "KeyA":
                        setPressed("A", true);
                        break;
                    case "KeyS":
                        setPressed("S", true);
                        break;
                    case "KeyD":
                        setPressed("D", true);
                        break;
                    case "Space":
                        setPressed("Space", true);
                        break;
                }
            };

            keyUpListener = (e) => {
                switch (e.code) {
                    case "KeyW":
                        setPressed("W", false);
                        break;
                    case "KeyA":
                        setPressed("A", false);
                        break;
                    case "KeyS":
                        setPressed("S", false);
                        break;
                    case "KeyD":
                        setPressed("D", false);
                        break;
                    case "Space":
                        setPressed("Space", false);
                        break;
                }
            };

            mouseDownListener = (e) => {
                if (e.button === 0) setPressed("LMB", true);
                if (e.button === 2) setPressed("RMB", true);
            };

            mouseUpListener = (e) => {
                if (e.button === 0) setPressed("LMB", false);
                if (e.button === 2) setPressed("RMB", false);
            };

            document.addEventListener("keydown", keyDownListener);
            document.addEventListener("keyup", keyUpListener);
            document.addEventListener("mousedown", mouseDownListener);
            document.addEventListener("mouseup", mouseUpListener);
        };

        const stop = () => {
            document.removeEventListener("keydown", keyDownListener);
            document.removeEventListener("keyup", keyUpListener);
            document.removeEventListener("mousedown", mouseDownListener);
            document.removeEventListener("mouseup", mouseUpListener);

            keyDownListener = null;
            keyUpListener = null;
            mouseDownListener = null;
            mouseUpListener = null;

            if (keystrokesHud) {
                keystrokesHud.remove();
                keystrokesHud = null;
            }

            keyElements = {};
        };

        return {
            start,
            stop
        };
    })();

    const deathinfoModule = (function () {
        let ResSearchIntervalId = null;
        let coordsNoti = 'nah';

        const setLastDeath = (x, y, z) => {
            saveSetting('Death Info','last_death',`X: ${x} Y: ${y} Z: ${z}`);
        };

        const start = () => {
            coordsEnabled = true;

            const ResScreenSearch = () => {
                const element = document.querySelector(".RespawnBackgroundScreen");
                if (element && element.parentElement) {
                    if (getComputedStyle(element.parentElement).opacity === "1") {
                        console.log(coordsNoti);
                        if (coords.length === 3 && coordsNoti === 'nah') {
                            const [x, y, z] = coords;
                            coordsNoti = 'done';
                            setLastDeath(x, y, z);
                            setTimeout(() => {
                                Notification.style.display = 'block';
                                Notification.style.opacity = '1';
                                Notification.innerHTML = `You <span style="color: red; font-weight: bolder;">Died</span> at X: <span style="color:#5865F2; font-weight:bold;">${x}</span> Y: <span style="color:#5865F2; font-weight:bold;">${y}</span> Z: <span style="color:#5865F2; font-weight:bold;">${z}</span> <span style="opacity:0.7; font-size: smaller ;">(saved in mod settings too)</span>`;
                                setTimeout(() => {
                                    Notification.style.opacity = '0';
                                    setTimeout(() => {
                                        Notification.style.display = 'none';
                                        coordsNoti = 'nah';
                                    }, 500);
                                }, 7000);
                            }, 5000);
                        }
                    }
                }
            };


            ResSearchIntervalId = setInterval(ResScreenSearch, 4500);
        };


        const stop = () => {
            clearInterval(ResSearchIntervalId);
            ResSearchIntervalId = null;
            coordsEnabled = false;
        };

        return {
            start,
            stop
        };
    })();

    const cinematicModule = (function () {

        let hidden = false;
        let keyListener = null;

        const GameUi = document.querySelector(".WholeAppWrapper");
        const hud = ClientHud;

        const getSettings = () => {
            const savedData = JSON.parse(localStorage.getItem(storageKey)) || {};
            const savedSettings = savedData['Cinematic Mode']?.settings || {};
            return {
                key: (savedSettings.cinematic_key || "H").toLowerCase()
            };
        };

        function toggleGameOpacity() {
            if (hud && window.getComputedStyle(hud).display !== "none") {
                if (!GameUi) return;

                hidden = !hidden;

                GameUi.style.transition = "opacity 0.2s ease";
                GameUi.style.opacity = hidden ? "0" : "1";
                hud.style.transition = "opacity 0.2s ease";
                hud.style.opacity = hidden ? "0" : "1";
            };
        }

        const start = () => {
            if (keyListener) return;

            const ActionKey = getSettings().key;

            keyListener = (e) => {
                if (e.key && e.key.toLowerCase() === ActionKey) {
                    toggleGameOpacity();
                }
            };

            document.addEventListener("keydown", keyListener);
        };

        const stop = () => {
            if (keyListener) {
                document.removeEventListener("keydown", keyListener);
                keyListener = null;
            }

            hidden = false;


            if (GameUi) GameUi.style.opacity = "1";
            if (hud) hud.style.opacity = "1";
        };

        return {
            start,
            stop
        };

    })();
})();
