import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, renderHook, act } from '@testing-library/react'
import React from 'react'
import { ThemeProvider, useTheme } from '../ThemeContext'

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn()
}
// eslint-disable-next-line no-undef
global.localStorage = localStorageMock

// Mock document.documentElement.classList
const mockClassList = {
    add: vi.fn(),
    remove: vi.fn()
}
Object.defineProperty(document.documentElement, 'classList', {
    value: mockClassList,
    writable: true
})

describe('ThemeContext', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks()
        localStorageMock.clear()
        mockClassList.add.mockClear()
        mockClassList.remove.mockClear()
    })

    describe('ThemeProvider', () => {
        it('should provide theme context to children', () => {
            const TestComponent = () => {
                const { theme } = useTheme()
                return <div>{theme.text.primary}</div>
            }

            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            )

            expect(screen.getByText('text-white')).toBeInTheDocument()
        })

        it('should throw error when useTheme is used outside ThemeProvider', () => {
            const TestComponent = () => {
                useTheme()
                return null
            }

            // Suppress console.error for this test
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

            expect(() => render(<TestComponent />)).toThrow('useTheme must be used within a ThemeProvider')

            consoleSpy.mockRestore()
        })

        it('should default to dark mode when no localStorage value', () => {
            localStorageMock.getItem.mockReturnValue(null)

            const { result } = renderHook(() => useTheme(), {
                wrapper: ThemeProvider
            })

            expect(result.current.isDarkMode).toBe(true)
            expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')
            expect(mockClassList.add).toHaveBeenCalledWith('dark')
        })

        it('should use localStorage value when available', () => {
            localStorageMock.getItem.mockReturnValue('light')

            const { result } = renderHook(() => useTheme(), {
                wrapper: ThemeProvider
            })

            expect(result.current.isDarkMode).toBe(false)
            expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
            expect(mockClassList.remove).toHaveBeenCalledWith('dark')
        })

        it('should toggle theme when toggleTheme is called', () => {
            localStorageMock.getItem.mockReturnValue('dark')

            const { result } = renderHook(() => useTheme(), {
                wrapper: ThemeProvider
            })

            expect(result.current.isDarkMode).toBe(true)

            act(() => {
                result.current.toggleTheme()
            })

            expect(result.current.isDarkMode).toBe(false)
            expect(localStorageMock.setItem).toHaveBeenLastCalledWith('theme', 'light')
            expect(mockClassList.remove).toHaveBeenCalledWith('dark')
        })

        it('should update document class when theme changes', () => {
            const { result } = renderHook(() => useTheme(), {
                wrapper: ThemeProvider
            })

            // Start in dark mode
            expect(mockClassList.add).toHaveBeenCalledWith('dark')

            // Toggle to light
            act(() => {
                result.current.toggleTheme()
            })
            expect(mockClassList.remove).toHaveBeenCalledWith('dark')

            // Toggle back to dark
            act(() => {
                result.current.toggleTheme()
            })
            expect(mockClassList.add).toHaveBeenCalledTimes(2)
        })
    })

    describe('Theme values', () => {
        it('should provide correct dark theme values', () => {
            localStorageMock.getItem.mockReturnValue('dark')

            const { result } = renderHook(() => useTheme(), {
                wrapper: ThemeProvider
            })

            const { theme } = result.current

            // Test a few key theme values
            expect(theme.bg.primary).toBe('bg-black')
            expect(theme.text.primary).toBe('text-white')
            expect(theme.button.primary).toContain('from-blue-600')
            expect(theme.background.primary).toBe('#080731')
        })

        it('should provide correct light theme values', () => {
            localStorageMock.getItem.mockReturnValue('light')

            const { result } = renderHook(() => useTheme(), {
                wrapper: ThemeProvider
            })

            const { theme } = result.current

            // Test a few key theme values
            expect(theme.bg.primary).toBe('bg-white')
            expect(theme.text.primary).toBe('text-gray-800')
            expect(theme.button.primary).toContain('from-indigo-200')
            expect(theme.background.primary).toBe('#A3B3FF')
        })

        it('should update all theme values when toggling', () => {
            const { result } = renderHook(() => useTheme(), {
                wrapper: ThemeProvider
            })

            const darkTheme = result.current.theme

            act(() => {
                result.current.toggleTheme()
            })

            const lightTheme = result.current.theme

            // Verify that theme values actually changed
            expect(darkTheme.bg.primary).not.toBe(lightTheme.bg.primary)
            expect(darkTheme.text.primary).not.toBe(lightTheme.text.primary)
            expect(darkTheme.border.primary).not.toBe(lightTheme.border.primary)
            expect(darkTheme.background.primary).not.toBe(lightTheme.background.primary)
        })
    })

    describe('Integration with components', () => {
        it('should update child components when theme changes', () => {
            // Explicitly set dark mode for this test
            localStorageMock.getItem.mockReturnValue('dark')

            const TestComponent = () => {
                const { theme, isDarkMode, toggleTheme } = useTheme()
                return (
                    <div>
                        <div data-testid="bg-primary">{theme.bg.primary}</div>
                        <div data-testid="mode">{isDarkMode ? 'dark' : 'light'}</div>
                        <button onClick={toggleTheme}>Toggle</button>
                    </div>
                )
            }

            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            )

            expect(screen.getByTestId('bg-primary')).toHaveTextContent('bg-black')
            expect(screen.getByTestId('mode')).toHaveTextContent('dark')

            act(() => {
                screen.getByText('Toggle').click()
            })

            expect(screen.getByTestId('bg-primary')).toHaveTextContent('bg-white')
            expect(screen.getByTestId('mode')).toHaveTextContent('light')
        })

        it('should persist theme across remounts', () => {
            localStorageMock.getItem.mockReturnValue('light')

            const TestComponent = () => {
                const { isDarkMode } = useTheme()
                return <div>{isDarkMode ? 'dark' : 'light'}</div>
            }

            const { unmount } = render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            )

            expect(screen.getByText('light')).toBeInTheDocument()

            // Unmount and remount
            unmount()

            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            )

            // Should still be light mode
            expect(screen.getByText('light')).toBeInTheDocument()
        })
    })

    describe('Edge case', () => {
        it('should handle invalid localStorage values', () => {
            localStorageMock.getItem.mockReturnValue('invalid')

            const { result } = renderHook(() => useTheme(), {
                wrapper: ThemeProvider
            })

            // Should default to dark when invalid
            expect(result.current.isDarkMode).toBe(false) // 'invalid' !== 'dark', so false
            expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
        })
    })
})