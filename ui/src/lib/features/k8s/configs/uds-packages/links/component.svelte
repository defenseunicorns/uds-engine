<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2024-Present The UDS Authors -->

<script lang="ts">
  import { Link } from '$components'

  export let endpoints: string[]
</script>

{#if endpoints.length < 1}
  <p class="text-gray-500 dark:text-gray-400">-</p>
{/if}

{#each endpoints as endpoint}
  <Link href={`https://${endpoint}`} text={endpoint} />
{/each}
