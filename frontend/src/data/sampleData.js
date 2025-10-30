export const initialData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'User Authentication System',
      description: 'Implement secure login and registration with JWT tokens',
      status: 'Not Started',
      priority: 'High',
      dueDate: '25 Mar 2024',
      assignees: ['user-1', 'user-2'],
      comments: 8,
      links: 3,
      progress: '0/5',
      type: 'backend'
    },
    'task-2': {
      id: 'task-2',
      title: 'Database Schema Design',
      description: 'Design and implement database schema for user management',
      status: 'Not Started',
      priority: 'High',
      dueDate: '28 Mar 2024',
      assignees: ['user-3', 'user-4'],
      comments: 12,
      links: 2,
      progress: '2/5',
      type: 'backend'
    },
    'task-3': {
      id: 'task-3',
      title: 'API Endpoints Development',
      description: 'Create RESTful API endpoints for CRUD operations',
      status: 'In Progress',
      priority: 'High',
      dueDate: '30 Mar 2024',
      assignees: ['user-1', 'user-5'],
      comments: 15,
      links: 4,
      progress: '3/5',
      type: 'backend'
    },
    'task-4': {
      id: 'task-4',
      title: 'Frontend Dashboard UI',
      description: 'Build responsive dashboard with modern design',
      status: 'In Progress',
      priority: 'Medium',
      dueDate: '02 Apr 2024',
      assignees: ['user-2', 'user-6'],
      comments: 6,
      links: 2,
      progress: '4/5',
      type: 'frontend'
    },
    'task-5': {
      id: 'task-5',
      title: 'Unit Testing Implementation',
      description: 'Write comprehensive unit tests for all components',
      status: 'Waiting Review',
      priority: 'Medium',
      dueDate: '05 Apr 2024',
      assignees: ['user-3', 'user-4'],
      comments: 4,
      links: 1,
      progress: '5/5',
      type: 'test'
    },
    'task-6': {
      id: 'task-6',
      title: 'Performance Optimization',
      description: 'Optimize application performance and loading times',
      status: 'Testing',
      priority: 'Low',
      dueDate: '07 Apr 2024',
      assignees: ['user-5', 'user-6'],
      comments: 2,
      links: 0,
      progress: '3/5',
      type: 'frontend'
    },
    'task-7': {
      id: 'task-7',
      title: 'Security Audit',
      description: 'Conduct comprehensive security audit and fix vulnerabilities',
      status: 'Testing',
      priority: 'High',
      dueDate: '10 Apr 2024',
      assignees: ['user-1', 'user-2'],
      comments: 7,
      links: 3,
      progress: '4/5',
      type: 'test'
    },
    'task-8': {
      id: 'task-8',
      title: 'Documentation Update',
      description: 'Update API documentation and user guides',
      status: 'Done',
      priority: 'Low',
      dueDate: '12 Apr 2024',
      assignees: ['user-3', 'user-4'],
      comments: 1,
      links: 2,
      progress: '5/5',
      type: 'product'
    },
    'task-9': {
      id: 'task-9',
      title: 'Mobile App Integration',
      description: 'Integrate mobile app with backend services',
      status: 'Done',
      priority: 'Medium',
      dueDate: '15 Apr 2024',
      assignees: ['user-5', 'user-6'],
      comments: 3,
      links: 1,
      progress: '5/5',
      type: 'frontend'
    },
    'task-10': {
      id: 'task-10',
      title: 'Deployment Pipeline Setup',
      description: 'Configure CI/CD pipeline for automated deployment',
      status: 'Done',
      priority: 'High',
      dueDate: '18 Apr 2024',
      assignees: ['user-1', 'user-3'],
      comments: 5,
      links: 4,
      progress: '5/5',
      type: 'devops'
    },
    'task-11': {
      id: 'task-11',
      title: 'Analytics Dashboard',
      description: 'Create analytics dashboard for user behavior tracking',
      status: 'Not Started',
      priority: 'Low',
      dueDate: '20 Apr 2024',
      assignees: ['user-2', 'user-4'],
      comments: 0,
      links: 0,
      progress: '0/5',
      type: 'data'
    },
    'task-12': {
      id: 'task-12',
      title: 'Email Notification System',
      description: 'Implement automated email notifications for users',
      status: 'Not Started',
      priority: 'Medium',
      dueDate: '22 Apr 2024',
      assignees: ['user-6'],
      comments: 2,
      links: 1,
      progress: '1/5',
      type: 'backend'
    }
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-11'],
      statusColor: '#6b7280'
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-3', 'task-4'],
      statusColor: '#3b82f6'
    },
    'column-3': {
      id: 'column-3',
      title: 'Waiting Review',
      taskIds: ['task-5'],
      statusColor: '#8b5cf6'
    },
    'column-4': {
      id: 'column-4',
      title: 'Testing',
      taskIds: ['task-6', 'task-7'],
      statusColor: '#f97316'
    },
    'column-5': {
      id: 'column-5',
      title: 'Done',
      taskIds: ['task-8', 'task-9', 'task-10'],
      statusColor: '#10b981'
    }
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5'],
  users: {
    'user-1': { id: 'user-1', name: 'John Doe', avatar: 'JD' },
    'user-2': { id: 'user-2', name: 'Jane Smith', avatar: 'JS' },
    'user-3': { id: 'user-3', name: 'Mike Johnson', avatar: 'MJ' },
    'user-4': { id: 'user-4', name: 'Sarah Wilson', avatar: 'SW' },
    'user-5': { id: 'user-5', name: 'David Brown', avatar: 'DB' },
    'user-6': { id: 'user-6', name: 'Lisa Davis', avatar: 'LD' }
  }
};
