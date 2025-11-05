import React from 'react';
import { useSidebar } from '../contexts/SidebarContext';
import ColumnComponent from './Column';
import type { UIBoardData, UITask } from '../types/ui';

interface BoardProps {
  data: UIBoardData;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onTaskClick: (task: UITask) => void;
  onCreateTask?: (columnId: string, statusKey: string) => void;
}

const Board: React.FC<BoardProps> = ({ data, onDragStart, onDragOver, onDrop, onTaskClick, onCreateTask }) => {
  const { isCollapsed } = useSidebar();
  const containerPadding = isCollapsed ? '8px' : '16px';
  const columnGap = isCollapsed ? '10px' : '16px';
  
  return (
    <div 
      className="p-4" 
      style={{ 
        minHeight: 'calc(100vh - 160px)', 
        maxWidth: '100%', 
        margin: '0 auto', 
        background: '#F4F6F8',
        padding: containerPadding,
        paddingLeft: isCollapsed ? '4px' : containerPadding,
      }}
    >
      <div 
        className="d-flex align-items-start pb-3" 
        style={{ 
          gap: columnGap,
          overflowX: 'auto',
          overflowY: 'hidden'
        }}
      >
        {data.columnOrder.map((columnId, index) => {
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
              onCreateTask={onCreateTask ? () => onCreateTask(column.id, column.statusKey || 'to-do') : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Board;
