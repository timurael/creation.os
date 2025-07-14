import type { Project, Todo, ProjectActivity } from '../storage';
import { HybridDatabase } from '../database/database';

export interface ProjectPattern {
  id: string;
  name: string;
  condition: (project: Project, activities: ProjectActivity[]) => boolean;
  scoreAdjustment: number;
  recommendation?: string;
}

export interface RiskIndicator {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
  detector: (project: Project, activities: ProjectActivity[]) => boolean;
  mitigationSteps: string[];
}

export interface OptimizationRule {
  id: string;
  name: string;
  condition: (project: Project, activities: ProjectActivity[]) => boolean;
  suggestion: string;
  expectedImpact: number; // 1-10 scale
}

export interface ProjectSummary {
  insights: {
    summary: string;
    healthScore: number;
    riskFactors: string[];
    recommendations: string[];
  };
  metrics: {
    velocity: number;
    productivity: number;
    timeToCompletion: number;
  };
  trends: {
    progressTrend: 'improving' | 'stable' | 'declining';
    velocityTrend: 'improving' | 'stable' | 'declining';
    qualityTrend: 'improving' | 'stable' | 'declining';
  };
}

export class AgentKnowledgeService {
  private db: HybridDatabase;
  private patterns: ProjectPattern[];
  private riskIndicators: RiskIndicator[];
  private optimizationRules: OptimizationRule[];

  constructor(db: HybridDatabase) {
    this.db = db;
    this.patterns = this.initializePatterns();
    this.riskIndicators = this.initializeRiskIndicators();
    this.optimizationRules = this.initializeOptimizationRules();
  }

  // Main AI Summary Generation
  generateProjectSummary(projectId: string, timeframe: '1d' | '7d' | '30d' = '7d'): ProjectSummary {
    const project = this.db.getProject(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    const activities = this.db.getProjectActivities(projectId, timeframe);
    
    // Calculate health score using patterns
    const healthScore = this.calculateHealthScore(project, activities);
    
    // Identify risks
    const riskFactors = this.identifyRisks(project, activities);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(project, activities);
    
    // Calculate metrics
    const velocity = this.calculateVelocity(activities);
    const productivity = this.calculateProductivity(activities);
    const timeToCompletion = this.estimateTimeToCompletion(project, activities);
    
    // Analyze trends
    const trends = this.analyzeTrends(project, activities);

    return {
      insights: {
        summary: this.generateInsightsSummary(project, activities, healthScore),
        healthScore,
        riskFactors,
        recommendations
      },
      metrics: {
        velocity,
        productivity,
        timeToCompletion
      },
      trends
    };
  }

  private calculateHealthScore(project: Project, activities: ProjectActivity[]): number {
    let score = 80; // Base score

    // Apply pattern-based scoring
    for (const pattern of this.patterns) {
      if (pattern.condition(project, activities)) {
        score += pattern.scoreAdjustment;
      }
    }

    // Activity-based adjustments
    const recentActivity = activities.filter(a => 
      a.timestamp > Date.now() - (7 * 24 * 60 * 60 * 1000)
    );

    if (recentActivity.length === 0) {
      score -= 20; // No recent activity
    } else if (recentActivity.length > 10) {
      score += 10; // High activity
    }

    // Progress-based adjustment
    if (project.progress > 80) {
      score += 15; // Near completion
    } else if (project.progress < 20) {
      score -= 10; // Low progress
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private identifyRisks(project: Project, activities: ProjectActivity[]): string[] {
    const risks: string[] = [];

    for (const indicator of this.riskIndicators) {
      if (indicator.detector(project, activities)) {
        risks.push(indicator.name);
      }
    }

    return risks;
  }

  private generateRecommendations(project: Project, activities: ProjectActivity[]): string[] {
    const recommendations: string[] = [];

    for (const rule of this.optimizationRules) {
      if (rule.condition(project, activities)) {
        recommendations.push(rule.suggestion);
      }
    }

    // Limit to top 3 recommendations
    return recommendations.slice(0, 3);
  }

  private calculateVelocity(activities: ProjectActivity[]): number {
    const completionActivities = activities.filter(a => 
      a.activityType === 'task_completed'
    );

    const timeSpan = 7 * 24 * 60 * 60 * 1000; // 7 days
    const tasksPerWeek = (completionActivities.length / activities.length) * 7;
    
    return Math.round(tasksPerWeek * 10) / 10;
  }

  private calculateProductivity(activities: ProjectActivity[]): number {
    if (activities.length === 0) return 0;

    const productiveActivities = activities.filter(a => 
      ['task_completed', 'progress_updated', 'milestone_reached'].includes(a.activityType)
    );

    return Math.round((productiveActivities.length / activities.length) * 100);
  }

  private estimateTimeToCompletion(project: Project, activities: ProjectActivity[]): number {
    const velocity = this.calculateVelocity(activities);
    const remainingProgress = 100 - project.progress;
    
    if (velocity === 0) return -1; // Unable to estimate
    
    const weeksRemaining = remainingProgress / (velocity * 10);
    return Math.round(weeksRemaining * 7); // Return days
  }

  private analyzeTrends(project: Project, activities: ProjectActivity[]): ProjectSummary['trends'] {
    const now = Date.now();
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = now - (14 * 24 * 60 * 60 * 1000);

    const recentActivities = activities.filter(a => a.timestamp > weekAgo);
    const olderActivities = activities.filter(a => 
      a.timestamp > twoWeeksAgo && a.timestamp <= weekAgo
    );

    const recentVelocity = this.calculateVelocity(recentActivities);
    const olderVelocity = this.calculateVelocity(olderActivities);

    const velocityTrend = recentVelocity > olderVelocity ? 'improving' : 
                         recentVelocity < olderVelocity ? 'declining' : 'stable';

    return {
      progressTrend: project.progress > 75 ? 'improving' : 
                    project.progress < 25 ? 'declining' : 'stable',
      velocityTrend,
      qualityTrend: 'stable' // Simplified for now
    };
  }

  private generateInsightsSummary(project: Project, activities: ProjectActivity[], healthScore: number): string {
    const status = healthScore > 80 ? 'excellent' : 
                  healthScore > 60 ? 'good' : 
                  healthScore > 40 ? 'concerning' : 'critical';

    const recentActivity = activities.filter(a => 
      a.timestamp > Date.now() - (7 * 24 * 60 * 60 * 1000)
    ).length;

    const progressStatus = project.progress > 75 ? 'near completion' :
                          project.progress > 50 ? 'making good progress' :
                          project.progress > 25 ? 'in early stages' : 'just getting started';

    return `Project "${project.title}" is in ${status} condition with ${recentActivity} recent activities. Currently ${progressStatus} at ${project.progress}% completion.`;
  }

  // Initialize knowledge base patterns
  private initializePatterns(): ProjectPattern[] {
    return [
      {
        id: 'high_activity',
        name: 'High Activity Pattern',
        condition: (project, activities) => {
          const recentActivity = activities.filter(a => 
            a.timestamp > Date.now() - (3 * 24 * 60 * 60 * 1000)
          );
          return recentActivity.length > 5;
        },
        scoreAdjustment: 10,
        recommendation: 'Maintain current momentum with regular activity'
      },
      {
        id: 'stalled_project',
        name: 'Stalled Project Pattern',
        condition: (project, activities) => {
          const recentActivity = activities.filter(a => 
            a.timestamp > Date.now() - (7 * 24 * 60 * 60 * 1000)
          );
          return recentActivity.length === 0 && project.progress < 90;
        },
        scoreAdjustment: -25,
        recommendation: 'Consider breaking down tasks or reassessing project scope'
      },
      {
        id: 'consistent_progress',
        name: 'Consistent Progress Pattern',
        condition: (project, activities) => {
          const progressUpdates = activities.filter(a => 
            a.activityType === 'progress_updated'
          );
          return progressUpdates.length > 3;
        },
        scoreAdjustment: 15,
        recommendation: 'Excellent progress tracking - keep it up!'
      }
    ];
  }

  private initializeRiskIndicators(): RiskIndicator[] {
    return [
      {
        id: 'no_recent_activity',
        name: 'No Recent Activity',
        severity: 'high',
        detector: (project, activities) => {
          const recentActivity = activities.filter(a => 
            a.timestamp > Date.now() - (14 * 24 * 60 * 60 * 1000)
          );
          return recentActivity.length === 0 && project.status === 'active';
        },
        mitigationSteps: [
          'Schedule time to review project',
          'Break down next steps into smaller tasks',
          'Consider if project should be paused or archived'
        ]
      },
      {
        id: 'low_progress_high_activity',
        name: 'High Activity, Low Progress',
        severity: 'medium',
        detector: (project, activities) => {
          return activities.length > 10 && project.progress < 30;
        },
        mitigationSteps: [
          'Review if tasks are aligned with project goals',
          'Consider if scope is too broad',
          'Focus on completing rather than starting tasks'
        ]
      },
      {
        id: 'unclear_objectives',
        name: 'Unclear Objectives',
        severity: 'medium',
        detector: (project, activities) => {
          return !project.why || project.why.length < 20;
        },
        mitigationSteps: [
          'Define clear project objectives',
          'Add detailed "why" section',
          'Establish success criteria'
        ]
      }
    ];
  }

  private initializeOptimizationRules(): OptimizationRule[] {
    return [
      {
        id: 'add_time_tracking',
        name: 'Add Time Tracking',
        condition: (project, activities) => {
          const timeTracked = activities.filter(a => 
            a.activityType === 'time_logged'
          );
          return timeTracked.length === 0;
        },
        suggestion: 'Consider tracking time spent on tasks to improve future estimates',
        expectedImpact: 7
      },
      {
        id: 'break_down_large_tasks',
        name: 'Break Down Large Tasks',
        condition: (project, activities) => {
          const todos = this.db.getTodos('default', { projectId: project.id });
          const largeTasks = todos.filter(t => t.estimatedHours > 8);
          return largeTasks.length > 0;
        },
        suggestion: 'Break large tasks (8+ hours) into smaller, manageable pieces',
        expectedImpact: 8
      },
      {
        id: 'regular_reviews',
        name: 'Regular Project Reviews',
        condition: (project, activities) => {
          const reviews = activities.filter(a => 
            a.activityType === 'project_reviewed'
          );
          return reviews.length === 0;
        },
        suggestion: 'Schedule weekly project reviews to maintain focus and momentum',
        expectedImpact: 6
      }
    ];
  }

  // Learning and adaptation methods
  updatePattern(patternId: string, success: boolean): void {
    // In a full implementation, this would update pattern weights based on outcomes
    console.log(`Pattern ${patternId} outcome: ${success ? 'success' : 'failure'}`);
  }

  learnFromProjectCompletion(projectId: string): void {
    const project = this.db.getProject(projectId);
    const activities = this.db.getProjectActivities(projectId);
    
    if (project && activities) {
      // Extract successful patterns for future use
      const successfulPatterns = this.patterns.filter(p => 
        p.condition(project, activities) && p.scoreAdjustment > 0
      );
      
      // Increase confidence in successful patterns
      successfulPatterns.forEach(pattern => {
        this.updatePattern(pattern.id, true);
      });
    }
  }
}