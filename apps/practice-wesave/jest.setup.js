// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import 'reflect-metadata';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd(), true);
process.env.NEXT_PUBLIC_API_PROTOCOL ??= 'http';
process.env.NEXT_PUBLIC_API_DOMAIN ??= 'localhost:3000';

window.matchMedia = jest.fn().mockImplementation(query => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
});
