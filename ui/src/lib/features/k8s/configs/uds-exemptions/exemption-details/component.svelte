<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2024-Present The UDS Authors -->

<script lang="ts">
  import { Information } from 'carbon-icons-svelte'
  import type { ExemptionElement } from 'uds-core-types/src/pepr/operator/crd/generated/exemption-v1alpha1'

  export let exemption: ExemptionElement
</script>

<p class=" whitespace-nowrap relative group py-4 flex items-center">
  <span>{exemption.title}</span>

  {#if exemption.description}
    <div class="flex relative items-center">
      <Information class="ml-2" />
      <div class="tooltip tooltip-right -translate-y-4">
        <div class="text-balance max-w-md text-loose">{exemption.description}</div>
      </div>
    </div>
  {/if}
</p>
