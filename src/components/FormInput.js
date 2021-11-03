import FormField from "./FormField";

const FormInput = ({ title = "Title", value = "Value", width = "auto", readOnly = false, disabled = false, mono = false, onChange=null }) => {
  return (
    <FormField title={title} width={width}>
      <input type="text" className={`py-1 px-2 text-sm font-${mono ? 'mono' : 'regular'}`} value={value} readOnly={readOnly} disabled={disabled} onChange={onChange} />
    </FormField>
  )
}

export default FormInput;