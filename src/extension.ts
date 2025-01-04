// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { BranchTreeDataProvider } from './providers/BranchTreeDataProvider';
import { BranchItem } from './models/BranchItem';
import { setBranchDescription } from './utils/git';

export function activate(context: vscode.ExtensionContext) {
	const branchTreeDataProvider = new BranchTreeDataProvider();
	const treeView = vscode.window.createTreeView('gitBranchNotes', {
		treeDataProvider: branchTreeDataProvider
	});

	// 注册刷新命令
	let refreshCommand = vscode.commands.registerCommand('git-branch-desc.refresh', () => {
		branchTreeDataProvider.refresh();
	});

	// 注册添加/编辑描述命令
	let editDescCommand = vscode.commands.registerCommand('git-branch-desc.editDescription', async (item: BranchItem) => {
		if (!item) { return; }

		const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
		if (!workspacePath) { return; }

		const description = await vscode.window.showInputBox({
			prompt: `输入分支 "${item.label}" 的描述信息`,
				placeHolder: '请输入分支描述...'
		});

		if (description === undefined) { return; }

		try {
			await setBranchDescription(item.label, description, workspacePath);
			branchTreeDataProvider.refresh();
			vscode.window.showInformationMessage('分支描述已更新');
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : '未知错误';
			vscode.window.showErrorMessage(`更新分支描述失败: ${errorMessage}`);
		}
	});

	context.subscriptions.push(treeView, refreshCommand, editDescCommand);
}

export function deactivate() {}
