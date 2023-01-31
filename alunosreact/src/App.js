import './App.css';
import React, { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

function App() {
  // URL para acessar endpoint para obter os alunos a partir da API
  const baseUrl="https://localhost:5001/api/Alunos"; 
  
  // Trata mudança de estado na aplicação relacionada aos dados do aluno
  const [data, setData]=useState([]); 

  // Definir um estado para controlar a janela Modal
  const [modalIncluir, setModalIncluir]=useState(false);

  // Cria o estado alunoSelecionado
  const [alunoSelecionado, setAlunoSelecionado]=useState({
    alunoId: '',
    nome: '',
    email: '',
    idade: ''
  })

  //Criar método abrirFecharModalIncluir para alterar entre os estados aberto e fechado
  const abrirFecharModalIncluir=()=>{
    setModalIncluir(!modalIncluir);
  }

  /**
   * Criar o método handleChange para
   * guardar os dados do aluno que serão
   * informados no inputs do formulário: 
   * id, nome, email e idade
   * 
   * E usa setAlunoSelecionado para atualizar o estado
   */
  const handleChange=e=>{
    const {name, value}=e.target;
    setAlunoSelecionado({
      ...alunoSelecionado,
      [name]: value
    });
    console.log(alunoSelecionado);
  }

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

  const pedidoPost=async()=>{
    delete alunoSelecionado.alunoId;
    alunoSelecionado.idade=parseInt(alunoSelecionado.idade);
      await axios.post(baseUrl, alunoSelecionado)
      .then(response=>{
        setData(data.concat(response.data));
        abrirFecharModalIncluir();
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
    <div className="aluno-container">
      <br/>
      <h3>Cadastro de Alunos</h3>
      <header>
        <button onClick={()=>abrirFecharModalIncluir()} className="btn btn-success">Incluir Novo Aluno</button>
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
              <td>{aluno.alunoId}</td>
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
      
      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Alunos</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Nome: </label>
            <br/>
            <input type='text' className="form-control" name='nome' onChange={handleChange}/>
            <br/>
            <label>Email: </label>
            <br/>
            <input type='text' className="form-control" name='email' onChange={handleChange}/>
            <br/>
            <label>Idade: </label>
            <br/>
            <input type='text' className="form-control" name='idade' onChange={handleChange}/>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={()=>pedidoPost()}>Incluir</button>{"   "}
          <button className='btn btn-danger' onClick={()=>abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
