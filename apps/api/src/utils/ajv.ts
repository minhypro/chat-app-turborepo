import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
  useDefaults: true,
});

addFormats(ajv);

export { ajv };
