export interface UITask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignees: string[];
  comments: number;
  links: number;
  progress: string;
  type: string;
  backendData?: any;
}

export interface UIUser {
  id: string;
  name: string;
  avatar: string;
}

export interface UIColumn {
  id: string;
  title: string;
  taskIds: string[];
  statusColor: string;
  statusKey?: string;
}

export interface UIBoardData {
  tasks: { [key: string]: UITask };
  columns: { [key: string]: UIColumn };
  columnOrder: string[];
  users: { [key: string]: UIUser };
}

