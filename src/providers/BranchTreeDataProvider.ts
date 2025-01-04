import * as vscode from 'vscode';
import { BranchItem } from '../models/BranchItem';
import { getAllBranches, getBranchDescription } from '../utils/git';

export class BranchTreeDataProvider implements vscode.TreeDataProvider<BranchItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<BranchItem | undefined | null | void> = new vscode.EventEmitter<BranchItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<BranchItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: BranchItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: BranchItem): Promise<BranchItem[]> {
        if (element) {
            return [];
        }

        try {
            const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
            if (!workspacePath) {
                return [];
            }

            const branches = await getAllBranches(workspacePath);
            const branchItems = await Promise.all(
                branches.map(async (branch) => {
                    const cleanBranch = branch.replace('* ', '');
                    const description = await getBranchDescription(cleanBranch, workspacePath);
                    const isActive = branch.startsWith('* ');

                    return new BranchItem(
                        cleanBranch,
                        description,
                        vscode.TreeItemCollapsibleState.None,
                        isActive
                    );
                })
            );

            return branchItems;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            vscode.window.showErrorMessage(`错误: ${errorMessage}`);
            return [];
        }
    }
} 