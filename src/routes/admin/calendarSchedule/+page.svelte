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

<!-- Modern Calendar Schedule with Tailwind CSS -->
<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
	<!-- Animated Background Shapes -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
		<div class="absolute w-96 h-96 bg-sky-500/5 rounded-full -top-24 -right-24 animate-blob"></div>
		<div class="absolute w-80 h-80 bg-orange-500/5 rounded-full -bottom-12 -left-12 animate-blob animation-delay-2000"></div>
		<div class="absolute w-72 h-72 bg-sky-700/5 rounded-full top-1/2 right-1/4 animate-blob animation-delay-4000"></div>
	</div>

	<!-- Hero Header -->
	<div class="relative z-10 flex flex-col lg:flex-row justify-between items-center mb-8 p-6 sm:p-8 bg-gradient-to-r from-sky-600 via-sky-500 to-orange-500 rounded-3xl border border-white/10 shadow-2xl animate-slide-down">
		<div class="flex items-center gap-6 mb-6 lg:mb-0">
			<div class="w-16 h-16 sm:w-20 sm:h-20 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl animate-pulse-slow">
				<svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
					<line x1="16" y1="2" x2="16" y2="6" stroke-width="2" stroke-linecap="round"/>
					<line x1="8" y1="2" x2="8" y2="6" stroke-width="2" stroke-linecap="round"/>
					<line x1="3" y1="10" x2="21" y2="10" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</div>
			<div class="text-white">
				<h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 drop-shadow-md">Calendar Schedule</h1>
				<p class="text-base sm:text-lg text-sky-100 opacity-95">Organize your property viewings and team tasks</p>
			</div>
		</div>
		<div class="flex gap-4">
			<div class="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center min-w-[120px] shadow-lg animate-fade-in-up-delay-1">
				<div class="text-3xl mb-2">📅</div>
				<span class="block text-2xl font-bold text-white">{getDow(year, month, activeDay)}</span>
				<span class="block text-xs text-sky-100 opacity-80">Today</span>
				</div>
			<div class="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center min-w-[120px] shadow-lg animate-fade-in-up-delay-2">
				<div class="text-3xl mb-2">✓</div>
				<span class="block text-2xl font-bold text-white">{selectedTasks.length}</span>
				<span class="block text-xs text-sky-100 opacity-80">Active</span>
			</div>
			<div class="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center min-w-[120px] shadow-lg animate-fade-in-up-delay-3">
				<div class="text-3xl mb-2">📊</div>
				<span class="block text-2xl font-bold text-white">{tasks.length}</span>
				<span class="block text-xs text-sky-100 opacity-80">Total</span>
			</div>
		</div>
	</div>

	<!-- Main Grid -->
	<div class="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 animate-fade-in">
		<!-- Calendar Card -->
		<div class="bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-slide-right">
			<!-- Month Navigation -->
			<div class="flex items-center justify-between mb-8">
				<button 
					class="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-sky-600 to-orange-600 rounded-xl text-white shadow-lg hover:scale-110 hover:rotate-6 active:scale-95 transition-all duration-300"
					onclick={prevMonth}
					aria-label="Previous month"
				>
					<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<div class="text-center">
					<h2 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-600 to-orange-600 bg-clip-text text-transparent">{months[month]}</h2>
					<span class="text-gray-600 font-medium">{year}</span>
				</div>
				<button 
					class="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-sky-600 to-orange-600 rounded-xl text-white shadow-lg hover:scale-110 hover:-rotate-6 active:scale-95 transition-all duration-300"
					onclick={nextMonth}
					aria-label="Next month"
				>
					<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>

			<!-- Weekdays -->
			<div class="grid grid-cols-7 gap-2 mb-2">
				{#each ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as day}
					<div class="text-center font-bold text-gray-700 text-sm uppercase tracking-wide py-3">{day}</div>
				{/each}
			</div>

			<!-- Days Grid -->
			<div class="grid grid-cols-7 gap-2 mb-8">
				{#each Array.from({ length: new Date(year, month, 1).getDay() }) as _}
					<div class="aspect-square"></div>
				{/each}
				{#each Array.from({ length: daysInMonth(month, year) }, (_, i) => i + 1) as day}
					<button 
						class="aspect-square flex flex-col items-center justify-center rounded-xl font-semibold text-gray-700 transition-all duration-300 relative
							{isToday(day) ? 'bg-gradient-to-br from-sky-600 to-sky-700 text-white font-bold shadow-lg animate-today-pulse' : ''}
							{activeDay === day && !isToday(day) ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold shadow-lg scale-105' : ''}
							{!isToday(day) && activeDay !== day ? 'bg-gray-100 hover:bg-gradient-to-br hover:from-sky-600 hover:to-orange-600 hover:text-white hover:scale-110 hover:shadow-lg hover:z-10' : ''}"
						onclick={() => selectDay(day)}
					>
						<span class="text-base">{day}</span>
						{#if hasTask(day)}
							<span class="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shadow-glow {isToday(day) || activeDay === day ? 'bg-white' : ''} animate-dot-pulse"></span>
						{/if}
					</button>
				{/each}
			</div>

			<!-- Quick Actions -->
			<div class="flex justify-between items-center pt-6 border-t-2 border-gray-200">
				<div class="flex gap-2">
					<input 
						type="text" 
						id="date-jump" 
						name="date-jump" 
						bind:value={dateInput} 
						placeholder="MM/YYYY" 
						autocomplete="off"
						class="w-32 px-4 py-2.5 border-2 border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
					/>
					<button 
						onclick={gotoDate} 
						class="px-5 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 hover:-translate-y-0.5 transition-all"
					>
						Go
					</button>
				</div>
				<button 
					onclick={gotoToday} 
					class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-600 to-orange-600 text-white font-semibold rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all"
				>
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<circle cx="12" cy="12" r="10" stroke-width="2"/>
						<polyline points="12 6 12 12 16 14" stroke-width="2" stroke-linecap="round"/>
					</svg>
					Today
				</button>
			</div>
		</div>

		<!-- Tasks Panel -->
		<div class="bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xl max-h-[calc(100vh-280px)] flex flex-col animate-slide-left">
			<div class="flex justify-between items-center mb-6 pb-6 border-b-2 border-gray-200">
				<div class="flex items-center gap-4 px-5 py-3 bg-gradient-to-r from-sky-600 to-orange-600 rounded-xl text-white shadow-lg animate-badge-float">
					<span class="text-4xl font-bold">{activeDay}</span>
					<div>
						<span class="block font-semibold text-base">{months[month]}</span>
						<span class="block text-sm opacity-90">{getDow(year, month, activeDay)}</span>
					</div>
				</div>
				<button 
					class="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all"
					onclick={openAdd}
					aria-label="Add task"
				>
					<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<circle cx="12" cy="12" r="10" stroke-width="2"/>
						<line x1="12" y1="8" x2="12" y2="16" stroke-width="2" stroke-linecap="round"/>
						<line x1="8" y1="12" x2="16" y2="12" stroke-width="2" stroke-linecap="round"/>
					</svg>
					Add Task
				</button>
			</div>

			<div class="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
				{#if selectedTasks.length > 0}
					{#each selectedTasks as task, i}
						<div 
							class="flex gap-4 p-5 bg-gray-50 rounded-2xl border-l-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:translate-x-2 {task.done ? 'opacity-60 border-gray-400' : 'border-sky-500'}"
							style="animation: task-slide 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) both; animation-delay: {i * 50}ms;"
						>
							<div class="relative">
								<input 
									type="checkbox" 
									bind:checked={task.done} 
									onchange={() => toggleDone(task)}
									id="task-{task.id}"
									class="peer w-6 h-6 cursor-pointer opacity-0 absolute"
								/>
								<label 
									for="task-{task.id}" 
									class="block w-6 h-6 border-2 border-sky-500 rounded-lg cursor-pointer transition-all peer-checked:bg-gradient-to-br peer-checked:from-sky-600 peer-checked:to-sky-700 peer-hover:border-sky-400 peer-hover:scale-110 relative"
								>
									{#if task.done}
										<svg class="absolute inset-0 w-full h-full p-0.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
											<polyline points="20 6 9 17 4 12" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									{/if}
								</label>
							</div>
							<div class="flex-1">
								<h3 class="font-semibold text-gray-900 mb-2 {task.done ? 'line-through text-gray-500' : ''}">{task.title}</h3>
								<p class="flex items-center gap-2 text-sm text-gray-600 mb-2 font-medium">
									<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-width="2"/>
										<circle cx="12" cy="7" r="4" stroke-width="2"/>
									</svg>
									{task.worker}
								</p>
								<p class="text-sm text-gray-600 leading-relaxed">{task.description}</p>
							</div>
							<div class="flex flex-col gap-2">
								<button 
									class="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white hover:scale-110 hover:rotate-6 transition-all"
									onclick={() => openEdit(task)}
									aria-label="Edit"
								>
									<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke-width="2"/>
										<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2"/>
									</svg>
								</button>
								<button 
									class="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white hover:scale-110 hover:-rotate-6 transition-all"
									onclick={() => deleteTask(task)}
									aria-label="Delete"
								>
									<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
					<div class="text-center py-16 text-gray-500 animate-empty-float">
						<div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
							<svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<circle cx="12" cy="12" r="10" stroke-width="2"/>
								<line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round"/>
								<line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" stroke-linecap="round"/>
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-gray-700 mb-2">No tasks scheduled</h3>
						<p class="text-gray-500">Click "Add Task" to create your first task</p>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Modal -->
	{#if showAddTask}
		<div 
			class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
			role="button"
			tabindex="0"
			onclick={(e) => e.target === e.currentTarget && (showAddTask = false)}
			onkeydown={(e) => e.key === 'Escape' && (showAddTask = false)}
		>
			<div class="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl animate-modal-bounce" role="dialog">
				<div class="flex justify-between items-center mb-6">
					<h2 class="text-3xl font-bold bg-gradient-to-r from-sky-600 to-orange-600 bg-clip-text text-transparent">
						{editingTask ? 'Edit Task' : 'Create New Task'}
					</h2>
					<button 
						class="w-11 h-11 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-red-500 hover:rotate-90 hover:scale-110 transition-all group"
						onclick={() => showAddTask = false}
						aria-label="Close modal"
					>
						<svg class="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<line x1="18" y1="6" x2="6" y2="18" stroke-width="2" stroke-linecap="round"/>
							<line x1="6" y1="6" x2="18" y2="18" stroke-width="2" stroke-linecap="round"/>
						</svg>
					</button>
				</div>

				<form class="space-y-5" onsubmit={(e) => { e.preventDefault(); saveTask(); }}>
					<div class="flex flex-col gap-2">
						<label for="task-name" class="font-semibold text-gray-700">Task Name</label>
						<input 
							id="task-name" 
							name="task-name" 
							type="text" 
							bind:value={taskName} 
							placeholder="Enter task name"
							autocomplete="off"
							class="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
						/>
					</div>

					<div class="flex flex-col gap-2">
						<label for="task-worker" class="font-semibold text-gray-700">Assigned Worker</label>
						<input 
							id="task-worker" 
							name="task-worker" 
							type="text" 
							bind:value={taskAuthor} 
							placeholder="Worker name"
							autocomplete="name"
							class="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
						/>
					</div>

					<div class="flex flex-col gap-2">
						<label for="task-desc" class="font-semibold text-gray-700">Description</label>
						<textarea 
							id="task-desc" 
							name="task-desc" 
							bind:value={taskDescription} 
							placeholder="Task details..." 
							rows="4"
							autocomplete="off"
							class="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-y"
						></textarea>
					</div>

					<div class="flex flex-col gap-2">
						<label for="task-date" class="font-semibold text-gray-700">Date</label>
						<input 
							id="task-date" 
							name="task-date" 
							type="date" 
							bind:value={taskDate}
							autocomplete="off"
							class="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
						/>
					</div>

					<div class="flex justify-end gap-3 pt-4 border-t-2 border-gray-200">
						<button 
							type="button" 
							class="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 hover:-translate-y-0.5 transition-all"
							onclick={() => showAddTask = false}
						>
							Cancel
						</button>
						<button 
							type="submit" 
							class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-orange-600 text-white font-semibold rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all"
						>
							<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
	@keyframes blob {
		0%, 100% { transform: translate(0px, 0px) scale(1); }
		33% { transform: translate(30px, -50px) scale(1.1); }
		66% { transform: translate(-20px, 20px) scale(0.9); }
	}

	.animate-blob {
		animation: blob 7s infinite;
	}

	.animation-delay-2000 {
		animation-delay: 2s;
	}

	.animation-delay-4000 {
		animation-delay: 4s;
	}

	@keyframes slide-down {
		from { opacity: 0; transform: translateY(-50px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.animate-slide-down {
		animation: slide-down 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	@keyframes pulse-slow {
		0%, 100% { transform: scale(1); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); }
		50% { transform: scale(1.05); box-shadow: 0 12px 40px rgba(14, 165, 233, 0.4); }
	}

	.animate-pulse-slow {
		animation: pulse-slow 3s ease-in-out infinite;
	}

	@keyframes fade-in-up {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.animate-fade-in-up-delay-1 {
		animation: fade-in-up 0.6s ease-out 0.1s both;
	}

	.animate-fade-in-up-delay-2 {
		animation: fade-in-up 0.6s ease-out 0.2s both;
	}

	.animate-fade-in-up-delay-3 {
		animation: fade-in-up 0.6s ease-out 0.3s both;
	}

	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.animate-fade-in {
		animation: fade-in 0.8s ease-out 0.3s both;
	}

	@keyframes slide-right {
		from { opacity: 0; transform: translateX(-50px); }
		to { opacity: 1; transform: translateX(0); }
	}

	.animate-slide-right {
		animation: slide-right 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	@keyframes slide-left {
		from { opacity: 0; transform: translateX(50px); }
		to { opacity: 1; transform: translateX(0); }
	}

	.animate-slide-left {
		animation: slide-left 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	@keyframes today-pulse {
		0%, 100% { transform: scale(1); box-shadow: 0 8px 20px rgba(26, 34, 54, 0.4); }
		50% { transform: scale(1.05); box-shadow: 0 12px 30px rgba(26, 34, 54, 0.6); }
	}

	.animate-today-pulse {
		animation: today-pulse 3s ease-in-out infinite;
	}

	@keyframes dot-pulse {
		0%, 100% { transform: scale(1); opacity: 1; }
		50% { transform: scale(1.3); opacity: 0.7; }
	}

	.animate-dot-pulse {
		animation: dot-pulse 2s ease-in-out infinite;
	}

	.shadow-glow {
		box-shadow: 0 0 10px rgba(16, 185, 129, 0.8);
	}

	@keyframes badge-float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-4px); }
	}

	.animate-badge-float {
		animation: badge-float 3s ease-in-out infinite;
	}

	@keyframes task-slide {
		from { opacity: 0; transform: translateX(-20px); }
		to { opacity: 1; transform: translateX(0); }
	}

	@keyframes empty-float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	.animate-empty-float {
		animation: empty-float 3s ease-in-out infinite;
	}

	@keyframes modal-bounce {
		from { opacity: 0; transform: translateY(-40px) scale(0.9); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}

	.animate-modal-bounce {
		animation: modal-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	.shadow-3xl {
		box-shadow: 0 25px 70px rgba(0, 0, 0, 0.15);
	}

	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: #f1f5f9;
		border-radius: 10px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: linear-gradient(135deg, #0ea5e9, #f97316);
		border-radius: 10px;
	}
</style>
