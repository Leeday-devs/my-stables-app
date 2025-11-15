const fs = require('fs');
const path = require('path');

// Create a simple SVG icon with horse head motif
const createIconSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#8b6c4c" rx="${size * 0.15}"/>

  <!-- Horse Head Icon (Centered) -->
  <g transform="translate(${size * 0.5}, ${size * 0.5}) scale(${size * 0.004})">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          fill="white"
          transform="translate(-12, -12) scale(8)"/>
  </g>

  <!-- Decorative Horseshoe (top) -->
  <path d="M ${size * 0.3} ${size * 0.2} Q ${size * 0.5} ${size * 0.15}, ${size * 0.7} ${size * 0.2}"
        stroke="white"
        stroke-width="${size * 0.02}"
        fill="none"
        opacity="0.3"/>

  <!-- Text -->
  <text x="${size * 0.5}"
        y="${size * 0.75}"
        font-family="serif"
        font-size="${size * 0.15}"
        font-weight="bold"
        fill="white"
        text-anchor="middle">MS</text>
</svg>`;

const sizes = [192, 512];
const publicDir = path.join(__dirname, '..', 'public');

sizes.forEach(size => {
  const svg = createIconSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(publicDir, filename);

  fs.writeFileSync(filepath, svg);
  console.log(`✓ Created ${filename}`);
});

console.log('\n✓ Icon generation complete!');
console.log('\nNote: SVG icons created. For production, consider converting to PNG using:');
console.log('- Online tools like CloudConvert');
console.log('- Or install sharp: npm install -D sharp');
