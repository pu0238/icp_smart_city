<script lang="ts">
import { getSmartCityBackend } from "../utils/smart_city_backend"
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { createHash } from "crypto";
import { Ref, ref } from "vue";
import { clearInterval, setInterval, setTimeout } from 'worker-timers'
//1000000000
const MILI_TO_NANO = 1000000;

export default {
  async setup() {
    const lightTimestamp: Ref<undefined | bigint> = ref(undefined)
    const lightChangeDuration: Ref<undefined | bigint> = ref(undefined)
    const lightColor: Ref<"RED" | "YELLOW" | "GREEN"> = ref("RED")
    const lightsItervalID:  Ref<undefined | number> = ref(undefined)

    const syncData = async () => {
      const smartCityBackend = getSmartCityBackend(identity)
      const [resTimestamp, {timestamp, change_duration}] = await smartCityBackend.sync_street_light()

      lightTimestamp.value = timestamp;
      lightChangeDuration.value = change_duration;
      return resTimestamp
    }

    const changeLight = () => {
      switch (lightColor.value) {
        case "RED":
          lightColor.value = "YELLOW"
          break;
        case "YELLOW":
          lightColor.value = "GREEN"
          break;
        case "GREEN":
          lightColor.value = "RED"
          break;
      }
    }

    const resetLight = async () => {
      const resTimestamp = await syncData()
      if (!lightTimestamp.value || !lightChangeDuration.value) return;
      if (lightsItervalID.value) clearInterval(lightsItervalID.value)
      const resDiff = resTimestamp - lightTimestamp.value
      const startLight = Number((resDiff % lightChangeDuration.value) / BigInt(MILI_TO_NANO));
      setTimeout(() => {
        changeLight()
        if (lightChangeDuration.value)
          lightsItervalID.value = setInterval(() => {
            changeLight()
          }, Number(lightChangeDuration.value  / BigInt(MILI_TO_NANO)));
      }, startLight)
    }

    //jfi3i-zb25f-gqumg-cmans-6lj7a-jam6x-lrfzj-eq5ht-y5xgc-zapei-wqe
    const streetLightSeed = new Uint8Array(createHash('sha256').update('street_light3').digest())
    const identity = await Ed25519KeyIdentity.generate(streetLightSeed)

    console.log("Light principal ID: ", identity.getPrincipal().toText())

    await resetLight()
    setInterval(async () => {
      await resetLight()
    }, 20_000)

    return {
      lightColor
    }
  }
}
</script>

<template>
  <div :class="{
      'bg-red-600': lightColor === 'RED',
      'bg-green-500': lightColor === 'GREEN',
      'bg-yellow-500': lightColor === 'YELLOW'
    }" class="w-screen h-screen">
   
  </div>
</template>
