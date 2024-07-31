// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2024-Present The UDS Authors

import { beforeEach, vi } from 'vitest'

import { testK8sTableWithCustomColumns, testK8sTableWithDefaults } from '$features/k8s/test-helper'
import { resourceDescriptions } from '$lib/utils/descriptions'
import Component from './component.svelte'
import { createStore } from './store'

suite('PodTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const resource = {
    name: 'Pods',
    description: resourceDescriptions['Pods'],
  }

  testK8sTableWithDefaults(Component, {
    createStore,
    columns: [
      ['name', 'emphasize'],
      ['namespace'],
      ['controller'],
      ['containers'],
      ['status'],
      ['restarts'],
      ['metrics'],
      ['node'],
      ['age'],
    ],
    resource,
  })

  testK8sTableWithCustomColumns(Component, { createStore, resource })
})
