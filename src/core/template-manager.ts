import simpleGit from 'simple-git';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import type { Template } from '../types/index.js';

const TEMPLATES_REPO = 'https://github.com/coinbase/x402.git';
const CACHE_DIR = path.join(os.homedir(), '.x402-polygon', 'templates');

export class TemplateManager {
  /**
   * Get template path from cache or clone from repo
   */
  async getTemplate(template: Template): Promise<string> {
    const templatePath = path.join(CACHE_DIR, template);

    // Check if template exists in cache
    if (await fs.pathExists(templatePath)) {
      return templatePath;
    }

    // Clone templates repo (shallow)
    await this.cloneTemplatesRepo();

    // Check if template exists in cloned repo
    const repoTemplatePath = this.getTemplatePathInRepo(template);
    if (await fs.pathExists(repoTemplatePath)) {
      // Copy to cache
      await fs.copy(repoTemplatePath, templatePath);
      return templatePath;
    }

    // Fallback to embedded templates
    return this.getEmbeddedTemplatePath(template);
  }

  private async cloneTemplatesRepo(): Promise<void> {
    const repoPath = path.join(CACHE_DIR, 'repo');

    // Skip if already cloned
    if (await fs.pathExists(repoPath)) {
      return;
    }

    await fs.ensureDir(CACHE_DIR);

    const git = simpleGit();
    try {
      await git.clone(TEMPLATES_REPO, repoPath, ['--depth', '1', '--single-branch']);
    } catch (error) {
      console.warn('Failed to clone templates repo, using embedded templates');
    }
  }

  private getTemplatePathInRepo(template: Template): string {
    // Map templates to their paths in the x402 repo
    const templatePaths: Record<Template, string> = {
      express: path.join(CACHE_DIR, 'repo', 'demo', 'quickstart-local'),
      hono: path.join(CACHE_DIR, 'repo', 'examples', 'typescript', 'servers', 'hono'),
    };
    return templatePaths[template];
  }

  private getEmbeddedTemplatePath(template: Template): string {
    // Get path relative to the CLI package, not the current working directory
    const cliPackagePath = path.resolve(__dirname, '..', '..');
    return path.join(cliPackagePath, 'src', 'templates', template);
  }
}

