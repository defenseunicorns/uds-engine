import type { V1StatefulSet as Resource } from '@kubernetes/client-node'
import {
  ResourceStore,
  type ColumnWrapper,
  type CommonRow,
  type ResourceStoreInterface,
  type ResourceWithTable,
} from '../common'

interface Row extends CommonRow {
  ready: string
  service: string
}

export type Columns = ColumnWrapper<Row>

/**
 * Create a new StatefulsetStore for streaming statefulset resources
 *
 * @returns A new StatefulsetStore instance
 */
export function createStore(): ResourceStoreInterface<Resource, Row> {
  const url = `/api/v1/resources/statefulsets`

  const transform = (resources: Resource[]) =>
    resources.map<ResourceWithTable<Resource, Row>>((r) => ({
      resource: r,
      table: {
        name: r.metadata?.name ?? '',
        namespace: r.metadata?.namespace ?? '',
        ready: `${r.status?.readyReplicas ?? 0} / ${r.status?.replicas ?? 0}`,
        service: r.spec?.serviceName ?? '',
        creationTimestamp: new Date(r.metadata?.creationTimestamp ?? ''),
      },
    }))

  const store = new ResourceStore<Resource, Row>('name')

  return {
    ...store,
    start: () => store.start(url, transform),
    sortByKey: store.sortByKey.bind(store),
  }
}