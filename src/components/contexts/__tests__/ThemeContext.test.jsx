import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, renderHook, act } from '@testing-library/react'
import React from 'react'
import { ThemeProvider, useTheme, TOKENS } from '../ThemeContext'

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
        vi.clearAllMocks()
        localStorageMock.clear()
        mockClassList.add.mockClear()
        mockClassList.remove.mockClear()
    })

    describe('ThemeProvider', () => {
        it('should provide theme context to children', () => {
            const TestComponent = () => {
                const { theme } = useTheme()
                return <div>{theme.ink}</div>
            }

            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            )

            expect(screen.getByText(TOKENS.dark.ink)).toBeInTheDocument()
        })

        it('should throw error when useTheme is used outside ThemeProvider', () => {
            const TestComponent = () => {
                useTheme()
                return null
            }

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
            expect(mockClassList.remove).toHaveBeenCalledWith('light')
        })

        it('should use localStorage value when available', () => {
            localStorageMock.getItem.mockReturnValue('light')

            const { result } = renderHook(() => useTheme(), {
                wrapper: ThemeProvider
            })

            expect(result.current.isDarkMode).toBe(false)
            expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
            expect(mockClassList.remove).toHaveBeenCalledWith('dark')
            expect(mockClassList.add).toHaveBeenCalledWith('light')
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
            expect(mockClassList.add).toHaveBeenCalledWith('light')

            // Toggle back to dark
            act(() => {
                result.current.toggleTheme()
            })
            expect(mockClassList.add).toHaveBeenLastCalledWith('dark')
        })
    })

    describe('Theme values', () => {
        it('should provide correct dark theme tokens', () => {
            localStorageMock.getItem.mockReturnValue('dark')

            const { result } = renderHook(() => useTheme(), {
                wrapper: ThemeProvider
            })

            const { theme } = result.current

            expect(theme.bg).toBe('#0a0907')
            expect(theme.ink).toBe('#ece6d6')
            expect(theme.accent).toBe('#c8965a')
            expect(theme).toEqual(TOKENS.dark)
        })

        it('should provide correct light theme tokens', () => {
            localStorageMock.getItem.mockReturnValue('light')

            const { result } = renderHook(() => useTheme(), {
                wrapper: ThemeProvider
            })

            const { theme } = result.current

            expect(theme.bg).toBe('#f3efe5')
            expect(theme.ink).toBe('#1a1612')
            expect(theme.accent).toBe('#8b5a1f')
            expect(theme).toEqual(TOKENS.light)
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

            expect(darkTheme.bg).not.toBe(lightTheme.bg)
            expect(darkTheme.ink).not.toBe(lightTheme.ink)
            expect(darkTheme.accent).not.toBe(lightTheme.accent)
            expect(darkTheme.rule).not.toBe(lightTheme.rule)
        })
    })

    describe('Integration with components', () => {
        it('should update child components when theme changes', () => {
            localStorageMock.getItem.mockReturnValue('dark')

            const TestComponent = () => {
                const { theme, isDarkMode, toggleTheme } = useTheme()
                return (
                    <div>
                        <div data-testid="bg">{theme.bg}</div>
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

            expect(screen.getByTestId('bg')).toHaveTextContent('#0a0907')
            expect(screen.getByTestId('mode')).toHaveTextContent('dark')

            act(() => {
                screen.getByText('Toggle').click()
            })

            expect(screen.getByTestId('bg')).toHaveTextContent('#f3efe5')
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

            unmount()

            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            )

            expect(screen.getByText('light')).toBeInTheDocument()
        })
    })

    describe('Edge case', () => {
        it('should handle invalid localStorage values', () => {
            localStorageMock.getItem.mockReturnValue('invalid')

            const { result } = renderHook(() => useTheme(), {
                wrapper: ThemeProvider
            })

            // 'invalid' !== 'dark', so falls back to light
            expect(result.current.isDarkMode).toBe(false)
            expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
        })
    })
})
