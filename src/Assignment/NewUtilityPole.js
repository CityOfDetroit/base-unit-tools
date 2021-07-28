import AssignmentStreet from "./AssignmentStreet";

const NewUtilityPole = ({ street, setStreet }) => {
      return (
        <>
          {!street && <section className='sidebar-section'>
            <h2>Click a street segment for the new utility address.</h2>
          </section>}
          {street && <AssignmentStreet {...{street}} />}
          {street && <section className='sidebar-section'>
            <h2>Click the map to drop a pin where the utility pole should be placed.</h2>
          </section>}
          
        </>
    )
  }

export default NewUtilityPole;