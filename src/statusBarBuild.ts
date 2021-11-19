// 这里的知识都可以从 api 中查到哦
// 下文有 api 截图，请大家参考，不过还是希望小伙伴们能够自行查一下哈～
import { window, StatusBarItem, StatusBarAlignment } from "vscode";
import * as vscode from "vscode";
import { QuickpickSet } from "./quickpickSet";

export class StatusBarBuild implements QuickpickSet {
  // 定义一个状态栏的属性
  private statusBar: StatusBarItem;
  public currentBranch: string | undefined;

  constructor() {
    if (!this.statusBar) {
      this.statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
    }
    this.statusBarReset();
    // 当编辑器中的选择更改时触发的事件
    // window.onDidChangeTextEditorSelection(this.updateWordCount, this);

    // 当活动编辑器 发生更改时将触发的事件
    window.onDidChangeActiveTextEditor(this.checkBranchChange, this);
    window.onDidChangeTextEditorOptions(this.checkBranchChange, this);
  }
  public async display(): Promise<void> {}
  public get commands(): any[] {
    return [];
  }
  /**
   * 重置状态栏
   */
  public statusBarReset() {
    this.statusBar.text = `$(run) Jenkins构建`;
    this.statusBar.command = "extension.jenkins-jack.build.quickBuild";
    this.statusBar.show();
  }
  /**
   * 获取当前激活窗口分支
   */
  public getCurrentBranch() {
    const extension = vscode?.extensions?.getExtension("vscode.git");
    if (extension?.isActive) {
      const gitExtension = extension?.exports;
      const git = gitExtension?.getAPI(1);
      if (
        git.state &&
        git.state === "initialized" &&
        git.repositories[0].length !== 0
      ) {
        const state = git.repositories[0]?.state;

        this.currentBranch = state?.HEAD?.name;
        return `origin/${this.currentBranch}`;
      } else {
        this.statusBar.hide();
        return null;
      }
    }
  }
  /**
   * 检查git分支变化 并更新状态
   */
  public checkBranchChange() {
    this.getCurrentBranch();
    // this.statusBar.color
    this.statusBar.text = true ? `$(run) Jenkins构建` : `$(repo-sync)构建中: `;
    this.statusBar.command = "extension.jenkins-jack.build.quickBuild";
    this.statusBar.show();
  }
  /**
   * 设置状态栏
   * @param str
   * @returns
   */
  public setStatusBar(status: boolean, str: string, command?: string) {
    if (!str) return;
    this.statusBar.text = str;
    this.statusBar.command = command || undefined;

    if (status) this.statusBar.show();
    else this.statusBar.hide();
  }

  // 销毁对象和自由资源
  dispose() {
    this.statusBar?.dispose();
  }
}
