use std::{cell::RefCell, collections::HashMap};

use candid::{CandidType, Principal};

#[derive(Clone, CandidType)]
struct StreetLightData {
     timestamp: u64,
     change_duration: u64
}

type StreetLights = HashMap<Principal, StreetLightData>;

thread_local! {
    static STREET_LIGHTS: RefCell<StreetLights> = RefCell::default();
    static ADMIN: RefCell<Option<Principal>> = RefCell::default();
}

pub fn caller() -> Principal{
    let caller = ic_cdk::caller();
    // The anonymous principal is not allowed to interact with the
    // encrypted notes canister.
    if caller == Principal::anonymous() {
        panic!("Anonymous caller")
    }
    caller
}

#[ic_cdk::init]
fn init(new_admin: Option<Principal>) {
    ADMIN.with_borrow_mut(|admin| *admin = new_admin)
}

#[ic_cdk::update]
fn set_change_duration(light_id: Principal, change_duration: u64)  {
    STREET_LIGHTS.with_borrow_mut(|lights| {
        lights.insert(light_id, StreetLightData {
            timestamp: ic_cdk::api::time(),
            change_duration
        });
    })
}

#[ic_cdk::query]
fn sync_street_light() -> (u64, StreetLightData) {
    let caller = caller();

    let light = STREET_LIGHTS.with_borrow(|lights| lights.get(&caller).expect("Light not found").clone());
    (ic_cdk::api::time(), light)
}

ic_cdk::export_candid!();