
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
        gap: var(--space-6, 1.5rem);
    }

    .calendar-wrapper {
        background: var(--bg-secondary, #ffffff);
        border-radius: var(--radius-2xl, 1rem);
        box-shadow: var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1));
        border: 1px solid var(--border-light, #e5e7eb);
        overflow: hidden;
    }

    /* Month Navigation */
    .month-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-6, 1.5rem);
        background: var(--bg-secondary, #ffffff);
        border-bottom: 1px solid var(--border-light, #e5e7eb);
    }

    .nav-btn {
        display: flex;
        align-items: center;
        gap: var(--space-2, 0.5rem);
        padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
        background: var(--bg-secondary, #ffffff);
        border: 1px solid var(--border-medium, #d1d5db);
        border-radius: var(--radius-md, 0.375rem);
        color: var(--text-primary, #111827);
        cursor: pointer;
        transition: var(--transition-normal, all 300ms cubic-bezier(0.4, 0, 0.2, 1));
        font-size: var(--font-size-sm, 0.875rem);
        font-weight: var(--font-weight-medium, 500);
    }

    .nav-btn:hover,
    .nav-btn:focus {
        background: var(--accent-color, #0ea5e9);
        color: var(--text-white, #ffffff);
        border-color: var(--accent-color, #0ea5e9);
        outline: none;
    }

    .nav-btn svg {
        width: 16px;
        height: 16px;
    }

    .month-header h2 {
        color: var(--text-primary, #111827);
        margin: 0;
        font-weight: var(--font-weight-bold, 700);
        font-size: var(--font-size-2xl, 1.5rem);
    }

    /* Calendar Grid */
    .calendar-grid {
        margin-bottom: var(--space-6, 1.5rem);
    }

    .weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        background: var(--bg-secondary, #ffffff);
        border-bottom: 1px solid var(--border-light, #e5e7eb);
    }

    .weekday {
        text-align: center;
        font-weight: var(--font-weight-bold, 700);
        color: var(--text-secondary, #4b5563);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: var(--space-3, 0.75rem);
        font-size: var(--font-size-sm, 0.875rem);
    }

    .days-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
        padding: var(--space-4, 1rem);
        background: var(--border-light, #e5e7eb);
    }

    .day {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-secondary, #ffffff);
        border: none;
        color: var(--text-primary, #111827);
        font-weight: var(--font-weight-medium, 500);
        cursor: pointer;
        transition: var(--transition-normal, all 300ms cubic-bezier(0.4, 0, 0.2, 1));
        height: 48px;
        font-size: var(--font-size-base, 1rem);
    }

    .day:hover {
        background: var(--accent-light, #38bdf8);
        color: var(--accent-dark, #0284c7);
    }

    .day.empty-day {
        background: var(--bg-secondary, #ffffff);
        cursor: default;
        color: var(--text-muted, #6b7280);
    }

    .day.empty-day:hover {
        background: var(--bg-accent, #f3f4f6);
        color: var(--text-muted, #6b7280);
    }

    .day.today {
        background: var(--accent-color, #0ea5e9);
        color: var(--text-white, #ffffff);
        font-weight: var(--font-weight-bold, 700);
    }

    .day.active {
        background: var(--primary-color, #1a2236);
        color: var(--text-white, #ffffff);
        font-weight: var(--font-weight-bold, 700);
    }

    .day.has-task {
        background: var(--success-light, #d1fae5);
        color: var(--success-dark, #065f46);
        font-weight: var(--font-weight-bold, 700);
    }

    .task-indicator {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 6px;
        height: 6px;
        background: var(--success-color, #10b981);
        border-radius: 50%;
    }

    /* Calendar Controls */
    .calendar-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-4, 1rem);
        background: var(--bg-secondary, #ffffff);
        border-top: 1px solid var(--border-light, #e5e7eb);
    }

    .date-picker {
        display: flex;
        gap: var(--space-3, 0.75rem);
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
        margin-bottom: var(--space-6, 1.5rem);
        padding-bottom: var(--space-4, 1rem);
        border-bottom: 1px solid var(--border-light, #e5e7eb);
    }

    .selected-date {
        display: flex;
        flex-direction: column;
        gap: var(--space-1, 0.25rem);
    }

    .day-name {
        font-size: var(--font-size-sm, 0.875rem);
        color: var(--text-secondary, #4b5563);
        font-weight: var(--font-weight-semibold, 600);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .date-display {
        font-size: var(--font-size-lg, 1.125rem);
        color: var(--text-primary, #111827);
        font-weight: var(--font-weight-bold, 700);
    }

    .tasks-header .admin-button-primary svg {
        width: 16px;
        height: 16px;
    }

    /* Tasks List */
    .tasks-list {
        display: grid;
        gap: var(--space-4, 1rem);
    }

    .task-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: var(--space-4, 1rem);
        background: var(--bg-accent, #f3f4f6);
        border: 1px solid var(--border-light, #e5e7eb);
        border-radius: var(--radius-lg, 0.5rem);
        gap: var(--space-4, 1rem);
        transition: var(--transition-normal, all 300ms cubic-bezier(0.4, 0, 0.2, 1));
    }

    .task-item:hover {
        background: var(--bg-secondary, #ffffff);
        border-color: var(--accent-color, #0ea5e9);
    }

    .task-item.completed {
        opacity: 0.7;
        background: var(--success-light, #d1fae5);
    }

    .task-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--space-2, 0.5rem);
    }

    .task-title {
        display: flex;
        align-items: center;
        gap: var(--space-3, 0.75rem);
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
        font-size: var(--font-size-sm, 0.875rem);
        color: var(--text-secondary, #4b5563);
        margin: 0;
        font-weight: var(--font-weight-medium, 500);
    }

    .task-description {
        margin: 0;
        color: var(--text-secondary, #4b5563) !important;
    }

    .task-toggle {
        padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
        background: var(--success-color, #10b981);
        color: var(--text-white, #ffffff);
        border: none;
        border-radius: var(--radius-md, 0.375rem);
        font-size: var(--font-size-sm, 0.875rem);
        font-weight: var(--font-weight-semibold, 600);
        cursor: pointer;
        transition: var(--transition-normal, all 300ms cubic-bezier(0.4, 0, 0.2, 1));
        white-space: nowrap;
    }

    .task-toggle:hover {
        background: var(--success-dark, #065f46);
    }

    .task-item.completed .task-toggle {
        background: var(--text-secondary, #4b5563);
    }

    .no-tasks {
        text-align: center;
        padding: var(--space-8, 2rem);
        color: var(--text-muted, #6b7280);
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
        margin: var(--space-4, 1rem);
        padding: 0;
        overflow: hidden;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-6, 1.5rem);
        background: var(--gradient-header, linear-gradient(135deg, #1a2236 0%, #0ea5e9 100%));
        color: var(--text-white, #ffffff);
    }

    .modal-header .admin-heading-2 {
        color: var(--text-white, #ffffff) !important;
        margin: 0;
    }

    .close-btn {
        display: flex;
        align-items: center;
        gap: var(--space-2, 0.5rem);
        padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-md, 0.375rem);
        color: var(--text-white, #ffffff);
        cursor: pointer;
        transition: var(--transition-normal, all 300ms cubic-bezier(0.4, 0, 0.2, 1));
        font-size: var(--font-size-sm, 0.875rem);
        font-weight: var(--font-weight-semibold, 600);
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
        padding: var(--space-6, 1.5rem);
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--space-2, 0.5rem);
        margin-bottom: var(--space-5, 1.25rem);
    }

    .form-group .admin-text-label {
        color: var(--text-label, #374151) !important;
    }

    .error-message {
        background: var(--error-light, #fee2e2);
        color: var(--error-color, #ef4444);
        padding: var(--space-3, 0.75rem);
        border-radius: var(--radius-md, 0.375rem);
        font-size: var(--font-size-sm, 0.875rem);
        font-weight: var(--font-weight-medium, 500);
        margin-bottom: var(--space-4, 1rem);
    }

    .modal-actions {
        display: flex;
        gap: var(--space-3, 0.75rem);
        justify-content: flex-end;
        margin-top: var(--space-6, 1.5rem);
        padding-top: var(--space-4, 1rem);
        border-top: 1px solid var(--border-light, #e5e7eb);
    }

    .cancel-btn {
        padding: var(--space-3, 0.75rem) var(--space-6, 1.5rem);
        background: var(--bg-secondary, #ffffff);
        color: var(--text-secondary, #4b5563);
        border: 1px solid var(--border-medium, #d1d5db);
        border-radius: var(--radius-md, 0.375rem);
        font-weight: var(--font-weight-semibold, 600);
        cursor: pointer;
        transition: var(--transition-normal, all 300ms cubic-bezier(0.4, 0, 0.2, 1));
    }

    .cancel-btn:hover {
        background: var(--bg-accent, #f3f4f6);
        border-color: var(--accent-color, #0ea5e9);
        color: var(--text-primary, #111827);
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
