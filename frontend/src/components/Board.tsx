import React from 'react';
import ColumnComponent from './Column';

interface Task {
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
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
  statusColor: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Data {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
  users: { [key: string]: User };
}

interface BoardProps {
  data: Data;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onTaskClick: (task: Task) => void;
}

const Board: React.FC<BoardProps> = ({ data, onDragStart, onDragOver, onDrop, onTaskClick }) => {
  return (
    <div className="p-4" style={{ minHeight: 'calc(100vh - 160px)', maxWidth: '1400px', margin: '0 auto', background: '#F4F6F8' }}>
      <div className="d-flex gap-3 align-items-start overflow-auto pb-3">
        {data.columnOrder.map(columnId => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map(taskId => data.tasks[taskId]);
          
          return (
            <ColumnComponent
              key={column.id}
              column={column}
              tasks={tasks}
              users={data.users}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onTaskClick={onTaskClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Board;
