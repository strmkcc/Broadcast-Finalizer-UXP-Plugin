const myModule = require('./index.node');

try {
  const options = {
    voLevel: -1.0,
    musicLevel: -12.0,
    fxLevel: -6.0,
  };

  const resultStr = myModule.processAudio(options);
  const result = JSON.parse(resultStr);

  if (result.received && result.received.voLevel === -1.0) {
    console.log('Native module test passed! Got expected received level.');
    process.exit(0);
  } else {
    console.error(`Test failed: Did not receive the correct level back. Response: ${resultStr}`);
    process.exit(1);
  }
} catch (e) {
  console.error('Test failed: Error calling native module or parsing JSON.', e);
  process.exit(1);
}
