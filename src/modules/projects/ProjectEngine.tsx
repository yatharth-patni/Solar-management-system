import React, { useState, useMemo } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { ProjectDetailsModal } from './ProjectDetailsModal';
import { TaskFormModal } from './TaskFormModal';
import { SolarProject, ProjectTask, TechnicianSchedule, ProjectStatus } from './projectTypes';
import { MOCK_PROJECTS, MOCK_PROJECT_TASKS, MOCK_TECHNICIAN_SCHEDULES } from './projectData';
import { getBreadcrumbs } from '../../app/navigation';
import { 
  Plus, 
  Eye, 
} from 'lucide-react';

interface ProjectEngineProps {
  onShowToast: (msg: string) => void;
  onNavigateToInstallation?: () => void;
}

export const ProjectEngine: React.FC<ProjectEngineProps> = ({ onShowToast, onNavigateToInstallation: _onNavigateToInstallation }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks' | 'technicians'>('projects');
  const [projects, setProjects] = useState<SolarProject[]>(MOCK_PROJECTS);
  const [tasks, setTasks] = useState<ProjectTask[]>(MOCK_PROJECT_TASKS);
  const [technicians] = useState<TechnicianSchedule[]>(MOCK_TECHNICIAN_SCHEDULES);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<SolarProject | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const statuses: ProjectStatus[] = [
    'Survey Approved',
    'Materials Ready',
    'Installation Scheduled',
    'Installation Started',
    'Testing Completed',
    'Customer Sign-off',
    'Project Completed',
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        q === '' ||
        p.customerName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.siteAddress.toLowerCase().includes(q) ||
        p.projectManager.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [projects, statusFilter, searchQuery]);

  const handleToggleMilestone = (projectId: string, milestoneName: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updatedMilestones = p.milestones.map(m => {
          if (m.name === milestoneName) {
            return {
              ...m,
              completed: !m.completed,
              dateCompleted: !m.completed ? 'Today' : undefined,
            };
          }
          return m;
        });

        // Determine active status based on last completed milestone
        const completedMilestones = updatedMilestones.filter(m => m.completed);
        const lastMilestone = completedMilestones[completedMilestones.length - 1];
        const newStatus = (lastMilestone ? lastMilestone.name : 'Survey Approved') as ProjectStatus;

        return {
          ...p,
          milestones: updatedMilestones,
          status: newStatus,
        };
      }
      return p;
    }));

    if (selectedProjectForDetails && selectedProjectForDetails.id === projectId) {
      setSelectedProjectForDetails(prev => prev ? {
        ...prev,
        milestones: prev.milestones.map(m => m.name === milestoneName ? { ...m, completed: !m.completed } : m)
      } : null);
    }

    onShowToast(`Milestone "${milestoneName}" updated for project.`);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'To Do' ? 'In Progress' : t.status === 'In Progress' ? 'Done' : 'To Do';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    onShowToast(`Task status updated.`);
  };

  const handleSaveTask = (task: ProjectTask) => {
    setTasks(prev => [task, ...prev]);
    onShowToast(`Task "${task.title}" created.`);
  };

  const projectColumns = [
    {
      header: 'Project / Customer',
      cell: (p: SolarProject) => (
        <div>
          <p 
            className="font-semibold text-[#211D24] hover:text-[#80538F] cursor-pointer"
            onClick={() => setSelectedProjectForDetails(p)}
          >
            {p.customerName}
          </p>
          <span className="font-mono text-[10px] text-[#80538F] bg-[#F1EAF5] px-1.5 py-0.2 rounded font-semibold">{p.id}</span>
        </div>
      ),
    },
    {
      header: 'Site Address',
      accessor: 'siteAddress' as keyof SolarProject,
      cell: (p: SolarProject) => (
        <span className="text-xs text-[#6F6874] line-clamp-1">{p.siteAddress}</span>
      ),
    },
    {
      header: 'Capacity',
      align: 'center' as const,
      cell: (p: SolarProject) => (
        <span className="font-semibold text-[#80538F] text-xs">{p.systemCapacityKw} kW DC</span>
      ),
    },
    {
      header: 'Lead PM & Techs',
      cell: (p: SolarProject) => (
        <div>
          <p className="font-medium text-[#211D24] text-xs">{p.projectManager}</p>
          <p className="text-[10px] text-[#6F6874]">{p.assignedTechnicians.join(', ')}</p>
        </div>
      ),
    },
    {
      header: 'Milestones Completed',
      cell: (p: SolarProject) => {
        const completedCount = p.milestones.filter(m => m.completed).length;
        return (
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-[#E8E5EA] h-1.5 rounded-full overflow-hidden">
              <div 
                style={{ width: `${(completedCount / 7) * 100}%` }}
                className="h-full bg-[#80538F]"
              />
            </div>
            <span className="text-[11px] font-semibold text-[#211D24]">{completedCount}/7</span>
          </div>
        );
      },
    },
    {
      header: 'Execution Status',
      cell: (p: SolarProject) => (
        <StatusBadge 
          status={p.status === 'Project Completed' ? 'Success' : 'Pro'} 
          customLabel={p.status}
          size="sm" 
        />
      ),
    },
    {
      header: 'Actions',
      align: 'right' as const,
      cell: (p: SolarProject) => (
        <button
          type="button"
          onClick={() => setSelectedProjectForDetails(p)}
          className="p-1.5 rounded-lg text-[#6F6874] hover:text-[#80538F] hover:bg-[#F1EAF5] transition-colors"
          title="Open Project Workspace"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <PageLayout
      title="Project Management"
      scriptTagline="Milestone tracking & field execution planning"
      description="Coordinate solar project lifecycles, Gantt milestone gates, permitting dependencies, technician task dispatch, and site schedules."
      breadcrumbs={getBreadcrumbs('projects')}
      actions={
        <button
          type="button"
          onClick={() => setIsTaskModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#80538F] hover:bg-[#693F77] text-white text-xs font-semibold shadow-subtle hover:shadow-card transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>New Task Item</span>
        </button>
      }
      kpiStats={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[#E8E5EA] shadow-subtle">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Active Projects</p>
            <p className="font-display font-extrabold text-2xl text-[#211D24] mt-0.5">{projects.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">In Active Installation</p>
            <p className="font-display font-extrabold text-2xl text-[#80538F] mt-0.5">
              {projects.filter(p => p.status === 'Installation Started' || p.status === 'Installation Scheduled').length}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Pending Tasks</p>
            <p className="font-display font-extrabold text-2xl text-amber-600 mt-0.5">
              {tasks.filter(t => t.status !== 'Done').length}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Completed Sign-offs</p>
            <p className="font-display font-extrabold text-2xl text-emerald-700 mt-0.5">
              {projects.filter(p => p.status === 'Project Completed').length}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* Navigation Sub-Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#E8E5EA] pb-3">
          {[
            { id: 'projects', label: 'Projects & Milestones', count: projects.length },
            { id: 'tasks', label: 'Action Task Board', count: tasks.length },
            { id: 'technicians', label: 'Technician Schedules & Workload', count: technicians.length },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#80538F] text-white shadow-subtle'
                  : 'text-[#6F6874] hover:text-[#211D24] hover:bg-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#E8E5EA] text-[#6F6874]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* TAB 1: Projects & Milestones Table */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E8E5EA] shadow-subtle">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search projects by customer, address, ID or PM..."
                className="w-full sm:w-80"
              />

              <FilterDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { label: 'All Milestone Stages', value: 'All' },
                  ...statuses.map(s => ({ label: s, value: s }))
                ]}
              />
            </div>

            <div className="rounded-2xl border border-[#E8E5EA] bg-white shadow-subtle overflow-hidden">
              <DataTable
                columns={projectColumns}
                data={filteredProjects}
                keyExtractor={(item) => item.id}
                emptyTitle="No projects found"
                emptyDescription="Try clearing filters or search criteria."
              />
            </div>
          </div>
        )}

        {/* TAB 2: Task Management */}
        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-2xl bg-white border border-[#E8E5EA] shadow-subtle flex items-start justify-between space-x-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-semibold text-[#80538F] bg-[#F1EAF5] px-1.5 py-0.5 rounded">
                      {task.projectId}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      task.priority === 'High' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {task.priority} Priority
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#211D24] leading-snug">
                    {task.title}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] text-[#6F6874] pt-1">
                    <span>Assigned: <strong>{task.assignedTo}</strong></span>
                    <span>•</span>
                    <span>Due: <strong>{task.dueDate}</strong></span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleTaskStatus(task.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    task.status === 'Done'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : task.status === 'In Progress'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-[#F7F6F8] text-[#6F6874] border border-[#E8E5EA] hover:bg-[#80538F] hover:text-white'
                  }`}
                >
                  {task.status}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Technician Schedules & Workload */}
        {activeTab === 'technicians' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                className="p-5 rounded-2xl bg-white border border-[#E8E5EA] shadow-subtle space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-lg bg-[#F1EAF5] text-[#80538F] font-display font-bold text-xs flex items-center justify-center">
                      {tech.name.slice(0, 2).toUpperCase()}
                    </span>
                    <StatusBadge 
                      status={tech.availability === 'Available' ? 'Success' : tech.availability === 'Onsite' ? 'Warning' : 'Pro'}
                      customLabel={tech.availability}
                      size="sm"
                    />
                  </div>

                  <h3 className="font-display font-bold text-base text-[#211D24]">
                    {tech.name}
                  </h3>
                  <p className="text-xs text-[#80538F] font-medium">{tech.role}</p>

                  <div className="pt-3 space-y-1.5 text-xs text-[#6F6874]">
                    <div className="flex justify-between">
                      <span>Workload Allocation:</span>
                      <span className="font-semibold text-[#211D24]">{tech.workloadScorePercent}%</span>
                    </div>
                    <div className="w-full bg-[#E8E5EA] h-1.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${tech.workloadScorePercent}%` }}
                        className={`h-full ${tech.workloadScorePercent > 80 ? 'bg-rose-500' : 'bg-[#80538F]'}`}
                      />
                    </div>
                  </div>

                  <div className="pt-2 text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#6F6874] block mb-1 font-display">Active Sites</span>
                    {tech.activeProjects.length > 0 ? (
                      <ul className="space-y-1 text-[#211D24] font-medium">
                        {tech.activeProjects.map((p, i) => (
                          <li key={i} className="truncate text-[11px]">• {p}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-[#6F6874] text-[11px]">No active field assignment</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8E5EA] text-[11px] text-[#6F6874]">
                  <span>Next slot: <strong>{tech.nextAvailableSlot}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        project={selectedProjectForDetails}
        onClose={() => setSelectedProjectForDetails(null)}
        onToggleMilestone={handleToggleMilestone}
      />

      {/* Task Create Modal */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaveTask={handleSaveTask}
      />
    </PageLayout>
  );
};
