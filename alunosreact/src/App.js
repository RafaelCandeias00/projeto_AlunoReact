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
  const [modalEditar, setModalEditar]=useState(false);
  const [modalExcluir, setModalExcluir]=useState(false);

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

  //Criar o método abrirFecharModalEditar para controlar a abertura da janela Modal
  const abrirFecharModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  //Criar o método abrirFecharModalExcluir para controlar a abertura da janela Modal
  const abrirFecharModalExcluir=()=>{
    setModalExcluir(!modalExcluir);
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

  const pedidoPut=async()=>{
    alunoSelecionado.idade=parseInt(alunoSelecionado.idade);
    await axios.put(baseUrl+'/'+alunoSelecionado.alunoId, alunoSelecionado)
    .then(response=>{
      var resposta = response.data;
      var dadosAuxiliar = data;
      dadosAuxiliar.map(aluno=>{
        if(aluno.id===alunoSelecionado.id){
          aluno.nome=resposta.nome;
          aluno.email=resposta.email;
          aluno.email=resposta.email;
        }
      });
      abrirFecharModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const pedidoDelete=async()=>{
    await axios.delete(baseUrl+'/'+alunoSelecionado.alunoId)
    .then(response=>{
      setData(data.filter(aluno=>aluno.alunoId !== response.data));
      abrirFecharModalExcluir();
    }).catch(error=>{
      console.log(error);
    })
  }

  const selecionarAluno=(aluno, opcao)=>{
    setAlunoSelecionado(aluno);
    (opcao==='Editar') ? abrirFecharModalEditar() : abrirFecharModalExcluir();
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
                <button className='btn btn-primary' onClick={()=>selecionarAluno(aluno, 'Editar')}>Editar</button> {"  "}
                <button className='btn btn-danger' onClick={()=>selecionarAluno(aluno, 'Excluir')}>Excluir</button>
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

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Aluno</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Id: </label><br/>
            <input type='text' className='form-control' readOnly value={alunoSelecionado && alunoSelecionado.alunoId}/>
            <br/>
            <label>Nome: </label><br/>
            <input type='text' className="form-control" name='nome' onChange={handleChange}
                  value={alunoSelecionado && alunoSelecionado.nome}/><br/>

            <label>Email: </label><br/>
            <input type='text' className="form-control" name='email' onChange={handleChange}
                  value={alunoSelecionado && alunoSelecionado.email}/><br/>

            <label>Idade: </label><br/>
            <input type='text' className="form-control" name='idade' onChange={handleChange}
                  value={alunoSelecionado && alunoSelecionado.idade}/><br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={()=>pedidoPut()}>Incluir</button>{"   "}
          <button className='btn btn-danger' onClick={()=>abrirFecharModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão deste(a) aluno(a): {alunoSelecionado && alunoSelecionado.nome}?
        </ModalBody>

        <ModalFooter>
          <button className='btn btn-primary' onClick={()=>pedidoDelete()}>Sim</button>{"   "}
          <button className='btn btn-danger' onClick={()=>abrirFecharModalExcluir()}>Não</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
