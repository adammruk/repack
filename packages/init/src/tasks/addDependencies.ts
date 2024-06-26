import type { PM } from 'detect-package-manager';
import { execa } from 'execa';
import ora from 'ora';
import logger from '../utils/logger.js';

const dependencies = [
  'webpack',
  'terser-webpack-plugin',
  'babel-loader',
  '@callstack/repack',
];

/**
 * Installs dependencies required by Re.Pack using the specified package manager
 *
 * @param packageManager yarn, npm or pnpm
 */
export default async function addDependencies(
  packageManager: PM,
  repackVersion?: string
) {
  let installCommand: string;

  if (packageManager === 'yarn' || packageManager === 'bun') {
    installCommand = 'add';
  } else {
    installCommand = 'install';
  }

  if (repackVersion) {
    const index = dependencies.indexOf('@callstack/repack');
    dependencies[index] = `@callstack/repack@${repackVersion}`;
    logger.info(`Using custom Re.Pack version ${repackVersion}`);
  }

  const deps = dependencies.join(' ');
  const command = `${packageManager} ${installCommand} -D ${deps}`;

  let spinner;

  try {
    spinner = ora(
      `Installing Re.Pack dependencies using ${packageManager}`
    ).start();
    await execa(command, { stdio: 'pipe', shell: true });
    spinner.succeed('Dependencies installed');
  } catch (error) {
    spinner?.fail(`Failed to install Re.Pack dependencies`);
    throw error;
  }
}
