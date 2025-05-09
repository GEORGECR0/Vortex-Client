const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    loadUrl: (url) => ipcRenderer.send('load-url', url)
});



window.addEventListener('DOMContentLoaded', () => {

    (function () {
        'use strict';

        const waitForElement = (selector, callback) => {
            const el = document.querySelector(selector);
            if (el) return callback(el);
            setTimeout(() => waitForElement(selector, callback), 100);
        };

        waitForElement('.WholeAppWrapper', (gameui) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css';
            document.head.appendChild(link);

            gameui.style.display = 'block';
            gameui.style.filter = 'grayscale(0%) brightness(1)';
            gameui.style.transition = 'all 0.2s ease';

            const hud = document.createElement('div');
            hud.style.position = 'fixed';
            hud.style.top = '0';
            hud.style.left = '0';
            hud.style.width = '100%';
            hud.style.height = '100%';
            hud.style.zIndex = '999999';
            hud.style.backgroundColor = 'transparent';
            hud.style.pointerEvents = 'none';
            hud.style.backdropFilter = 'blur(0px)';
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
            menu.style.display = 'none';
            menu.style.flexDirection = 'column';
            menu.style.justifyContent = 'center';
            menu.style.alignItems = 'center';
            menu.style.backgroundImage = 'url(https://i.postimg.cc/fyR7DMPB/Vortex-Client-png.png)';
            menu.style.backgroundRepeat = 'no-repeat';
            menu.style.backgroundSize = '265px 230px';
            menu.style.backgroundPosition = 'center calc(50% - 70px)';
            hud.appendChild(menu);

            const mainMenuScreen = document.createElement('div');
            mainMenuScreen.style.position = 'fixed';
            mainMenuScreen.style.top = '0';
            mainMenuScreen.style.left = '0';
            mainMenuScreen.style.width = '100%';
            mainMenuScreen.style.height = '100%';
            mainMenuScreen.style.zIndex = '999998';
            mainMenuScreen.style.display = 'none';
            mainMenuScreen.style.backgroundColor = 'transparent';
            hud.appendChild(mainMenuScreen);

            const mainMenuCon = document.createElement('div');
            mainMenuCon.style.width = '55vw';
            mainMenuCon.style.height = '65vh';
            mainMenuCon.style.position = 'fixed';
            mainMenuCon.style.top = '50%';
            mainMenuCon.style.left = '50%';
            mainMenuCon.style.transform = 'translate(-50%, -50%)';
            mainMenuCon.style.display = 'flex';
            mainMenuCon.style.flexDirection = 'column';
            mainMenuCon.style.justifyContent = 'center';
            mainMenuCon.style.alignItems = 'center';
            mainMenuCon.style.maxWidth = '1200px';
            mainMenuCon.style.maxHeight = '800px';
            mainMenuCon.style.minWidth = '900px';
            mainMenuCon.style.minHeight = '700px';
            mainMenuScreen.appendChild(mainMenuCon);

            const OptionsBtnCon = document.createElement('div');
            OptionsBtnCon.style.width = '100%';
            OptionsBtnCon.style.height = '3vh';
            OptionsBtnCon.style.maxHeight = '60px';
            OptionsBtnCon.style.minHeight = '60px';
            OptionsBtnCon.style.zIndex = '530';
            OptionsBtnCon.style.display = 'flex';
            OptionsBtnCon.style.flexDirection = 'row';
            OptionsBtnCon.style.justifyContent = 'space-between';
            OptionsBtnCon.style.backgroundColor = 'transparent';
            OptionsBtnCon.style.marginBottom = '10px';
            mainMenuCon.appendChild(OptionsBtnCon);

            const mainMenu = document.createElement('div');
            mainMenu.style.width = '100%';
            mainMenu.style.height = '55vh';
            mainMenu.style.zIndex = '520';
            mainMenu.style.backdropFilter = 'blur(0.45rem)';
            mainMenu.style.backgroundImage = 'url(https://i.postimg.cc/Dw856D97/download.png), linear-gradient(45deg, rgba(0, 4, 9, 1) 40%, rgba(14, 14, 19, 1) 100%)';
            mainMenu.style.backgroundSize = '100px, cover';
            mainMenu.style.backgroundPosition = 'center, 0% 0%';
            mainMenu.style.backgroundRepeat = 'repeat, repeat';
            mainMenu.style.borderRadius = '1rem';
            mainMenu.style.display = 'flex';
            mainMenu.style.justifyContent = 'center';
            mainMenu.style.alignItems = 'center';
            mainMenu.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            mainMenu.style.maxHeight = '650px';
            mainMenu.style.minHeight = '600px';
            mainMenuCon.appendChild(mainMenu);

            const modMenu = document.createElement('div');
            modMenu.style.width = '100%';
            modMenu.style.height = '100%';
            modMenu.style.display = 'flex';
            modMenu.style.flexDirection = 'column';
            modMenu.style.justifyContent = 'flex-start';
            modMenu.style.alignItems = 'center';
            mainMenu.appendChild(modMenu);

            const topBar = document.createElement('div');
            topBar.style.width = '95%';
            topBar.style.height = '7%';
            topBar.style.display = 'flex';
            topBar.style.flexDirection = 'row';
            topBar.style.justifyContent = 'space-between';
            topBar.style.alignItems = 'center';
            topBar.style.padding = '10px';
            modMenu.appendChild(topBar);

            const categoriesContainer = document.createElement('div');
            categoriesContainer.style.width = '70%';
            categoriesContainer.style.height = '100%';
            categoriesContainer.style.display = 'flex';
            categoriesContainer.style.justifyContent = 'flex-start';
            categoriesContainer.style.alignItems = 'center';
            categoriesContainer.style.gap = '10px';
            topBar.appendChild(categoriesContainer);

            const searchContainer = document.createElement('div');
            searchContainer.style.width = '30%';
            searchContainer.style.height = '100%';
            searchContainer.style.display = 'flex';
            searchContainer.style.justifyContent = 'flex-end';
            searchContainer.style.alignItems = 'center';
            topBar.appendChild(searchContainer);

            const searchBar = document.createElement('input');
            searchBar.type = 'text';
            searchBar.placeholder = 'Search...';
            searchBar.style.width = '80%';
            searchBar.style.height = '30px';
            searchBar.style.padding = '0 15px';
            searchBar.style.borderRadius = '15px';
            searchBar.style.border = '2px solid rgba(255, 255, 255, 0.1)';
            searchBar.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
            searchBar.style.color = 'white';
            searchBar.style.fontSize = '14px';
            searchBar.style.outline = 'none';
            searchBar.style.transition = 'all 0.3s ease';
            searchContainer.appendChild(searchBar);

            const categories = ['All', 'New', 'Hud', 'Pvp'];
            categories.forEach(category => {
                const categoryBtn = document.createElement('button');
                categoryBtn.textContent = category;
                categoryBtn.style.padding = '8px 20px';
                categoryBtn.style.borderRadius = '0.5rem';
                categoryBtn.style.border = 'none';
                categoryBtn.style.backgroundImage = 'linear-gradient(45deg, rgba(0, 4, 9, 1) 40%, rgba(14, 14, 19, 1) 100%)';
                categoryBtn.style.backgroundSize = 'cover';
                categoryBtn.style.backgroundPosition = '0% 0%';
                categoryBtn.style.backgroundColor = 'transparent';
                categoryBtn.style.color = 'white';
                categoryBtn.style.fontSize = '14px';
                categoryBtn.style.cursor = 'pointer';
                categoryBtn.style.transition = 'all 0.3s ease';
                categoryBtn.style.overflow = 'hidden';
                categoryBtn.style.position = 'relative';
                categoryBtn.style.zIndex = '1';
                
                categoryBtn.addEventListener('mouseover', () => {
                    categoryBtn.style.transition = 'all 0.3s ease';
                    categoryBtn.style.backgroundImage = 'linear-gradient(45deg, rgba(110, 40, 40, 1) 40%, rgba(124, 54, 59, 0.99) 100%)';
                    categoryBtn.style.boxShadow = '0px 0px 29px 0px rgb(110, 40, 40)';
                });
                
                categoryBtn.addEventListener('mouseout', () => {
                    categoryBtn.style.transition = 'none';
                    categoryBtn.style.backgroundImage = 'linear-gradient(45deg, rgba(0, 4, 9, 1) 40%, rgba(14, 14, 19, 1) 100%)';
                    categoryBtn.style.boxShadow = 'none';
                });

                categoriesContainer.appendChild(categoryBtn);
            });

            const modBoxContainer = document.createElement('div');
            modBoxContainer.style.width = '95%';
            modBoxContainer.style.height = '93%';
            modBoxContainer.style.display = 'grid';
            modBoxContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
            modBoxContainer.style.gap = '20px';
            modBoxContainer.style.padding = '0 20px 20px 20px';
            modBoxContainer.style.overflowY = 'auto';
            modMenu.appendChild(modBoxContainer);

            const createModBox = (title, iconUrl) => {
                const modBox = document.createElement('div');
                modBox.style.width = '90%';
                modBox.style.height = '200px';
                modBox.style.backgroundImage = 'linear-gradient(45deg, rgba(0, 4, 9, 0.6) 40%, rgba(14, 14, 19, 0.6) 100%)';
                modBox.style.borderRadius = '1rem';
                modBox.style.display = 'flex';
                modBox.style.flexDirection = 'column';
                modBox.style.alignItems = 'center';
                modBox.style.padding = '10px';
                modBox.style.position = 'relative';
                modBox.style.overflow = 'hidden';
                
                const borderGradient = document.createElement('div');
                borderGradient.style.position = 'absolute';
                borderGradient.style.top = '0';
                borderGradient.style.left = '0';
                borderGradient.style.right = '0';
                borderGradient.style.bottom = '0';
                borderGradient.style.padding = '4px';
                borderGradient.style.borderRadius = '1rem';
                borderGradient.style.background = 'linear-gradient(45deg, rgba(14, 14, 19, 1) 0%, transparent 50%, rgba(14, 14, 19, 1) 100%)';
                borderGradient.style.mask = 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)';
                borderGradient.style.maskComposite = 'exclude';
                borderGradient.style.zIndex = '-1';
                modBox.appendChild(borderGradient);

                const titleElement = document.createElement('div');
                titleElement.textContent = title;
                titleElement.style.color = 'white';
                titleElement.style.fontSize = '16px';
                titleElement.style.fontWeight = '400';
                titleElement.style.marginBottom = '10px';
                titleElement.style.fontFamily = "'Inter', sans-serif";
                modBox.appendChild(titleElement);

                const iconElement = document.createElement('img');
                iconElement.src = iconUrl;
                iconElement.style.width = '80px';
                iconElement.style.height = '80px';
                iconElement.style.objectFit = 'contain';
                iconElement.style.marginBottom = '10px';
                modBox.appendChild(iconElement);

                const buttonContainer = document.createElement('div');
                buttonContainer.style.width = '100%';
                buttonContainer.style.display = 'flex';
                buttonContainer.style.justifyContent = 'center';
                buttonContainer.style.gap = '10px';
                buttonContainer.style.marginTop = 'auto';
                modBox.appendChild(buttonContainer);

                return modBox;
            };

            const mods = [
                { id: 1, title: "MOD TITLE", icon: "https://i.postimg.cc/rpyVVM4G/Armor-View.png", category: "New" },
                { id: 2, title: "MOD TITLE", icon: "https://i.postimg.cc/rpyVVM4G/Armor-View.png", category: "New" },
                { id: 3, title: "MOD TITLE", icon: "https://i.postimg.cc/rpyVVM4G/Armor-View.png", category: "Hud" },
                { id: 4, title: "MOD TITLE", icon: "https://i.postimg.cc/rpyVVM4G/Armor-View.png", category: "Hud" },
                { id: 5, title: "MOD TITLE", icon: "https://i.postimg.cc/rpyVVM4G/Armor-View.png", category: "Pvp" },
                { id: 6, title: "MOD TITLE", icon: "https://i.postimg.cc/rpyVVM4G/Armor-View.png", category: "Pvp" },
                { id: 7, title: "MOD TITLE", icon: "https://i.postimg.cc/rpyVVM4G/Armor-View.png", category: "Pvp" },
                { id: 8, title: "MOD TITLE", icon: "https://i.postimg.cc/rpyVVM4G/Armor-View.png", category: "Pvp" },
                { id: 9, title: "MOD TITLE", icon: "https://i.postimg.cc/rpyVVM4G/Armor-View.png", category: "New" },
                { id: 10, title: "MOD TITLE", icon: "https://i.postimg.cc/rpyVVM4G/Armor-View.png", category: "New" },
                { id: 11, title: "MOD TITLE", icon: "https://i.postimg.cc/rpyVVM4G/Armor-View.png", category: "Hud" },
                { id: 12, title: "MOD TITLE", icon: "https://i.postimg.cc/rpyVVM4G/Armor-View.png", category: "Hud" },
                { id: 13, title: "MOD TITLE", icon: "https://i.postimg.cc/rpyVVM4G/Armor-View.png", category: "Pvp" },
                { id: 14, title: "MOD TITLE", icon: "https://i.postimg.cc/rpyVVM4G/Armor-View.png", category: "Pvp" },
                { id: 15, title: "MOD TITLE", icon: "https://i.postimg.cc/rpyVVM4G/Armor-View.png", category: "Pvp" } 
            ];

            let currentCategory = 'All';
            let currentSearch = '';

            const updateModDisplay = () => {
                modBoxContainer.innerHTML = '';

                const filteredMods = mods.filter(mod => {
                    const matchesCategory = currentCategory === 'All' || mod.category === currentCategory;
                    const matchesSearch = currentSearch === '' || 
                        mod.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
                        mod.id.toString().includes(currentSearch);
                    return matchesCategory && matchesSearch;
                });

                filteredMods.forEach(mod => {
                    const modBox = createModBox(
                        mod.title,
                        mod.icon
                    );
                    modBoxContainer.appendChild(modBox);
                });
            };

            searchBar.addEventListener('input', (e) => {
                currentSearch = e.target.value;
                updateModDisplay();
            });

            const categoryButtons = categoriesContainer.querySelectorAll('button');
            categoryButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    categoryButtons.forEach(b => b.style.backgroundColor = 'transparent');
                    btn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    currentCategory = btn.textContent;
                    updateModDisplay();
                });
            });

            updateModDisplay();

            const settingsMenu = document.createElement('div');
            settingsMenu.style.width = '100%';
            settingsMenu.style.height = '100%';
            settingsMenu.style.display = 'none';
            settingsMenu.style.flexDirection = 'column';
            settingsMenu.style.justifyContent = 'center';
            settingsMenu.style.alignItems = 'center';
            mainMenu.appendChild(settingsMenu);

            const socialMenu = document.createElement('div');
            socialMenu.style.width = '100%';
            socialMenu.style.height = '100%';
            socialMenu.style.display = 'none';
            socialMenu.style.flexDirection = 'column';
            socialMenu.style.justifyContent = 'flex-start';
            socialMenu.style.alignItems = 'center';
            socialMenu.style.padding = '20px';
            mainMenu.appendChild(socialMenu);


            const cosmeticsMenu = document.createElement('div');
            cosmeticsMenu.style.width = '100%';
            cosmeticsMenu.style.height = '100%';
            cosmeticsMenu.style.display = 'none';
            cosmeticsMenu.style.flexDirection = 'column';
            cosmeticsMenu.style.justifyContent = 'center';
            cosmeticsMenu.style.alignItems = 'center';
            mainMenu.appendChild(cosmeticsMenu);

            const graphicsMenu = document.createElement('div');
            graphicsMenu.style.width = '100%';
            graphicsMenu.style.height = '100%';
            graphicsMenu.style.display = 'none';
            graphicsMenu.style.flexDirection = 'column';
            graphicsMenu.style.justifyContent = 'center';
            graphicsMenu.style.alignItems = 'center';
            mainMenu.appendChild(graphicsMenu);

            const createStyledButton = (options = {}) => {
                const btn = document.createElement('button');
                btn.style.width = options.width || '250px';
                btn.style.height = options.height || '60px';
                btn.style.backgroundImage = 'linear-gradient(45deg, rgba(0, 4, 9, 1) 40%, rgba(14, 14, 19, 1) 100%)';
                btn.style.backgroundSize = 'cover';
                btn.style.backgroundPosition = '0% 0%';
                btn.style.border = 'none';
                btn.style.borderRadius = '0.7rem';
                btn.style.cursor = 'pointer';
                btn.style.boxShadow = 'none';
                btn.style.backgroundColor = 'transparent';
                btn.style.fontSize = options.fontSize || '16px';
                btn.style.color = 'white';
                btn.style.transition = 'all 0.3s ease';
                btn.style.overflow = 'hidden';
                btn.style.position = 'relative';
                btn.style.zIndex = '1';

                btn.addEventListener('mouseover', function () {
                    if (!btn.active) {
                        btn.style.transition = 'all 0.3s ease';
                        btn.style.backgroundImage = 'linear-gradient(45deg, rgba(110, 40, 40, 1) 40%, rgba(124, 54, 59, 0.99) 100%)';
                        btn.style.boxShadow = '0px 0px 29px 0px rgb(110, 40, 40)';
                    }
                });

                btn.addEventListener('mouseout', function () {
                    if (!btn.active) {
                        btn.style.transition = 'none';
                        btn.style.backgroundImage = 'linear-gradient(45deg, rgba(0, 4, 9, 1) 40%, rgba(14, 14, 19, 1) 100%)';
                        btn.style.boxShadow = 'none';
                    }
                });

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

            const VortexSettingsBtn = createStyledButton({
                width: '250px',
                height: '60px',
                fontSize: '16px',
                text: 'Vortex Settings'
            });
            VortexSettingsBtn.style.marginTop = '120px';
            VortexSettingsBtn.style.backgroundImage = ' linear-gradient(45deg, rgba(0, 4, 9, 1) 40%, rgba(14, 14, 19, 1) 100%)';
            VortexSettingsBtn.style.backgroundSize = 'cover, cover';
            VortexSettingsBtn.style.backgroundPosition = 'center, 0% 0%';
            VortexSettingsBtn.style.backgroundRepeat = 'repeat, repeat';
            VortexSettingsBtn.addEventListener('click', function () {
                mainMenuScreen.style.display = 'block';
                menu.style.display = 'none';
                gameui.style.display = 'none';
            });
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

            const icons = ['ri-settings-5-fill', 'ri-group-fill', 'ri-message-2-fill', 'ri-t-shirt-2-fill'];
            icons.forEach(icon => {
                const btn = createStyledButton({ html: `<i class="${icon}"></i>` });
                btn.style.backgroundImage = 'linear-gradient(45deg, rgba(0, 4, 9, 1) 40%, rgba(14, 14, 19, 1) 100%)';
                btn.style.backgroundSize = 'cover, cover';
                btn.style.backgroundPosition = 'center, 0% 0%';
                btn.style.backgroundRepeat = 'repeat, repeat';
                VortexMenuBtnDiv.appendChild(btn);
            });

            const OBtnCon = document.createElement('div');
            OBtnCon.style.width = '70%';
            OBtnCon.style.height = '100%';
            OBtnCon.style.zIndex = '540';
            OBtnCon.style.display = 'flex';
            OBtnCon.style.flexDirection = 'row';
            OBtnCon.style.alignItems = 'center';
            OBtnCon.style.backgroundColor = 'transparent';
            OBtnCon.style.gap = '20px';
            OptionsBtnCon.appendChild(OBtnCon);

            const iconsOBtnCon = [
                { icon: 'ri-terminal-window-line', label: 'Mod Menu' },
                { icon: 'ri-settings-3-line', label: 'Settings' },
                { icon: 'ri-group-line', label: 'Social' },
                { icon: 'ri-t-shirt-2-fill', label: 'Cosmetics' },
                { icon: 'ri-computer-line', label: 'Graphics' }
            ];

            let selectedBtn = null;

            const menuArray = [cosmeticsMenu];

            iconsOBtnCon.forEach((item, index) => {
                const btn = createStyledButton({
                    html: `<i class="${item.icon}"></i>`,
                    width: '55px',
                    height: '55px'
                });

                btn.style.backgroundImage = 'url(https://i.postimg.cc/Dw856D97/download.png), linear-gradient(45deg, rgba(0, 4, 9, 1) 40%, rgba(14, 14, 19, 1) 100%)';
                btn.style.backgroundSize = 'cover, cover';
                btn.style.backgroundPosition = 'center, 0% 0%';
                btn.style.backgroundRepeat = 'repeat, repeat';
                btn.addEventListener('mouseover', function () {
                    btn.style.transition = 'all 0.3s ease';
                    btn.style.backgroundImage = 'url(https://i.postimg.cc/Dw856D97/download.png), linear-gradient(45deg, rgba(110, 40, 40, 1) 40%, rgba(124, 54, 59, 0.99) 100%)';
                    btn.style.boxShadow = '0px 0px 29px 0px rgb(110, 40, 40)';
                });

                btn.addEventListener('mouseout', function () {
                    btn.style.transition = 'none';
                    btn.style.backgroundImage = 'url(https://i.postimg.cc/Dw856D97/download.png), linear-gradient(45deg, rgba(0, 4, 9, 1) 40%, rgba(14, 14, 19, 1) 100%)';
                    btn.style.boxShadow = 'none';
                });

                btn.setAttribute('data-label', item.label);

                OBtnCon.appendChild(btn);

                if (item.label === 'Mod Menu') {
                    btn.innerHTML = `<i class="${item.icon}" style="position: relative; top: 2px;"></i> ${item.label}`;
                    btn.style.width = '170px';
                    btn.classList.add('selected');
                    selectedBtn = btn;
                }

                btn.addEventListener('click', function () {
                    if (selectedBtn && selectedBtn !== btn) {
                        const prevIcon = iconsOBtnCon.find(el => el.label === selectedBtn.getAttribute('data-label')).icon;
                        selectedBtn.innerHTML = `<i class="${prevIcon}"></i>`;
                        selectedBtn.style.transition = 'width 0.5s ease';
                        selectedBtn.style.width = '55px';
                    }

                    if (selectedBtn !== btn) {
                        btn.innerHTML = `<i class="${item.icon}"></i>`;
                        btn.style.transition = 'width 0.5s ease';
                        btn.style.width = '170px';

                        setTimeout(() => {
                            btn.innerHTML = `<i class="${item.icon}" style="position: relative; top: 2px;"></i> ${item.label}`;
                        }, 500);

                        modMenu.style.display = 'none';
                        settingsMenu.style.display = 'none';
                        socialMenu.style.display = 'none';
                        cosmeticsMenu.style.display = 'none';
                        graphicsMenu.style.display = 'none';

                        switch(item.label) {
                            case 'Mod Menu':
                                modMenu.style.display = 'flex';
                                break;
                            case 'Settings':
                                settingsMenu.style.display = 'flex';
                                break;
                            case 'Social':
                                socialMenu.style.display = 'flex';
                                break;
                            case 'Cosmetics':
                                cosmeticsMenu.style.display = 'flex';
                                break;
                            case 'Graphics':
                                graphicsMenu.style.display = 'flex';
                                break;
                        }

                        selectedBtn = btn;
                    }
                });
            });

            let menuVisible = false;
            const toggleMenuKey = 'ShiftRight';

            // Add screen tools functionality
            let stream = null;
            let track = null;
            let mediaRecorder = null;
            let recordedChunks = [];
            let screenToolsVisible = false;
            let screenToolsContainer = null;

            function hideScreenTools() {
                if (screenToolsContainer) screenToolsContainer.style.display = 'none';
                screenToolsVisible = false;
                // Remove effects when hiding screen tools
                gameui.style.display = 'block';
                gameui.style.filter = 'grayscale(0%) brightness(1)';
                hud.style.backgroundColor = 'transparent';
                hud.style.backdropFilter = 'blur(0px)';
                hud.style.pointerEvents = 'none';
            }

            function showScreenTools() {
                if (screenToolsContainer) screenToolsContainer.style.display = 'flex';
                screenToolsVisible = true;
                // Apply effects when showing screen tools
                gameui.style.display = 'block';
                gameui.style.filter = 'grayscale(80%) brightness(0.6)';
                hud.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                hud.style.backdropFilter = 'blur(5px)';
                hud.style.pointerEvents = 'auto';
            }

            function toggleScreenTools() {
                if (!screenToolsContainer) createScreenTools();
                screenToolsVisible ? hideScreenTools() : showScreenTools();
            }

            function createScreenTools() {
                screenToolsContainer = document.createElement('div');
                screenToolsContainer.style.position = 'fixed';
                screenToolsContainer.style.top = '50%';
                screenToolsContainer.style.left = '50%';
                screenToolsContainer.style.transform = 'translate(-50%, -50%)';
                screenToolsContainer.style.padding = '20px';
                screenToolsContainer.style.background = 'rgba(0, 0, 0, 0.85)';
                screenToolsContainer.style.borderRadius = '16px';
                screenToolsContainer.style.zIndex = '1000001'; // Above HUD
                screenToolsContainer.style.display = 'flex';
                screenToolsContainer.style.flexDirection = 'column';
                screenToolsContainer.style.gap = '15px';
                screenToolsContainer.style.boxShadow = '0 0 20px rgba(0,0,0,0.6)';

                const startButton = createStyledButton({ text: 'Start Recording' });
                startButton.style.cursor = 'pointer';

                startButton.onclick = () => {
                    hideScreenTools();
                    setTimeout(() => {
                        if (mediaRecorder && mediaRecorder.state === 'recording') {
                            mediaRecorder.stop();
                            startButton.textContent = 'Start Recording';
                            startButton.style.backgroundImage = 'linear-gradient(45deg, rgba(0, 4, 9, 1) 40%, rgba(14, 14, 19, 1) 100%)';
                            startButton.active = false;
                            startButton.style.boxShadow = 'none';
                        } else {
                            recordedChunks = [];
                            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

                            mediaRecorder.ondataavailable = (event) => {
                                if (event.data.size > 0) recordedChunks.push(event.data);
                            };

                            mediaRecorder.onstop = () => {
                                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'vortex-recording.webm';
                                a.click();
                            };

                            mediaRecorder.start();
                            startButton.textContent = 'Stop Recording';
                            startButton.style.backgroundImage = 'linear-gradient(45deg, rgba(170, 40, 40, 1) 40%, rgba(154, 54, 59, 0.99) 100%)';
                            startButton.style.boxShadow = '0px 0px 29px 0px rgb(110, 40, 40)';
                            startButton.active = true;
                        }
                    }, 300);
                };

                screenToolsContainer.appendChild(startButton);
                document.body.appendChild(screenToolsContainer);
            }

            window.addEventListener('keydown', function (e) {
                if (e.code === toggleMenuKey) {
                    console.log('ShiftRight pressed - toggling menu');
                    menuVisible = !menuVisible;
                    menu.style.display = menuVisible ? 'flex' : 'none';
                    hud.style.backgroundColor = menuVisible ? 'rgba(0, 0, 0, 0.8)' : 'transparent';
                    hud.style.backdropFilter = menuVisible ? 'blur(5px)' : 'blur(0px)';
                    hud.style.pointerEvents = menuVisible ? 'auto' : 'none';
                    mainMenuScreen.style.display = 'none';
                    gameui.style.display = 'block';
                    gameui.style.filter = menuVisible ? 'grayscale(80%) brightness(0.6)' : 'grayscale(0%) brightness(1)';

                    if (menuVisible && document.pointerLockElement) {
                        document.exitPointerLock();
                    }
                }

                // Add K key handler for screen tools
                if (e.key.toLowerCase() === 'k') {
                    if (document.pointerLockElement) {
                        document.exitPointerLock();
                    }
                    toggleScreenTools();
                }
            });
        });
    })();
});