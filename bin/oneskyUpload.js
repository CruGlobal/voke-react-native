import process from 'process';
// import dotenv from 'dotenv';
import oneSky from '@brainly/onesky-utils';
import translations from '../src/i18n/locales/en-US';
// import translations from '../src/i18n/locales/es';
// import translations from '../src/i18n/locales/pt-BR';
// import translations from '../src/i18n/locales/fr';

// dotenv.config({ path: '.env.local' });

async function uploadTranslations() {
  const options = {
    language: 'en-US',
    apiKey: 'LtL9CZus4SOnzmVGYQLXvoReCv0Z2PYE',
    secret: 'MdEMyjou0fxvsRIIhM4f9PN3SnOWwHY9',
    projectId: '363848',
    fileName: 'en_us.json',
    format: 'HIERARCHICAL_JSON',
    content: JSON.stringify(translations),
    keepStrings: true,
  };

  /* const options = {
    language: 'es',
    apiKey: 'LtL9CZus4SOnzmVGYQLXvoReCv0Z2PYE',
    secret: 'MdEMyjou0fxvsRIIhM4f9PN3SnOWwHY9',
    projectId: '363848',
    fileName: 'es.json',
    format: 'HIERARCHICAL_JSON',
    content: JSON.stringify(translations),
    keepStrings: true,
  }; */

  /* const options = {
    language: 'pt-BR',
    apiKey: 'LtL9CZus4SOnzmVGYQLXvoReCv0Z2PYE',
    secret: 'MdEMyjou0fxvsRIIhM4f9PN3SnOWwHY9',
    projectId: '363848',
    fileName: 'pt-BR.json',
    format: 'HIERARCHICAL_JSON',
    content: JSON.stringify(translations),
    keepStrings: true,
  }; */

  /* const options = {
    language: 'fr',
    apiKey: 'LtL9CZus4SOnzmVGYQLXvoReCv0Z2PYE',
    secret: 'MdEMyjou0fxvsRIIhM4f9PN3SnOWwHY9',
    projectId: '363848',
    fileName: 'fr.json',
    format: 'HIERARCHICAL_JSON',
    content: JSON.stringify(translations),
    keepStrings: true,
  }; */

  console.log('Uploading to OneSky...', JSON.stringify(translations));
  try {
    // console.log( options );
    const result = await oneSky.postFile(options);
    console.log( result );
    console.log('Successfully Uploaded.');
  } catch (error) {
    console.log('Error uploading to OneSky:');
    console.log(error);
    process.exit(1);
  }
}

uploadTranslations();
