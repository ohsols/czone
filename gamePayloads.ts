const createEmbedPayload = (title: string, url: string) => ({
    title,
    customHtml: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #000; }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>
    <iframe src="${url}" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" scrolling="no" frameborder="0"></iframe>
</body>
</html>`
});

export const GAME_PAYLOADS: Record<string, { title: string; customHtml: string }> = {
    'sonic-1-genesis': createEmbedPayload("Sonic the Hedgehog", "https://www.retrogames.cc/embed/16847-sonic-the-hedgehog-usa-europe.html"),
    'sonic-2-genesis': createEmbedPayload("Sonic the Hedgehog 2", "https://www.retrogames.cc/embed/16848-sonic-the-hedgehog-2-world.html"),
    'sonic-3-genesis': createEmbedPayload("Sonic the Hedgehog 3", "https://www.retrogames.cc/embed/16849-sonic-the-hedgehog-3-usa.html"),
    'banjo-kazooie': createEmbedPayload("Banjo-Kazooie", "https://www.retrogames.cc/embed/9831-banjo-kazooie-usa.html"),
    'banjo-tooie': createEmbedPayload("Banjo-Tooie", "https://www.retrogames.cc/embed/9833-banjo-tooie-usa.html"),
    'conkers-bad-fur-day': createEmbedPayload("Conker's Bad Fur Day", "https://www.retrogames.cc/embed/9869-conker-s-bad-fur-day-usa.html"),
    'diddy-kong-racing': createEmbedPayload("Diddy Kong Racing", "https://www.retrogames.cc/embed/9884-diddy-kong-racing-usa-v1-1.html"),
    'donkey-kong-64': createEmbedPayload("Donkey Kong 64", "https://www.retrogames.cc/embed/9895-donkey-kong-64-usa.html"),
    'f-zero-x': createEmbedPayload("F-Zero X", "https://www.retrogames.cc/embed/9909-f-zero-x-usa.html"),
    'kirby-64': createEmbedPayload("Kirby 64: The Crystal Shards", "https://www.retrogames.cc/embed/10188-kirby-64-the-crystal-shards-usa.html"),
    'pokemon-snap': createEmbedPayload("Pokemon Snap", "https://www.retrogames.cc/embed/10317-pokemon-snap-usa.html"),
    'pokemon-stadium': createEmbedPayload("Pokemon Stadium", "https://www.retrogames.cc/embed/10320-pokemon-stadium-usa.html"),
    'perfect-dark': createEmbedPayload("Perfect Dark", "https://www.retrogames.cc/embed/10303-perfect-dark-usa-v1-1.html"),
    'crash-bandicoot': createEmbedPayload("Crash Bandicoot", "https://www.retrogames.cc/embed/40149-crash-bandicoot-usa.html"),
    'metal-gear-solid': createEmbedPayload("Metal Gear Solid", "https://www.retrogames.cc/embed/40192-metal-gear-solid-usa-disc-1.html"),
    'sonic-adventure': createEmbedPayload("Sonic Adventure", "https://www.retrogames.cc/embed/42602-sonic-adventure-usa.html"),
    'doom-64': createEmbedPayload("Doom 64", "https://www.retrogames.cc/embed/10129-doom-64-usa.html"),
    'goldeneye-007': createEmbedPayload("Goldeneye 007", "https://www.retrogames.cc/embed/9916-goldeneye-007-usa.html"),
    'mortal-kombat-4': createEmbedPayload("Mortal Kombat 4", "https://www.retrogames.cc/embed/10255-mortal-kombat-4-usa.html"),
    'sonic-exe': {
                title: "FNF (Sonic.EXE V4)",
                customHtml: `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Game 27060</title>
	<base href="https://cdn.jsdelivr.net/gh/bubbls/fnf-mods@main/sonic-exe-4/">
	<meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<meta name="apple-mobile-web-app-capable" content="yes">
	<link rel="shortcut icon" type="image/png" href="./favicon.png">
	<link rel="canonical" href="https://game3.glov3.me/uploads/game/html5/27060/" />
	<script type="text/javascript" src="./PsychEngine.js"><\/script>
	<script>
		window.addEventListener ("touchmove", function (event) { event.preventDefault (); }, { capture: false, passive: false });
		if (typeof window.devicePixelRatio != 'undefined' && window.devicePixelRatio > 2) {
			var meta = document.getElementById ("viewport");
			meta.setAttribute ('content', 'width=device-width, initial-scale=' + (2 / window.devicePixelRatio) + ', user-scalable=no');
		}
		window.addEventListener("keydown", function(e) {if(["Tab","Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {e.preventDefault(); }}, false);
	<\/script>
	<style>
		html,body { margin: 0; padding: 0; height: 100%; overflow: hidden; }
		#openfl-content { background: #000000; width: 100%; height: 100%; }
		@font-face { font-family: 'EurostileTBla'; src: url('assets/fonts/EurostileTBla.ttf') format('truetype'); font-weight: normal; font-style: normal; }
		@font-face { font-family: 'Impact'; src: url('assets/fonts/impact.ttf') format('truetype'); font-weight: normal; font-style: normal; }
		@font-face { font-family: 'Pixel Arial 11 Bold'; src: url('assets/fonts/pixel.otf') format('truetype'); font-weight: normal; font-style: normal; }
		@font-face { font-family: 'Sonic CD Menu Font Regular'; src: url('assets/fonts/sonic-cd-menu-font.ttf') format('truetype'); font-weight: normal; font-style: normal; }
		@font-face { font-family: 'Tahoma Bold'; src: url('assets/fonts/tahoma-bold.ttf') format('truetype'); font-weight: normal; font-style: normal; }
		@font-face { font-family: 'VCR OSD Mono'; src: url('assets/fonts/vcr.ttf') format('truetype'); font-weight: normal; font-style: normal; }
	</style>
</head>
<body>
	<noscript>This webpage makes extensive use of JavaScript. Please enable JavaScript in your web browser to view this page.<\/noscript>
	<div id="openfl-content"><\/div>
	<script type="text/javascript">
		lime.embed ("PsychEngine", "openfl-content", 1280, 720, { parameters: {} });
	<\/script>
</body>
</html>`
            },
            'mindwave': {
                title: "Mindwave",
                customHtml: `<!DOCTYPE html>
<html lang="en-us">
  <head>
    <base href="https://cdn.jsdelivr.net/gh/web-ports/mindwave@latest/">
    <meta charset="utf-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
    <title>GXC Game</title>
    <link rel="stylesheet" href="style.css">
  </head>

  <body>
    <canvas
      class="emscripten"
      id="canvas"
      oncontextmenu="event.preventDefault()"
      tabindex="-1"
    >
    </canvas>
    <script>
      let doneparts = 0;
      function mergeFiles(fileParts) {
      return new Promise((resolve, reject) => {
          let buffers = [];

          function fetchPart(index) {
              if (index >= fileParts.length) {
                  let mergedBlob = new Blob(buffers);
                  let mergedFileUrl = URL.createObjectURL(mergedBlob);
                  resolve(mergedFileUrl);
                  return;
              }
              fetch(fileParts[index]).then((response) => response.arrayBuffer()).then((data) => {
                  buffers.push(data);
                  doneparts = doneparts+1;
                  fetchPart(index + 1);
              }).catch(reject);
          }
          fetchPart(0);
      });
  }
  function getParts(file, start, end) {
      let parts = [];
      for (let i = start; i <= end; i++) {
          parts.push(file + ".part" + i);
      }
      return parts;
  }
          Promise.all([
            mergeFiles(getParts("game.unx", 1, 17)),
        ]).then(([gameunx]) => {
      window.gameUnxUrl = gameunx;

      const originalFetch = window.fetch;
      window.fetch = async function (input, init) {
        let urlString;

        if (input instanceof Request) {
          urlString = input.url;
        } else {
          urlString = String(input);
        }

        if (urlString.includes("game.unx")) {
          if (input instanceof Request) {
              input = new Request(window.gameUnxUrl, input);
          } else {
              input = window.gameUnxUrl;
          }
        }

        return originalFetch(input, init);
      };

      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function (method, url, ...rest) {
          if (url.includes("game.unx")) {
              url = window.gameUnxUrl;
          }
          return originalOpen.call(this, method, url, ...rest);
      };

      let tickworkerreal = document.createElement("script");
      tickworkerreal.src = "realtickworker.js";
      tickworkerreal.type = "javascript/worker";
      tickworkerreal.id = "tick-worker";
      document.body.appendChild(tickworkerreal);

      let tickworker = document.createElement("script");
      tickworker.src = "tickworker.js";
      document.body.appendChild(tickworker);

      let index = document.createElement("script");
      index.src = "index.js";
      document.body.appendChild(index);

      let runner = document.createElement("script");
      runner.src = "runner.js";
      document.body.appendChild(runner);
        });
    <\/script>
  </body>
</html>`
            }
};
