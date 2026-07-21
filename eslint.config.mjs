// ESLint 9 "flat config". Structure is fixed by ESLint itself: export a single
// array (via defineConfig) of config *objects*. Each object = "for files matching
// this pattern, use these parser/plugins/rules/settings." Multiple objects can
// target different file patterns, and rules are applied in order (later can
// override earlier for overlapping files).

//import js from "@eslint/js";
//import globals from "globals";
import { defineConfig } from "eslint/config";
import reactPlugin from 'eslint-plugin-react';           // React-specific lint rules (jsx-key, prop-types, etc.)
import jestPlugin from 'eslint-plugin-jest';              // Jest-specific lint rules (no-disabled-tests, expect-expect, etc.)
import testingLibraryPlugin from 'eslint-plugin-testing-library'; // @testing-library best-practice rules
import babelParser from '@babel/eslint-parser';           // lets ESLint's parser understand JSX syntax
import pluginSecurity from "eslint-plugin-security";      // security-focused rules (eval, ReDoS, unsafe Buffer, etc.)
import securityNode from 'eslint-plugin-security-node';   // Node.js-specific security rules (CRLF injection, child_process, SQL/NoSQL injection, etc.)
import noUnsanitized from 'eslint-plugin-no-unsanitized';  // flags unsafe DOM writes (innerHTML, document.write) that can lead to XSS

export default defineConfig([
  // --- Block 1: applies to ALL source + test files (*.js, *.jsx) ---
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      // Default ESLint parser can't handle JSX. Swap in Babel's parser, which can,
      // as long as we tell it to use the React JSX preset below.
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false, // don't require a separate babel.config.js in the repo
        babelOptions: {
          presets: ['@babel/preset-react'], // teaches the parser JSX syntax
        },
      },
      // Browser globals used in the app (e.g. registerServiceWorker.js) that would
      // otherwise be flagged as "undefined variable" by ESLint.
      globals: {
        window: true,
        document: true,
        navigator: true,
      },
    },
    plugins: {
      react: reactPlugin,
      security: pluginSecurity,
      'security-node': securityNode,
      'no-unsanitized': noUnsanitized,
    },
    rules: {
      // Spread = "turn on this plugin's whole recommended rule set", then override
      // individual rules below as needed instead of hand-picking every rule.
      ...reactPlugin.configs.recommended.rules,
      ...pluginSecurity.configs.recommended.rules,
      // Node-focused rules (Express sessions, MySQL/NoSQL injection, child_process,
      // etc.) - this app is browser-side CRA, not a Node server, so most of these
      // won't fire on anything here, but they're on in case Node-side code (e.g. a
      // custom server, build scripts) gets added later.
      ...securityNode.configs.recommended.rules,
      // Catches unsanitized values passed to innerHTML/outerHTML/document.write -
      // the classic DOM-based XSS sink. Relevant even in React, since
      // dangerouslySetInnerHTML and direct DOM refs can still introduce this.
      ...noUnsanitized.configs.recommended.rules,
      // React 17+ doesn't require `import React` in every JSX file, so this legacy
      // rule (meant for React <17) would otherwise false-positive on every file.
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect', // Automatically picks up from package.json
      },
    },
  },
  // --- Block 2: applies ONLY to *.test.jsx files, layered on top of Block 1 ---
  // Test files use extra globals (test/expect/describe/...) and extra rule sets
  // (Jest, Testing Library) that would be noise/irrelevant in non-test source files,
  // so they're scoped to their own block instead of going in Block 1.
  {
    files: ['**/*.test.jsx'],
    plugins: {
      jest: jestPlugin,
      'testing-library': testingLibraryPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      ...testingLibraryPlugin.configs.react.rules,
      // Turned off because it conflicted with how this project awaits async
      // events in its existing tests (avoids false-positive errors).
      'testing-library/await-async-events': 'off',
    },
    languageOptions: {
      // Jest injects these as globals at test-run time; without declaring them
      // here ESLint would flag every `test(...)`/`expect(...)` as undefined.
      globals: {
        test: true,
        expect: true,
        describe: true,
        beforeEach: true,
        afterEach: true,
        it: true,
        jest: true,
      },
    },
  },
]);
