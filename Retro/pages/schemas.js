import Realm from 'realm';
export const TRAVEL_CLAIMS = "travel_claims";
export const DESTINATIONS = "destinations";

export const TravelClaimsSchema = {
    name:'TRAVEL_CLAIMS',
        primaryKey: 'claim_id',
                properties: {
                  claim_id: { type: 'int', default: 0 },
                  client: 'int',
                  distance: 'float',
                  date: 'string',
                  amount: 'float',
                  type: 'string',
                  migrated: {type: 'bool', default: false},
                  deleted: {type: 'bool', default: false},

                },
};

export const DestinationsSchema = {
    name:'DESTINATIONS',
        primaryKey: 'destination_id',
                properties:{
                  destination_id: {type:'int', default: 0},
                  destination: 'string',
                  deleted: {type: 'bool', default: false},
                },
};

const databaseOptions ={
    path:'RRRR.realm',
    schema:[TravelClaimsSchema, DestinationsSchema],
    schemaVersion: 0,
};

export const insertNewTravelClaim = newTravelClaim => new Promise((resolve,reject) => {
  Realm.open(databaseOptions).then(realm => {

  }).catch((error) => reject(error));
})
export default Realm;