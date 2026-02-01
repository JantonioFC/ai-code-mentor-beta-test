import { useState, useEffect } from 'react';

/**
 * Hook para cargar y gestionar el currículo desde sources.json
 */
export function useCurriculumSource() {
    const [curriculum, setCurriculum] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCurriculum();
    }, []);

    const loadCurriculum = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/sources.json');
            if (!response.ok) {
                throw new Error('Error cargando el curriculum');
            }
            const data = await response.json();
            setCurriculum(data.curriculum || {});
            setError(null);
        } catch (err) {
            console.error('Error cargando curriculum:', err);
            setError('No se pudo cargar el curriculum. Verifique que sources.json esté disponible.');
        } finally {
            setIsLoading(false);
        }
    };

    return { curriculum, error, isLoading, reload: loadCurriculum };
}
