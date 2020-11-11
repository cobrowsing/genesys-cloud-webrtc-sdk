const { Spigot } = require('genesyscloud-spigot/dist/src/index');
const version = require('../package.json').version;

let envConfig = {};

const defaultDevConfig = {
  OAUTH_CLIENT_ID: 'ff22e32c-2948-4ff4-8f2c-1c379d28e84d',
  ORG: 'TEST-valve-1ym37mj1kao',
  USERNAME: '<USERNAME>',
  PASSWORD: '<PASSWORD>',
  ENV_HOST: 'inindca.com'
};

const ciMode = process.env.CI_MODE === 'true';

['ORG', 'USERNAME', 'PASSWORD', 'ENV_HOST', 'OAUTH_CLIENT_ID'].forEach((name) => {
  const value = process.env[name];
  if (!value) {
    if (ciMode) {
      console.error(`Missing required environment variable for ci mode: ${name}`);
      process.exit(1);
    }
  }

  envConfig[name] = value || defaultDevConfig[name];
});

const config = {
  oauth: {
    clientId: envConfig.OAUTH_CLIENT_ID
  },
  credentials: {
    org: envConfig.ORG,
    username: envConfig.USERNAME,
    password: envConfig.PASSWORD
  },
  appName: 'webrtc-sdk',
  appVersion: version,
  headless: !!process.env.SINGLE_RUN || process.env.CI_MODE,
  testPort: '8443',
  envHost: envConfig.ENV_HOST,
  outboundNumber: '3172222222',
  filter: '',
  validationTimeout: '15000',
  iceTransportPolicy: 'all',
  testGlob: 'tests/*',
  babelExtras: {
    modulesToTranspile: [
      'genesys-cloud-webrtc-sdk',
      'genesyscloud-spigot',
      'genesys-cloud-streaming-client',
      'genesys-cloud-streaming-client-webrtc-sessions',
      'whatwg-fetch',
      'stanza',
    ],
    aliases: {
      crypto: './node_modules/stanza/lib/crypto/index-browser.js',
      stringprep: './node_modules/stanza/lib/stringprep/index-browser.js',
      'node-stringprep': './node_modules/stanza/lib/stringprep/index-browser.js',
    }
  }
};

async function runTests () {
  try {
    const spigot = new Spigot(config);

    console.info('starting spigot tests');
    await spigot.start();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.info('tests passed!');
  process.exit(0);
}

runTests();