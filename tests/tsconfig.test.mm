{
  "transpileOnly": true,
  "compilerOptions": {
    "target": "es6",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "module":"CommonJS",
    "jsx": "react-jsx",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext",
    ],
    "noEmit": true,
    "baseUrl": "../src/",
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "paths": {
    "app/*": ["../src/app/*", "../src/app"],
    "components/*": ["../src/app/_components/*"],
    "helpers/*": ["../src/app/helpers/*"],
    "models/*": ["../src/app/models/*"],
    "@content-manager/*": ["../src/app/content-manager/*"]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    "../tests/**/*.ts",
    "../tests/**/*.tsx",
    "../src/app/**/*.tsx",
    "../src/app/**/*.ts",
    "../scripts/gen-imports.mts",
    "../scripts/*.ts",
    "../scripts/resize.mts",
    "../scripts/mdxToMd.mts",
    "../.next/types/**/*.ts"
  ],
  "exclude": ["node_modules/*", "../node_modules/*", "cypress", "../src/app/sw/*.ts"]
}
