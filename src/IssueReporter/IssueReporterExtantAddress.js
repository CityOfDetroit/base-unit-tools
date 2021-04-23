
import layers from '../data/layers'
import IdBadge from '../Explorer/IdBadge';

const IssueReporterExtantAddress = ({ type, featureCollection }) => {

  let match = featureCollection.features[0].properties
  return (<>
    <h2>Existing address</h2>
    <div className="flex items-center justify-between py-1 border-b-2">
      <p>Address ID</p>
      <IdBadge id={match.address_id} layer={layers['addresses']} link={false} />
    </div>
    <div className="flex items-center justify-between py-1 border-b-2">
      <p>Building ID</p>
      <IdBadge id={match.building_id} layer={layers['buildings']} link={false} />
    </div>
    <div className="flex items-center justify-between py-1 border-b-2">
      <p>Parcel ID</p>
      <IdBadge id={match.parcel_id} layer={layers['parcels']} link={false} />
    </div>
    <div className="flex items-center justify-between py-1">
      <p>Street ID</p>
      <IdBadge id={match.street_id} layer={layers['streets']} link={false} />
    </div>
  </>)
}

export default IssueReporterExtantAddress;