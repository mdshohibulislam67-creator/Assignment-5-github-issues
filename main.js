let allData = [];
async function fetchIssues(url = "https://phi-lab-server.vercel.app/api/v1/lab/issues") {
    const spinner = document.getElementById('loading-spinner');
    const container = document.getElementById('all-issues');
    
    if (spinner) spinner.classList.remove('hidden');
    container.innerHTML = "";

    try {
        const res = await fetch(url);
        const result = await res.json();
        allData = Array.isArray(result) ? result : (result.data || []);
        
        renderCards(allData);
    } catch (err) {
        console.error("Fetch error:", err);
        container.innerHTML = `<p class="col-span-full text-center text-red-500 py-10">Failed to load data. Please check API.</p>`;
    } finally {
        if (spinner) spinner.classList.add('hidden');
    }
}
function renderCards(issues) {
    const container = document.getElementById('all-issues');
    const countElement = document.getElementById('issue-count');

    const issuesArray = Array.isArray(issues) ? issues : [];
    if (countElement) countElement.innerText = `${issuesArray.length} Issues`;

    if (issuesArray.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center py-20 text-gray-400">No issues found.</p>`;
        return;
    }

    container.innerHTML = issuesArray.map(issue => {
        const status = (issue.status || 'open').toLowerCase();
        const isOpen = status === 'open';
        const topBorder = isOpen ? 'border-t-green-500' : 'border-t-purple-500';
        
        const priority = issue.priority || 'Low';
        const prioStyle = priority === 'High' ? 'bg-red-50 text-red-500' : 
                        priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-500';

        return `
            <div onclick="openModal('${issue.id}')" class="bg-white border border-gray-200 border-t-4 ${topBorder} rounded-lg p-5 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer h-full">
                <div>
                    <div class="flex justify-between items-center mb-4">
                        <div class="${isOpen ? 'text-green-500' : 'text-purple-500'}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <span class="text-[10px] font-bold px-3 py-1 rounded-full ${prioStyle}">${priority.toUpperCase()}</span>
                    </div>

                    <h3 class="text-sm font-bold text-gray-800 leading-tight mb-2 line-clamp-2">${issue.title || 'No Title'}</h3>
                    <p class="text-xs text-gray-400 line-clamp-2 mb-4 font-medium">${issue.description || 'No description provided.'}</p>
                    
                    <div class="flex flex-wrap gap-2 mb-6">
                        <span class="text-[9px] font-bold px-2 py-1 rounded-md bg-red-50 text-red-400 border border-red-100 uppercase italic flex items-center gap-1">
                            <span class="w-1.5 h-1.5 bg-red-400 rounded-full"></span> BUG
                        </span>
                        <span class="text-[9px] font-bold px-2 py-1 rounded-md bg-yellow-50 text-yellow-500 border border-yellow-100 uppercase italic flex items-center gap-1">
                            <span class="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> HELP WANTED
                        </span>
                    </div>
                </div>

                <div class="pt-4 border-t border-gray-100">
                    <p class="text-[11px] text-gray-500 font-bold">#${issue.id} by ${issue.author || 'unknown'}</p>
                    <p class="text-[11px] text-gray-400">${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>
        `;
    }).join('');
}
function filterIssues(status) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
        tab.classList.add('text-gray-500', 'hover:bg-gray-100');
    });

    const activeTab = document.getElementById(`tab-${status}`);
    if(activeTab) {
        activeTab.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
        activeTab.classList.remove('text-gray-500', 'hover:bg-gray-100');
    }

    if (status === 'all') {
        renderCards(allData);
    } else {
        const filtered = allData.filter(i => (i.status || '').toLowerCase() === status);
        renderCards(filtered);
    }
}
async function openModal(id) {
    const modal = document.getElementById('issue-modal');
    const content = document.getElementById('modal-content');
    modal.classList.replace('hidden', 'flex');
    content.innerHTML = `<p class="text-center text-gray-500">Loading...</p>`;

    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const issue = await res.json();
        
        content.innerHTML = `
            <div class="mb-6">
                <span class="text-[10px] font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 uppercase mb-4 inline-block">${issue.label || 'Task'}</span>
                <h2 class="text-2xl font-bold text-gray-900 mb-1">${issue.title}</h2>
                <p class="text-gray-400 text-xs">Created by <span class="text-indigo-600 font-bold">${issue.author}</span> on ${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6 max-h-40 overflow-y-auto">
                <p class="text-gray-700 text-sm leading-relaxed">${issue.description}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="p-3 bg-white border border-gray-100 rounded-md">
                    <p class="text-gray-400 text-[10px] uppercase font-bold mb-1">Priority</p>
                    <p class="text-sm font-bold text-gray-800">${issue.priority}</p>
                </div>
                <div class="p-3 bg-white border border-gray-100 rounded-md">
                    <p class="text-gray-400 text-[10px] uppercase font-bold mb-1">Status</p>
                    <p class="text-sm font-bold text-gray-800 capitalize">${issue.status}</p>
                </div>
            </div>
        `;
    } catch (err) {
        content.innerHTML = `<p class="text-red-500">Error loading details.</p>`;
    }
}

function closeModal() {
    document.getElementById('issue-modal').classList.replace('flex', 'hidden');
}

document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    fetchIssues(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`);
});
fetchIssues();