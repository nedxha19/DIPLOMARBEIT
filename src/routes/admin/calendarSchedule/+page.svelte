
<script>
	import { onMount } from 'svelte';

	let today = new Date();
	let activeDay = today.getDate();
	let month = today.getMonth();
	let year = today.getFullYear();
	let dateInput = '';
	let showAddTask = false;
	let taskName = '', taskAuthor = '', taskDescription = '', taskDate = '';
	let selectedTasks = [];
	let errorMsg = '';

	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	let eventsArr = [];
	let eventLookup = new Map();

	// === INIT ===
	onMount(() => {
		const stored = localStorage?.getItem('events');
		if (stored) eventsArr = JSON.parse(stored);
		rebuildEventLookup();
		updateTasks(activeDay);
	});

	$: rebuildEventLookup();
	$: updateTasks(activeDay);

	// Helper functions
	const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
	const getDayOfWeek = (y, m, d) => new Date(y, m, d).toLocaleDateString('en-US', { weekday: 'short' });
	const getKey = (d, m, y) => `${d}-${m}-${y}`;

	function rebuildEventLookup() {
		eventLookup.clear();
		eventsArr.forEach(ev => eventLookup.set(getKey(ev.day, ev.month, ev.year), true));
	}

	const hasTask = (d) => eventLookup.has(getKey(d, month + 1, year));
	const isToday = (d) => {
		const now = new Date();
		return d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
	};
	const selectDay = (d) => (activeDay = d);

	function updateTasks(d) {
		const found = eventsArr.find((e) => e.day === d && e.month === month + 1 && e.year === year);
		selectedTasks = found?.events ?? [];
		saveEvents();
	}

	function prevMonth() {
		month = month === 0 ? 11 : month - 1;
		year = month === 11 ? year - 1 : year;
		activeDay = 1;
	}

	function nextMonth() {
		month = month === 11 ? 0 : month + 1;
		year = month === 0 ? year + 1 : year;
		activeDay = 1;
	}

	function gotoDate() {
		const [m, y] = dateInput.split('/').map(Number);
		if (m >= 1 && m <= 12 && y.toString().length === 4) {
			month = m - 1;
			year = y;
			activeDay = 1;
		} else {
			alert('Invalid Date');
		}
	}

	function addTask() {
		errorMsg = '';
		if (!taskName || !taskAuthor || !taskDescription || !taskDate) {
			errorMsg = 'Please fill all fields.';
			return;
		}

		const dateObj = new Date(taskDate);
		const d = dateObj.getDate();
		const m = dateObj.getMonth() + 1;
		const y = dateObj.getFullYear();

		const existing = eventsArr.find((e) => e.day === d && e.month === m && e.year === y);
		if (existing?.events.some((ev) => ev.name === taskName)) {
			errorMsg = 'Task name must be unique for this day.';
			return;
		}

		const newTask = {
			id: crypto.randomUUID(),
			name: taskName,
			author: taskAuthor,
			description: taskDescription,
			date: taskDate,
			done: false
		};

		if (existing) {
			existing.events.push(newTask);
		} else {
			eventsArr.push({ day: d, month: m, year: y, events: [newTask] });
		}

		rebuildEventLookup();
		month = m - 1;
		year = y;
		activeDay = d;
		updateTasks(d);

		taskName = taskAuthor = taskDescription = taskDate = '';
		showAddTask = false;
	}

	const toggleDone = (task) => {
		task.done = !task.done;
		saveEvents();
		updateTasks(activeDay);
	};

	const saveEvents = () => localStorage?.setItem('events', JSON.stringify(eventsArr));

	const gotoToday = () => {
		const now = new Date();
		month = now.getMonth();
		year = now.getFullYear();
		activeDay = now.getDate();
	};
</script>

<section class="admin-container">
	<div class="calendar-header admin-section">
		<div class="header-content">
			<h1 class="admin-heading-1">Calendar Schedule</h1>
			<p class="admin-text-body">Manage your property appointments and tasks</p>
		</div>
	</div>

	<div class="calendar-content">
		<div class="calendar-wrapper admin-card">
			<!-- Month Navigation -->
			<div class="month-header">
				<div class="nav-btn" on:click={prevMonth}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
					</svg>
					Previous
				</div>
				<h2 class="admin-heading-2">{months[month]} {year}</h2>
				<div class="nav-btn" on:click={nextMonth}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 18 6-6-6-6"/>
					</svg>
					Next
				</div>
			</div>

			<!-- Calendar Grid -->
			<div class="calendar-grid">
				<!-- Weekdays Header -->
		<div class="weekdays">
					<div class="weekday">Sun</div>
					<div class="weekday">Mon</div>
					<div class="weekday">Tue</div>
					<div class="weekday">Wed</div>
					<div class="weekday">Thu</div>
					<div class="weekday">Fri</div>
					<div class="weekday">Sat</div>
		</div>

		<div class="days-grid">
			{#each Array.from({ length: new Date(year, month, 1).getDay() }) as _}
				<div class="day empty-day"></div>
			{/each}
			{#each Array.from({ length: daysInMonth(month, year) }, (_, i) => i + 1) as day}
				<button type="button" class="day {isToday(day) ? 'today' : ''} {activeDay === day ? 'active' : ''} {hasTask(day) ? 'has-task' : ''}" on:click={() => selectDay(day)}>
					{day}
					{#if hasTask(day)}<span class="task-indicator"></span>{/if}
				</button>
			{/each}
		</div>
		</div>

			<!-- Calendar Controls -->
			<div class="calendar-controls">
				<div class="date-picker">
					<input type="text" bind:value={dateInput} placeholder="mm/yyyy" class="admin-input" />
					<button type="button" on:click={gotoDate} class="admin-button-primary">Go</button>
				</div>
				<button type="button" on:click={gotoToday} class="admin-button-primary">Today</button>
			</div>
		</div>

	</div>

	<!-- Tasks Panel -->
	<div class="tasks-panel admin-card">
		<div class="tasks-header">
			<div class="selected-date">
				<span class="day-name">{getDayOfWeek(year, month, activeDay)}</span>
				<span class="date-display">{activeDay} {months[month]} {year}</span>
			</div>
			<button type="button" on:click={() => (showAddTask = true)} class="admin-button-primary">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
				</svg>
				Add Task
			</button>
		</div>

		<div class="tasks-list">
			{#if selectedTasks.length > 0}
				{#each selectedTasks as task}
					<div class="task-item {task.done ? 'completed' : ''}">
						<div class="task-content">
							<div class="task-title">
							<input type="checkbox" bind:checked={task.done} on:change={() => toggleDone(task)} />
								<h3 class="admin-text-label">{task.name}</h3>
							</div>
							<p class="task-author">By: {task.author}</p>
							<p class="task-description admin-text-body">{task.description}</p>
						</div>
						<button type="button" class="task-toggle" on:click={() => toggleDone(task)}>
							{task.done ? 'Undo' : 'Complete'}
						</button>
					</div>
				{/each}
			{:else}
				<div class="no-tasks">
					<p class="admin-text-body">No tasks scheduled for this day</p>
				</div>
			{/if}
		</div>

	</div>

	<!-- Add Task Modal -->
	{#if showAddTask}
		<div class="task-modal-overlay">
			<div class="task-modal admin-card">
				<div class="modal-header">
					<h2 class="admin-heading-2">Add New Task</h2>
					<div class="close-btn" on:click={() => (showAddTask = false)}>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
						</svg>
						Close
					</div>
				</div>
				
				<form class="modal-form" on:submit|preventDefault={addTask}>
					<div class="form-group">
						<div class="admin-text-label">Task Name</div>
						<input type="text" bind:value={taskName} class="admin-input" placeholder="Enter task name" />
					</div>
					
					<div class="form-group">
						<div class="admin-text-label">Author</div>
						<input type="text" bind:value={taskAuthor} class="admin-input" placeholder="Enter author name" />
					</div>
					
					<div class="form-group">
						<div class="admin-text-label">Description</div>
						<input type="text" bind:value={taskDescription} class="admin-input" placeholder="Enter task description" />
					</div>
					
					<div class="form-group">
						<div class="admin-text-label">Date</div>
						<input type="date" bind:value={taskDate} class="admin-input" />
					</div>
					
				{#if errorMsg}
						<div class="error-message">{errorMsg}</div>
				{/if}
					
					<div class="modal-actions">
						<button type="button" class="cancel-btn" on:click={() => (showAddTask = false)}>Cancel</button>
						<button type="submit" class="admin-button-primary">Add Task</button>
			</div>
				</form>
			</div>
		</div>
	{/if}
</section>

<style>
    /* === CALENDAR HEADER === */
    .calendar-header {
        background: var(--admin-gradient-header);
        color: var(--admin-text-white);
    }

    .calendar-header .admin-heading-1,
    .calendar-header .admin-text-body {
        color: var(--admin-text-white) !important;
    }

    .header-content {
        text-align: center;
        max-width: var(--admin-content-max-width);
        margin: 0 auto;
	}

        /* === CALENDAR LAYOUT === */
    .calendar-content {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .calendar-wrapper {
        width: 100%;
    }

    /* === MONTH NAVIGATION === */
    .month-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
        margin-bottom: var(--admin-space-6);
        padding-bottom: var(--admin-space-4);
        border-bottom: 2px solid var(--admin-border-light);
	}

        .nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--admin-space-2);
        padding: var(--admin-space-3) var(--admin-space-4);
        background: var(--admin-bg-accent);
        border: 1px solid var(--admin-border-medium);
        border-radius: var(--admin-radius-lg);
        color: var(--admin-text-primary);
        cursor: pointer;
        transition: var(--admin-transition-normal);
        font-size: var(--admin-text-sm);
        font-weight: 600;
    }

    .nav-btn:hover {
        background: var(--admin-accent);
        color: var(--admin-text-white);
        border-color: var(--admin-accent);
    }

        .nav-btn svg {
        width: 16px;
        height: 16px;
    }

    .month-header .admin-heading-2 {
        color: var(--admin-text-primary) !important;
        margin: 0;
    }

    /* === CALENDAR GRID === */
    .calendar-grid {
        margin-bottom: var(--admin-space-6);
	}

        .weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        margin-bottom: var(--admin-space-4);
    }

        .weekday {
        text-align: center;
        font-weight: 600;
        color: var(--admin-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .days-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
    }

        .day {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--admin-bg-secondary);
        border: 1px solid var(--admin-border-light);
        border-radius: var(--admin-radius-md);
        color: var(--admin-text-primary);
        font-weight: 500;
        cursor: pointer;
        transition: var(--admin-transition-normal);
    }

    .day:hover {
        background: var(--admin-bg-accent);
        border-color: var(--admin-accent);
        transform: translateY(-1px);
    }

    .day.empty-day {
        background: transparent;
		border: none;
        cursor: default;
    }

    .day.empty-day:hover {
        background: transparent;
        transform: none;
	}

    .day.today {
        background: var(--admin-accent) !important;
        color: var(--admin-text-white) !important;
        font-weight: 700;
        box-shadow: var(--admin-shadow-md);
	}

    .day.active {
        background: var(--admin-primary);
        color: var(--admin-text-white);
        border-color: var(--admin-primary);
	}

    .day.has-task {
        background: var(--admin-success-light);
        border-color: var(--admin-success);
        font-weight: 600;
    }

    .task-indicator {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 6px;
        height: 6px;
        background: var(--admin-success);
        border-radius: 50%;
	}

    /* === CALENDAR CONTROLS === */
    .calendar-controls {
		display: flex;
		justify-content: space-between;
        align-items: center;
        padding: var(--admin-space-4);
        background: var(--admin-bg-accent);
        border-radius: var(--admin-radius-lg);
    }

    .date-picker {
        display: flex;
        gap: var(--admin-space-3);
        align-items: center;
	}

    .date-picker .admin-input {
        width: 120px;
    }

        /* === TASKS PANEL === */
    .tasks-panel {
        width: 100%;
    }

    .tasks-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
        margin-bottom: var(--admin-space-6);
        padding-bottom: var(--admin-space-4);
        border-bottom: 2px solid var(--admin-border-light);
	}

    .selected-date {
		display: flex;
		flex-direction: column;
        gap: var(--admin-space-1);
	}

    .day-name {
        font-size: var(--admin-text-sm);
        color: var(--admin-text-secondary);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .date-display {
        font-size: var(--admin-text-lg);
        color: var(--admin-text-primary);
        font-weight: 700;
    }

    .tasks-header .admin-button-primary svg {
        width: 16px;
        height: 16px;
    }

        /* === TASKS LIST === */
    .tasks-list {
        display: grid;
        gap: var(--admin-space-4);
        overflow-y: auto;
    }

    .task-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: var(--admin-space-4);
        background: var(--admin-bg-accent);
        border: 1px solid var(--admin-border-light);
        border-radius: var(--admin-radius-lg);
        gap: var(--admin-space-4);
        transition: var(--admin-transition-normal);
	}

    .task-item:hover {
        background: var(--admin-bg-secondary);
        border-color: var(--admin-accent);
        transform: translateY(-1px);
        box-shadow: var(--admin-shadow-md);
	}

    .task-item.completed {
        opacity: 0.7;
        background: var(--admin-success-light);
        border-color: var(--admin-success);
	}

    .task-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--admin-space-2);
	}

    .task-title {
        display: flex;
        align-items: center;
        gap: var(--admin-space-3);
	}

    .task-title input[type="checkbox"] {
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

    .task-title .admin-text-label {
        margin: 0;
        color: var(--admin-text-primary) !important;
    }

    .task-item.completed .task-title .admin-text-label {
        text-decoration: line-through;
        color: var(--admin-text-muted) !important;
    }

    .task-author {
        font-size: var(--admin-text-sm);
        color: var(--admin-text-secondary);
        margin: 0;
		font-weight: 500;
	}

    .task-description {
        margin: 0;
        color: var(--admin-text-secondary) !important;
	}

    .task-toggle {
        padding: var(--admin-space-2) var(--admin-space-4);
        background: var(--admin-success);
        color: var(--admin-text-white);
		border: none;
        border-radius: var(--admin-radius-md);
        font-size: var(--admin-text-sm);
        font-weight: 600;
		cursor: pointer;
        transition: var(--admin-transition-normal);
        white-space: nowrap;
	}

    .task-toggle:hover {
		background: #059669;
        transform: translateY(-1px);
	}

    .task-item.completed .task-toggle {
        background: var(--admin-secondary);
	}

    .no-tasks {
		text-align: center;
        padding: var(--admin-space-8);
        color: var(--admin-text-muted);
	}

    /* === TASK MODAL === */
    .task-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .task-modal {
        width: 100%;
        max-width: 500px;
        margin: var(--admin-space-4);
        padding: 0;
        overflow: hidden;
}

    .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
        padding: var(--admin-space-6);
        background: var(--admin-gradient-header);
        color: var(--admin-text-white);
}

    .modal-header .admin-heading-2 {
        color: var(--admin-text-white) !important;
        margin: 0;
    }

        .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--admin-space-2);
        padding: var(--admin-space-2) var(--admin-space-3);
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--admin-radius-md);
        color: var(--admin-text-white);
        cursor: pointer;
        transition: var(--admin-transition-normal);
        font-size: var(--admin-text-sm);
        font-weight: 600;
    }

    .close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
}

    .close-btn svg {
        width: 14px;
        height: 14px;
    }

    .modal-form {
        padding: var(--admin-space-6);
    }

    .form-group {
  display: flex;
  flex-direction: column;
        gap: var(--admin-space-2);
        margin-bottom: var(--admin-space-5);
}

    .form-group .admin-text-label {
        color: var(--admin-text-label) !important;
    }

    .error-message {
        background: var(--admin-error-light);
        color: var(--admin-error);
        padding: var(--admin-space-3);
        border-radius: var(--admin-radius-md);
        font-size: var(--admin-text-sm);
        font-weight: 500;
        margin-bottom: var(--admin-space-4);
}

    .modal-actions {
        display: flex;
        gap: var(--admin-space-3);
        justify-content: flex-end;
        margin-top: var(--admin-space-6);
        padding-top: var(--admin-space-4);
        border-top: 1px solid var(--admin-border-light);
}

    .cancel-btn {
        padding: var(--admin-space-3) var(--admin-space-6);
        background: var(--admin-bg-secondary);
        color: var(--admin-text-secondary);
        border: 1px solid var(--admin-border-medium);
        border-radius: var(--admin-radius-md);
        font-weight: 600;
  cursor: pointer;
        transition: var(--admin-transition-normal);
}

    .cancel-btn:hover {
        background: var(--admin-bg-accent);
        border-color: var(--admin-accent);
        color: var(--admin-text-primary);
}

    /* === PROFESSIONAL MOBILE-FIRST RESPONSIVE DESIGN === */
    
    /* Base Mobile Styles (Default - 320px+) */
    .calendar-content {
        padding: var(--admin-space-4);
        gap: var(--admin-space-4);
    }

    .calendar-wrapper {
        padding: var(--admin-space-4);
    }

    .tasks-panel {
        padding: var(--admin-space-4);
    }

    .month-header {
        flex-direction: column;
        gap: var(--admin-space-4);
        text-align: center;
    }

    .nav-btn {
        padding: var(--admin-space-2) var(--admin-space-4);
        font-size: var(--admin-text-xs);
    }

    .nav-btn svg {
        width: 14px;
        height: 14px;
    }

    .days-grid {
        gap: var(--admin-space-1);
    }

    .day {
        min-height: 36px;
        font-size: var(--admin-text-sm);
        padding: var(--admin-space-1);
    }

    .weekday {
        padding: var(--admin-space-2);
        font-size: var(--admin-text-xs);
    }

    .calendar-controls {
        flex-direction: column;
        gap: var(--admin-space-3);
        padding: var(--admin-space-3);
    }

    .date-picker {
        flex-direction: column;
        gap: var(--admin-space-2);
        align-items: stretch;
    }

    .date-picker .admin-input {
        width: 100%;
    }

    .tasks-header {
        flex-direction: column;
        gap: var(--admin-space-3);
        align-items: stretch;
        text-align: center;
    }

    .tasks-header .admin-button-primary {
        justify-content: center;
        width: 100%;
    }

    .tasks-list {
        grid-template-columns: 1fr;
    }

    .task-item {
        flex-direction: column;
        align-items: stretch;
        gap: var(--admin-space-3);
    }

    .task-toggle {
        align-self: stretch;
        text-align: center;
    }

    .task-modal {
        margin: var(--admin-space-2);
        max-height: calc(100vh - var(--admin-space-4));
        overflow-y: auto;
    }

    .modal-form {
        padding: var(--admin-space-4);
    }

    .modal-actions {
        flex-direction: column;
        gap: var(--admin-space-3);
    }

    .modal-actions button {
        width: 100%;
        justify-content: center;
    }

    /* Small Mobile Landscape (480px+) */
    @media (min-width: 480px) {
        .month-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            text-align: left;
        }

        .nav-btn {
            padding: var(--admin-space-3) var(--admin-space-4);
            font-size: var(--admin-text-sm);
        }

        .nav-btn svg {
            width: 16px;
            height: 16px;
        }

        .day {
            min-height: 40px;
            font-size: var(--admin-text-base);
        }

        .date-picker {
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }

        .date-picker .admin-input {
            width: 140px;
        }

        .tasks-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            text-align: left;
        }

        .tasks-header .admin-button-primary {
            width: auto;
        }

        .modal-actions {
            flex-direction: row;
            justify-content: flex-end;
        }

        .modal-actions button {
            width: auto;
        }
    }

    /* Tablet Portrait (640px+) */
    @media (min-width: 640px) {
        .calendar-content {
            padding: var(--admin-space-5);
            gap: var(--admin-space-5);
        }

        .calendar-wrapper,
        .tasks-panel {
            padding: var(--admin-space-5);
        }

        .days-grid {
            gap: var(--admin-space-2);
        }

        .day {
            min-height: 44px;
            padding: var(--admin-space-2);
        }

        .weekday {
            padding: var(--admin-space-3);
            font-size: var(--admin-text-sm);
        }

        .tasks-list {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .task-item {
            flex-direction: row;
            align-items: flex-start;
        }

        .task-toggle {
            align-self: flex-start;
            white-space: nowrap;
        }

        .calendar-controls {
            flex-direction: row;
            justify-content: space-between;
            padding: var(--admin-space-4);
        }
    }

    /* Tablet Landscape (768px+) */
    @media (min-width: 768px) {
        .calendar-content {
            padding: var(--admin-space-6);
            gap: var(--admin-space-6);
        }

        .calendar-wrapper,
        .tasks-panel {
            padding: var(--admin-space-6);
        }

        .tasks-list {
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            max-height: 500px;
        }

        .task-modal {
            margin: var(--admin-space-6);
            max-width: 600px;
        }

        .modal-form {
            padding: var(--admin-space-6);
        }
    }

    /* Desktop Small (1024px+) */
    @media (min-width: 1024px) {
        .calendar-content {
            max-width: var(--admin-content-max-width);
            margin: 0 auto;
            padding: var(--admin-space-8);
        }

        .tasks-list {
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            max-height: 600px;
        }

        .day {
            min-height: 48px;
            font-size: var(--admin-text-lg);
        }

        .task-modal {
            max-width: 700px;
        }
    }

    /* Desktop Large (1280px+) */
    @media (min-width: 1280px) {
        .tasks-list {
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        }
    }

    /* Ultra Wide Desktop (1536px+) */
    @media (min-width: 1536px) {
        .calendar-content {
            max-width: 1400px;
        }

        .tasks-list {
            grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
        }
    }
</style>
