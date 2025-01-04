import * as vscode from 'vscode';

export class BranchItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public override description: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        private isActive: boolean
    ) {
        super(label, collapsibleState);
        this.tooltip = this.description ? `${this.label}\n${this.description}` : this.label;
        this.description = this.description || '无描述';
        
        this.iconPath = new vscode.ThemeIcon(
            this.isActive ? 'check' : 'git-branch'
        );
    }
} 