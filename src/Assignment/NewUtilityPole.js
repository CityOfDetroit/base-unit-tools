const NewUtilityPole = ({ street, setStreet }) => {
      return (
      <>
        <section className='sidebar-section'>
          {!street && <h2>Click a street segment for the new utility address.</h2>}
          {street && <h2>Selected street segment: {street}</h2>}
        </section>
      </>
    )
  }

export default NewUtilityPole;