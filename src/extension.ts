export async function activate(context: vscode.ExtensionContext) {
    const config = await loadConfiguration();
    
    const performanceOptimizer = new PerformanceOptimizer();
    const teamLearning = new TeamLearningManager();
    const projectManager = new ProjectManager();
    const aiManager = new CustomAIManager();
    
    const dashboard = new DashboardView(
        performanceOptimizer,
        teamLearning,
        projectManager,
        aiManager
    );

    // Register commands and views
    context.subscriptions.push(
        vscode.commands.registerCommand('gitAI.optimize', () =>
            performanceOptimizer.analyzeCIPipeline(currentPipeline)
        ),
        vscode.commands.registerCommand('gitAI.planSprint', () =>
            projectManager.planSprint()
        ),
        vscode.commands.registerCommand('gitAI.trainAI', () =>
            aiManager.trainCustomModel()
        )
    );

    // Initialize dashboard
    await dashboard.render();
}