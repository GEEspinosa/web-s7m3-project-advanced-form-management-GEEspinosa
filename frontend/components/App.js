// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, {useState, useEffect} from 'react'
import * as yup from 'yup'
import axios from 'axios'

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'a favorite food must be selected',
  favFoodOptions: 'a favorite food must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

const initialFormValues = {
  username: '',
    favLanguage: '',
    favFood: '',
    agree: false
}

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.

const formSchema = yup.object().shape({
  username: yup
    .string()
    .required(e.usernameRequired)
    .min(3, e.usernameMin)
    .max(20, e.usernameMax),
  favLanguage: yup
    .string()
    .required(e.favFoodRequired)
    .oneOf(['javascript', 'rust'], e.favLanguageOptions),
  favFood: yup
    .string()
    .required()
    .oneOf(['broccoli', 'spaghetti', 'pizza'], e.favFoodRequired),
  agreement: yup
    .boolean()
    .required(e.agreementRequired)
    .oneOf([true], e.agreementOptions)
})

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.
  
  const [formValues, setFormValues] = useState(initialFormValues)
  const [failureMessage, setFailureMessage] = useState('')
  const [enabled, setEnabled] = useState(false)
  const [success, setSuccess] = useState('')
  const [failure, setFailure] = useState('')
  

  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.

useEffect(() => {
  formSchema.isValid(formValues).then((isValid) =>{
    setEnabled(isValid)
  })

}, [formValues])

  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    let {type, name, value, checked} = evt.target

    if (type === 'checkbox'){value = checked}
    setFormValues ({
      ...formValues, [name]: value
    })
    
    yup
      .reach(formSchema, name)
      .validate(value)
      .then (() => setFailureMessage({...failureMessage, [name]: ''}))
      .catch ((err) => setFailureMessage({...failureMessage, [name]: err.errors[0]}))


  }


  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault()
    axios.post('https://webapis.bloomtechdev.com/registration', formValues)
      .then((res) => {
        setSuccess(res.data)
        setFailure('')
      })
      .catch((err) => {
        setFailure(err.response)
        setSuccess('')
      })
      .finally(setFormValues(initialFormValues))
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit = {onSubmit}>
        {success && <h4 className="success">{success.message}!</h4>}
        {failure && <h4 className="error">{failure.data.message}</h4>}
        
        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input 
            id="username" 
            name="username" 
            type="text"
            onChange = {onChange} 
            placeholder="Type Username"
          />
          {failureMessage.username && <div className="validation">{failureMessage.username}</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input 
                type="radio" 
                name="favLanguage" 
                value="javascript" 
                onChange = {onChange}
                checked = {formValues.favLanguage === 'javascript'}
              />
              JavaScript
            </label>
            <label>
              <input 
                type="radio" 
                name="favLanguage" 
                value="rust" 
                onChange = {onChange}
                checked= {formValues.favLanguage === 'rust'}
            />
              Rust
            </label>
          </fieldset>
          {failureMessage.favLanguage && <div className="validation">{failureMessage.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select 
            id="favFood" 
            name="favFood" 
            value = {formValues.favFood} 
            onChange = {onChange}
          >
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {failureMessage.favFood && <div className="validation">{failureMessage.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input 
              id="agreement" 
              type="checkbox" 
              name="agreement" 
              checked = {formValues.agreement === true}
              onChange = {onChange}
            />
            Agree to our terms
          </label>
          {failureMessage.agreement && <div className="validation">{failureMessage.agreement}</div>}
        </div>

        <div>
          <input type="submit" disabled={!enabled} />
        </div>
      </form>
    </div>
  )
}
