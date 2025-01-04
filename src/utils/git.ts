import { exec } from 'child_process';
import { promisify } from 'util';

export const execAsync = promisify(exec);

export async function getBranchDescription(branch: string, workspacePath: string): Promise<string> {
    try {
        const { stdout } = await execAsync(
            `git config branch.${branch}.description`,
            { cwd: workspacePath }
        );
        return stdout.trim();
    } catch {
        return '';
    }
}

export async function setBranchDescription(branch: string, description: string, workspacePath: string): Promise<void> {
    await execAsync(
        `git config branch.${branch}.description "${description}"`,
        { cwd: workspacePath }
    );
}

export async function getAllBranches(workspacePath: string): Promise<string[]> {
    const { stdout } = await execAsync('git branch', { cwd: workspacePath });
    return stdout.split('\n')
        .filter(branch => branch.trim())
        .map(branch => branch.trim());
} 