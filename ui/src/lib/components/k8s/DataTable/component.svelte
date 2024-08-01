<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2024-Present The UDS Authors -->

<script lang="ts">
  import type { KubernetesObject } from '@kubernetes/client-node'
  import { ChevronDown, ChevronUp, Filter, Search } from 'carbon-icons-svelte'
  import { onDestroy, onMount } from 'svelte'
  import { type Unsubscriber } from 'svelte/store'

  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { Drawer } from '$components'
  import type { Row as NamespaceRow } from '$features/k8s/namespaces/store'
  import { type ResourceStoreInterface } from '$features/k8s/types'
  import { addToast } from '$features/toast'

  // Determine if the data is namespaced
  export let isNamespaced = true

  // We have to be a bit generic here to handle the various Column/Row types coming from the various stores
  export let columns: [name: string, styles?: string][]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let createStore: () => ResourceStoreInterface<KubernetesObject, any>

  const rows = createStore()
  const { namespace, search, searchBy, searchTypes, sortAsc, sortBy } = rows

  let resource: KubernetesObject | null = null
  let baseURL: string
  let pathName: string
  let unsubscribePage: Unsubscriber
  let uid = ''
  let namespaces: ResourceStoreInterface<KubernetesObject, NamespaceRow>

  onDestroy(() => {
    unsubscribePage()
  })

  unsubscribePage = page.subscribe(async ({ params, data, url }) => {
    namespaces = data.namespaces as ResourceStoreInterface<KubernetesObject, NamespaceRow>
    uid = params.uid || ''

    pathName = url.pathname

    // If UID is present, load the data
    if (uid) {
      try {
        // Strip the UID from the URL
        baseURL = pathName.replace(`/${uid}`, '')

        // Split because new URL() doesn't work without a complete URL
        const [apiPath] = rows.url.split('?')

        // Fetch the resource data
        const results = await fetch(`${apiPath}/${uid}`)

        // If the fetch is successful, set the resource data
        if (results.ok) {
          const data = await results.json()
          resource = data.Object as KubernetesObject
          return
        } else {
          // Otherwise, throw an error
          throw new Error(`Failed to fetch resource: ${results.statusText}`)
        }
      } catch (e) {
        // If an error occurs, set the resource to null
        resource = null

        // Display an error toast if the fetch fails
        addToast({
          timeoutSecs: 5,
          message: e.message,
          type: 'error',
        })
      }
    } else {
      // If no UID is present, the path is the base URL and the resource is null
      baseURL = pathName
      resource = null
    }
  })

  onMount(() => {
    // Function to navigate using the keyboard
    const keyboardNavigate = (e: KeyboardEvent) => {
      if (uid) {
        let nextID: string | undefined

        switch (e.key) {
          case 'ArrowDown': {
            nextID = document.getElementById(uid)?.nextElementSibling?.id
            break
          }
          case 'ArrowUp': {
            nextID = document.getElementById(uid)?.previousElementSibling?.id
            break
          }
        }

        if (nextID) {
          // Navigate to the next row
          goto(`${baseURL}/${nextID}`)
        }
      }
    }

    // Bind the keyboard navigation event
    window.addEventListener('keydown', keyboardNavigate)
    const stop = rows.start()

    // Clean up the event listener when the component is destroyed
    return () => {
      window.removeEventListener('keydown', keyboardNavigate)
      stop()
    }
  })
</script>

{#if resource}
  <Drawer {resource} {baseURL} />
{/if}

<section class="table-section">
  <div class="table-container">
    <div class="table-content">
      <div class="table-filter-section">
        <div class="relative lg:w-96">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="email"
            autocomplete="off"
            class="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-9 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="Search"
            bind:value={$search}
          />
        </div>
        <button
          id="filterDropdownButton"
          data-dropdown-toggle="filterDropdown"
          class="hover:text-primary-700 flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 md:w-auto dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          type="button"
        >
          <Filter class="mr-2 h-4 w-4 text-gray-400" />
          {$searchBy}
          <ChevronDown class="ml-2 h-4 w-4 text-gray-400" />
        </button>
        <div id="filterDropdown" class="z-10 hidden w-48 rounded-lg bg-white p-3 shadow dark:bg-gray-700">
          <h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Search By</h6>
          <ul class="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
            {#each searchTypes as searchType}
              <li class="flex items-center">
                <input
                  id={searchType}
                  type="radio"
                  name="searchType"
                  value={searchType}
                  class="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:focus:bg-blue-600 dark:focus:ring-blue-600"
                  bind:group={$searchBy}
                />
                <label for={searchType} class="ms-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
                  {searchType}
                </label>
              </li>
            {/each}
          </ul>
        </div>
        <div class="flex-grow"></div>
        <div>
          {#if isNamespaced}
            <select id="stream" bind:value={$namespace}>
              <option value="">All Namespaces</option>
              <hr />
              {#each $namespaces as ns}
                <option value={ns.table.name}>{ns.table.name}</option>
              {/each}
            </select>
          {/if}
        </div>
      </div>
      <div class="table-scroll-container">
        <table>
          <thead>
            <tr>
              {#each columns as [header, style]}
                <th>
                  <button on:click={() => rows.sortByKey(header)}>
                    {header.replaceAll('_', ' ')}
                    <ChevronUp
                      class="sort
                      {style || ''}
                      {$sortAsc ? 'rotate-180' : ''}
                      {$sortBy === header ? 'opacity-100' : 'opacity-0'}"
                    />
                  </button>
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each $rows as row}
              <tr
                id={row.resource.metadata?.uid}
                on:click={() => goto(`${baseURL}/${row.resource.metadata?.uid}`)}
                class:active={pathName.includes(row.resource.metadata?.uid ?? '')}
              >
                {#each columns as [key, style]}
                  <!-- Check object to avoid issues with `false` values -->
                  {@const value = Object.hasOwn(row.table, key) ? row.table[key] : ''}
                  {#if value.component}
                    <td class={style || ''}>
                      <svelte:component this={value.component} {...value.props} />
                    </td>
                  {:else if value.text}
                    <td class={style || ''}>{value.text}</td>
                  {:else}
                    <td class={style || ''}>{value}</td>
                  {/if}
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>