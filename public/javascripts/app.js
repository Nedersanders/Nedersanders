// Shared utilities for the Nedersanders.nl application

import { initChangePassword } from "./change-password";
import { initProfileImageUpload } from "./profile-image-upload";
window.NedersandersApp = window.NedersandersApp || {};

(function(app) {
    'use strict';

    // Theme management utilities
    app.theme = {
        removeAppliedThemes: function(themeList) {
            for (let i = 0; i < themeList.length; i++) {
                document.body.classList.remove(themeList[i]);
            }
        },

        checkThemes: function() {
            let availableThemes = ["light", "dark"];
            let currentTheme = localStorage.getItem("theme") || "light";
            let localStorageThemeOveride = false;
            
            if (localStorage.getItem("theme") && availableThemes.includes(currentTheme)) {
                localStorageThemeOveride = true;
            }
            
            // Check if the browser supports prefers-color-scheme
            if (window.matchMedia) {
                const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
                if (darkModeQuery.matches) {
                    console.log("Dark mode is preferred by the user");
                    if (!localStorageThemeOveride) {
                        currentTheme = "dark";
                    }
                } else {
                    console.log("Light mode is preferred by the user");
                    if (!localStorageThemeOveride) {
                        currentTheme = "light";
                    }
                }
                // Apply the theme
                this.removeAppliedThemes(availableThemes);
                document.body.classList.add(currentTheme);
            } else {
                console.warn("Browser does not support prefers-color-scheme, defaulting to light mode");
                this.removeAppliedThemes(availableThemes);
                document.body.classList.add("light");
            }
        },

        toggle: function() {
            const currentTheme = localStorage.getItem('theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            this.checkThemes();
        }
    };

    // Navigation utilities
    app.navigation = {
        mobileMenu: null,
        mobileMenuToggle: null,
        mobileMenuClose: null,
        settingsDropdown: null,
        settingsDropdownToggle: null,

        init: function() {
            console.log('Initializing navigation...');
            this.mobileMenu = document.getElementById('mobile-menu');
            this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            this.mobileMenuClose = document.getElementById('mobile-menu-close');
            this.settingsDropdown = document.getElementById('settings-dropdown-menu');
            this.settingsDropdownToggle = document.getElementById('settings-dropdown-toggle');
            
            console.log('Settings dropdown found:', this.settingsDropdown);
            console.log('Settings dropdown toggle found:', this.settingsDropdownToggle);
            
            this.bindEvents();
        },

        bindEvents: function() {
            if (this.mobileMenuToggle) {
                this.mobileMenuToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleMobileMenu();
                });
            }

            if (this.mobileMenuClose) {
                this.mobileMenuClose.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeMobileMenu();
                });
            }

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                }
            });

            // Close menu when clicking on menu links
            document.querySelectorAll('.mobile-menu-link').forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (event) => {
                if (this.mobileMenu && !this.mobileMenu.contains(event.target) &&
                    this.mobileMenuToggle && !this.mobileMenuToggle.contains(event.target)) {
                    this.closeMobileMenu();
                }
                
                // Close settings dropdown when clicking outside
                if (this.settingsDropdown && this.settingsDropdownToggle &&
                    !this.settingsDropdown.contains(event.target) &&
                    !this.settingsDropdownToggle.contains(event.target)) {
                    this.closeSettingsDropdown();
                }
            });

            // Settings dropdown
            if (this.settingsDropdownToggle) {
                this.settingsDropdownToggle.addEventListener('click', (e) => {
                    console.log('Settings dropdown toggle clicked');
                    e.preventDefault();
                    e.stopPropagation(); // Prevent the document click handler from immediately closing
                    this.toggleSettingsDropdown();
                });
            } else {
                console.log('Settings dropdown toggle not found');
            }

            // Close dropdown on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                    this.closeSettingsDropdown();
                }
            });

            // Theme toggle
            const themeToggle = document.querySelector('#toggle-theme');
            const themeToggleMobile = document.querySelector('#toggle-theme-mobile');
            
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    app.theme.toggle();
                    // Sync the mobile toggle
                    if (themeToggleMobile) {
                        themeToggleMobile.checked = themeToggle.checked;
                    }
                });
            }
            
            if (themeToggleMobile) {
                themeToggleMobile.addEventListener('click', () => {
                    app.theme.toggle();
                    // Sync the desktop toggle
                    if (themeToggle) {
                        themeToggle.checked = themeToggleMobile.checked;
                    }
                });
            }
        },

        toggleMobileMenu: function() {
            const isOpen = this.mobileMenu.classList.contains('translate-x-0');
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        },

        openMobileMenu: function() {
            this.mobileMenu.classList.remove('translate-x-full');
            this.mobileMenu.classList.add('translate-x-0');
            document.body.classList.add('overflow-hidden');
        },

        closeMobileMenu: function() {
            this.mobileMenu.classList.remove('translate-x-0');
            this.mobileMenu.classList.add('translate-x-full');
            document.body.classList.remove('overflow-hidden');
        },

        toggleSettingsDropdown: function() {
            if (this.settingsDropdown.style.visibility === 'hidden' || this.settingsDropdown.classList.contains('opacity-0')) {
                this.openSettingsDropdown();
            } else {
                this.closeSettingsDropdown();
            }
        },

        openSettingsDropdown: function() {
            this.settingsDropdown.style.visibility = 'visible';
            this.settingsDropdown.classList.remove('opacity-0', 'translate-y-1', 'pointer-events-none');
            this.settingsDropdown.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
            this.settingsDropdownToggle.setAttribute('aria-expanded', 'true');
        },

        closeSettingsDropdown: function() {
            this.settingsDropdown.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            this.settingsDropdown.classList.add('opacity-0', 'translate-y-1', 'pointer-events-none');
            this.settingsDropdownToggle.setAttribute('aria-expanded', 'false');
            // Hide after transition completes
            setTimeout(() => {
                if (this.settingsDropdown.classList.contains('opacity-0')) {
                    this.settingsDropdown.style.visibility = 'hidden';
                }
            }, 200);
        }
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log("Initializing Nedersanders App");
        app.theme.checkThemes();
        app.navigation.init();
        initChangePassword();
        initProfileImageUpload();
    });


})(window.NedersandersApp);
