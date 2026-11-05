
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [pagina, setPagina] = useState('Visão geral')

  const [receitas, setReceitas] = useState(() => {
    const salvas = localStorage.getItem('receitas')

    return salvas
      ? JSON.parse(salvas)
      : [{ id: 1, descricao: 'Salário', valor: 4500 }]
  })

  const [gastos, setGastos] = useState(() => {
    const salvos = localStorage.getItem('gastos')

    return salvos
      ? JSON.parse(salvos)
      : [{ id: 1, descricao: 'Conta de luz', valor: 150 }]
  })

  const [investimentos, setInvestimentos] = useState(() => {
    const salvos = localStorage.getItem('investimentos')

    return salvos ? JSON.parse(salvos) : []
  })

  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')

  useEffect(() => {
    localStorage.setItem('gastos', JSON.stringify(gastos))
  }, [gastos])

  useEffect(() => {
    localStorage.setItem('investimentos', JSON.stringify(investimentos))
  }, [investimentos])

  useEffect(() => {
    localStorage.setItem('receitas', JSON.stringify(receitas))
  }, [receitas])

  const menu = [
    'Visão geral',
    'Gastos',
    'Receitas',
    'Investimentos'
  ]

  const totalCadastrado = (lista) =>
    lista.reduce((total, item) => total + item.valor, 0)

  const totalReceitas = totalCadastrado(receitas)
  const totalGastos = totalCadastrado(gastos)
  const totalInvestimentos = totalCadastrado(investimentos)

  const saldoDisponivel =
    totalReceitas - totalGastos - totalInvestimentos

  const totalMovimentacoes =
    totalReceitas + totalGastos + totalInvestimentos

  const percentual = (valor) =>
    totalMovimentacoes > 0
      ? (valor / totalMovimentacoes) * 100
      : 0

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  function adicionarItem(e) {
    e.preventDefault()

    if (!descricao.trim() || !valor || Number(valor) <= 0) {
      alert('Preencha a descrição e informe um valor válido.')
      return
    }

    const novoItem = {
      id: Date.now(),
      descricao: descricao.trim(),
      valor: Number(valor)
    }

    if (pagina === 'Receitas') {
      setReceitas([...receitas, novoItem])
    } else if (pagina === 'Gastos') {
      setGastos([...gastos, novoItem])
    } else if (pagina === 'Investimentos') {
      setInvestimentos([...investimentos, novoItem])
    }

    setDescricao('')
    setValor('')
  }

  function excluirItem(id) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este registro?'
    )

    if (!confirmar) {
      return
    }

    if (pagina === 'Receitas') {
      setReceitas(receitas.filter(item => item.id !== id))
    } else if (pagina === 'Gastos') {
      setGastos(gastos.filter(item => item.id !== id))
    } else if (pagina === 'Investimentos') {
      setInvestimentos(
        investimentos.filter(item => item.id !== id)
      )
    }
  }

  let listaAtual = []

  if (pagina === 'Receitas') {
    listaAtual = receitas
  } else if (pagina === 'Gastos') {
    listaAtual = gastos
  } else if (pagina === 'Investimentos') {
    listaAtual = investimentos
  }

  return (
    <div className="app">

      <aside className="sidebar">
        <h2>Financeiro</h2>

        <nav>
          {menu.map(item => (
            <button
              key={item}
              className={pagina === item ? 'ativo' : ''}
              onClick={() => {
                setPagina(item)
                setDescricao('')
                setValor('')
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="conteudo">

        <h1>{pagina}</h1>
        <p>Bem-vindo ao seu painel financeiro.</p>

        {pagina === 'Visão geral' && (
          <>

            <section className="cards">

              <div className="card">
                <h3>Receitas</h3>
                <h2>{formatarMoeda(totalReceitas)}</h2>
              </div>

              <div className="card">
                <h3>Gastos</h3>
                <h2>{formatarMoeda(totalGastos)}</h2>
              </div>

              <div className="card">
                <h3>Investimentos</h3>
                <h2>{formatarMoeda(totalInvestimentos)}</h2>
              </div>

              <div className="card">
                <h3>Saldo disponível</h3>
                <h2>{formatarMoeda(saldoDisponivel)}</h2>
              </div>

            </section>

            <section className="mensagem">
              <h2>Seu dinheiro sob controle.</h2>

              <p>
                Acompanhe suas receitas, despesas e investimentos
                em um só lugar.
              </p>
            </section>

            <section className="mensagem grafico-container">

              <h2>Distribuição financeira</h2>

              <div className="grafico-rosca">

                <div
                  className="grafico-centro"
                  style={{
                    background: `conic-gradient(
                      #2563eb 0% ${percentual(totalReceitas)}%,
                      #ef4444 ${percentual(totalReceitas)}% ${percentual(totalReceitas) + percentual(totalGastos)}%,
                      #16a34a ${percentual(totalReceitas) + percentual(totalGastos)}% 100%
                    )`
                  }}
                >

                  <div className="grafico-texto">
                    <strong>
                      {formatarMoeda(totalMovimentacoes)}
                    </strong>
                    <span>Total registrado</span>
                  </div>

                </div>

              </div>

              <div className="legenda-grafico">
                <p>🔵 Receitas: {formatarMoeda(totalReceitas)}</p>
                <p>🔴 Gastos: {formatarMoeda(totalGastos)}</p>
                <p>🟢 Investimentos: {formatarMoeda(totalInvestimentos)}</p>
              </div>

            </section>

          </>
        )}

        {(pagina === 'Receitas' ||
          pagina === 'Gastos' ||
          pagina === 'Investimentos') && (

          <section className="mensagem">

            <h2>
              {pagina === 'Receitas'
                ? 'Cadastrar nova receita'
                : pagina === 'Gastos'
                  ? 'Cadastrar novo gasto'
                  : 'Cadastrar novo investimento'}
            </h2>

            <form onSubmit={adicionarItem}>

              <div className="campo">
                <label>Descrição</label>

                <input
                  type="text"
                  placeholder={
                    pagina === 'Receitas'
                      ? 'Ex: Salário'
                      : pagina === 'Gastos'
                        ? 'Ex: Conta de luz'
                        : 'Ex: CDB'
                  }
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                />
              </div>

              <div className="campo">
                <label>Valor (R$)</label>

                <input
                  type="number"
                  placeholder="Ex: 500"
                  min="0.01"
                  step="0.01"
                  value={valor}
                  onChange={e => setValor(e.target.value)}
                />
              </div>

              <button className="botao-adicionar" type="submit">
                Adicionar {
                  pagina === 'Receitas'
                    ? 'receita'
                    : pagina === 'Gastos'
                      ? 'gasto'
                      : 'investimento'
                }
              </button>

            </form>

            <h2 className="titulo-lista">
              {pagina} cadastrados
            </h2>

            <div className="lista-receitas">

              {listaAtual.length === 0 ? (
                <p>Nenhum registro cadastrado ainda.</p>
              ) : (
                listaAtual.map(item => (
                  <div className="item-receita" key={item.id}>

                    <span>{item.descricao}</span>

                    <strong>{formatarMoeda(item.valor)}</strong>

                    <button
                      className="botao-excluir"
                      onClick={() => excluirItem(item.id)}
                      type="button"
                    >
                      Excluir
                    </button>

                  </div>
                ))
              )}

            </div>

            <div className="total-receitas">
              Total de {pagina.toLowerCase()} cadastrados:{' '}
              {formatarMoeda(totalCadastrado(listaAtual))}
            </div>

          </section>
        )}

      </main>

    </div>
  )
}

export default App

