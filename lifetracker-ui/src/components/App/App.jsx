import './App.css'
import axios from 'axios'
import { useState, useEffect } from 'react'

const App = () => {
  const [name, setName] = useState("")
  const handleSubmit = async (event) => {
    event.preventDefault()
    const email = event.target.email.value
    const password = event.target.password.value

    await axios.post('http://localhost:3001/auth/login', { email: email, password: password })
        .then(response => {
          const firstName = response.data.user.first_name
          const lastName = response.data.user.last_name

          setName(`${firstName} ${lastName}`)
        })
  }

  if (name) {
    return (
      <>
        <h1>{name}</h1>
        <button onClick={() => setName(null)}>Logout</button>
      </>
    )
  } 
  return (
    <>
      <form onSubmit={handleSubmit}>
        <section>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" required/>
        </section>
        <section>
          <label htmlFor="password">Password</label>
          <input id="password" type="text" />
          <button type="submit">Login</button>
        </section>
      </form>
    </>
  )
}

export default App
