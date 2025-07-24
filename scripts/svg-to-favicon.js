const fs = require('fs');
const sharp = require('sharp');
const svg2img = require('svg2img');

const svgPath = 'public/logo-lightning.svg';
const pngPath = 'public/favicon.png';
const icoPath = 'public/favicon.ico';

// Läs SVG-filen
const svg = fs.readFileSync(svgPath, 'utf8');

// Konvertera SVG till PNG (t.ex. 256x256)
sharp(Buffer.from(svg))
  .resize(256, 256)
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log('PNG skapad:', pngPath);

    // Konvertera SVG till ICO
    svg2img(svg, {width: 256, height: 256, format: 'ico'}, function(error, buffer) {
      if (error) throw error;
      fs.writeFileSync(icoPath, buffer);
      console.log('ICO skapad:', icoPath);
    });
  })
  .catch(err => {
    console.error('Fel vid konvertering:', err);
  }); 