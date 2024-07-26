// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2024-Present The UDS Authors

import type { V1PersistentVolumeClaim as Resource, V1Pod } from '@kubernetes/client-node'

import { ResourceStore, transformResource } from '$features/k8s/store'
import { type ColumnWrapper, type CommonRow, type ResourceStoreInterface } from '$features/k8s/types'
import { writable } from 'svelte/store'

interface Row extends CommonRow {
  storage_class: string
  capacity: string
  pods: string[]
  status: string
}

export type Columns = ColumnWrapper<Row>

export function createStore(): ResourceStoreInterface<Resource, Row> {
  const url = `/api/v1/resources/storage/persistentvolumeclaims?dense=true`

  // Store to hold pods for each PVC

  const pods = new Map<string, string[]>() // map of pvc name -> pod names
  const podStore = writable<number>()
  const podEvents = new EventSource(`/api/v1/resources/workloads/pods`)

  podEvents.onmessage = (event) => {
    const data = JSON.parse(event.data) as V1Pod[]
    data.forEach((p) => {
      p.spec?.volumes?.forEach((v) => {
        if (v.persistentVolumeClaim) {
          const claimName = `${v.persistentVolumeClaim.claimName}`
          let podNames = pods.get(claimName) ?? []
          podNames.push(p.metadata?.name ?? '')
          podNames = Array.from(new Set(podNames))
          pods.set(claimName, podNames)
        }
      })
    })
    // trigger an update
    podStore.set(event.timeStamp)
    console.log(event.timeStamp, 'pod event stream', pods)
  }

  const transform = transformResource<Resource, Row>((r) => ({
    storage_class: r.spec?.storageClassName ?? '',
    capacity: r.spec?.resources?.requests?.storage ?? '',
    status: r.status?.phase ?? '',
    pods: [],
  }))

  const store = new ResourceStore<Resource, Row>('name', true, [podStore])
  store.stopCallback = podEvents.close.bind(podEvents)
  store.filterCallback = (data) => {
    console.log('filter callback')
    return data.map((d) => {
      const pvcName = d.table.name
      if (pods.has(pvcName)) {
        d.table.pods = pods.get(pvcName) ?? []
      }
      return d
    })
  }

  return {
    ...store,
    start: () => store.start(url, transform),
    sortByKey: store.sortByKey.bind(store),
  }
}
