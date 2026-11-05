
import { useState } from 'react'
import './Login.css'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function entrar(e) {
    e.preventDefault()

    if (!email || !senha) {
      alert('Preencha o e-mail e a senha.')
      return
    }

    onLogin()
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={entrar}>
        <h1>Fintech</h1>
        <p>Entre na sua conta</p>

        <label>E-mail</label>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha</label>
        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}

export default Login
