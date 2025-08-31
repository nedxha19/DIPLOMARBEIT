
<script>
	import { onMount } from 'svelte';

	// State management
	let today = new Date();
	let activeDay = today.getDate();
	let month = today.getMonth();
	let year = today.getFullYear();
	let dateInput = '';
	let showAddTask = false;
	let taskName = '', taskAuthor = '', taskDescription = '', taskDate = '';
	let selectedTasks = [];
	let errorMsg = '';
	let eventsArr = [];

	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	// Initialize on mount
	onMount(() => {
		const stored = localStorage?.getItem('events');
		if (stored) eventsArr = JSON.parse(stored);
		updateTasks(activeDay);
	});

	// Reactive updates
	$: updateTasks(activeDay);

	// Utility functions
	const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
	const getDayOfWeek = (y, m, d) => new Date(y, m, d).toLocaleDateString('en-US', { weekday: 'short' });
	const hasTask = (d) => eventsArr.some(e => e.day === d && e.month === month + 1 && e.year === year);
	const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
	const selectDay = (d) => (activeDay = d);
	const saveEvents = () => localStorage?.setItem('events', JSON.stringify(eventsArr));

	function updateTasks(d) {
		const found = eventsArr.find(e => e.day === d && e.month === month + 1 && e.year === year);
		selectedTasks = found?.events ?? [];
	}

	function prevMonth() {
		if (month === 0) {
			month = 11;
			year--;
		} else {
			month--;
		}
		activeDay = 1;
	}

	function nextMonth() {
		if (month === 11) {
			month = 0;
			year++;
		} else {
			month++;
		}
		activeDay = 1;
	}

	function gotoDate() {
		const [m, y] = dateInput.split('/').map(Number);
		if (m >= 1 && m <= 12 && y > 1900 && y < 2100) {
			month = m - 1;
			year = y;
			activeDay = 1;
			dateInput = '';
		} else {
			errorMsg = 'Invalid date format. Use MM/YYYY';
		}
	}

	function addTask() {
		errorMsg = '';
		if (!taskName?.trim() || !taskAuthor?.trim() || !taskDescription?.trim() || !taskDate) {
			errorMsg = 'Please fill all fields.';
			return;
		}

		const dateObj = new Date(taskDate);
		const d = dateObj.getDate();
		const m = dateObj.getMonth() + 1;
		const y = dateObj.getFullYear();

		const existing = eventsArr.find(e => e.day === d && e.month === m && e.year === y);
		if (existing?.events.some(ev => ev.name.toLowerCase() === taskName.trim().toLowerCase())) {
			errorMsg = 'Task name must be unique for this day.';
			return;
		}

		const newTask = {
			id: crypto.randomUUID(),
			name: taskName.trim(),
			author: taskAuthor.trim(),
			description: taskDescription.trim(),
			date: taskDate,
			done: false
		};

		if (existing) {
			existing.events.push(newTask);
		} else {
			eventsArr.push({ day: d, month: m, year: y, events: [newTask] });
		}

		month = m - 1;
		year = y;
		activeDay = d;
		taskName = taskAuthor = taskDescription = taskDate = '';
		showAddTask = false;
		saveEvents();
	}

	const toggleDone = (task) => {
		task.done = !task.done;
		saveEvents();
	};

	const gotoToday = () => {
		month = today.getMonth();
		year = today.getFullYear();
		activeDay = today.getDate();
	};
</script>

<div class="admin-container">
	<header class="admin-page-header">
		<div class="admin-header-content">
			<div class="admin-header-icon">
				<i class="fas fa-calendar-alt"></i>
			</div>
			<div class="admin-header-text">
				<h1>Calendar Schedule</h1>
				<p>Manage appointments, tasks and property viewing schedules</p>
			</div>
		</div>
		<div class="admin-header-stats">
			<div class="admin-stat-card">
				<i class="fas fa-calendar-day"></i>
				<span class="admin-stat-number">{getDayOfWeek(year, month, activeDay)}</span>
				<span class="admin-stat-label">Today</span>
			</div>
			<div class="admin-stat-card">
				<i class="fas fa-tasks"></i>
				<span class="admin-stat-number">{selectedTasks.length}</span>
				<span class="admin-stat-label">Tasks</span>
			</div>
		</div>
	</header>

	<div class="calendar-content">
		<div class="calendar-wrapper admin-card">
			<!-- Month Navigation -->
			<div class="month-header">
				<div 
					class="nav-btn" 
					role="button" 
					tabindex="0"
					on:click={prevMonth}
					on:keydown={(e) => e.key === 'Enter' || e.key === ' ' ? prevMonth() : null}
					aria-label="Previous month"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
					</svg>
					Previous
				</div>
				<h2 class="admin-heading-2">{months[month]} {year}</h2>
				<div 
					class="nav-btn" 
					role="button" 
					tabindex="0"
					on:click={nextMonth}
					on:keydown={(e) => e.key === 'Enter' || e.key === ' ' ? nextMonth() : null}
					aria-label="Next month"
				>
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
					<div 
						class="close-btn" 
						role="button" 
						tabindex="0"
						on:click={() => (showAddTask = false)}
						on:keydown={(e) => e.key === 'Enter' || e.key === ' ' ? (showAddTask = false) : null}
						aria-label="Close modal"
					>
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
</div>

<style>
    /* Calendar Schedule Styles - Global header classes handle header styling */
    
    .calendar-content {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
    }

    .calendar-wrapper {
        background: var(--bg-primary);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        border: 1px solid var(--border-light);
        overflow: hidden;
    }

    /* Month Navigation */
    .month-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-6);
        background: var(--bg-accent);
        border-bottom: 1px solid var(--border-light);
    }

    .nav-btn {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3) var(--space-4);
        background: var(--bg-secondary);
        border: 1px solid var(--border-medium);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        cursor: pointer;
        transition: var(--transition-normal);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
    }

    .nav-btn:hover,
    .nav-btn:focus {
        background: var(--accent-color);
        color: var(--text-white);
        border-color: var(--accent-color);
        outline: none;
    }

    .nav-btn svg {
        width: 16px;
        height: 16px;
    }

    .month-header h2 {
        color: var(--text-primary);
        margin: 0;
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-2xl);
    }

    /* Calendar Grid */
    .calendar-grid {
        margin-bottom: var(--space-6);
    }

    .weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        background: var(--bg-accent);
        border-bottom: 1px solid var(--border-light);
    }

    .weekday {
        text-align: center;
        font-weight: var(--font-weight-bold);
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: var(--space-3);
        font-size: var(--font-size-sm);
    }

    .days-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
        padding: var(--space-4);
        background: var(--border-light);
    }

    .day {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-primary);
        border: none;
        color: var(--text-primary);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        transition: var(--transition-normal);
        height: 48px;
        font-size: var(--font-size-base);
    }

    .day:hover {
        background: var(--accent-light);
        color: var(--accent-dark);
    }

    .day.empty-day {
        background: var(--bg-accent);
        cursor: default;
        color: var(--text-muted);
    }

    .day.empty-day:hover {
        background: var(--bg-accent);
        color: var(--text-muted);
    }

    .day.today {
        background: var(--accent-color);
        color: var(--text-white);
        font-weight: var(--font-weight-bold);
    }

    .day.active {
        background: var(--primary-color);
        color: var(--text-white);
        font-weight: var(--font-weight-bold);
    }

    .day.has-task {
        background: var(--success-light);
        color: var(--success-dark);
        font-weight: var(--font-weight-bold);
    }

    .task-indicator {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 6px;
        height: 6px;
        background: var(--success-color);
        border-radius: 50%;
    }

    /* Calendar Controls */
    .calendar-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-4);
        background: var(--bg-accent);
        border-top: 1px solid var(--border-light);
    }

    .date-picker {
        display: flex;
        gap: var(--space-3);
        align-items: center;
    }

    .date-picker .admin-input {
        width: 120px;
    }

    /* Tasks Panel */
    .tasks-panel {
        width: 100%;
    }

    .tasks-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-6);
        padding-bottom: var(--space-4);
        border-bottom: 1px solid var(--border-light);
    }

    .selected-date {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
    }

    .day-name {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        font-weight: var(--font-weight-semibold);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .date-display {
        font-size: var(--font-size-lg);
        color: var(--text-primary);
        font-weight: var(--font-weight-bold);
    }

    .tasks-header .admin-button-primary svg {
        width: 16px;
        height: 16px;
    }

    /* Tasks List */
    .tasks-list {
        display: grid;
        gap: var(--space-4);
    }

    .task-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: var(--space-4);
        background: var(--bg-accent);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-lg);
        gap: var(--space-4);
        transition: var(--transition-normal);
    }

    .task-item:hover {
        background: var(--bg-secondary);
        border-color: var(--accent-color);
    }

    .task-item.completed {
        opacity: 0.7;
        background: var(--success-light);
    }

    .task-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
    }

    .task-title {
        display: flex;
        align-items: center;
        gap: var(--space-3);
    }

    .task-title input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
    }

    .task-title .admin-text-label {
        margin: 0;
        color: var(--text-primary) !important;
    }

    .task-item.completed .task-title .admin-text-label {
        text-decoration: line-through;
        color: var(--text-muted) !important;
    }

    .task-author {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin: 0;
        font-weight: var(--font-weight-medium);
    }

    .task-description {
        margin: 0;
        color: var(--text-secondary) !important;
    }

    .task-toggle {
        padding: var(--space-2) var(--space-4);
        background: var(--success-color);
        color: var(--text-white);
        border: none;
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        cursor: pointer;
        transition: var(--transition-normal);
        white-space: nowrap;
    }

    .task-toggle:hover {
        background: var(--success-dark);
    }

    .task-item.completed .task-toggle {
        background: var(--text-secondary);
    }

    .no-tasks {
        text-align: center;
        padding: var(--space-8);
        color: var(--text-muted);
    }

    /* Task Modal */
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
        margin: var(--space-4);
        padding: 0;
        overflow: hidden;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-6);
        background: var(--gradient-header);
        color: var(--text-white);
    }

    .modal-header .admin-heading-2 {
        color: var(--text-white) !important;
        margin: 0;
    }

    .close-btn {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-3);
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-md);
        color: var(--text-white);
        cursor: pointer;
        transition: var(--transition-normal);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
    }

    .close-btn:hover,
    .close-btn:focus {
        background: rgba(255, 255, 255, 0.2);
        outline: none;
    }

    .close-btn svg {
        width: 14px;
        height: 14px;
    }

    .modal-form {
        padding: var(--space-6);
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        margin-bottom: var(--space-5);
    }

    .form-group .admin-text-label {
        color: var(--text-label) !important;
    }

    .error-message {
        background: var(--error-light);
        color: var(--error-color);
        padding: var(--space-3);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        margin-bottom: var(--space-4);
    }

    .modal-actions {
        display: flex;
        gap: var(--space-3);
        justify-content: flex-end;
        margin-top: var(--space-6);
        padding-top: var(--space-4);
        border-top: 1px solid var(--border-light);
    }

    .cancel-btn {
        padding: var(--space-3) var(--space-6);
        background: var(--bg-secondary);
        color: var(--text-secondary);
        border: 1px solid var(--border-medium);
        border-radius: var(--radius-md);
        font-weight: var(--font-weight-semibold);
        cursor: pointer;
        transition: var(--transition-normal);
    }

    .cancel-btn:hover {
        background: var(--bg-accent);
        border-color: var(--accent-color);
        color: var(--text-primary);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .admin-page-header {
            flex-direction: column;
            text-align: center;
            gap: var(--space-4);
        }

        .month-header {
            flex-direction: column;
            gap: var(--space-3);
            text-align: center;
        }

        .calendar-controls {
            flex-direction: column;
            gap: var(--space-3);
        }

        .date-picker {
            flex-direction: column;
            gap: var(--space-2);
        }

        .date-picker .admin-input {
            width: 100%;
        }

        .tasks-header {
            flex-direction: column;
            gap: var(--space-3);
            text-align: center;
        }

        .task-item {
            flex-direction: column;
            gap: var(--space-3);
        }

        .task-modal {
            margin: var(--space-2);
            max-height: calc(100vh - var(--space-4));
        }

        .modal-actions {
            flex-direction: column;
        }

        .modal-actions button {
            width: 100%;
        }
    }

    @media (min-width: 768px) {
        .tasks-list {
            max-height: 500px;
            overflow-y: auto;
        }
    }
</style>
