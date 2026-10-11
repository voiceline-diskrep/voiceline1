/**
 * Voiceline - Stickers & Custom Emoji System
 * Modular Client Module for Discord-Style Stickers
 */
(function() {
  'use strict';

  function getAuthToken() {
    if (window.VoicelineState && typeof window.VoicelineState.getToken === 'function') {
      const t = window.VoicelineState.getToken();
      if (t) return t;
    }
    return localStorage.getItem('voiceline_token') || localStorage.getItem('token') || '';
  }

  function getCurrentServerId() {
    if (window.VoicelineState && typeof window.VoicelineState.getActiveServerId === 'function') {
      return window.VoicelineState.getActiveServerId();
    }
    return null;
  }

  function getCurrentChannelId() {
    if (window.VoicelineState && typeof window.VoicelineState.getActiveChannelId === 'function') {
      return window.VoicelineState.getActiveChannelId();
    }
    return null;
  }

  function getCurrentDmFriend() {
    if (window.VoicelineState && typeof window.VoicelineState.getActiveDmFriend === 'function') {
      return window.VoicelineState.getActiveDmFriend();
    }
    return null;
  }

  function getActiveSocket() {
    if (window.VoicelineState && typeof window.VoicelineState.getSocket === 'function') {
      return window.VoicelineState.getSocket();
    }
    return window.socket || null;
  }

  const StickersModule = {
    popover: null,
    scrollArea: null,
    packContainer: null,
    searchInput: null,
    searchClearBtn: null,
    categoryPills: null,
    loadingIndicator: null,
    emptyState: null,
    uploadTriggerBtn: null,
    fileInput: null,
    serverPackPill: null,

    activeTriggerBtn: null,
    activeContext: 'channel', // 'channel' | 'dm'
    isOpen: false,
    isClosing: false,

    allStickers: [],
    selectedPack: 'all',
    searchQuery: '',

    init() {
      this.popover = document.getElementById('stickerPickerPopover');
      if (!this.popover) return;

      this.scrollArea = document.getElementById('stickerScrollArea');
      this.packContainer = document.getElementById('stickerPackContainer');
      this.searchInput = document.getElementById('stickerSearchInput');
      this.searchClearBtn = document.getElementById('stickerSearchClearBtn');
      this.categoryPills = document.getElementById('stickerCategoryPills');
      this.loadingIndicator = document.getElementById('stickerLoadingIndicator');
      this.emptyState = document.getElementById('stickerEmptyState');
      this.uploadTriggerBtn = document.getElementById('stickerUploadTriggerBtn');
      this.fileInput = document.getElementById('stickerFileInput');
      this.serverPackPill = document.getElementById('stickerServerPackPill');

      const chatStickerBtn = document.getElementById('chatStickerBtn');
      const dmChatStickerBtn = document.getElementById('dmChatStickerBtn');

      if (chatStickerBtn) {
        chatStickerBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggle(chatStickerBtn, 'channel');
        });
      }

      if (dmChatStickerBtn) {
        dmChatStickerBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggle(dmChatStickerBtn, 'dm');
        });
      }

      // Search input binding
      if (this.searchInput) {
        this.searchInput.addEventListener('input', () => {
          this.searchQuery = this.searchInput.value.trim().toLowerCase();
          if (this.searchClearBtn) {
            this.searchClearBtn.classList.toggle('hidden', !this.searchQuery);
          }
          this.render();
        });
      }

      if (this.searchClearBtn) {
        this.searchClearBtn.addEventListener('click', () => {
          if (this.searchInput) {
            this.searchInput.value = '';
            this.searchQuery = '';
          }
          this.searchClearBtn.classList.add('hidden');
          this.render();
        });
      }

      // Category / Pack filter pills
      if (this.categoryPills) {
        this.categoryPills.addEventListener('click', (e) => {
          const btn = e.target.closest('.sticker-pill-btn');
          if (!btn) return;
          this.categoryPills.querySelectorAll('.sticker-pill-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectedPack = btn.dataset.pack || 'all';
          this.render();
        });
      }

      // Upload button & File input binding
      if (this.uploadTriggerBtn && this.fileInput) {
        this.uploadTriggerBtn.addEventListener('click', () => {
          const token = getAuthToken();
          if (!token) {
            alert('Please log in or sign up before uploading custom stickers.');
            return;
          }
          this.fileInput.click();
        });

        this.fileInput.addEventListener('change', (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          this.handleFileUpload(file);
          this.fileInput.value = '';
        });
      }

      // Outside click & ESC dismissal
      document.addEventListener('click', (e) => {
        if (!this.isOpen || this.isClosing) return;
        if (this.popover.contains(e.target)) return;
        if (this.activeTriggerBtn && this.activeTriggerBtn.contains(e.target)) return;
        this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      window.addEventListener('resize', () => {
        if (this.isOpen && this.activeTriggerBtn) {
          this.positionPopover(this.activeTriggerBtn);
        }
      });
    },

    toggle(triggerBtn, context) {
      if (this.isOpen && this.activeTriggerBtn === triggerBtn) {
        this.close();
      } else {
        this.open(triggerBtn, context);
      }
    },

    open(triggerBtn, context) {
      if (!this.popover) return;

      // Close other pickers
      const gifPopover = document.getElementById('gifPickerPopover');
      if (gifPopover && !gifPopover.classList.contains('hidden')) {
        gifPopover.classList.add('hidden');
        document.querySelectorAll('.chat-gif-btn').forEach(b => b.classList.remove('active'));
      }
      const emojiPopover = document.getElementById('emojiPickerPopover');
      if (emojiPopover && !emojiPopover.classList.contains('hidden')) {
        emojiPopover.classList.add('hidden');
        document.querySelectorAll('.chat-emoji-btn').forEach(b => b.classList.remove('active'));
      }

      this.activeTriggerBtn = triggerBtn;
      this.activeContext = context;
      this.isOpen = true;
      this.isClosing = false;

      if (triggerBtn) triggerBtn.classList.add('active');
      this.popover.classList.remove('hidden', 'is-closing');
      this.positionPopover(triggerBtn);

      if (this.searchInput) {
        this.searchInput.value = '';
        this.searchQuery = '';
        setTimeout(() => this.searchInput.focus(), 60);
      }
      if (this.searchClearBtn) this.searchClearBtn.classList.add('hidden');

      // Update server pack pill visibility
      const srvId = getCurrentServerId();
      if (this.serverPackPill) {
        this.serverPackPill.style.display = (this.activeContext === 'channel' && srvId) ? 'inline-block' : 'none';
      }

      this.fetchStickers();
    },

    close() {
      if (!this.isOpen || !this.popover || this.isClosing) return;
      this.isClosing = true;
      this.popover.classList.add('is-closing');

      if (this.activeTriggerBtn) {
        this.activeTriggerBtn.classList.remove('active');
      }

      setTimeout(() => {
        if (this.popover) {
          this.popover.classList.add('hidden');
          this.popover.classList.remove('is-closing');
        }
        this.isOpen = false;
        this.isClosing = false;
        this.activeTriggerBtn = null;
      }, 160);
    },

    positionPopover(triggerBtn) {
      if (!this.popover || !triggerBtn) return;
      const rect = triggerBtn.getBoundingClientRect();
      const popWidth = Math.min(440, window.innerWidth - 24);
      const popHeight = Math.min(480, window.innerHeight - 120);

      let right = window.innerWidth - rect.right;
      let bottom = window.innerHeight - rect.top + 8;

      if (right < 12) right = 12;
      if (right + popWidth > window.innerWidth - 12) right = window.innerWidth - popWidth - 12;
      if (bottom + popHeight > window.innerHeight - 12) {
        bottom = window.innerHeight - popHeight - 12;
      }

      this.popover.style.right = `${Math.max(8, right)}px`;
      this.popover.style.bottom = `${Math.max(8, bottom)}px`;
    },

    async fetchStickers() {
      if (this.loadingIndicator) this.loadingIndicator.classList.remove('hidden');
      if (this.emptyState) this.emptyState.classList.add('hidden');
      if (this.packContainer) this.packContainer.innerHTML = '';

      const srvId = (this.activeContext === 'channel') ? getCurrentServerId() : null;
      const url = srvId ? `/api/stickers?serverId=${encodeURIComponent(srvId)}` : '/api/stickers';

      try {
        const token = getAuthToken();
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(url, { headers });
        const data = await res.json();
        if (data && Array.isArray(data.stickers)) {
          this.allStickers = data.stickers;
        } else {
          this.allStickers = [];
        }
      } catch (err) {
        console.error('[StickersModule] Failed to fetch stickers:', err);
        this.allStickers = [];
      } finally {
        if (this.loadingIndicator) this.loadingIndicator.classList.add('hidden');
        this.render();
      }
    },

    render() {
      if (!this.packContainer) return;
      this.packContainer.innerHTML = '';

      const query = this.searchQuery;
      const packFilter = this.selectedPack;

      // Filter stickers
      let filtered = this.allStickers.filter(s => {
        if (packFilter === 'official' && s.serverId !== null) return false;
        if (packFilter === 'server' && s.serverId === null) return false;

        if (query) {
          const nameMatch = (s.name || '').toLowerCase().includes(query);
          const tagsMatch = (s.tags || '').toLowerCase().includes(query);
          const descMatch = (s.description || '').toLowerCase().includes(query);
          return nameMatch || tagsMatch || descMatch;
        }
        return true;
      });

      if (filtered.length === 0) {
        if (this.emptyState) this.emptyState.classList.remove('hidden');
        return;
      }
      if (this.emptyState) this.emptyState.classList.add('hidden');

      // Group by pack: Official Voiceline (serverId === null) vs Server Custom
      const officialStickers = filtered.filter(s => s.serverId === null);
      const serverStickers = filtered.filter(s => s.serverId !== null);

      if (officialStickers.length > 0 && packFilter !== 'server') {
        this.renderPackSection('Voiceline Official Pack', officialStickers);
      }

      if (serverStickers.length > 0 && packFilter !== 'official') {
        let serverTitle = 'Server Stickers';
        if (window.VoicelineState && window.VoicelineState.getServers) {
          const activeSrvId = getCurrentServerId();
          const srv = window.VoicelineState.getServers().find(s => s.id === activeSrvId);
          if (srv && srv.name) serverTitle = `${srv.name} Stickers`;
        }
        this.renderPackSection(serverTitle, serverStickers);
      }
    },

    renderPackSection(title, stickers) {
      const section = document.createElement('div');
      section.className = 'sticker-pack-section';

      const header = document.createElement('div');
      header.className = 'sticker-pack-header';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'sticker-pack-title';
      titleSpan.textContent = title;

      const badge = document.createElement('span');
      badge.className = 'sticker-pack-badge';
      badge.textContent = `${stickers.length} stickers`;

      header.appendChild(titleSpan);
      header.appendChild(badge);
      section.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'sticker-grid';

      stickers.forEach(sticker => {
        const card = document.createElement('div');
        card.className = 'sticker-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', sticker.name || 'Sticker');

        const img = document.createElement('img');
        img.className = 'sticker-card-img';
        img.src = (typeof window.resolveAssetUrl === 'function') ? window.resolveAssetUrl(sticker.fileUrl) : sticker.fileUrl;
        img.alt = sticker.name || 'Sticker';
        img.loading = 'lazy';

        const tooltip = document.createElement('span');
        tooltip.className = 'sticker-card-tooltip';
        tooltip.textContent = sticker.name || 'Sticker';

        card.appendChild(img);
        card.appendChild(tooltip);

        card.addEventListener('click', (e) => {
          e.stopPropagation();
          this.sendSticker(sticker);
        });

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.sendSticker(sticker);
          }
        });

        grid.appendChild(card);
      });

      section.appendChild(grid);
      this.packContainer.appendChild(section);
    },

    sendSticker(sticker) {
      const sock = getActiveSocket();
      if (!sock || sock.readyState !== WebSocket.OPEN) {
        alert('Not connected to the Voiceline chat server.');
        return;
      }

      const stickerFile = {
        url: sticker.fileUrl,
        name: sticker.name || 'sticker',
        type: 'sticker',
        size: 0
      };

      if (this.activeContext === 'channel') {
        const currentChannelId = getCurrentChannelId();
        const currentServerId = getCurrentServerId();
        if (!currentChannelId) {
          alert('Please select a channel first.');
          return;
        }

        sock.send(JSON.stringify({
          type: 'chat',
          serverId: currentServerId,
          channelId: currentChannelId,
          content: '',
          file: stickerFile
        }));
      } else if (this.activeContext === 'dm') {
        const friend = getCurrentDmFriend();
        if (!friend) {
          alert('Please select a friend first.');
          return;
        }

        sock.send(JSON.stringify({
          type: 'direct_message',
          friendId: friend.id,
          content: '',
          file: stickerFile
        }));
      }

      this.close();

      if (window.VoicelineState && window.VoicelineState.playSound) {
        window.VoicelineState.playSound('pop');
      }
    },

    async handleFileUpload(file) {
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        alert('Sticker file must be under 2MB.');
        return;
      }

      const token = getAuthToken();
      if (!token) {
        alert('Please log in or sign up before uploading custom stickers.');
        return;
      }

      const defaultName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').slice(0, 30);
      const stickerName = prompt('Enter a name for this custom sticker:', defaultName);
      if (!stickerName || !stickerName.trim()) return;

      const stickerTags = prompt('Enter tags/keywords (comma separated, optional):', defaultName) || '';

      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result;
        let targetServerId = (this.activeContext === 'channel') ? getCurrentServerId() : null;

        // If in DM or no server active, find user's primary server
        if (!targetServerId && window.VoicelineState && window.VoicelineState.getServers) {
          const list = window.VoicelineState.getServers();
          if (list && list.length > 0) {
            targetServerId = list[0].id;
          }
        }

        try {
          const res = await fetch('/api/stickers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              serverId: targetServerId,
              name: stickerName.trim(),
              description: 'Custom Sticker',
              tags: stickerTags.trim(),
              imageData: base64Data
            })
          });

          const data = await res.json();
          if (!res.ok) {
            alert(data.error || 'Failed to upload sticker');
            return;
          }

          // Refresh stickers
          await this.fetchStickers();
        } catch (err) {
          console.error('[StickersModule] Upload failed:', err);
          alert('Upload failed: ' + err.message);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Attach globally and initialize upon DOM ready
  window.StickersModule = StickersModule;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => StickersModule.init());
  } else {
    StickersModule.init();
  }
})();
