import * as components from '$components'
import { render, screen } from '@testing-library/svelte'
import { describe, expect } from 'vitest'
import EndpointComponent from './component.svelte'

describe('EndpointComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders a dash when no endpoints are provided', () => {
    render(EndpointComponent, { props: { endpoints: [] } })
    expect(screen.getByText('-')).toBeInTheDocument()
    expect(components.Link).not.toHaveBeenCalled()
  })

  test('does not render a dash when endpoints are provided', () => {
    render(EndpointComponent, { props: { endpoints: ['example.com'] } })
    expect(screen.queryByText('-')).not.toBeInTheDocument()
  })

  test('calls Link component for each endpoint with correct props', () => {
    const endpoints = ['example.com', 'test.com']
    render(EndpointComponent, { props: { endpoints } })

    expect(components.Link).toHaveBeenCalledTimes(endpoints.length)

    endpoints.forEach((endpoint, index) => {
      expect(components.Link).toHaveBeenNthCalledWith(index + 1, {
        $$inline: true,
        props: {
          href: `https://${endpoint}`,
          text: endpoint,
        },
      })
    })
  })

  test('does not call Link component when no endpoints are provided', () => {
    render(EndpointComponent, { props: { endpoints: [] } })
    expect(components.Link).not.toHaveBeenCalled()
  })
})
