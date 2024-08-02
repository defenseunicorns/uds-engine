// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2024-Present The UDS Authors

import { ResourceStore, transformResource } from '$features/k8s/store'
import { type ColumnWrapper, type CommonRow, type ResourceStoreInterface } from '$features/k8s/types'

export type Columns = ColumnWrapper<Row>

type ZarfStatus = 'Succeeded' | 'Failed' | 'Pending' | 'Unknown'

interface ZarfComponents {
  [key: string]: ZarfStatus
}

interface ZarfMetadata {
  name: string
  namespace: string
  creationTimestamp: string
}

export interface ZarfPackage {
  metadata: ZarfMetadata
  components: ZarfComponents
  succeeded: boolean
}

interface Row extends CommonRow {
  components: string[]
  succeeded: boolean
}

export function createStore(): ResourceStoreInterface<ZarfPackage, Row> {
  const url = `/api/v1/applications/zarfpackages`

  const transform = transformResource<ZarfPackage, Row>((z) => ({
    components: Object.keys(z.components) ?? [],
    succeeded: z.succeeded ?? false,
  }))

  const store = new ResourceStore<ZarfPackage, Row>(url, transform, 'name')

  return {
    ...store,
    start: store.start.bind(store),
    sortByKey: store.sortByKey.bind(store),
  }
}
