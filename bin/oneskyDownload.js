import process from 'process';
import fs from 'fs';
import path from 'path';

// import dotenv from 'dotenv';
import oneSky from '@brainly/onesky-utils';

import { filterReadyTranslations } from './translationHelpers';

// dotenv.config({ path: '.env.local' });

async function downloadTranslations() {
  const options = {
    apiKey: 'LtL9CZus4SOnzmVGYQLXvoReCv0Z2PYE',
    secret: 'MdEMyjou0fxvsRIIhM4f9PN3SnOWwHY9',
    projectId: '363848',
  };
  const multilingualOptions = {
    ...options,
    fileName: 'en_us.json',
    // format: 'HIERARCHICAL_JSON',
  };

  console.log('Downloading from OneSky...');
  try {
    const translationsRaw = await oneSky.getMultilingualFile(
      multilingualOptions,
    );
    const languagesRaw = await oneSky.getLanguages(options);
    console.log('Successfully Downloaded.');
    console.log('Writing translations.json...');
    fs.writeFileSync(
      path.resolve(__dirname, '../src/i18n/locales/translations.json'),
      filterReadyTranslations(translationsRaw, languagesRaw),
    );
    console.log('Done.');
  } catch (error) {
    console.log('Error downloading from OneSky:');
    console.log(error);
    process.exit(1);
  }
}

downloadTranslations();
