// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2024-Present The UDS Authors

import { beforeEach, vi } from 'vitest'

import { testK8sTableWithCustomColumns, testK8sTableWithDefaults } from '$features/k8s/test-helper'
import type { NameAndDesc } from '$features/k8s/types'
import { resourceDescriptions } from '$lib/utils/descriptions'
import Component from './component.svelte'
import { createStore } from './store'

suite('StatefulsetTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const resourceName = 'StatefulSets'
  const nameAndDesc: NameAndDesc = {
    name: resourceName,
    desc: resourceDescriptions[resourceName],
  }

  testK8sTableWithDefaults(Component, {
    createStore,
    columns: [['name', 'emphasize'], ['namespace'], ['ready'], ['up_to_date'], ['available'], ['age']],
    nameAndDesc,
  })

  testK8sTableWithCustomColumns(Component, { createStore, nameAndDesc })
})
