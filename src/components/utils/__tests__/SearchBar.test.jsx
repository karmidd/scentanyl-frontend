import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import SearchBar from '../SearchBar'

// Mock the theme context
vi.mock('../../contexts/ThemeContext', () => ({
    useTheme: () => ({
        theme: {
            bg: { input: 'bg-white' },
            text: { primary: 'text-gray-900', secondary: 'text-gray-600', other_accent: 'text-blue-500', include: 'text-green-600', exclude: 'text-red-600' },
            border: { primary: 'border-gray-300', hover: 'hover:border-gray-400', accent: 'border-blue-500' },
            button: { primary: 'bg-blue-500 text-white', browseAll: 'bg-green-500' },
            card: { primary: 'bg-gray-100', selected: 'bg-blue-500 text-white', secondary: 'bg-gray-200', indicator: 'bg-blue-400', hover: 'hover:bg-gray-300' },
            randomDiscoveryButton: { primary: 'from-purple-500 to-pink-500' },
            shadow: { button: 'shadow-lg' }
        }
    })
}))

// Mock fetch globally
// eslint-disable-next-line no-undef
global.fetch = vi.fn()

// Wrapper component for Router
const Wrapper = ({ children }) => (
    <BrowserRouter>{children}</BrowserRouter>
)

describe('SearchBar', () => {
    const defaultProps = {
        value: '',
        onChange: () => {},
        onSubmit: (e) => e.preventDefault(),
        message: 'Test placeholder'
    }

    beforeEach(() => {
        // Reset fetch mock before each test
        fetch.mockClear()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe('Basic Functionality', () => {
        it('renders with regular search mode by default', async () => {
            render(
                <SearchBar {...defaultProps} />,
                {wrapper: Wrapper}
            )

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument()
            })
        })

        it('calls onChange when typing in search input', async () => {
            const handleChange = vi.fn()
            const user = userEvent.setup()

            render(
                <SearchBar
                    {...defaultProps}
                    onChange={handleChange}
                />,
                { wrapper: Wrapper }
            )

            const input = screen.getByPlaceholderText('Test placeholder')
            await user.type(input, 'test')

            expect(handleChange).toHaveBeenCalled()
        })

        it('calls onSubmit when form is submitted', async () => {
            const handleSubmit = vi.fn(e => e.preventDefault())

            render(
                <SearchBar
                    {...defaultProps}
                    value="test"
                    onSubmit={handleSubmit}
                />,
                { wrapper: Wrapper }
            )

            const form = screen.getByPlaceholderText('Test placeholder').closest('form')
            fireEvent.submit(form)

            expect(handleSubmit).toHaveBeenCalled()
        })
    })

    describe('Advanced Search Mode', () => {
        it('shows advanced search button when enabled', () => {
            render(
                <SearchBar
                    {...defaultProps}
                    enableAdvancedSearch={true}
                />,
                { wrapper: Wrapper }
            )

            // Look for button with the filter/settings SVG icon
            // The advanced button has a specific SVG with viewBox "0 0 24 24"
            const buttons = screen.getAllByRole('button')
            const advancedButton = buttons.find(btn => {
                const svg = btn.querySelector('svg[viewBox="0 0 24 24"]')
                return svg && svg.querySelector('path[d*="M18.75"]')
            })

            expect(advancedButton).toBeTruthy()
        })

        it('switches to layered search mode when clicking advanced button', async () => {
            const user = userEvent.setup()

            render(
                <SearchBar
                    {...defaultProps}
                    enableAdvancedSearch={true}
                />,
                { wrapper: Wrapper }
            )

            // Find the advanced search button by its unique SVG path
            const buttons = screen.getAllByRole('button')
            const advancedButton = buttons.find(btn => {
                const svg = btn.querySelector('svg')
                return svg && svg.querySelector('path[d*="M18.75"]')
            })

            await user.click(advancedButton)

            // Should show mode selection buttons
            expect(screen.getByText('Layered Search')).toBeInTheDocument()
            expect(screen.getByText('Uncategorized Search')).toBeInTheDocument()
        })

        it('fetches notes and accords when advanced search is enabled', async () => {
            fetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ['bergamot', 'lemon', 'rose']
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ['woody', 'fresh', 'floral']
                })

            render(
                <SearchBar
                    {...defaultProps}
                    enableAdvancedSearch={true}
                />,
                { wrapper: Wrapper }
            )

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith('/api/notes')
                expect(fetch).toHaveBeenCalledWith('/api/accords')
            })
        })

        it('notifies parent when advanced search data changes', async () => {
            const handleAdvancedSearchChange = vi.fn()
            const user = userEvent.setup()

            fetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ['bergamot', 'lemon']
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ['woody', 'fresh']
                })

            render(
                <SearchBar
                    {...defaultProps}
                    enableAdvancedSearch={true}
                    onAdvancedSearchChange={handleAdvancedSearchChange}
                />,
                { wrapper: Wrapper }
            )

            // Wait for initial API calls
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledTimes(2)
            })

            // Switch to layered mode by clicking the advanced button
            const buttons = screen.getAllByRole('button')
            const advancedButton = buttons.find(btn => {
                const svg = btn.querySelector('svg')
                return svg && svg.querySelector('path[d*="M18.75"]')
            })

            await user.click(advancedButton)

            await waitFor(() => {
                expect(handleAdvancedSearchChange).toHaveBeenCalledWith(
                    expect.objectContaining({
                        mode: 'layered',
                        accords: [],
                        excludedAccords: [],
                        notes: expect.any(Object),
                        excludedNotes: expect.any(Object)
                    })
                )
            })
        })

        it('can switch between search modes', async () => {
            const user = userEvent.setup()

            render(
                <SearchBar
                    {...defaultProps}
                    enableAdvancedSearch={true}
                />,
                { wrapper: Wrapper }
            )

            // Switch to advanced mode
            const buttons = screen.getAllByRole('button')
            const advancedButton = buttons.find(btn => {
                const svg = btn.querySelector('svg')
                return svg && svg.querySelector('path[d*="M18.75"]')
            })

            await user.click(advancedButton)

            // Click on Uncategorized Search
            const uncategorizedButton = screen.getByText('Uncategorized Search')
            await user.click(uncategorizedButton)

            // Should show uncategorized options
            expect(screen.getByText('Include Notes')).toBeInTheDocument()
            expect(screen.getByText('Exclude Notes')).toBeInTheDocument()

            // Switch back to regular by clicking the search icon button
            const searchButton = screen.getAllByRole('button').find(btn => {
                const svg = btn.querySelector('svg')
                return svg && svg.querySelector('path[d*="M21 21l-6-6"]')
            })
            await user.click(searchButton)

            // Should be back to regular search
            await waitFor(() => {
                expect(screen.queryByText('Include Notes')).not.toBeInTheDocument()
                expect(screen.queryByText('Include Accords')).not.toBeInTheDocument()
            })
        })
    })

    describe('Random Fragrance Button', () => {
        it('shows random button when includeRandomButton is true', () => {
            render(
                <SearchBar
                    {...defaultProps}
                    includeRandomButton={true}
                />,
                { wrapper: Wrapper }
            )

            // Look for the flask/beaker icon button
            const buttons = screen.getAllByRole('button')
            const randomButton = buttons.find(btn => {
                const svg = btn.querySelector('svg')
                return svg && svg.querySelector('path[d*="M9.75 3.104"]')
            })

            expect(randomButton).toBeTruthy()
        })

        it('does not show random button by default', () => {
            render(
                <SearchBar {...defaultProps} />,
                { wrapper: Wrapper }
            )

            const buttons = screen.getAllByRole('button')
            const randomButton = buttons.find(btn => {
                const svg = btn.querySelector('svg')
                return svg && svg.querySelector('path[d*="M9.75 3.104"]')
            })

            expect(randomButton).toBeFalsy()
        })
    })

    describe('Dropdown Interactions', () => {
        it('opens dropdown when clicking add button in advanced mode', async () => {
            const user = userEvent.setup()

            fetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ['bergamot', 'lemon']
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ['woody', 'fresh']
                })

            render(
                <SearchBar
                    {...defaultProps}
                    enableAdvancedSearch={true}
                />,
                { wrapper: Wrapper }
            )

            // Wait for API calls
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledTimes(2)
            })

            // Switch to advanced mode
            const buttons = screen.getAllByRole('button')
            const advancedButton = buttons.find(btn => {
                const svg = btn.querySelector('svg')
                return svg && svg.querySelector('path[d*="M18.75"]')
            })
            await user.click(advancedButton)

            // Find and click the Include Accords add button (green button with + icon)
            await waitFor(() => {
                expect(screen.getByText('Include Accords')).toBeInTheDocument()
            })

            // Find the add button next to "Include Accords" text
            const includeAccordsSection = screen.getByText('Include Accords').closest('div')
            const addButton = includeAccordsSection.querySelector('button.bg-green-600')

            expect(addButton).toBeTruthy()
            await user.click(addButton)

            // Should show search input in dropdown
            await waitFor(() => {
                expect(screen.getByPlaceholderText('Search accords...')).toBeInTheDocument()
            })
        })

        it('filters dropdown items based on search', async () => {
            const user = userEvent.setup()

            fetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ['bergamot', 'lemon', 'orange', 'grapefruit']
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ['woody', 'fresh', 'citrus', 'floral']
                })

            render(
                <SearchBar
                    {...defaultProps}
                    enableAdvancedSearch={true}
                />,
                { wrapper: Wrapper }
            )

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledTimes(2)
            })

            // Switch to advanced mode
            const buttons = screen.getAllByRole('button')
            const advancedButton = buttons.find(btn => {
                const svg = btn.querySelector('svg')
                return svg && svg.querySelector('path[d*="M18.75"]')
            })
            await user.click(advancedButton)

            // Open Include Accords dropdown
            const includeAccordsSection = screen.getByText('Include Accords').closest('div')
            const addButton = includeAccordsSection.querySelector('button.bg-green-600')
            await user.click(addButton)

            // Type in search
            const searchInput = screen.getByPlaceholderText('Search accords...')
            await user.type(searchInput, 'wood')

            // Should only show woody
            await waitFor(() => {
                expect(screen.getByText('woody')).toBeInTheDocument()
                // These shouldn't be visible because they don't match "wood"
                const dropdownButtons = screen.getAllByRole('button')
                const visibleAccords = dropdownButtons
                    .filter(btn => btn.textContent === 'fresh' || btn.textContent === 'citrus')
                expect(visibleAccords).toHaveLength(0)
            })
        })

        it('can add and remove accords', async () => {
            const user = userEvent.setup()
            const handleAdvancedSearchChange = vi.fn()

            fetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ['bergamot', 'lemon']
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ['woody', 'fresh', 'floral']
                })

            render(
                <SearchBar
                    {...defaultProps}
                    enableAdvancedSearch={true}
                    onAdvancedSearchChange={handleAdvancedSearchChange}
                />,
                { wrapper: Wrapper }
            )

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledTimes(2)
            })

            // Switch to advanced mode
            const buttons = screen.getAllByRole('button')
            const advancedButton = buttons.find(btn => {
                const svg = btn.querySelector('svg')
                return svg && svg.querySelector('path[d*="M18.75"]')
            })
            await user.click(advancedButton)

            // Open Include Accords dropdown
            const includeAccordsSection = screen.getByText('Include Accords').closest('div')
            const addButton = includeAccordsSection.querySelector('button.bg-green-600')
            await user.click(addButton)

            // Click on "woody" to add it
            const woodyButton = screen.getByText('woody')
            await user.click(woodyButton)

            // Should show woody as selected
            await waitFor(() => {
                // The woody accord should now be visible in the green include section
                // Look for all elements with text "woody"
                const woodyElements = screen.getAllByText('woody')
                // At least one should be in the selected accords area (not in dropdown)
                expect(woodyElements.length).toBeGreaterThanOrEqual(1) // One in dropdown history, one as selected chip
            })

            // Verify the callback was called with woody in accords
            await waitFor(() => {
                expect(handleAdvancedSearchChange).toHaveBeenCalledWith(
                    expect.objectContaining({
                        mode: 'layered',
                        accords: ['woody']
                    })
                )
            })

            // Remove woody by clicking the × button
            const removeButtons = screen.getAllByText('×')
            await user.click(removeButtons[0])

            // Verify woody was removed
            await waitFor(() => {
                expect(handleAdvancedSearchChange).toHaveBeenCalledWith(
                    expect.objectContaining({
                        mode: 'layered',
                        accords: []
                    })
                )
            })
        })
    })

    describe('Error Handling', () => {
        it('handles API errors gracefully', async () => {
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

            fetch
                .mockRejectedValueOnce(new Error('Network error'))
                .mockRejectedValueOnce(new Error('Network error'))

            render(
                <SearchBar
                    {...defaultProps}
                    enableAdvancedSearch={true}
                />,
                { wrapper: Wrapper }
            )

            await waitFor(() => {
                expect(consoleError).toHaveBeenCalledWith(
                    'Error fetching notes:',
                    expect.any(Error)
                )
            })

            // Component should still render
            expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument()

            consoleError.mockRestore()
        })

        it('handles empty API responses', async () => {
            fetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => null // Invalid response
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => [] // Empty array
                })

            render(
                <SearchBar
                    {...defaultProps}
                    enableAdvancedSearch={true}
                />,
                { wrapper: Wrapper }
            )

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledTimes(2)
            })

            // Component should still be functional
            expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument()
        })
    })
})