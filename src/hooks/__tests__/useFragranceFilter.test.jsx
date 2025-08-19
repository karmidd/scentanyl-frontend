import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFragranceFilter } from '../useFragranceFilter'

// Mock the debounced value hook
vi.mock('../useDebouncedValue', () => ({
    useDebouncedValue: vi.fn((value) => value) // Return value immediately for tests
}))

describe('useFragranceFilter', () => {
    const mockFragrances = [
        {
            name: 'Fragrance 1',
            brand: 'Brand A',
            gender: 'men',
            year: 2020,
            accords: 'woody, fresh',
            topNotes: 'bergamot, lemon',
            middleNotes: 'lavender, sage',
            baseNotes: 'cedar, musk',
            uncategorizedNotes: ''
        },
        {
            name: 'Fragrance 2',
            brand: 'Brand B',
            gender: 'women',
            year: 2021,
            accords: 'floral, sweet',
            topNotes: 'rose, jasmine',
            middleNotes: 'peony, lily',
            baseNotes: 'vanilla, sandalwood',
            uncategorizedNotes: ''
        },
        {
            name: 'Fragrance 3',
            brand: 'Brand C',
            gender: 'unisex',
            year: 2019,
            accords: 'citrus, aquatic',
            topNotes: 'orange, grapefruit',
            middleNotes: 'sea salt, mint',
            baseNotes: 'amber, white musk',
            uncategorizedNotes: 'marine notes'
        },
        {
            name: 'Fragrance 4',
            brand: 'Brand A',
            gender: 'men',
            year: null,
            accords: 'woody, spicy',
            topNotes: 'pepper, cardamom',
            middleNotes: 'geranium, patchouli',
            baseNotes: 'vetiver, oakmoss',
            uncategorizedNotes: ''
        }
    ]

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useFragranceFilter())

        expect(result.current.fragrances).toEqual([])
        expect(result.current.filteredFragrances).toEqual([])
        expect(result.current.searchQuery).toBe('')
        expect(result.current.selectedGender).toBe('all')
        expect(result.current.yearRange).toBeNull()
        expect(result.current.yearSort).toBe('none')
        expect(result.current.hasActiveFilters).toBe(false)
    })

    it('should set and count fragrances by gender', () => {
        const { result } = renderHook(() => useFragranceFilter())

        act(() => {
            result.current.setFragrances(mockFragrances)
        })

        expect(result.current.fragrances).toEqual(mockFragrances)
        expect(result.current.genderCounts).toEqual({
            all: 4,
            men: 2,
            women: 1,
            unisex: 1
        })
    })

    it('should filter by search query', () => {
        const { result } = renderHook(() => useFragranceFilter())

        act(() => {
            result.current.setFragrances(mockFragrances)
            result.current.setSearchQuery('Brand A')
        })

        expect(result.current.filteredFragrances).toHaveLength(2)
        expect(result.current.filteredFragrances[0].brand).toBe('Brand A')
        expect(result.current.hasActiveFilters).toBe(true)
    })

    it('should filter by gender', () => {
        const { result } = renderHook(() => useFragranceFilter())

        act(() => {
            result.current.setFragrances(mockFragrances)
            result.current.setSelectedGender('women')
        })

        expect(result.current.filteredFragrances).toHaveLength(1)
        expect(result.current.filteredFragrances[0].gender).toBe('women')
        expect(result.current.hasActiveFilters).toBe(true)
    })

    it('should filter by year range', () => {
        const { result } = renderHook(() => useFragranceFilter())

        act(() => {
            result.current.setFragrances(mockFragrances)
            result.current.setYearRange([2020, 2021])
        })

        expect(result.current.filteredFragrances).toHaveLength(2)
        expect(result.current.filteredFragrances.every(f => f.year >= 2020 && f.year <= 2021)).toBe(true)
        expect(result.current.hasActiveFilters).toBe(true)
    })

    it('should sort by year', () => {
        const { result } = renderHook(() => useFragranceFilter())

        act(() => {
            result.current.setFragrances(mockFragrances)
            result.current.setYearSort('newest')
        })

        // Should exclude null years when sorting
        expect(result.current.filteredFragrances).toHaveLength(3)
        expect(result.current.filteredFragrances[0].year).toBe(2021)
        expect(result.current.filteredFragrances[1].year).toBe(2020)
        expect(result.current.filteredFragrances[2].year).toBe(2019)

        act(() => {
            result.current.setYearSort('oldest')
        })

        expect(result.current.filteredFragrances[0].year).toBe(2019)
        expect(result.current.filteredFragrances[1].year).toBe(2020)
        expect(result.current.filteredFragrances[2].year).toBe(2021)
    })

    describe('Advanced Search', () => {
        it('should filter by included accords', () => {
            const { result } = renderHook(() => useFragranceFilter())

            act(() => {
                result.current.setFragrances(mockFragrances)
                result.current.setAdvancedSearchData({
                    mode: 'uncategorized',
                    accords: ['woody'],
                    excludedAccords: [],
                    notes: { top: [], middle: [], base: [], uncategorized: [] },
                    excludedNotes: { top: [], middle: [], base: [], uncategorized: [] }
                })
            })

            expect(result.current.filteredFragrances).toHaveLength(2)
            expect(result.current.filteredFragrances.every(f => f.accords.includes('woody'))).toBe(true)
        })

        it('should filter by excluded accords', () => {
            const { result } = renderHook(() => useFragranceFilter())

            act(() => {
                result.current.setFragrances(mockFragrances)
                result.current.setAdvancedSearchData({
                    mode: 'uncategorized',
                    accords: [],
                    excludedAccords: ['woody'],
                    notes: { top: [], middle: [], base: [], uncategorized: [] },
                    excludedNotes: { top: [], middle: [], base: [], uncategorized: [] }
                })
            })

            expect(result.current.filteredFragrances).toHaveLength(2)
            expect(result.current.filteredFragrances.every(f => !f.accords.includes('woody'))).toBe(true)
        })

        it('should filter by layered notes', () => {
            const { result } = renderHook(() => useFragranceFilter())

            act(() => {
                result.current.setFragrances(mockFragrances)
                result.current.setAdvancedSearchData({
                    mode: 'layered',
                    accords: [],
                    excludedAccords: [],
                    notes: {
                        top: ['bergamot'],
                        middle: [],
                        base: [],
                        uncategorized: []
                    },
                    excludedNotes: { top: [], middle: [], base: [], uncategorized: [] }
                })
            })

            expect(result.current.filteredFragrances).toHaveLength(1)
            expect(result.current.filteredFragrances[0].topNotes).toContain('bergamot')
        })

        it('should filter by excluded layered notes', () => {
            const { result } = renderHook(() => useFragranceFilter())

            act(() => {
                result.current.setFragrances(mockFragrances)
                result.current.setAdvancedSearchData({
                    mode: 'layered',
                    accords: [],
                    excludedAccords: [],
                    notes: { top: [], middle: [], base: [], uncategorized: [] },
                    excludedNotes: {
                        top: ['rose'],
                        middle: [],
                        base: [],
                        uncategorized: []
                    }
                })
            })

            expect(result.current.filteredFragrances).toHaveLength(3)
            expect(result.current.filteredFragrances.every(f => !f.topNotes?.includes('rose'))).toBe(true)
        })

        it('should filter by uncategorized notes across all layers', () => {
            const { result } = renderHook(() => useFragranceFilter())

            act(() => {
                result.current.setFragrances(mockFragrances)
                result.current.setAdvancedSearchData({
                    mode: 'uncategorized',
                    accords: [],
                    excludedAccords: [],
                    notes: {
                        top: [],
                        middle: [],
                        base: [],
                        uncategorized: ['musk']
                    },
                    excludedNotes: { top: [], middle: [], base: [], uncategorized: [] }
                })
            })

            // Should find 'musk' in base notes of two fragrances
            expect(result.current.filteredFragrances).toHaveLength(2)
        })

        it('should handle multiple filters simultaneously', () => {
            const { result } = renderHook(() => useFragranceFilter())

            act(() => {
                result.current.setFragrances(mockFragrances)
                result.current.setAdvancedSearchData({
                    mode: 'uncategorized',
                    accords: ['woody'],
                    excludedAccords: ['spicy'],
                    notes: { top: [], middle: [], base: [], uncategorized: [] },
                    excludedNotes: { top: [], middle: [], base: [], uncategorized: [] }
                })
            })

            // Should find woody fragrances that are not spicy
            expect(result.current.filteredFragrances).toHaveLength(1)
            expect(result.current.filteredFragrances[0].name).toBe('Fragrance 1')
        })
    })

    it('should clear all filters', () => {
        const { result } = renderHook(() => useFragranceFilter())

        act(() => {
            result.current.setFragrances(mockFragrances)
            result.current.setSearchQuery('test')
            result.current.setSelectedGender('men')
            result.current.setYearRange([2020, 2021])
            result.current.setYearSort('newest')
            result.current.setAdvancedSearchData({
                mode: 'uncategorized',
                accords: ['woody'],
                excludedAccords: [],
                notes: { top: [], middle: [], base: [], uncategorized: [] },
                excludedNotes: { top: [], middle: [], base: [], uncategorized: [] }
            })
        })

        expect(result.current.hasActiveFilters).toBe(true)

        act(() => {
            result.current.clearAllFilters()
        })

        expect(result.current.searchQuery).toBe('')
        expect(result.current.selectedGender).toBe('all')
        expect(result.current.yearRange).toBeNull()
        expect(result.current.yearSort).toBe('none')
        expect(result.current.advancedSearchData.mode).toBe('regular')
        expect(result.current.hasActiveFilters).toBe(false)
        expect(result.current.filteredFragrances).toEqual(mockFragrances)
    })

    it('should correctly identify when filters are active', () => {
        const { result } = renderHook(() => useFragranceFilter())

        act(() => {
            result.current.setFragrances(mockFragrances)
        })

        expect(result.current.hasActiveFilters).toBe(false)

        // Test each filter type
        act(() => {
            result.current.setSearchQuery('test')
        })
        expect(result.current.hasActiveFilters).toBe(true)

        act(() => {
            result.current.clearAllFilters()
            result.current.setSelectedGender('men')
        })
        expect(result.current.hasActiveFilters).toBe(true)

        act(() => {
            result.current.clearAllFilters()
            result.current.setYearSort('newest')
        })
        expect(result.current.hasActiveFilters).toBe(true)
    })
})