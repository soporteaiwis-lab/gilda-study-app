import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Tasks</h2>
      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
        <ul className="divide-y divide-slate-700">
          {tasks.map(task => (
            <li key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-750">
              <span className="text-slate-200">{task.title}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                task.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {task.status}
              </span>
            </li>
          ))}
          {tasks.length === 0 && (
            <li className="p-8 text-center text-slate-500">No tasks found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
