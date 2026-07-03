import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import SearchLine from '../SearchLine'

describe('SearchLine', () => {
    const defaultProps = {
        value: '',
        onChange: () => {},
        placeholder: 'Test placeholder'
    }

    it('renders the search input with its placeholder', () => {
        render(<SearchLine {...defaultProps} />)
        expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument()
    })

    it('calls onChange when typing in the input', async () => {
        const handleChange = vi.fn()
        const user = userEvent.setup()

        render(<SearchLine {...defaultProps} onChange={handleChange} />)

        const input = screen.getByPlaceholderText('Test placeholder')
        await user.type(input, 'test')

        expect(handleChange).toHaveBeenCalled()
    })

    it('shows the controlled value', () => {
        render(<SearchLine {...defaultProps} value="oud" />)
        expect(screen.getByPlaceholderText('Test placeholder')).toHaveValue('oud')
    })

    it('calls onSubmit when the form is submitted', async () => {
        const handleSubmit = vi.fn(e => e.preventDefault())
        const user = userEvent.setup()

        render(<SearchLine {...defaultProps} onSubmit={handleSubmit} />)

        const input = screen.getByPlaceholderText('Test placeholder')
        await user.type(input, 'iris{enter}')

        expect(handleSubmit).toHaveBeenCalled()
    })

    it('does not crash without an onSubmit handler', async () => {
        const user = userEvent.setup()
        render(<SearchLine {...defaultProps} />)
        await user.type(screen.getByPlaceholderText('Test placeholder'), '{enter}')
    })
})
