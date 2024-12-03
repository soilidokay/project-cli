const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Function to run shell commands
function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error running command: ${command}`);
    process.exit(1);
  }
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt user for project name
rl.question('Enter project name: ', (projectName) => {
  rl.close(); // Close the input interface

  // Create project directory
  console.log('Creating project directory...');
  const projectDir = path.resolve(projectName);
  fs.mkdirSync(projectDir, { recursive: true });

  // Navigate into the project directory
  process.chdir(projectDir);

  // Initialize npm project
  console.log('Initializing npm project...');
  runCommand('npm init -y');

  // Install React and TypeScript
  console.log('Installing React and TypeScript...');
  runCommand('npm install react@^17.0.0 react-dom@^17.0.0');
  runCommand('npm install -D typescript @types/react @types/react-dom');

  // Install Webpack and required plugins
  console.log('Installing Webpack and required plugins...');
  runCommand('npm install -D webpack webpack-cli webpack-dev-server ts-loader css-loader style-loader html-webpack-plugin');

  // Create tsconfig.json file
  console.log('Creating tsconfig.json...');
  const tsconfigContent = `
{
  "compilerOptions": {
    "target": "ES6",
    "module": "ESNext",
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
`;
  fs.writeFileSync('tsconfig.json', tsconfigContent);

  // Create webpack.config.js file
  console.log('Creating webpack.config.js...');
  const webpackConfigContent = `
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  devServer: {
    static: './dist',
    port: 3000,
    hot: true,
  },
};
`;
  fs.writeFileSync('webpack.config.js', webpackConfigContent);

  // Create project structure
  console.log('Creating project structure...');
  const srcDir = path.join(projectDir, 'src');
  fs.mkdirSync(srcDir, { recursive: true });

  // Create index.tsx file
  console.log('Creating index.tsx...');
  const indexTsxContent = `
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';

ReactDOM.render(<App />, document.getElementById('root'));
`;
  fs.writeFileSync(path.join(srcDir, 'index.tsx'), indexTsxContent);

  // Create App.tsx file
  console.log('Creating App.tsx...');
  const appTsxContent = `
import React from 'react';

const App: React.FC = () => {
  return (
    <div>
      <h1>Hello, React with TypeScript and Webpack!</h1>
    </div>
  );
};

export default App;
`;
  fs.writeFileSync(path.join(srcDir, 'App.tsx'), appTsxContent);

  // Create App.css file
  console.log('Creating App.css...');
  const appCssContent = `body {
  font-family: Arial, sans-serif;
}`;
  fs.writeFileSync(path.join(srcDir, 'App.css'), appCssContent);

  // Create index.html file
  console.log('Creating index.html...');
  const indexHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;
  fs.writeFileSync(path.join(srcDir, 'index.html'), indexHtmlContent);

  // Update package.json to add start and build scripts
  console.log('Updating package.json...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJson.scripts = {
    start: 'webpack serve',
    build: 'webpack',
  };
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

  console.log(`Project "${projectName}" has been created successfully!`);
});
