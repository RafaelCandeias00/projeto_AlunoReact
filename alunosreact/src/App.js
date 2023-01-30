import './App.css';
import React, { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
//import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

function App() {
  // URL para acessar endpoint para obter os alunos a partir da API
  const baseUrl="https://localhost:5001/api/Alunos"; 
  
  // Trata mudança de estado na aplicação relacionada aos dados do aluno
  const [data, setData]=useState([]); 

  /**
   * Define o request GET usando o axios com o 
   * endereço base e obtém a resposta e
   * usando setData atribui os dados recebidos
   */
  const pedidoGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  /**
   * A função setData é resposável por alterar
   * o estado de data e assim a colocamos
   * dentro do escopo da função useEffect,
   * porque ela é a resposável por tratar os dados 
   * que vão modiciar o estado da aplicação
   */
  useEffect(()=>{
    pedidoGet();
  })

  return (
    <div className="App">
      <br/>
      <h3>Cadastro de Alunos</h3>
      <header>
        <button className="btn btn-success">Incluir Novo Aluno</button>
      </header>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(aluno=>(
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
              <td>{aluno.idade}</td>
              <td>
                <button className='btn btn-primary'>Editar</button> {"  "}
                <button className='btn btn-danger'>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
