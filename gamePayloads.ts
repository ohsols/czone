export const GAME_PAYLOADS: Record<string, { title: string; customHtml: string }> = {
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
	<script type="text/javascript" src="./PsychEngine.js"></script>
	<script>
		window.addEventListener ("touchmove", function (event) { event.preventDefault (); }, { capture: false, passive: false });
		if (typeof window.devicePixelRatio != 'undefined' && window.devicePixelRatio > 2) {
			var meta = document.getElementById ("viewport");
			meta.setAttribute ('content', 'width=device-width, initial-scale=' + (2 / window.devicePixelRatio) + ', user-scalable=no');
		}
		window.addEventListener("keydown", function(e) {if(["Tab","Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {e.preventDefault(); }}, false);
	</script>
	<style>
		html,body { margin: 0; padding: 0; height: 100%; overflow: hidden; }
		#openfl-content { background: #000000; width: 100%; height: 100%; }
		@font-face { font-family: 'EurostileTBla'; src: url('assets/fonts/EurostileTBla.ttf') format('truetype'); font-weight: normal; font-style: normal; }
		@font-face { font-family: 'Impact'; src: url('assets/fonts/impact.ttf') format('truetype'); font-weight: normal; font-style: normal; }
		@font-face { font-family: 'Pixel Arial 11 Bold'; src: url('assets/fonts/pixel.otf') format('truetype'); font-weight: normal; font-style: normal; }
		@font-face { font-family: 'Sonic CD Menu Font Regular'; src: url('assets/fonts/sonic-cd-menu-font.ttf') format('truetype'); font-weight: normal; font-style: normal; }
		@font-face { font-family: 'Tahoma Bold'; src: url('assets/fonts/tahoma-bold.ttf') format('truetype'); font-weight: normal; font-style: normal; }
		@font-face { font-family: 'VCR OSD Mono'; src: url('assets/fonts/vcr.ttf') format('truetype'); font-weight: normal; font-style: normal; }
		@font-face { font-family: 'Nokia Cellphone FC Small'; src: url('flixel/fonts/nokiafc22.ttf') format('truetype'); font-weight: normal; font-style: normal; }
		@font-face { font-family: 'Monsterrat'; src: url('flixel/fonts/monsterrat.ttf') format('truetype'); font-weight: normal; font-style: normal; }
	</style>
</head>
<body>
	<noscript>This webpage makes extensive use of JavaScript. Please enable JavaScript in your web browser to view this page.</noscript>
	<div id="openfl-content"></div>
	<script type="text/javascript">
		lime.embed ("PsychEngine", "openfl-content", 1280, 720, { parameters: {} });
	</script>
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
    <div id="loading-text" style="color: white; font-size: 48px; font-family: cursive; text-align: center; margin-top: 20px;"> LOADING... </div>
    <canvas
      class="emscripten"
      id="canvas"
      oncontextmenu="event.preventDefault()"
      tabindex="-1"
    >
    </canvas>
    <div id="pauseMenuContainer" hidden>
      <div id="pauseMenuBorder">
        <div id="pauseMenu">
          <button id="resumeButton" onclick="resume()">
            Resume
          </button>
          <button id="quitButton" onclick="quitIfSupported()">
            Quit
          </button>
        </div>
        </div>
    </div>
    <div class="loading">
      <div class="spinner" id="spinner"></div>
      <div class="emscripten" id="status">Downloading...</div>

      <progress value="0" max="100" id="progress" hidden="1"></progress>
      <img id="QRCode" class="qrCode" src="runner.svg" alt="URL QR Code" hidden="1"></img>`
            }
};
