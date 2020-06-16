import process from 'process';
// import dotenv from 'dotenv';
import oneSky from '@brainly/onesky-utils';
import translations from '../src/i18n/locales/en-US';

// dotenv.config({ path: '.env.local' });

async function uploadTranslations() {
  const options = {
    language: 'en-US',
    apiKey: 'LtL9CZus4SOnzmVGYQLXvoReCv0Z2PYE',
    secret: 'MdEMyjou0fxvsRIIhM4f9PN3SnOWwHY9',
    projectId: '363848',
    fileName: 'en-us.json',
    format: 'HIERARCHICAL_JSON',
    content: JSON.stringify(translations),
    keepStrings: true,
  };

  console.log('Uploading to OneSky...');
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
