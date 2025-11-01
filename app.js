// FakeMRR - Where dreams become "data"
class FakeMRR {
    constructor() {
        this.startups = [];
        this.currentSort = 'revenue';
        this.searchTerm = '';
        this.init();
    }

    // Content moderation - Filter hate speech (client-side protection)
    containsHateSpeech(text) {
        if (!text) return false;

        const normalizedText = text.toLowerCase();

        // List of prohibited slurs and hate speech patterns
        const hateSpeechPatterns = [
            // Racial slurs (removed 'nig' to avoid false positives with 'Nigeria', 'knight', etc.)
            'nigger', 'nigga', 'n1gger', 'n1gga', ' nig ', 'coon', 'chink', 'gook', 'spic', 'wetback', 'beaner', 'towelhead', 'sand nigger', 'paki', 'curry muncher',
            // Anti-Semitic slurs
            'kike', 'yid', 'heeb', 'jew down', 'jewboy',
            // Homophobic slurs (removed 'fag' to avoid false positives)
            'faggot', 'f4ggot', 'dyke', 'tranny', 'tr4nny',
            // Other hate speech
            'hitler', 'nazi', 'kkk', 'white power', 'white supremacy', 'race traitor', 'genocide', 'gas the',
            // Common obfuscation attempts
            'n!gger', 'n*gger', 'f@ggot', 'f@g',
        ];

        // Check for exact matches and partial matches
        for (const pattern of hateSpeechPatterns) {
            if (normalizedText.includes(pattern)) {
                return true;
            }
        }

        // Check for character substitution patterns (l33t speak)
        const l33tSubstitutions = normalizedText
            .replace(/0/g, 'o')
            .replace(/1/g, 'i')
            .replace(/3/g, 'e')
            .replace(/4/g, 'a')
            .replace(/5/g, 's')
            .replace(/7/g, 't')
            .replace(/!/g, 'i')
            .replace(/@/g, 'a')
            .replace(/\$/g, 's')
            .replace(/\*/g, '')
            .replace(/\./g, '');

        for (const pattern of hateSpeechPatterns) {
            if (l33tSubstitutions.includes(pattern)) {
                return true;
            }
        }

        return false;
    }

    // Check if startup contains any hateful content
    isContentSafe(startup) {
        const fieldsToCheck = [
            startup.companyName,
            startup.founderName,
            startup.twitter,
            startup.website
        ];

        for (const field of fieldsToCheck) {
            if (this.containsHateSpeech(field)) {
                return false;
            }
        }

        return true;
    }

    async init() {
        this.setupEventListeners();
        await this.loadStartups();
        this.renderTable();
    }

    setupEventListeners() {
        // Modal controls
        const modal = document.getElementById('addStartupModal');
        const openBtn = document.getElementById('openModalBtn');
        const closeBtn = document.getElementById('closeModalBtn');
        const overlay = document.getElementById('modalOverlay');

        openBtn.addEventListener('click', () => this.openModal());
        closeBtn.addEventListener('click', () => this.closeModal());
        overlay.addEventListener('click', () => this.closeModal());

        // Form submission
        const form = document.getElementById('startupForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Search
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderTable();
        });

        // Filters
        const sortFilter = document.getElementById('sortFilter');
        sortFilter.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderTable();
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    openModal() {
        const modal = document.getElementById('addStartupModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('addStartupModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Check rate limiting
        const lastSubmission = localStorage.getItem('fakeMRR_lastSubmit');
        const now = Date.now();
        const cooldownPeriod = 60000; // 1 minute

        if (lastSubmission && (now - parseInt(lastSubmission)) < cooldownPeriod) {
            const remainingSeconds = Math.ceil((cooldownPeriod - (now - parseInt(lastSubmission))) / 1000);
            this.showToast(`Please wait ${remainingSeconds} seconds before submitting again`, 'error');
            return;
        }

        const formData = {
            companyName: document.getElementById('companyName').value,
            founderName: document.getElementById('founderName').value,
            twitter: document.getElementById('twitter').value,
            website: document.getElementById('website').value,
            mrr: parseFloat(document.getElementById('mrr').value) || 0,
            totalRevenue: parseFloat(document.getElementById('totalRevenue').value) || 0,
            growthRate: parseFloat(document.getElementById('growthRate').value) || 0,
        };

        try {
            // Disable submit button
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';

            const response = await fetch('/api/startups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to add startup');
            }

            // Double-check content safety before adding to local array
            if (this.isContentSafe(data.startup)) {
                this.startups.push(data.startup);
                this.renderTable();
            } else {
                console.warn('Blocked unsafe content from being displayed');
            }

            // Save submission timestamp for rate limiting
            localStorage.setItem('fakeMRR_lastSubmit', Date.now().toString());

            // Reset form and close modal
            e.target.reset();
            this.closeModal();
            this.showToast('Startup added to leaderboard! 🎉');

            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add startup';

        } catch (error) {
            console.error('Error adding startup:', error);
            this.showToast('Error adding startup. Please try again.', 'error');

            // Re-enable button
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add startup';
        }
    }

    renderTable() {
        const tbody = document.getElementById('leaderboardBody');
        const filtered = this.getFilteredStartups();

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="6" class="empty-state">
                        ${this.searchTerm ? 'No startups found matching your search.' : 'Loading startups...'}
                    </td>
                </tr>
            `;
            return;
        }

        const sorted = this.getSortedStartups(filtered);
        tbody.innerHTML = sorted.map((startup, index) => this.renderRow(startup, index + 1)).join('');
    }

    renderRow(startup, rank) {
        const medal = this.getMedal(rank);
        const rankDisplay = medal || rank;

        // Get domain from website
        const domain = startup.website ? this.getDomain(startup.website) : '';

        // Get favicon URL if website exists
        const faviconUrl = startup.website ? this.getFaviconUrl(startup.website) : null;

        // Generate emoji logo as fallback
        const logoEmoji = this.getCompanyEmoji(startup.companyName);
        const logoColor = this.getCompanyColor(startup.id);

        // Format twitter handle
        const twitterHandle = startup.twitter ? (startup.twitter.startsWith('@') ? startup.twitter : `@${startup.twitter}`) : '—';
        const twitterUsername = startup.twitter ? startup.twitter.replace('@', '') : '';
        const twitterLink = twitterUsername ? `https://twitter.com/${twitterUsername}` : '#';

        // Get Twitter avatar URL
        const twitterAvatarUrl = twitterUsername ? `https://unavatar.io/twitter/${twitterUsername}` : null;

        return `
            <tr>
                <td class="rank-cell">${rankDisplay}</td>
                <td>
                    <div class="startup-cell">
                        <div class="startup-logo ${faviconUrl ? 'has-image' : ''}" style="background-color: ${logoColor};">
                            ${faviconUrl
                                ? `<img src="${faviconUrl}" alt="${this.escapeHtml(startup.companyName)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                   <span class="fallback-emoji" style="display:none;">${logoEmoji}</span>`
                                : logoEmoji
                            }
                        </div>
                        <div class="startup-info">
                            <div class="startup-name">${this.escapeHtml(startup.companyName)}</div>
                            <div class="startup-url">${domain || 'No website'}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="founder-cell">
                        <div class="founder-avatar ${twitterAvatarUrl ? 'has-image' : ''}">
                            ${twitterAvatarUrl
                                ? `<img src="${twitterAvatarUrl}" alt="${this.escapeHtml(startup.founderName)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                   <span class="fallback-initials" style="display:none;">${this.getNameInitials(startup.founderName)}</span>`
                                : this.getNameInitials(startup.founderName)
                            }
                        </div>
                        <div class="founder-handle">
                            ${startup.twitter ? `<a href="${twitterLink}" target="_blank">${twitterHandle}</a>` : this.escapeHtml(startup.founderName)}
                        </div>
                    </div>
                </td>
                <td class="revenue-cell">$${this.formatNumber(startup.totalRevenue)}</td>
                <td class="mrr-cell">${startup.mrr > 0 ? '$' + this.formatNumber(startup.mrr) : '—'}</td>
                <td class="share-cell">
                    <button class="share-btn" onclick="fakeMRR.shareStartup(${startup.id})" title="Share this startup">
                        📤
                    </button>
                </td>
            </tr>
        `;
    }

    getFilteredStartups() {
        if (!this.searchTerm) return this.startups;

        return this.startups.filter(s =>
            s.companyName.toLowerCase().includes(this.searchTerm) ||
            s.founderName.toLowerCase().includes(this.searchTerm) ||
            (s.twitter && s.twitter.toLowerCase().includes(this.searchTerm))
        );
    }

    getSortedStartups(startups) {
        return [...startups].sort((a, b) => {
            switch(this.currentSort) {
                case 'revenue':
                    return b.totalRevenue - a.totalRevenue;
                case 'mrr':
                    return b.mrr - a.mrr;
                case 'growth':
                    return (b.growthRate || 0) - (a.growthRate || 0);
                default:
                    return 0;
            }
        });
    }

    getMedal(rank) {
        const medals = {
            1: '🥇',
            2: '🥈',
            3: '🥉'
        };
        return medals[rank];
    }

    getCompanyEmoji(name) {
        // Generate consistent emoji based on company name
        const emojis = ['🚀', '💎', '⚡', '🔥', '🌟', '💰', '🎯', '🎪', '🎭', '🎨', '🎲', '🎸', '🔮', '🌈', '🦄', '🐉', '🦅', '🐙', '🤖', '👾'];
        const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % emojis.length;
        return emojis[index];
    }

    getCompanyColor(id) {
        // Generate consistent pastel color based on ID
        const colors = [
            '#E0E7FF', '#DBEAFE', '#D1FAE5', '#FEF3C7', '#FEE2E2',
            '#FFE4E6', '#E9D5FF', '#FEF9C3', '#E0F2FE', '#D1F4E0'
        ];
        return colors[id % colors.length];
    }

    getNameInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    getDomain(url) {
        try {
            const domain = new URL(url).hostname;
            return domain.replace('www.', '');
        } catch {
            return url;
        }
    }

    getFaviconUrl(url) {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch {
            return null;
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toLocaleString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        if (type === 'error') {
            toast.style.background = '#ef4444';
        }
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // API methods
    async loadStartups() {
        try {
            // Show loading state
            const tbody = document.getElementById('leaderboardBody');
            tbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="6" class="empty-state">
                        <div class="loading-spinner"></div>
                        Loading startups...
                    </td>
                </tr>
            `;

            const response = await fetch('/api/startups');
            const data = await response.json();

            if (data.success && data.startups) {
                // Filter out any hateful content from existing database entries
                this.startups = data.startups.filter(startup => this.isContentSafe(startup));

                // Log filtered entries (for admin awareness)
                const filteredCount = data.startups.length - this.startups.length;
                if (filteredCount > 0) {
                    console.warn(`Filtered ${filteredCount} entries containing prohibited content`);
                }
            } else {
                console.error('Failed to load startups:', data);
                this.showToast('Failed to load startups', 'error');
                this.startups = [];
            }
        } catch (error) {
            console.error('Error loading startups:', error);
            this.showToast('Error connecting to server. Using offline mode.', 'error');
            this.startups = [];
        }
    }

    // Debug method to reload data from server
    async reload() {
        await this.loadStartups();
        this.renderTable();
        this.showToast('Data reloaded!');
    }

    // Share functionality
    async shareStartup(id) {
        const startup = this.startups.find(s => s.id === id);
        if (!startup) return;

        const shareData = {
            title: `${startup.companyName} on FakeMRR`,
            text: `Check out ${startup.companyName} by ${startup.founderName} - claiming $${this.formatNumber(startup.totalRevenue)} in revenue on FakeMRR!`,
            url: window.location.href
        };

        try {
            // Try Web Share API first (mobile-friendly)
            if (navigator.share) {
                await navigator.share(shareData);
                this.showToast('Shared successfully!');
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                this.showToast('Link copied to clipboard!');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
                this.showToast('Could not share', 'error');
            }
        }
    }

    async shareSite() {
        const shareData = {
            title: 'FakeMRR - The database of unverified startup revenues',
            text: 'Check out FakeMRR - where anyone can claim any revenue. No verification needed!',
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                this.showToast('Shared successfully!');
            } else {
                await navigator.clipboard.writeText(shareData.url);
                this.showToast('Link copied to clipboard!');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
            }
        }
    }
}

// Initialize the app
const app = new FakeMRR();

// Expose to console for debugging
window.fakeMRR = app;
console.log('💸 FakeMRR loaded! Type "fakeMRR.reload()" to refresh data from server.');
