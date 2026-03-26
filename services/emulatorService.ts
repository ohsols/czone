import { Game } from '../types';

const SYSTEM_TO_CORE: Record<string, string> = {
  'N64': 'n64',
  'Genesis': 'segaMD',
  'PS1': 'psx',
  'GBA': 'gba',
  'NES': 'nes',
  'SNES': 'snes',
  'GG': 'segaGG',
  'Sega CD': 'segaCD',
  'Dreamcast': 'dreamcast',
  'Windows': 'dos', // Fallback or specific core
  'Web': 'web' // Not really an emulator core
};

export const getEmulatorHtml = (game: Game) => {
  const core = SYSTEM_TO_CORE[game.system] || 'nes';
  const romUrl = game.link || '';

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <style>
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
        #ejs-player { width: 100%; height: 100%; }
        ${game.system === 'N64' ? '#ejs-player { cursor: none; }' : ''}
    </style>
</head>
<body>
    <div id="ejs-player"></div>
    <script>
        window.EJS_player = '#ejs-player';
        window.EJS_gameUrl = '${romUrl}';
        window.EJS_core = '${core}';
        window.EJS_pathtodata = 'https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@latest/data/';
        window.EJS_startOnLoaded = true;
        window.EJS_gameName = '${game.title.replace(/'/g, "\\'")}';
        window.EJS_color = '#2563eb';
        window.EJS_AdUrl = '';
    </script>
    <script>
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.parent.postMessage({ type: 'EXIT_GAME' }, '*');
        }
    });
    (async function() {
        const scripts = [
            "emulator.js",
            "nipplejs.js",
            "shaders.js",
            "storage.js",
            "gamepad.js",
            "GameManager.js",
            "socket.io.min.js",
            "compression.js"
        ];

        const folderPath = (path) => path.substring(0, path.length - path.split('/').pop().length);
        let scriptPath = (typeof window.EJS_pathtodata === "string") ? window.EJS_pathtodata : folderPath((new URL(document.currentScript.src)).pathname);
        if (!scriptPath.endsWith('/')) scriptPath+='/';
        
        function loadScript(file) {
            return new Promise(function (resolve, reject) {
                let script = document.createElement('script');
                script.src = function() {
                    if ('undefined' != typeof EJS_paths && typeof EJS_paths[file] === 'string') {
                        return EJS_paths[file];
                    } else if (file.endsWith("emulator.min.js")) {
                        return scriptPath + file;
                    } else {
                        return scriptPath + "src/" + file;
                    }
                }();
                script.onload = resolve;
                script.onerror = () => {
                    filesmissing(file).then(e => resolve());
                }
                document.head.appendChild(script);
            })
        }
        function loadStyle(file) {
            return new Promise(function(resolve, reject) {
                let css = document.createElement('link');
                css.rel = 'stylesheet';
                css.href = function() {
                    if ('undefined' != typeof EJS_paths && typeof EJS_paths[file] === 'string') {
                        return EJS_paths[file];
                    } else {
                        return scriptPath+file;
                    }
                }();
                css.onload = resolve;
                css.onerror = () => {
                    filesmissing(file).then(e => resolve());
                }
                document.head.appendChild(css);
            })
        }

        async function filesmissing(file) {
            console.error("Failed to load " + file);
            let minifiedFailed = file.includes(".min.") && !file.includes("socket");
            if (minifiedFailed) {
                if (file === "emulator.min.js") {
                    for (let i=0; i<scripts.length; i++) {
                        await loadScript(scripts[i]);
                    }
                } else {
                    await loadStyle('emulator.css');
                }
            }
        }
        
        if (('undefined' != typeof EJS_DEBUG_XX && true === EJS_DEBUG_XX)) {
            for (let i=0; i<scripts.length; i++) {
                await loadScript(scripts[i]);
            }
            await loadStyle('emulator.css');
        } else {
            await loadScript('emulator.min.js');
            await loadStyle('emulator.min.css');
        }
        const config = {};
        config.gameUrl = window.EJS_gameUrl;
        config.dataPath = scriptPath;
        config.system = window.EJS_core;
        config.biosUrl = window.EJS_biosUrl;
        config.gameName = window.EJS_gameName;
        config.color = window.EJS_color;
        config.startOnLoad = window.EJS_startOnLoaded;
        
        if (typeof window.EJS_language === "string" && window.EJS_language !== "en-US") {
            try {
                let path;
                if ('undefined' != typeof EJS_paths && typeof EJS_paths[window.EJS_language] === 'string') {
                    path = EJS_paths[window.EJS_language];
                } else {
                    path = scriptPath+"localization/"+window.EJS_language+".json";
                }
                config.language = window.EJS_language;
                config.langJson = JSON.parse(await (await fetch(path)).text());
            } catch(e) {
                config.langJson = {};
            }
        }
        
        window.EJS_emulator = new EmulatorJS(window.EJS_player, config);
        window.EJS_adBlocked = (url, del) => window.EJS_emulator.adBlocked(url, del);
        if (typeof window.EJS_ready === "function") {
            window.EJS_emulator.on("ready", window.EJS_ready);
        }
        if (typeof window.EJS_onGameStart === "function") {
            window.EJS_emulator.on("start", window.EJS_onGameStart);
        }
    })();
    </script>
</body>
</html>
  `;
};
