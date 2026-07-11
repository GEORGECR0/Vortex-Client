// ==UserScript==
// @name         Vortex Client Capes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Vortex Capes for Bloxd.io
// @author       GE0RGECR
// @match        https://*.bloxd.io/*
// @icon         https://i.postimg.cc/xT3H10rq/vorte3dmodel.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //credit to realcherryy for the icon image [ https://www.youtube.com/@RealCherryy ]
    //if you wanna steal the code just dm me in discord: [ ge0rgecr_ ]

    let ApplyCape = true;
    const capeTexture = 'https://raw.githubusercontent.com/GEORGECR0/Vortex-Client/refs/heads/main/assets/vortex/Vortex_Default_Cape_Red.png';

    function findNoa() {
        const deepFindSafe = (obj, test, seen = new Set()) => {
            if (!obj || typeof obj !== 'object' || seen.has(obj)) return null;
            seen.add(obj);
            try {
                if (test(obj)) return obj;
                for (const val of Object.values(obj)) {
                    const res = deepFindSafe(val, test, seen);
                    if (res) return res;
                }
            } catch (e) {}
        };

        let noa = null;
        const getNoa = () => {
            if (noa) return noa;
            const element = document.querySelector('div.InventoryWrapper');
            if (!element) return null;
            const fiberKey = Object.keys(element).find(k => k.startsWith('__reactFiber$'));
            if (!fiberKey) return null;
            const fiber = element[fiberKey];
            const test = (obj) => obj && obj.entities && typeof obj.entities.getState === 'function' && obj.camera;
            noa = deepFindSafe(fiber.memoizedProps, test) || deepFindSafe(fiber.memoizedState, test);
            window._noa = noa;
            return noa;
        };

        const vortex = getNoa();

        if (vortex) {
            const cape = vortex.entities.getState(1, "cape")
            ApplyCape = false;
            cape.chooseCape("super");
            const capeMesh = cape.mesh;

            const CapeMaterial = capeMesh.material;
            if (!CapeMaterial || !CapeMaterial.diffuseTexture) return;
            CapeMaterial.diffuseTexture.updateURL(capeTexture);
            CapeMaterial.diffuseTexture.hasAlpha = true;
            CapeMaterial.disableLighting = false;


            if (typeof CapeMaterial.markAsDirty === "function")
                CapeMaterial.markAsDirty();
        }
        return vortex;
    }

    function checkState() {
        const Ingame = document.querySelector(".InGameHeader");
        if (Ingame && window.getComputedStyle(Ingame).display !== "none") {if (ApplyCape){ findNoa();}} else {ApplyCape = true;}
    }
    checkState();
    setInterval(checkState, 3000);

})();
