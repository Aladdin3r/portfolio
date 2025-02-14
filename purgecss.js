const PurgeCSS = require('purgecss').PurgeCSS;
const fs = require('fs');

async function runPurgeCSS() {
  const purgeCSSResults = await new PurgeCSS().purge({
    content: ['./**/*.html', './**/*.js'], // Files to scan for used classes
    css: ['./css/style.css'],              // CSS file to purge
  });

  // Save the purged CSS to a file
  fs.writeFileSync('./css/style.css', purgeCSSResults[0].css);
  console.log('Purged CSS saved to ./css/style.css');
}

runPurgeCSS();