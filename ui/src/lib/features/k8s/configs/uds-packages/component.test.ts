// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2024-Present The UDS Authors

import { beforeEach, vi } from 'vitest'

import { testK8sTableWithCustomColumns, testK8sTableWithDefaults } from '$features/k8s/test-helper'
import { resourceDescriptions } from '$lib/utils/descriptions'
import Component from './component.svelte'
import { createStore } from './store'

suite('StatefulsetTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const name = 'Packages'
  const description = resourceDescriptions[name]

  testK8sTableWithDefaults(Component, {
    createStore,
    columns: [
      ['name', 'emphasize'],
      ['namespace'],
      ['status'],
      ['endpoints'],
      ['monitors'],
      ['ssoClients'],
      ['networkPolicies'],
      ['age'],
    ],
    name,
    description,
  })

  testK8sTableWithCustomColumns(Component, { createStore, name, description })
})
