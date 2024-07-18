import type { ActorSubclass, Identity } from "@dfinity/agent";
import { createActor } from "../../../declarations/smart_city_backend";
import type { _SERVICE } from "../../../declarations/smart_city_backend/smart_city_backend.did";

export function getSmartCityBackend(identity?: Identity): ActorSubclass<_SERVICE> {
  const host =
    process.env.DFX_NETWORK === "local" ? "http://localhost:4943" : "https://ic0.app";

  return createActor(process.env.CANISTER_ID_SMART_CITY_BACKEND ?? "", {
    agentOptions: { host, identity },
  });
}