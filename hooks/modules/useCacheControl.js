import { useState } from 'react';

export function useCacheControl() {
    const [isClearing, setIsClearing] = useState(false);

    const clearCache = async () => {
        setIsClearing(true);
        try {
            const response = await fetch('/api/clear-cache', { method: 'POST' });
            const data = await response.json();

            if (data.success) {
                alert(`🧺 Cache limpiado exitosamente: ${data.deletedCount} archivos eliminados.`);
                return true;
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error limpiando cache:', error);
            alert('❌ Error limpiando cache: ' + error.message);
            return false;
        } finally {
            setIsClearing(false);
        }
    };

    return { clearCache, isClearing };
}
