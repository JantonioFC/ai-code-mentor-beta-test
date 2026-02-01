/**
 * Sistema de Backups Automatizados para AI Code Mentor
 * Exporta datos locales y configuraciones para respaldo
 * 
 * @module lib/backup/BackupManager
 */

import { storage } from '../storage/StorageManager';

/**
 * Configuración de backups
 */
const BACKUP_CONFIG = {
    autoBackupEnabled: true,
    autoBackupIntervalDays: 7,
    maxBackupsToKeep: 5,
    backupPrefix: 'ai-code-mentor-backup'
};

/**
 * Manager de backups
 */
class BackupManager {
    constructor() {
        this.lastBackupKey = 'lastBackupTimestamp';
    }

    /**
     * Crear backup completo de datos locales
     * @returns {Promise<Object>} - Datos del backup
     */
    async createBackup(options = { encrypt: false, password: null }) {
        console.log('[BackupManager] Iniciando backup...');

        try {
            await storage.init();
            const exportedData = await storage.exportAll();

            const backup = {
                version: '1.0.0',
                createdAt: new Date().toISOString(),
                type: 'full',
                data: {
                    analyses: exportedData.analyses || [],
                    draft: exportedData.draft || null
                },
                metadata: {
                    analysisCount: exportedData.analyses?.length || 0,
                    hasDraft: !!exportedData.draft,
                    exportedAt: exportedData.exportedAt,
                    encrypted: !!options.encrypt
                }
            };

            if (options.encrypt && options.password) {
                console.log('[BackupManager] Encriptando backup...');
                const encryptedData = await this._encryptData(backup.data, options.password);
                backup.data = encryptedData;
            }

            // Guardar timestamp
            await this.saveLastBackupTimestamp();
            return backup;

        } catch (error) {
            console.error('[BackupManager] Error creando backup:', error);
            throw error;
        }
    }

    /**
     * Generar URL para descarga (client-side)
     */
    createDownloadUrl(backupData) {
        if (typeof window === 'undefined') return null;

        const blob = new Blob([JSON.stringify(backupData, null, 2)], {
            type: 'application/json'
        });
        return URL.createObjectURL(blob);
    }

    /**
     * Helper para descargar archivo en navegador
     */
    triggerDownload(url, filename) {
        if (typeof window === 'undefined') return;

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async downloadBackup(options = { encrypt: false, password: null }) {
        const backup = await this.createBackup(options);
        const url = this.createDownloadUrl(backup);
        if (!url) return;

        const filename = `${BACKUP_CONFIG.backupPrefix}-${Date.now()}${options.encrypt ? '.enc' : ''}.json`;
        this.triggerDownload(url, filename);

        URL.revokeObjectURL(url);
        console.log(`[BackupManager] Backup descargado: ${filename}`);
    }

    async restoreFromBackup(backupData, password = null) {
        console.log('[BackupManager] Iniciando restauración...');

        try {
            if (!backupData.version || !backupData.data) {
                throw new Error('Formato de backup inválido');
            }

            let dataToRestore = backupData.data;

            // Desencriptar si es necesario
            if (backupData.metadata?.encrypted) {
                if (!password) throw new Error('Contraseña requerida para backup encriptado');
                dataToRestore = await this._decryptData(backupData.data, password);
            }

            await storage.init();

            let restoredAnalyses = 0;
            let restoredDraft = false;

            if (dataToRestore.analyses && Array.isArray(dataToRestore.analyses)) {
                for (const analysis of dataToRestore.analyses) {
                    await storage.saveAnalysis(analysis);
                    restoredAnalyses++;
                }
            }

            if (dataToRestore.draft) {
                await storage.saveDraft(dataToRestore.draft.code, dataToRestore.draft.language);
                restoredDraft = true;
            }

            return {
                success: true,
                restoredAnalyses,
                restoredDraft,
                backupVersion: backupData.version
            };

        } catch (error) {
            console.error('[BackupManager] Error restaurando backup:', error);
            throw error;
        }
    }

    // --- Crypto Helpers (Web Crypto API) ---

    async _encryptData(data, password) {
        if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
            throw new Error('Encriptación solo disponible en navegador seguro');
        }

        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(data));
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        const key = await this._deriveKey(password, salt);

        const encryptedContent = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            dataBuffer
        );

        // Retornar formato: salt + iv + ciphertext (Base64)
        return {
            v: 1,
            alg: 'AES-GCM',
            salt: this._arrayBufferToBase64(salt),
            iv: this._arrayBufferToBase64(iv),
            content: this._arrayBufferToBase64(encryptedContent)
        };
    }

    async _decryptData(encryptedPackage, password) {
        if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
            throw new Error('Encriptación solo disponible en navegador seguro');
        }

        const salt = this._base64ToArrayBuffer(encryptedPackage.salt);
        const iv = this._base64ToArrayBuffer(encryptedPackage.iv);
        const content = this._base64ToArrayBuffer(encryptedPackage.content);

        const key = await this._deriveKey(password, salt);

        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            content
        );

        const decoder = new TextDecoder();
        return JSON.parse(decoder.decode(decryptedBuffer));
    }

    async _deriveKey(password, salt) {
        const encoder = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );

        return window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    _arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    _base64ToArrayBuffer(base64) {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // ... (Restore from file helper kept roughly same or updated logic)
    async restoreFromFile(file, password = null) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const backupData = JSON.parse(event.target.result);
                    const result = await this.restoreFromBackup(backupData, password);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Error leyendo archivo'));
            reader.readAsText(file);
        });
    }

    // ... (Keep other methods)

    /**
     * Verificar si es momento de hacer backup automático
     * @returns {Promise<boolean>}
     */
    async shouldAutoBackup() {
        if (!BACKUP_CONFIG.autoBackupEnabled) return false;
        if (typeof window === 'undefined') return false;

        try {
            const lastBackup = localStorage.getItem(this.lastBackupKey);

            if (!lastBackup) return true;

            const lastBackupDate = new Date(lastBackup);
            const daysSinceBackup = (Date.now() - lastBackupDate.getTime()) / (1000 * 60 * 60 * 24);

            return daysSinceBackup >= BACKUP_CONFIG.autoBackupIntervalDays;

        } catch {
            return false;
        }
    }

    /**
     * Guardar timestamp del último backup
     */
    async saveLastBackupTimestamp() {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.lastBackupKey, new Date().toISOString());
        }
    }

    /**
     * Obtener información del último backup
     * @returns {Object|null}
     */
    getLastBackupInfo() {
        if (typeof window === 'undefined') return null;

        const lastBackup = localStorage.getItem(this.lastBackupKey);

        if (!lastBackup) {
            return { hasBackup: false };
        }

        const lastBackupDate = new Date(lastBackup);
        const daysSinceBackup = Math.floor(
            (Date.now() - lastBackupDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
            hasBackup: true,
            lastBackupDate: lastBackup,
            daysSinceBackup,
            needsBackup: daysSinceBackup >= BACKUP_CONFIG.autoBackupIntervalDays
        };
    }

    /**
     * Ejecutar backup automático si es necesario
     * @returns {Promise<Object|null>}
     */
    async runAutoBackupIfNeeded() {
        const shouldBackup = await this.shouldAutoBackup();

        if (shouldBackup) {
            console.log('[BackupManager] Ejecutando backup automático...');
            return this.createBackup();
        }

        return null;
    }
}

// Exportar instancia singleton
export const backupManager = new BackupManager();
