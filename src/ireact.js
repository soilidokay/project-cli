#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptProjectName(defaultName, callback) {
  rl.question(`Enter the project name (default: ${defaultName}): `, (answer) => {
    callback(answer.trim() || defaultName);
    rl.close();
  });
}

promptProjectName("my-react-ts-library", (projectName) => {
  console.log(`🚀 Initializing React TypeScript Component Library: ${projectName}...\n`);
  try {
    execSync(`mkdir ${projectName}`, { stdio: "inherit" });
    process.chdir(projectName);
    execSync("npm init -y", { stdio: "inherit" });

    execSync(
      "npm install react react-dom tslib && npm install typescript @types/react @types/react-dom rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-typescript rollup-plugin-peer-deps-external rollup-plugin-postcss --save-dev",
      { stdio: "inherit" }
    );

    const tsConfig = {
      compilerOptions: {
        target: "ES6",
        module: "ESNext",
        jsx: "react",
        declaration: true,
        outDir: "./dist",
        strict: true,
      },
      include: ["src/**/*"],
    };
    fs.writeFileSync("tsconfig.json", JSON.stringify(tsConfig, null, 2));

    const rollupConfig = `
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

const packageJson = require('./package.json');

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    postcss(),
  ],
};
`;
    fs.writeFileSync("rollup.config.js", rollupConfig.trim());

    execSync("mkdir src", { stdio: "inherit" });
    fs.writeFileSync(
      "src/Button.tsx",
      `
import React from 'react';

export interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};
`.trim()
    );
    fs.writeFileSync("src/index.tsx", `export * from './Button';`);

    const packageJson = JSON.parse(fs.readFileSync("package.json"));
    packageJson.main = "dist/cjs/index.js";
    packageJson.module = "dist/esm/index.js";
    packageJson.types = "dist/index.d.ts";
    packageJson.files = ["dist"];
    packageJson.scripts = {
      build: "rollup -c",
    };
    packageJson.peerDependencies = {
      react: "^18.0.0",
      "react-dom": "^18.0.0",
    };
    fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

    console.log("\n✅ React TypeScript Component Library initialized successfully!");
    console.log("👉 Run the following commands to build your project:");
    console.log("   cd", projectName);
    console.log("   npm run build");
  } catch (error) {
    console.error("❌ Error during project initialization:", error.message);
  }
});
