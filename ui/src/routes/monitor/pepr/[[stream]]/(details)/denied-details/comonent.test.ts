import { render } from '@testing-library/svelte'

import type { SvelteComponent } from 'svelte'
import DeniedDetails from './DeniedDetails.svelte'

// Mock the carbon-icons-svelte module

const comp = vi.fn().mockImplementation(() => ({
  $$: {
    on_mount: [],
    on_destroy: [],
    before_update: [],
    after_update: [],
  },
})) as unknown as SvelteComponent

describe('Denied Details', () => {
  test('renders denied messages', () => {
    const peprDetails = { component: comp, messages: ['Authorized: test', 'Found: test'] }
    const { getByText } = render(DeniedDetails, { props: { details: peprDetails } })
    expect(getByText('Details')).toBeInTheDocument()
    expect(getByText(peprDetails.messages[0])).toBeInTheDocument()
    expect(getByText(peprDetails.messages[1])).toBeInTheDocument()
  })
})
