export class DashboardView {
    constructor(
        private performanceOptimizer: PerformanceOptimizer,
        private teamLearning: TeamLearningManager,
        private projectManager: ProjectManager,
        private aiManager: CustomAIManager
    ) {}

    async render(): Promise<string> {
        const performance = await this.getPerformanceMetrics();
        const teamInsights = await this.getTeamInsights();
        const projectStatus = await this.getProjectStatus();
        const aiSuggestions = await this.getAISuggestions();

        return this.generateDashboardHTML({
            performance,
            teamInsights,
            projectStatus,
            aiSuggestions
        });
    }
}
