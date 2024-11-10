import { OpenAI } from 'openai';
import { SimpleGit } from 'simple-git';
import { CodeAnalyzer } from './CodeAnalyzer';
import { SecurityScanner } from './SecurityScanner';
import { TeamCollaborator } from './TeamCollaborator';

export class AIWorkflowManager {
    private codeAnalyzer: CodeAnalyzer;
    private securityScanner: SecurityScanner;
    private teamCollaborator: TeamCollaborator;

    constructor(
        private git: SimpleGit,
        private openai: OpenAI,
        private workspaceContext: vscode.WorkspaceFolder
    ) {
        this.codeAnalyzer = new CodeAnalyzer(openai);
        this.securityScanner = new SecurityScanner(openai);
        this.teamCollaborator = new TeamCollaborator();
    }

    async analyzeChangeContext(diff: string): Promise<ChangeContext> {
        const fileChanges = await this.git.diff(['--name-status']);
        const codebase = await this.getWorkspaceFiles();
        const dependencies = await this.analyzeDependencies();

        return {
            changes: await this.codeAnalyzer.analyzeImpact(diff, codebase),
            security: await this.securityScanner.scanChanges(diff),
            dependencies: dependencies,
            teamContext: await this.teamCollaborator.getTeamContext()
        };
    }

    async smartCommit(context: ChangeContext): Promise<void> {
        const commitStrategy = await this.determineCommitStrategy(context);
        const branchStrategy = await this.determineBranchStrategy(context);

        // Implement smart branching if needed
        if (branchStrategy.shouldCreateBranch) {
            await this.git.checkoutLocalBranch(branchStrategy.branchName);
        }

        // Auto-group related changes
        const changeGroups = this.groupRelatedChanges(context.changes);
        
        for (const group of changeGroups) {
            await this.git.add(group.files);
            const message = await this.generateContextAwareCommitMessage(group, context);
            await this.git.commit(message);
        }
    }

    async generateDocumentation(context: ChangeContext): Promise<Documentation> {
        return {
            changelog: await this.generateChangelog(context),
            apiDocs: await this.generateAPIDocs(context),
            impactAnalysis: await this.generateImpactAnalysis(context)
        };
    }
}