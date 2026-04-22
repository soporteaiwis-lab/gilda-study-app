import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const initializeDatabase = async () => {
  try {
    // Definición e inicialización de la colección tasks
    const tasksRef = collection(db, 'tasks');
    await addDoc(tasksRef, {
      title: 'Configurar sistema inicial',
      status: 'completed',
      createdAt: serverTimestamp()
    });
    console.log('Colección "tasks" inicializada.');

    // Definición e inicialización de la colección chats
    const chatsRef = collection(db, 'chats');
    await addDoc(chatsRef, {
      userId: 'system_admin',
      messages: 'Base de datos inicializada correctamente.',
      source: 'initDb.ts',
      createdAt: serverTimestamp()
    });
    console.log('Colección "chats" inicializada.');

  } catch (error) {
    console.error('Error inicializando base de datos:', error);
  }
};
