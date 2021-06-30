const MailerTable = ({ filtered }) => {

    console.log(filtered)
    
    return (
        <div>
            We've got {filtered.length} addresses.
        </div>
    )
}

export default MailerTable;