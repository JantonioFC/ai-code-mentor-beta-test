import { useState, useMemo } from 'react';

/**
 * Hook para gestionar la selección jerárquica de lecciones
 * (Lenguaje -> Categoría -> Lección)
 */
export function useLessonSelection(curriculum) {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLesson, setSelectedLesson] = useState('');

    // Resetear dependencias
    const setLanguage = (lang) => {
        setSelectedLanguage(lang);
        setSelectedCategory('');
        setSelectedLesson('');
    };

    const setCategory = (cat) => {
        setSelectedCategory(cat);
        setSelectedLesson('');
    };

    const resetSelection = () => {
        setSelectedLanguage('');
        setSelectedCategory('');
        setSelectedLesson('');
    };

    // Computados (Memoized para performance)
    const availableCategories = useMemo(() => {
        if (!selectedLanguage || !curriculum[selectedLanguage]) return [];
        return Object.keys(curriculum[selectedLanguage]);
    }, [curriculum, selectedLanguage]);

    const availableLessons = useMemo(() => {
        if (!selectedLanguage || !selectedCategory || !curriculum[selectedLanguage]?.[selectedCategory]) return [];
        return Object.keys(curriculum[selectedLanguage][selectedCategory]);
    }, [curriculum, selectedLanguage, selectedCategory]);

    const currentLessonInfo = useMemo(() => {
        if (!selectedLanguage || !selectedCategory || !selectedLesson) return null;
        return curriculum[selectedLanguage]?.[selectedCategory]?.[selectedLesson];
    }, [curriculum, selectedLanguage, selectedCategory, selectedLesson]);

    return {
        // State
        selectedLanguage,
        selectedCategory,
        selectedLesson,
        // Actions
        setLanguage,
        setCategory,
        setLesson: setSelectedLesson,
        resetSelection,
        // Computed
        availableCategories,
        availableLessons,
        currentLessonInfo
    };
}
