import React, { useState, useEffect } from 'react';

const getAudioContext = () => {
  if (!window.sharedAudioContext) {
    window.sharedAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (window.sharedAudioContext.state === 'suspended') {
    window.sharedAudioContext.resume();
  }
  return window.sharedAudioContext;
};

const playPageFlip = () => {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 1600;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();
  } catch (e) {}
};

const playCrumple = () => {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 1000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();
  } catch (e) {}
};

const playAlertBeep = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    osc.type = 'sine'; osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  } catch(e) {}
};

const playPop = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    osc.type = 'sine'; osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.1);
  } catch(e) {}
};

const playClink = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    osc.type = 'triangle'; osc.frequency.setValueAtTime(2000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.1);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.1);
  } catch(e) {}
};

const playBurn = () => {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.6;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 500;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();
  } catch(e) {}
};

const lofiAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3');
lofiAudio.loop = true;

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [handDirection, setHandDirection] = useState('left');
  const [flipDirection, setFlipDirection] = useState('next');

  const turnPage = (target) => {
    if (isAnimating || target === currentPage) return;
    const dir = target > currentPage ? 'next' : 'prev';
    setHandDirection(dir === 'next' ? 'left' : 'right');
    setFlipDirection(dir);
    playPageFlip();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(target);
      setTimeout(() => setIsAnimating(false), 750); // Finish 1500ms total
    }, 750); // Swap the DOM content directly at the 50% centerline
  };

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('planner-tasks');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, text: 'Review wireframes with team', done: false, matrix: 'NU_NI', assignee: '' },
      { id: 2, text: 'Design realistic toggle button', done: false, matrix: 'UR_IM', assignee: '' },
      { id: 3, text: 'Generate texture assets for corkboard', done: false, matrix: 'NU_IM', assignee: 'Alice' },
      { id: 4, text: 'Finalize presentation for client', done: false, matrix: 'UR_NI', assignee: '' },
    ];
  });

  const [trashedTasks, setTrashedTasks] = useState(() => {
    const saved = localStorage.getItem('planner-trashed');
    return saved ? JSON.parse(saved) : [];
  });

  const [trashedHabits, setTrashedHabits] = useState(() => {
    const saved = localStorage.getItem('planner-trashed-habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [journalText, setJournalText] = useState(() => {
    return localStorage.getItem('planner-journal') || '';
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('planner-habits');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, text: 'Drink Water (2L)', checks: [false, true, false, false, false, false, false] },
      { id: 2, text: 'Read 20 pages', checks: [true, true, true, false, false, false, false] },
    ];
  });

  const [toggles, setToggles] = useState({
    notifications: true,
    autoSync: false,
    darkMode: false,
  });

  const [activeTab, setActiveTab] = useState('ALL'); 
  const [completionValue, setCompletionValue] = useState(0);

  const POMODORO_START = 25 * 60; 
  const [pomodoroLeft, setPomodoroLeft] = useState(POMODORO_START);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerRunning && pomodoroLeft > 0) {
      interval = setInterval(() => setPomodoroLeft(prev => prev - 1), 1000);
    } else if (pomodoroLeft === 0 && isTimerRunning) {
      playAlertBeep();
      setIsTimerRunning(false);
      lofiAudio.pause();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroLeft]);

  const toggleTimer = () => {
    if (!isTimerRunning) {
      lofiAudio.play().catch(e=>e);
    } else {
      lofiAudio.pause();
    }
    setIsTimerRunning(!isTimerRunning);
  };
  const resetTimer = () => {
    setIsTimerRunning(false);
    lofiAudio.pause();
    lofiAudio.currentTime = 0;
    setPomodoroLeft(POMODORO_START);
  };

  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newMatrix, setNewMatrix] = useState('NU_NI'); 
  const [newAssignee, setNewAssignee] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitText, setNewHabitText] = useState('');

  const [editingTask, setEditingTask] = useState(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0});
  
  const [deletingId, setDeletingId] = useState(null);
  const [isTrashHover, setIsTrashHover] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks => {
        let updated = false;
        const now = new Date().getTime();
        const nextTasks = prevTasks.map(t => {
          if (!t.done && t.dueDate && !t.notified) {
            const dueTime = new Date(t.dueDate).getTime();
            const hr24 = 24 * 60 * 60 * 1000;
            if (dueTime - now > 0 && dueTime - now <= hr24) {
              if (toggles.notifications) {
                 playAlertBeep();
                 if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(`Deadline Approaching!`, { body: `"${t.text}" is due within 24 hours.` });
                 }
              }
              updated = true;
              return { ...t, notified: true };
            }
          }
          return t;
        });
        return updated ? nextTasks : prevTasks;
      });
    }, 60000); 
    return () => clearInterval(interval);
  }, [toggles.notifications]);

  useEffect(() => {
    localStorage.setItem('planner-tasks', JSON.stringify(tasks));
    localStorage.setItem('planner-trashed', JSON.stringify(trashedTasks));
    localStorage.setItem('planner-journal', journalText);
    localStorage.setItem('planner-habits', JSON.stringify(habits));
    localStorage.setItem('planner-trashed-habits', JSON.stringify(trashedHabits));

    const doneCount = tasks.filter(t => t.done).length;
    setCompletionValue(tasks.length === 0 ? 0 : (doneCount / tasks.length) * 100);
  }, [tasks, trashedTasks, journalText, habits, trashedHabits]);

  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const triggerDelete = (id) => {
    setDeletingId(id);
    playCrumple();
    setTimeout(() => {
      const taskToTrash = tasks.find(t => t.id === id);
      if (taskToTrash) {
         setTrashedTasks(prev => [...prev, { ...taskToTrash, trashedAt: Date.now() }]);
      }
      setTasks(prev => prev.filter(t => t.id !== id));
      setDeletingId(null);
    }, 450); 
  };

  const handleTrashDrop = (e) => {
    e.preventDefault();
    setIsTrashHover(false);
    const taskId = Number(e.dataTransfer.getData('taskId'));
    if (!taskId) return;
    triggerDelete(taskId);
  };

  const restoreTask = (id) => {
    playPop();
    const taskToRestore = trashedTasks.find(t => t.id === id);
    if (!taskToRestore) return;
    setTasks([...tasks, taskToRestore]);
    setTrashedTasks(prev => prev.filter(t => t.id !== id));
  };
  const permaDeleteTask = (id) => {
    playBurn();
    setTrashedTasks(prev => prev.filter(t => t.id !== id));
  };

  const addNewTask = (e) => {
    if (e) e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTaskText, done: false, matrix: newMatrix, assignee: newAssignee.trim(), dueDate: newDueDate, notified: false }]);
    setNewTaskText(''); setNewMatrix('NU_NI'); setNewAssignee(''); setNewDueDate(''); setIsAdding(false);
  };
  const saveEditedTask = () => {
    if (editingTask.assignee) editingTask.assignee = editingTask.assignee.trim();
    setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
    setEditingTask(null);
  };

  const addNewHabit = (e) => {
    if (e) e.preventDefault();
    if (!newHabitText.trim()) return;
    setHabits([...habits, { id: Date.now(), text: newHabitText, checks: [false,false,false,false,false,false,false] }]);
    setNewHabitText(''); setIsAddingHabit(false);
  };
  const toggleHabit = (habitId, dayIndex) => {
    playClink();
    setHabits(habits.map(h => {
       if (h.id === habitId) {
          const newChecks = [...h.checks];
          newChecks[dayIndex] = !newChecks[dayIndex];
          return { ...h, checks: newChecks };
       }
       return h;
    }));
  };
  const deleteHabit = (habitId) => {
    const habitToTrash = habits.find(h => h.id === habitId);
    if (habitToTrash) {
      setTrashedHabits([...trashedHabits, { ...habitToTrash, trashedAt: Date.now() }]);
    }
    setHabits(habits.filter(h => h.id !== habitId));
  };
  const restoreHabit = (id) => {
    const habitToRestore = trashedHabits.find(h => h.id === id);
    if (!habitToRestore) return;
    setHabits([...habits, habitToRestore]);
    setTrashedHabits(prev => prev.filter(h => h.id !== id));
  };
  const permaDeleteHabit = (id) => setTrashedHabits(prev => prev.filter(h => h.id !== id));

  const toggleSwitch = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PRIO') return t.matrix === 'UR_IM' && !t.done;
    return t.done;
  });
  const getMatrixTasks = (matrixCode) => tasks.filter(t => {
    if (t.matrix !== matrixCode) return false;
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PRIO') return t.matrix === 'UR_IM' && !t.done;
    return t.done;
  });
  
  const handleDragStart = (e, taskId) => { e.dataTransfer.setData('taskId', taskId); e.target.style.opacity = '0.5'; };
  const handleDragEnd = (e) => { e.target.style.opacity = '1'; setIsTrashHover(false); };
  const handleDrop = (e, targetMatrix) => {
    e.preventDefault();
    const taskId = Number(e.dataTransfer.getData('taskId'));
    if (!taskId) return;
    setTasks(tasks.map(t => t.id === taskId ? { ...t, matrix: targetMatrix } : t));
  };
  const handleDragOver = (e) => e.preventDefault(); 
  
  const handleStickyMouseDown = (e) => setDragStartPos({ x: e.clientX, y: e.clientY });
  const handleStickyMouseUp = (e, task) => {
    const dx = Math.abs(e.clientX - dragStartPos.x);
    const dy = Math.abs(e.clientY - dragStartPos.y);
    if (dx < 3 && dy < 3) setEditingTask(task);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const matrixColorMap = { 'UR_IM': '#ff9b9b', 'NU_IM': '#8dc1fd', 'UR_NI': '#fdf38d', 'NU_NI': '#b1fcb1' };
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="planner-binder">
      
      {/* Dog-Ear Navigation */}
      {(currentPage === 1 || currentPage === 2) && (
        <div className="page-corner page-corner-right" onClick={() => turnPage(currentPage + 1)} title="Next Page">
          <div className="fold"></div>
        </div>
      )}
      {(currentPage === 2 || currentPage === 3) && (
        <div className="page-corner page-corner-left" onClick={() => turnPage(currentPage - 1)} title="Previous Page">
          <div className="fold"></div>
        </div>
      )}

      <div className="binder-rings">
        {[...Array(6)].map((_, i) => <div key={i} className="ring"></div>)}
      </div>

      {currentPage === 1 && (
        <div className="index-tabs">
          <div className={`index-tab tab-all ${activeTab === 'ALL' ? 'active' : ''}`} onClick={() => setActiveTab('ALL')}>ALL</div>
          <div className={`index-tab tab-yellow ${activeTab === 'PRIO' ? 'active' : ''}`} onClick={() => setActiveTab('PRIO')}>PRIO</div>
          <div className={`index-tab tab-green ${activeTab === 'DONE' ? 'active' : ''}`} onClick={() => setActiveTab('DONE')}>DONE</div>
        </div>
      )}

      {/* LEFT PAPER STACK */}
      <div className={`paper-stack ${isAnimating ? (flipDirection === 'next' ? 'flip-drop-in-left' : 'flip-lift-out-left') : ''}`}>
        <div className="paper-page paper-page-under-1"></div>
        <div className="paper-page paper-page-under-2"></div>
        <div className={`paper-page paper-page-main ${currentPage === 3 ? 'blueprint-mode' : ''}`}>
          
          {currentPage === 1 && (
             <>
                <div className="task-item header">
                  <div>
                    <h1>Tasks To-Do</h1>
                    <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <button className="btn-embossed" style={{ marginBottom: '8px' }} onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? 'Cancel' : '+ Add New'}
                  </button>
                </div>

                {isAdding && (
                  <form onSubmit={addNewTask} className="task-item flex flex-wrap" style={{ marginBottom: '28px' }}>
                    <input type="checkbox" className="metal-checkbox" disabled />
                    <input 
                      type="text" className="task-input" placeholder="Write a task..." 
                      value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} autoFocus
                    />
                    <select className="matrix-select" value={newMatrix} onChange={(e) => setNewMatrix(e.target.value)}>
                      <option value="UR_IM">Urg / Imp</option>
                      <option value="UR_NI">Urg / Not Imp</option>
                      <option value="NU_IM">Not Urg / Imp</option>
                      <option value="NU_NI">Not Urg / Not Imp</option>
                    </select>
                    <input 
                      type="text" className="task-input assignee-input" placeholder="Assign to..." 
                      value={newAssignee} onChange={(e) => setNewAssignee(e.target.value)} maxLength="12"
                    />
                    <input 
                      type="date" className="task-input" style={{ width: '100px', fontSize: '10px' }}
                      value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} title="Set Due Date"
                    />
                    <button type="submit" className="btn-embossed" style={{ marginLeft: '10px', padding: '2px 8px', borderColor: '#4CAF50', color: '#1b5e20' }}>Save</button>
                  </form>
                )}

                {filteredTasks.length === 0 && !isAdding && (
                  <div className="task-item" style={{ color: '#aaa', fontStyle: 'italic', height: '28px' }}>No tasks to show...</div>
                )}

                {filteredTasks.map((task) => (
                  <div key={task.id} className={`task-item ${deletingId === task.id ? 'deleting-crunch' : ''}`}>
                    <input type="checkbox" className="metal-checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
                    <span className={`task-text ${task.done ? 'done' : ''}`} onClick={() => toggleTask(task.id)} style={{ cursor: 'pointer' }}>{task.text}</span>
                    {!task.done && <div className="matrix-dot" style={{ backgroundColor: matrixColorMap[task.matrix] }} title={task.matrix}></div>}
                    {task.assignee && task.assignee !== '' && !task.done && (
                       <span style={{ fontSize: '10px', background: '#ccc', padding: '2px 5px', borderRadius: '4px', marginLeft: '10px' }}>@{task.assignee}</span>
                    )}
                    <button className="delete-btn" onClick={() => triggerDelete(task.id)}>×</button>
                  </div>
                ))}
             </>
          )}

          {currentPage === 2 && (
             <>
                <div className="task-item header">
                  <div>
                    <h1 style={{ fontSize: '32px', color: '#555' }}>Incinerator History</h1>
                    <p style={{ fontStyle: 'italic', color: '#666' }}>Restore deleted tasks to the Board.</p>
                  </div>
                </div>
                {trashedTasks.length === 0 && (
                  <div className="task-item" style={{ color: '#aaa', fontStyle: 'italic' }}>Archive is completely empty...</div>
                )}
                {trashedTasks.map(task => (
                  <div key={task.id} className="task-item archive-item" style={{ borderBottom: '1px dotted rgba(0,0,0,0.1)' }}>
                    <span className="task-text" style={{ color: '#888', textDecoration: 'line-through' }}>{task.text}</span>
                    <button className="btn-embossed mini" onClick={() => restoreTask(task.id)} style={{ marginRight: '10px', color: '#2b78e4' }}>Restore</button>
                    <button className="delete-btn" style={{ opacity: 1, padding: 0, fontSize: '10px', textTransform: 'uppercase' }} onClick={() => permaDeleteTask(task.id)}>Burn</button>
                  </div>
                ))}

                <h2 style={{ fontSize: '24px', color: '#555', marginTop: '40px', borderBottom: '1px solid #aaa' }}>Incinerated Habits</h2>
                {trashedHabits.length === 0 && (
                  <div className="task-item" style={{ color: '#aaa', fontStyle: 'italic' }}>Habit Archive is empty...</div>
                )}
                {trashedHabits.map(habit => (
                  <div key={habit.id} className="task-item archive-item" style={{ borderBottom: '1px dotted rgba(0,0,0,0.1)' }}>
                    <span className="task-text" style={{ color: '#888', textDecoration: 'line-through' }}>{habit.text}</span>
                    <button className="btn-embossed mini" onClick={() => restoreHabit(habit.id)} style={{ marginRight: '10px', color: '#2b78e4' }}>Restore</button>
                    <button className="delete-btn" style={{ opacity: 1, padding: 0, fontSize: '10px', textTransform: 'uppercase' }} onClick={() => permaDeleteHabit(habit.id)}>Burn</button>
                  </div>
                ))}
             </>
          )}

          {currentPage === 3 && (
             <div className="blueprint-content">
                <div className="task-item header" style={{ borderBottomColor: 'rgba(255,255,255,0.3)' }}>
                  <div>
                    <h1>Habit Blueprint</h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>Track weekly disciplines</p>
                  </div>
                  <button className="btn-embossed blueprint-btn" onClick={() => setIsAddingHabit(!isAddingHabit)}>+ New Habit</button>
                </div>

                <div className="habit-days-header">
                   <div style={{ flex: 1 }}></div>
                   {daysOfWeek.map((d, i) => <div key={i} className="habit-day-label">{d}</div>)}
                   <div style={{ width: '25px' }}></div>
                </div>

                {isAddingHabit && (
                  <form onSubmit={addNewHabit} className="task-item flex" style={{ marginBottom: '28px' }}>
                    <input 
                      type="text" className="task-input blueprint-input" placeholder="Type new habit..." 
                      value={newHabitText} onChange={(e) => setNewHabitText(e.target.value)} autoFocus
                    />
                    <button type="submit" className="btn-embossed mini blueprint-btn" style={{ marginLeft: '10px' }}>Save</button>
                  </form>
                )}

                {habits.map((h) => (
                  <div key={h.id} className="task-item habit-row">
                    <span className="task-text habit-text">{h.text}</span>
                    {h.checks.map((isChecked, dayIdx) => (
                       <input 
                         key={dayIdx} type="checkbox" className="metal-checkbox habit-check" 
                         checked={isChecked} onChange={() => toggleHabit(h.id, dayIdx)} 
                       />
                    ))}
                    <button className="delete-btn" style={{ color: '#f55' }} onClick={() => deleteHabit(h.id)}>×</button>
                  </div>
                ))}
             </div>
          )}

        </div>
      </div>

      {/* RIGHT DASHBOARD */}
      <div className={`dashboard-area ${currentPage === 2 ? 'journal-mode' : ''} ${isAnimating ? (flipDirection === 'next' ? 'flip-lift-out-right' : 'flip-drop-in-right') : ''}`}>
        
        {currentPage === 1 && (
          <>
            <div className="corkboard-matrix">
              {[{ code: 'UR_IM', title: 'URGENT / IMP', color: 'red' }, 
                { code: 'NU_IM', title: 'NOT URG / IMP', color: 'blue' }, 
                { code: 'UR_NI', title: 'URGENT / NOT IMP', color: 'yellow' }, 
                { code: 'NU_NI', title: 'NOT URG / NOT IMP', color: 'green' }]
                .map((quad) => (
                 <div key={quad.code} className="matrix-quadrant" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, quad.code)}>
                    <div className="matrix-label">{quad.title}</div>
                    {getMatrixTasks(quad.code).map((t, idx) => (
                       <div 
                         key={t.id} draggable="true"
                         onDragStart={(e) => handleDragStart(e, t.id)} onDragEnd={handleDragEnd}
                         onMouseDown={handleStickyMouseDown} onMouseUp={(e) => handleStickyMouseUp(e, t)}
                         className={`sticky-note ${quad.color} ${deletingId === t.id ? 'deleting-crunch' : ''}`} 
                         title="Click to Edit, Drag to move or trash"
                         style={{ top: `${15 + idx * 5}px`, left: `${5 + idx * 10}px`, transform: `rotate(${(idx % 2 === 0 ? '-3' : '2')}deg)`, cursor: 'grab' }}
                       >
                         <div className="push-pin"></div>
                         {t.assignee && t.assignee !== '' && (
                            <div className="polaroid">
                              <div className="paperclip"></div>
                              <div className="polaroid-img" style={{ backgroundImage: `url('https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(t.assignee)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf')`}}></div>
                              <div className="polaroid-name">{t.assignee}</div>
                            </div>
                         )}
                         {t.text}
                         {t.done && (
                             <div style={{
                                position: 'absolute', top: '15px', left: '15px', 
                                fontSize: '28px', color: 'rgba(40,167,69,0.8)', 
                                transform: 'rotate(-15deg)', fontWeight: '900', 
                                fontFamily: 'Impact, sans-serif', textShadow: '2px 2px 5px rgba(0,0,0,0.3)',
                                pointerEvents: 'none', border: '3px solid rgba(40,167,69,0.8)', padding: '2px 8px', borderRadius: '8px'
                             }}>✔ DONE</div>
                         )}
                         {t.dueDate && (
                            <div style={{ 
                               position: 'absolute', bottom: '8px', right: '8px',
                               fontSize: new Date(t.dueDate).getTime() < Date.now() ? '14px' : '11px', 
                               fontWeight: 'bold', 
                               fontFamily: new Date(t.dueDate).getTime() < Date.now() ? 'Impact, sans-serif' : '"Comic Sans MS", cursive',
                               color: new Date(t.dueDate).getTime() < Date.now() ? '#d32f2f' : 'rgba(0,0,0,0.5)',
                               border: new Date(t.dueDate).getTime() < Date.now() ? '2px solid #d32f2f' : 'none',
                               padding: new Date(t.dueDate).getTime() < Date.now() ? '2px 6px' : '0',
                               transform: new Date(t.dueDate).getTime() < Date.now() ? 'rotate(-6deg)' : 'none',
                               borderRadius: '4px',
                               zIndex: 10,
                               background: new Date(t.dueDate).getTime() < Date.now() ? 'rgba(255,255,255,0.4)' : 'transparent'
                            }}>
                               {new Date(t.dueDate).getTime() < Date.now() ? "OVERDUE" : `Due: ${new Date(t.dueDate).toLocaleDateString()}`}
                            </div>
                         )}
                       </div>
                    ))}
                 </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', padding: '0 10px' }}>
              <div className="gauge-block">
                <h3 style={{ marginBottom: '10px', color: '#444', fontSize: '13px' }}>Completion</h3>
                <div className="gauge-container short">
                  <div className="gauge-dial-bg" style={{ overflow: 'hidden' }}>
                    <div className="gauge-needle" style={{ transform: `rotate(${-90 + (completionValue * 1.8)}deg)` }}></div>
                    <div className="gauge-center"></div>
                  </div>
                  <div className="gauge-glass"></div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold', fontSize: '14px', color: '#222' }}>
                  {Math.round(completionValue)}% Done
                </div>
              </div>

              <div className="gauge-block">
                <h3 style={{ marginBottom: '10px', color: '#444', fontSize: '13px' }}>Focus Timer</h3>
                <div className="gauge-container stop-watch">
                  <div className="gauge-dial-bg" style={{ borderRadius: '50%' }}>
                    <div className="gauge-needle timer" style={{ transform: `rotate(${(1 - pomodoroLeft / POMODORO_START) * 360}deg)` }}></div>
                    <div className="gauge-center timer"></div>
                  </div>
                  <div className="gauge-glass"></div>
                </div>
                <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                  <button className="btn-embossed mini" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={toggleTimer}>{isTimerRunning ? '⏸' : '▶'}</button>
                  <button className="btn-embossed mini" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={resetTimer}>↺</button>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', marginLeft: '5px', lineHeight: '20px' }}>{formatTime(pomodoroLeft)}</div>
                </div>
              </div>
              
              <div className={`gauge-block trash-zone ${isTrashHover ? 'hover' : ''}`} onDragOver={(e) => { e.preventDefault(); setIsTrashHover(true); }} onDragLeave={() => setIsTrashHover(false)} onDrop={handleTrashDrop}>
                <h3 style={{ marginBottom: '10px', color: '#444', fontSize: '13px' }}>Incinerator</h3>
                <div className="trash-bin">
                   <div className="trash-lid"></div>
                   <div className="trash-body"><div className="trash-lines"></div><div className="trash-lines"></div><div className="trash-lines"></div></div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: '#666', fontWeight: 'bold' }}>Drag to Bin</div>
              </div>
            </div>
          </>
        )}

        {currentPage === 2 && (
          <div className="journal-paper">
            <div className="journal-header">Brainstorming Pad</div>
            <textarea 
               className="journal-textarea" 
               placeholder="Scribble stream-of-consciousness ideas, grocery lists, or un-assigned thoughts here. Everything auto-saves instantly off the grid!"
               value={journalText} onChange={(e) => setJournalText(e.target.value)}
            ></textarea>
          </div>
        )}

        {currentPage === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
             <h1 style={{ fontSize: '32px', color: '#555', borderBottom: '2px solid #aaa', paddingBottom: '10px' }}>System Control Panel</h1>
             
             <div style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
                <div className="gauge-block" style={{ background: 'rgba(0,0,0,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid #ccc' }}>
                   <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>Global Settings</h3>
                    
                   <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', width: '100%' }}>
                     <span style={{ width: '120px', fontSize: '14px', fontWeight: 'bold' }}>Notifications: </span>
                     <div className={`metal-toggle ${toggles.notifications ? 'active' : ''}`} onClick={() => toggleSwitch('notifications')}><div className="slider"></div></div>
                   </div>
                   
                   <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', width: '100%' }}>
                     <span style={{ width: '120px', fontSize: '14px', fontWeight: 'bold' }}>Cloud Sync: </span>
                     <div className={`metal-toggle ${toggles.autoSync ? 'active' : ''}`} onClick={() => toggleSwitch('autoSync')}><div className="slider"></div></div>
                   </div>

                   <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                     <span style={{ width: '120px', fontSize: '14px', fontWeight: 'bold' }}>Local Backup: </span>
                     <div className={`metal-toggle active`} style={{ cursor: 'default' }} title="Always On"><div className="slider"></div></div>
                   </div>
                </div>

                <div className="gauge-block" style={{ background: 'rgba(0,0,0,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid #ccc', alignItems: 'flex-start' }}>
                   <h3 style={{ fontSize: '16px', marginBottom: '20px', width: '100%', textAlign: 'center' }}>Analytics Core</h3>
                   <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '15px', color: '#444' }}>
                      <li style={{ marginBottom: '15px' }}>Total Active Tasks: <strong>{tasks.length}</strong></li>
                      <li style={{ marginBottom: '15px' }}>Total Habits Tracked: <strong>{habits.length}</strong></li>
                      <li style={{ marginBottom: '15px' }}>Items Incinerated: <strong>{trashedTasks.length + trashedHabits.length}</strong></li>
                      <li style={{ marginBottom: '15px' }}>Local Save Size: <strong>{( (JSON.stringify(tasks).length + JSON.stringify(habits).length + JSON.stringify(trashedTasks).length + JSON.stringify(trashedHabits).length + journalText.length) / 1024 ).toFixed(2)} KB</strong></li>
                   </ul>
                </div>
             </div>
          </div>
        )}

      </div>

      {editingTask && (
        <div className="modal-backdrop" onClick={() => setEditingTask(null)}>
          <div className={`giant-sticky ${editingTask.matrix === 'UR_IM'? 'red' : editingTask.matrix === 'NU_IM'? 'blue' : editingTask.matrix === 'UR_NI'? 'yellow' : 'green'}`} onClick={(e) => e.stopPropagation()}>
            <div className="push-pin huge-pin"></div>
            <h2 style={{ fontFamily: '"Comic Sans MS", cursive', marginBottom: '10px', textAlign: 'center', opacity: 0.7 }}>Edit Sticky Note</h2>
            <textarea className="sticky-textarea" value={editingTask.text} onChange={(e) => setEditingTask({...editingTask, text: e.target.value})} autoFocus />
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: '"Comic Sans MS", cursive', fontSize: '14px', fontWeight: 'bold' }}>Delegation:</span>
                <input type="text" className="giant-matrix-select" placeholder="Type a team name..." value={editingTask.assignee || ''} onChange={(e) => setEditingTask({...editingTask, assignee: e.target.value})} maxLength="15" style={{ width: '180px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: '"Comic Sans MS", cursive', fontSize: '14px', fontWeight: 'bold' }}>Move Board:</span>
                <select className="giant-matrix-select" value={editingTask.matrix} onChange={(e) => setEditingTask({...editingTask, matrix: e.target.value})}>
                  <option value="UR_IM">Urg / Imp (Red)</option>
                  <option value="UR_NI">Urg / Not Imp (Yellow)</option>
                  <option value="NU_IM">Not Urg / Imp (Blue)</option>
                  <option value="NU_NI">Not Urg / Not Imp (Green)</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: '"Comic Sans MS", cursive', fontSize: '14px', fontWeight: 'bold' }}>Due Date:</span>
                <input type="date" className="giant-matrix-select" value={editingTask.dueDate || ''} onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})} style={{ width: '180px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button className="btn-embossed sticky-btn" onClick={() => setEditingTask(null)}>Discard</button>
                <button className="btn-embossed sticky-btn primary" onClick={saveEditedTask}>Restick Note!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAnimating && (
         <div className={`the-3d-hand ${handDirection}`}>🤚🏽</div>
      )}

    </div>
  );
}

export default App;
