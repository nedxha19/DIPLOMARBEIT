<script>
	let { data } = $props();

	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	let today = new Date();
	let year = $state(today.getFullYear());
	let month = $state(today.getMonth());
	let activeDay = $state(today.getDate());
	let dateInput = $state('');

	let showAddTask = $state(false);
	let editingTask = $state(null);
	let taskName = $state('');
	let taskAuthor = $state('');
	let taskDescription = $state('');
	let taskDate = $state('');

	let tasks = $state(data.tasks || []);
	let selectedTasks = $state([]);

	$effect(() => {
		selectedTasks = tasks.filter(t => {
			const td = new Date(t.task_date);
			return td.getDate() === activeDay && td.getMonth() === month && td.getFullYear() === year;
		});
	});

	const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
	const getDow = (y, m, d) => new Date(y, m, d).toLocaleDateString('en-US', { weekday: 'short' });
	const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
	const hasTask = (d) => tasks.some(t => {
		const td = new Date(t.task_date);
		return td.getDate() === d && td.getMonth() === month && td.getFullYear() === year;
	});

	function selectDay(d) {
		activeDay = d;
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

	function gotoToday() {
		year = today.getFullYear();
		month = today.getMonth();
		activeDay = today.getDate();
	}

	function gotoDate() {
		const [m, y] = dateInput.split('/').map(Number);
		month = m - 1;
		year = y;
		activeDay = 1;
		dateInput = '';
	}

	async function saveTask() {
		const fd = new FormData();
		fd.set('title', taskName);
		fd.set('worker', taskAuthor);
		fd.set('description', taskDescription);
		fd.set('task_date', taskDate);

		if (editingTask) {
			fd.set('id', editingTask.id);
			await fetch('?/update', { method: 'POST', body: fd });
			editingTask.title = taskName;
			editingTask.worker = taskAuthor;
			editingTask.description = taskDescription;
			editingTask.task_date = taskDate;
		} else {
			const res = await fetch('?/create', { method: 'POST', body: fd });
			const result = await res.json();
			
			tasks = [...tasks, {
				id: result.data.id,
				title: taskName,
				worker: taskAuthor,
				description: taskDescription,
				task_date: taskDate,
				done: false
			}];
			
			const d = new Date(taskDate);
			month = d.getMonth();
			year = d.getFullYear();
			activeDay = d.getDate();
		}
		
		taskName = taskAuthor = taskDescription = taskDate = '';
		editingTask = null;
		showAddTask = false;
	}

	function openAdd() {
		editingTask = null;
		taskName = taskAuthor = taskDescription = '';
		taskDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(activeDay).padStart(2, '0')}`;
		showAddTask = true;
	}

	function openEdit(task) {
		editingTask = task;
		taskName = task.title;
		taskAuthor = task.worker;
		taskDescription = task.description;
		taskDate = task.task_date;
		showAddTask = true;
	}

	async function deleteTask(task) {
		if (!confirm('Delete this task?')) return;
		
		const fd = new FormData();
		fd.set('id', task.id);
		await fetch('?/delete', { method: 'POST', body: fd });
		tasks = tasks.filter(t => t.id !== task.id);
	}

	async function toggleDone(task) {
		task.done = !task.done;
		
		const fd = new FormData();
		fd.set('id', task.id);
		fd.set('title', task.title);
		fd.set('worker', task.worker);
		fd.set('description', task.description);
		fd.set('task_date', task.task_date);
		await fetch('?/update', { method: 'POST', body: fd });
	}
</script>

<div class="calendar-page">
	<!-- Animated Background Elements -->
	<div class="bg-shapes">
		<div class="shape shape-1"></div>
		<div class="shape shape-2"></div>
		<div class="shape shape-3"></div>
	</div>

	<!-- Hero Header -->
	<div class="hero-header">
		<div class="hero-content">
			<div class="hero-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
					<line x1="16" y1="2" x2="16" y2="6" stroke-width="2" stroke-linecap="round"/>
					<line x1="8" y1="2" x2="8" y2="6" stroke-width="2" stroke-linecap="round"/>
					<line x1="3" y1="10" x2="21" y2="10" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</div>
			<div class="hero-text">
				<h1>Calendar Schedule</h1>
				<p>Organize your property viewings and team tasks</p>
			</div>
		</div>
		<div class="hero-stats">
			<div class="stat-card">
				<div class="stat-icon">📅</div>
				<div class="stat-info">
					<span class="stat-value">{getDow(year, month, activeDay)}</span>
					<span class="stat-label">Today</span>
				</div>
			</div>
			<div class="stat-card">
				<div class="stat-icon">✓</div>
				<div class="stat-info">
					<span class="stat-value">{selectedTasks.length}</span>
					<span class="stat-label">Active</span>
				</div>
			</div>
			<div class="stat-card">
				<div class="stat-icon">📊</div>
				<div class="stat-info">
					<span class="stat-value">{tasks.length}</span>
					<span class="stat-label">Total</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Grid -->
	<div class="calendar-grid-container">
		<!-- Calendar Card -->
		<div class="glass-card calendar-card">
			<!-- Month Navigation -->
			<div class="month-nav">
				<button class="nav-button" onclick={prevMonth} aria-label="Previous month">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<div class="month-display">
					<h2>{months[month]}</h2>
					<span>{year}</span>
				</div>
				<button class="nav-button" onclick={nextMonth} aria-label="Next month">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>

			<!-- Weekdays -->
			<div class="weekdays">
				{#each ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as day}
					<div class="weekday">{day}</div>
				{/each}
			</div>

			<!-- Days Grid -->
			<div class="days-grid">
				{#each Array.from({ length: new Date(year, month, 1).getDay() }) as _}
					<div class="day-cell empty"></div>
				{/each}
				{#each Array.from({ length: daysInMonth(month, year) }, (_, i) => i + 1) as day}
					<button 
						class="day-cell {isToday(day) ? 'today' : ''} {activeDay === day ? 'active' : ''}"
						onclick={() => selectDay(day)}>
						<span class="day-number">{day}</span>
						{#if hasTask(day)}
							<span class="task-dot"></span>
						{/if}
					</button>
				{/each}
			</div>

			<!-- Quick Actions -->
			<div class="quick-actions">
				<div class="date-jump">
					<input type="text" id="date-jump" name="date-jump" bind:value={dateInput} placeholder="MM/YYYY" class="date-input" autocomplete="off" />
					<button onclick={gotoDate} class="action-btn secondary">Go</button>
				</div>
				<button onclick={gotoToday} class="action-btn primary">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<circle cx="12" cy="12" r="10" stroke-width="2"/>
						<polyline points="12 6 12 12 16 14" stroke-width="2" stroke-linecap="round"/>
					</svg>
					Today
				</button>
			</div>
		</div>

		<!-- Tasks Panel -->
		<div class="glass-card tasks-card">
			<div class="tasks-header">
				<div class="date-badge">
					<span class="badge-day">{activeDay}</span>
					<div class="badge-info">
						<span class="badge-month">{months[month]}</span>
						<span class="badge-dow">{getDow(year, month, activeDay)}</span>
					</div>
				</div>
				<button class="add-task-btn" onclick={openAdd}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<circle cx="12" cy="12" r="10" stroke-width="2"/>
						<line x1="12" y1="8" x2="12" y2="16" stroke-width="2" stroke-linecap="round"/>
						<line x1="8" y1="12" x2="16" y2="12" stroke-width="2" stroke-linecap="round"/>
					</svg>
					Add Task
				</button>
			</div>

			<div class="tasks-list">
				{#if selectedTasks.length > 0}
					{#each selectedTasks as task, i}
						<div class="task-card {task.done ? 'completed' : ''}" style="animation-delay: {i * 50}ms">
							<div class="task-check">
								<input 
									type="checkbox" 
									bind:checked={task.done} 
									onchange={() => toggleDone(task)}
									id="task-{task.id}"
								/>
								<label for="task-{task.id}"></label>
							</div>
							<div class="task-content">
								<h3>{task.title}</h3>
								<p class="task-author">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-width="2"/>
										<circle cx="12" cy="7" r="4" stroke-width="2"/>
									</svg>
									{task.worker}
								</p>
								<p class="task-desc">{task.description}</p>
							</div>
							<div class="task-actions">
								<button class="icon-btn edit" onclick={() => openEdit(task)} aria-label="Edit">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke-width="2"/>
										<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2"/>
									</svg>
								</button>
								<button class="icon-btn delete" onclick={() => deleteTask(task)} aria-label="Delete">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<polyline points="3 6 5 6 21 6" stroke-width="2"/>
										<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke-width="2"/>
										<line x1="10" y1="11" x2="10" y2="17" stroke-width="2"/>
										<line x1="14" y1="11" x2="14" y2="17" stroke-width="2"/>
									</svg>
								</button>
							</div>
						</div>
					{/each}
				{:else}
					<div class="empty-state">
						<div class="empty-icon">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<circle cx="12" cy="12" r="10" stroke-width="2"/>
								<line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round"/>
								<line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" stroke-linecap="round"/>
							</svg>
						</div>
						<h3>No tasks scheduled</h3>
						<p>Click "Add Task" to create your first task</p>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Modal -->
	{#if showAddTask}
		<div class="modal-overlay" role="button" tabindex="0" 
			onclick={(e) => e.target === e.currentTarget && (showAddTask = false)}
			onkeydown={(e) => e.key === 'Escape' && (showAddTask = false)}>
			<div class="modal-card" role="dialog">
				<div class="modal-header">
					<h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
					<button class="close-btn" onclick={() => showAddTask = false} aria-label="Close modal">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<line x1="18" y1="6" x2="6" y2="18" stroke-width="2" stroke-linecap="round"/>
							<line x1="6" y1="6" x2="18" y2="18" stroke-width="2" stroke-linecap="round"/>
						</svg>
					</button>
				</div>

				<form class="modal-form" onsubmit={(e) => { e.preventDefault(); saveTask(); }}>
					<div class="form-field">
						<label for="task-name">Task Name</label>
						<input id="task-name" name="task-name" type="text" bind:value={taskName} placeholder="Enter task name" autocomplete="off" />
					</div>

					<div class="form-field">
						<label for="task-worker">Assigned Worker</label>
						<input id="task-worker" name="task-worker" type="text" bind:value={taskAuthor} placeholder="Worker name" autocomplete="name" />
					</div>

					<div class="form-field">
						<label for="task-desc">Description</label>
						<textarea id="task-desc" name="task-desc" bind:value={taskDescription} placeholder="Task details..." rows="4" autocomplete="off"></textarea>
					</div>

					<div class="form-field">
						<label for="task-date">Date</label>
						<input id="task-date" name="task-date" type="date" bind:value={taskDate} autocomplete="off" />
					</div>

					<div class="form-actions">
						<button type="button" class="action-btn secondary" onclick={() => showAddTask = false}>
							Cancel
						</button>
						<button type="submit" class="action-btn primary">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<polyline points="20 6 9 17 4 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
							{editingTask ? 'Update' : 'Create'} Task
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>

<style>
	* {
		box-sizing: border-box;
	}

	.calendar-page {
		min-height: 100vh;
		background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
		padding: 2rem;
		position: relative;
		overflow-x: hidden;
	}

	/* Animated Background Shapes */
	.bg-shapes {
		position: fixed;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
		z-index: 0;
	}

	.shape {
		position: absolute;
		border-radius: 50%;
		opacity: 0.05;
		animation: float-shape 20s infinite ease-in-out;
	}

	.shape-1 {
		width: 400px;
		height: 400px;
		background: var(--primary-color);
		top: -100px;
		right: -100px;
		animation-delay: 0s;
	}

	.shape-2 {
		width: 300px;
		height: 300px;
		background: var(--accent-color);
		bottom: -50px;
		left: -50px;
		animation-delay: 5s;
	}

	.shape-3 {
		width: 250px;
		height: 250px;
		background: var(--primary-color);
		top: 50%;
		right: 20%;
		animation-delay: 10s;
	}

	@keyframes float-shape {
		0%, 100% {
			transform: translate(0, 0) rotate(0deg);
		}
		25% {
			transform: translate(30px, -30px) rotate(90deg);
		}
		50% {
			transform: translate(-20px, 20px) rotate(180deg);
		}
		75% {
			transform: translate(20px, 30px) rotate(270deg);
		}
	}

	/* Hero Header */
	.hero-header {
		position: relative;
		z-index: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding: 2rem;
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
		border-radius: 24px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 20px 60px rgba(26, 34, 54, 0.3);
		animation: slideDown 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-50px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.hero-content {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.hero-icon {
		width: 72px;
		height: 72px;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		border-radius: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		animation: pulse 3s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% {
			transform: scale(1);
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		}
		50% {
			transform: scale(1.05);
			box-shadow: 0 12px 40px rgba(14, 165, 233, 0.4);
		}
	}

	.hero-icon svg {
		width: 40px;
		height: 40px;
		color: white;
	}

	.hero-text h1 {
		margin: 0;
		font-size: 2.5rem;
		font-weight: 800;
		color: white;
		letter-spacing: -1px;
		text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
	}

	.hero-text p {
		margin: 0.5rem 0 0;
		color: rgba(255, 255, 255, 0.95);
		font-size: 1.05rem;
	}

	.hero-stats {
		display: flex;
		gap: 1rem;
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.5rem;
		background: rgba(255, 255, 255, 0.12);
		backdrop-filter: blur(20px);
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		min-width: 130px;
		transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		animation: fadeInUp 0.6s ease-out;
		animation-fill-mode: both;
	}

	.stat-card:nth-child(1) { animation-delay: 0.1s; }
	.stat-card:nth-child(2) { animation-delay: 0.2s; }
	.stat-card:nth-child(3) { animation-delay: 0.3s; }

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.stat-card:hover {
		transform: translateY(-8px) scale(1.05);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
		background: rgba(255, 255, 255, 0.2);
	}

	.stat-icon {
		font-size: 2.2rem;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
		animation: bounce 2s ease-in-out infinite;
	}

	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-5px); }
	}

	.stat-info {
		display: flex;
		flex-direction: column;
	}

	.stat-value {
		font-size: 1.75rem;
		font-weight: 700;
		color: white;
	}

	.stat-label {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.9);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-weight: 500;
	}

	/* Main Grid */
	.calendar-grid-container {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: 1fr 420px;
		gap: 2rem;
		animation: fadeIn 0.8s ease-out 0.3s both;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	/* Glass Card Effect */
	.glass-card {
		background: rgba(255, 255, 255, 0.98);
		backdrop-filter: blur(30px);
		border-radius: 24px;
		padding: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.5);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.glass-card:hover {
		box-shadow: 0 25px 70px rgba(0, 0, 0, 0.15);
		transform: translateY(-2px);
	}

	/* Calendar Card */
	.calendar-card {
		animation: slideRight 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	@keyframes slideRight {
		from {
			opacity: 0;
			transform: translateX(-50px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.month-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 2rem;
	}

	.nav-button {
		width: 48px;
		height: 48px;
		border: none;
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		box-shadow: 0 8px 20px rgba(26, 34, 54, 0.3);
	}

	.nav-button:hover {
		transform: scale(1.15) rotate(5deg);
		box-shadow: 0 12px 30px rgba(14, 165, 233, 0.5);
	}

	.nav-button:active {
		transform: scale(0.95) rotate(-5deg);
	}

	.nav-button svg {
		width: 24px;
		height: 24px;
		color: white;
	}

	.month-display {
		text-align: center;
	}

	.month-display h2 {
		margin: 0;
		font-size: 2.2rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient 3s ease infinite;
	}

	@keyframes gradient {
		0%, 100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	.month-display span {
		color: var(--gray-600);
		font-size: 0.95rem;
		font-weight: 500;
	}

	.weekdays {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.weekday {
		text-align: center;
		font-weight: 700;
		color: var(--gray-700);
		font-size: 0.85rem;
		padding: 0.75rem 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.days-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.day-cell {
		aspect-ratio: 1;
		border: none;
		background: var(--gray-100);
		border-radius: 14px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		font-weight: 600;
		color: var(--gray-700);
	}

	.day-cell.empty {
		background: transparent;
		cursor: default;
	}

	.day-cell:not(.empty):hover {
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
		color: white;
		transform: scale(1.1) rotate(2deg);
		box-shadow: 0 10px 25px rgba(14, 165, 233, 0.4);
		z-index: 10;
	}

	.day-cell.today {
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
		color: white;
		font-weight: 700;
		box-shadow: 0 8px 20px rgba(26, 34, 54, 0.4);
		animation: todayPulse 3s ease-in-out infinite;
	}

	@keyframes todayPulse {
		0%, 100% {
			transform: scale(1);
			box-shadow: 0 8px 20px rgba(26, 34, 54, 0.4);
		}
		50% {
			transform: scale(1.05);
			box-shadow: 0 12px 30px rgba(26, 34, 54, 0.6);
		}
	}

	.day-cell.active {
		background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-light) 100%);
		color: white;
		font-weight: 700;
		transform: scale(1.08);
		box-shadow: 0 12px 30px rgba(14, 165, 233, 0.6);
		animation: activeGlow 2s ease-in-out infinite;
	}

	@keyframes activeGlow {
		0%, 100% {
			box-shadow: 0 12px 30px rgba(14, 165, 233, 0.6);
		}
		50% {
			box-shadow: 0 12px 40px rgba(14, 165, 233, 0.8);
		}
	}

	.day-number {
		font-size: 1rem;
	}

	.task-dot {
		width: 6px;
		height: 6px;
		background: var(--success-color);
		border-radius: 50%;
		position: absolute;
		bottom: 6px;
		box-shadow: 0 0 10px rgba(16, 185, 129, 0.8);
		animation: dotPulse 2s ease-in-out infinite;
	}

	@keyframes dotPulse {
		0%, 100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.3);
			opacity: 0.7;
		}
	}

	.day-cell.active .task-dot,
	.day-cell.today .task-dot {
		background: white;
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
	}

	/* Quick Actions */
	.quick-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1.5rem;
		border-top: 2px solid var(--gray-200);
	}

	.date-jump {
		display: flex;
		gap: 0.5rem;
	}

	.date-input {
		padding: 0.75rem 1rem;
		border: 2px solid var(--gray-300);
		border-radius: 12px;
		font-size: 0.9rem;
		transition: all 0.3s;
		width: 130px;
	}

	.date-input:focus {
		outline: none;
		border-color: var(--accent-color);
		box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
		transform: scale(1.02);
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		font-size: 0.95rem;
	}

	.action-btn.primary {
		background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-dark) 100%);
		color: white;
		box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
	}

	.action-btn.primary:hover {
		transform: translateY(-3px) scale(1.05);
		box-shadow: 0 10px 30px rgba(14, 165, 233, 0.6);
	}

	.action-btn.secondary {
		background: var(--gray-200);
		color: var(--gray-700);
	}

	.action-btn.secondary:hover {
		background: var(--gray-300);
		transform: translateY(-2px);
	}

	.action-btn svg {
		width: 18px;
		height: 18px;
	}

	/* Tasks Card */
	.tasks-card {
		animation: slideLeft 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		max-height: calc(100vh - 220px);
		display: flex;
		flex-direction: column;
	}

	@keyframes slideLeft {
		from {
			opacity: 0;
			transform: translateX(50px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.tasks-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 2px solid var(--gray-200);
	}

	.date-badge {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.85rem 1.25rem;
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
		border-radius: 14px;
		color: white;
		box-shadow: 0 8px 20px rgba(26, 34, 54, 0.3);
		animation: badgeFloat 3s ease-in-out infinite;
	}

	@keyframes badgeFloat {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-4px);
		}
	}

	.badge-day {
		font-size: 2.2rem;
		font-weight: 700;
		line-height: 1;
	}

	.badge-info {
		display: flex;
		flex-direction: column;
	}

	.badge-month {
		font-weight: 600;
		font-size: 0.95rem;
	}

	.badge-dow {
		font-size: 0.8rem;
		opacity: 0.95;
	}

	.add-task-btn {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.85rem 1.5rem;
		border: none;
		background: linear-gradient(135deg, var(--success-color) 0%, #059669 100%);
		color: white;
		border-radius: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
	}

	.add-task-btn:hover {
		transform: translateY(-3px) scale(1.05);
		box-shadow: 0 10px 30px rgba(16, 185, 129, 0.6);
	}

	.add-task-btn svg {
		width: 22px;
		height: 22px;
	}

	.tasks-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow-y: auto;
		flex: 1;
		padding-right: 0.5rem;
	}

	.tasks-list::-webkit-scrollbar {
		width: 6px;
	}

	.tasks-list::-webkit-scrollbar-track {
		background: var(--gray-100);
		border-radius: 10px;
	}

	.tasks-list::-webkit-scrollbar-thumb {
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
		border-radius: 10px;
	}

	.task-card {
		display: flex;
		gap: 1rem;
		padding: 1.25rem;
		background: var(--gray-50);
		border-radius: 16px;
		border-left: 4px solid var(--accent-color);
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		animation: taskSlide 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
	}

	@keyframes taskSlide {
		from {
			opacity: 0;
			transform: translateX(-20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.task-card:hover {
		transform: translateX(6px) scale(1.02);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
		background: white;
	}

	.task-card.completed {
		opacity: 0.6;
		border-left-color: var(--gray-400);
	}

	.task-check {
		position: relative;
	}

	.task-check input[type="checkbox"] {
		width: 24px;
		height: 24px;
		cursor: pointer;
		opacity: 0;
		position: absolute;
	}

	.task-check label {
		width: 24px;
		height: 24px;
		border: 2px solid var(--accent-color);
		border-radius: 8px;
		display: block;
		position: relative;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		cursor: pointer;
	}

	.task-check label:hover {
		border-color: var(--accent-light);
		transform: scale(1.1);
	}

	.task-check input:checked + label {
		background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-dark) 100%);
		border-color: var(--accent-color);
		animation: checkBounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	@keyframes checkBounce {
		0% { transform: scale(0.8); }
		50% { transform: scale(1.2); }
		100% { transform: scale(1); }
	}

	.task-check input:checked + label::after {
		content: '';
		position: absolute;
		top: 3px;
		left: 7px;
		width: 6px;
		height: 12px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	.task-content {
		flex: 1;
	}

	.task-content h3 {
		margin: 0 0 0.5rem;
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--gray-900);
	}

	.task-card.completed .task-content h3 {
		text-decoration: line-through;
		color: var(--gray-500);
	}

	.task-author {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0 0 0.5rem;
		font-size: 0.85rem;
		color: var(--gray-600);
		font-weight: 500;
	}

	.task-author svg {
		width: 14px;
		height: 14px;
	}

	.task-desc {
		margin: 0;
		font-size: 0.9rem;
		color: var(--gray-600);
		line-height: 1.5;
	}

	.task-actions {
		display: flex;
		gap: 0.5rem;
	}

	.icon-btn {
		width: 38px;
		height: 38px;
		border: none;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	.icon-btn svg {
		width: 18px;
		height: 18px;
	}

	.icon-btn.edit {
		background: #dbeafe;
		color: #3b82f6;
	}

	.icon-btn.edit:hover {
		background: #3b82f6;
		color: white;
		transform: scale(1.15) rotate(5deg);
	}

	.icon-btn.delete {
		background: #fee2e2;
		color: #ef4444;
	}

	.icon-btn.delete:hover {
		background: #ef4444;
		color: white;
		transform: scale(1.15) rotate(-5deg);
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--gray-500);
		animation: emptyFloat 3s ease-in-out infinite;
	}

	@keyframes emptyFloat {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	.empty-icon {
		width: 80px;
		height: 80px;
		margin: 0 auto 1.5rem;
		background: var(--gray-100);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.empty-icon svg {
		width: 40px;
		height: 40px;
		color: var(--gray-400);
	}

	.empty-state h3 {
		margin: 0 0 0.5rem;
		font-size: 1.3rem;
		color: var(--gray-700);
	}

	.empty-state p {
		margin: 0;
		font-size: 0.95rem;
		color: var(--gray-500);
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(26, 34, 54, 0.7);
		backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 2rem;
		animation: fadeIn 0.3s ease-out;
	}

	.modal-card {
		width: 100%;
		max-width: 520px;
		background: white;
		border-radius: 24px;
		padding: 2rem;
		box-shadow: 0 30px 80px rgba(26, 34, 54, 0.4);
		animation: modalBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	@keyframes modalBounce {
		from {
			opacity: 0;
			transform: translateY(-40px) scale(0.9);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.85rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.close-btn {
		width: 42px;
		height: 42px;
		border: none;
		background: var(--gray-100);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	.close-btn:hover {
		background: #ef4444;
		transform: rotate(90deg) scale(1.1);
	}

	.close-btn:hover svg {
		color: white;
	}

	.close-btn svg {
		width: 20px;
		height: 20px;
		color: var(--gray-600);
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-field label {
		font-weight: 600;
		color: var(--gray-700);
		font-size: 0.95rem;
	}

	.form-field input,
	.form-field textarea {
		padding: 0.85rem 1rem;
		border: 2px solid var(--gray-300);
		border-radius: 12px;
		font-size: 0.95rem;
		transition: all 0.3s;
		font-family: inherit;
	}

	.form-field input:focus,
	.form-field textarea:focus {
		outline: none;
		border-color: var(--accent-color);
		box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
		transform: scale(1.01);
	}

	.form-field textarea {
		resize: vertical;
		min-height: 110px;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		padding-top: 1rem;
		border-top: 2px solid var(--gray-200);
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.calendar-grid-container {
			grid-template-columns: 1fr;
		}

		.hero-header {
			flex-direction: column;
			gap: 1.5rem;
		}

		.hero-stats {
			width: 100%;
			justify-content: center;
		}
	}

	@media (max-width: 640px) {
		.calendar-page {
			padding: 1rem;
		}

		.hero-text h1 {
			font-size: 1.85rem;
		}

		.glass-card {
			padding: 1.5rem;
		}

		.month-display h2 {
			font-size: 1.75rem;
		}

		.day-number {
			font-size: 0.9rem;
		}

		.stat-card {
			min-width: 100px;
			padding: 0.75rem 1rem;
		}
	}
</style>
