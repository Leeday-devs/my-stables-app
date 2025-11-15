const fs = require('fs');
const path = require('path');

// For browsers with canvas support, we can convert SVG to PNG
// This script creates PNG versions using a data URL approach

const createPNGFromSVG = async () => {
  console.log('Creating PNG conversion script...\n');

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Icon Converter</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    .container { max-width: 800px; margin: 0 auto; }
    .icon-pair { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    canvas { border: 1px solid #ccc; margin: 10px; }
    button { padding: 10px 20px; margin: 5px; background: #8b6c4c; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #6d5439; }
  </style>
</head>
<body>
  <div class="container">
    <h1>My Stables - Icon Converter</h1>
    <p>Click the buttons below to download PNG versions of the app icons:</p>

    <div class="icon-pair">
      <h2>192x192 Icon</h2>
      <canvas id="canvas192" width="192" height="192"></canvas>
      <br>
      <button onclick="downloadIcon(192)">Download 192x192 PNG</button>
    </div>

    <div class="icon-pair">
      <h2>512x512 Icon</h2>
      <canvas id="canvas512" width="512" height="512"></canvas>
      <br>
      <button onclick="downloadIcon(512)">Download 512x512 PNG</button>
    </div>
  </div>

  <script>
    function createIcon(size) {
      const canvas = document.getElementById(\`canvas\${size}\`);
      const ctx = canvas.getContext('2d');

      // Background with rounded corners
      const radius = size * 0.2;
      ctx.fillStyle = '#8b6c4c';
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, radius);
      ctx.fill();

      // Decorative circle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(size * 0.5, size * 0.44, size * 0.286, 0, Math.PI * 2);
      ctx.fill();

      // Horse head (simplified)
      const scale = size / 192;
      ctx.save();
      ctx.translate(size * 0.5, size * 0.39);
      ctx.scale(scale * 2.5, scale * 2.5);
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(-8, -12);
      ctx.lineTo(-6, -8);
      ctx.lineTo(-8, -4);
      ctx.lineTo(-10, -2);
      ctx.lineTo(-12, 0);
      ctx.lineTo(-12, 4);
      ctx.lineTo(-10, 8);
      ctx.lineTo(-6, 10);
      ctx.lineTo(-2, 10);
      ctx.lineTo(2, 8);
      ctx.lineTo(4, 6);
      ctx.lineTo(6, 2);
      ctx.lineTo(8, -2);
      ctx.lineTo(8, -8);
      ctx.lineTo(6, -12);
      ctx.lineTo(4, -14);
      ctx.lineTo(0, -16);
      ctx.lineTo(-4, -16);
      ctx.lineTo(-8, -14);
      ctx.closePath();
      ctx.fill();

      // Eye
      ctx.fillStyle = '#8b6c4c';
      ctx.beginPath();
      ctx.arc(0, -6, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Ear
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-2, -14);
      ctx.lineTo(0, -18);
      ctx.lineTo(2, -14);
      ctx.stroke();

      ctx.restore();

      // Text "MS"
      ctx.fillStyle = 'white';
      ctx.font = \`bold \${size * 0.167}px serif\`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = \`\${size * 0.01}px\`;
      ctx.fillText('MS', size * 0.5, size * 0.755);

      // Horseshoe
      ctx.save();
      ctx.translate(size * 0.5, size * 0.859);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = size * 0.013;
      ctx.lineCap = 'round';
      const hs = size * 0.078;
      ctx.beginPath();
      ctx.moveTo(-hs, 0);
      ctx.quadraticCurveTo(-hs, -hs * 1.03, -hs * 0.53, -hs * 1.28);
      ctx.quadraticCurveTo(0, -hs * 1.54, hs * 0.53, -hs * 1.28);
      ctx.quadraticCurveTo(hs, -hs * 1.03, hs, 0);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(-hs * 0.8, -hs * 0.51, size * 0.0078, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hs * 0.8, -hs * 0.51, size * 0.0078, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function downloadIcon(size) {
      const canvas = document.getElementById(\`canvas\${size}\`);
      const link = document.createElement('a');
      link.download = \`icon-\${size}x\${size}.png\`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    // Create icons on page load
    createIcon(192);
    createIcon(512);
  </script>
</body>
</html>`;

  const outputPath = path.join(__dirname, '..', 'public', 'convert-icons.html');
  fs.writeFileSync(outputPath, htmlContent);

  console.log('✓ Created conversion tool at: public/convert-icons.html');
  console.log('\nTo create PNG icons:');
  console.log('1. Start your dev server: npm run dev');
  console.log('2. Open http://localhost:3000/convert-icons.html');
  console.log('3. Click the download buttons');
  console.log('4. Save the PNG files to the public/ directory');
  console.log('\nOr use an online converter like:');
  console.log('- https://cloudconvert.com/svg-to-png');
  console.log('- https://svgtopng.com/');
};

createPNGFromSVG();
