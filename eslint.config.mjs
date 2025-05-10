// import js from "@eslint/js";
// import globals from "globals";
// import tseslint from "typescript-eslint";
// import { defineConfig } from "eslint/config";


// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
//   { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser,sourceType: "module", } },
//   {
//     rules: {
//       eqeqeq: "off",
//       "no-unused-vars": "error",
//       "no-unused-expressions": "error",
//       "no-console": "warn",
//       "no-undev":"error",
//       "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
       
//     },
//     "globals":{
//       "process":"readonly"
//     }
//   },
   
//    {
//   ignores: ["node_modules/", "dist/"] // exclude built files
// }
// ,
//   tseslint.configs.recommended,
// ]);
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    languageOptions: {
      globals: {
        ...globals.browser,
        process: "readonly", // move 'process' here
      },
      sourceType: "module",
    },
    extends: ["js/recommended"],
    rules: {
      eqeqeq: "off",
      "no-unused-vars": "error",
      "no-unused-expressions": "error",
      "no-console": "warn",
      "no-undef": "error", // fixed typo: "no-undev" → "no-undef"
      "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
    },
  },
  {
    ignores: ["node_modules/", "dist/"], // exclude built files
  },
  tseslint.configs.recommended,
]);
