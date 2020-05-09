import React from 'react';
import Card from '../ components/card';
import FormGroup from '../ components/form-gruop';

import axios from 'axios';

import { withRouter } from 'react-router-dom';

class Login extends React.Component{

    state = {
        email: '',
        senha: ''
    }

    entrar = () =>{
        axios
        .post('http://localhost:8080/api/usuarios/autenticar', {
            email: this.state.email, 
            senha: this.state.senha
        }).then(response => {
            console.log(response)
        }).catch(erro => {
            console.log(erro.response)
        });
    }

    prepareCadastrar = () => {
        this.props.history.push('/cadastro-usuarios')
    }

    render(){
        return(            
                <div className="row">
                    <div className="col-md-6" style={ {position: 'relative', left: '300px'} }>
                        <div className="bs-docs-section">
                            <Card title="Login">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="bs-component">
                                            <fieldset>
                                                <FormGroup label="Email: *" htmlFor="exampleInputEmail1">
                                                    <input id="exampleInputEmail1" 
                                                        value={this.state.email}
                                                        onChange={(e) => this.setState({email: e.target.value})}
                                                        type="email" 
                                                        className="form-control" 
                                                        aria-describedby="emailHelp" 
                                                        placeholder="Digite o Email" />
                                                </FormGroup>
                                                <FormGroup label="Senha: *" htmlFor="exampleInputPassword1">
                                                    <input id="exampleInputPassword1" 
                                                        value={this.state.senha}
                                                        onChange={(e) => this.setState({senha: e.target.value})}
                                                        type="password" 
                                                        className="form-control"                                                        
                                                        placeholder="Password" />
                                                </FormGroup>
                                                <button onClick={this.entrar} className="btn btn-success">
                                                    Entrar
                                                </button>

                                                <button onClick={this.prepareCadastrar} className="btn btn-danger">
                                                    Cadastrar
                                                </button>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            
        )
    }
}

export default withRouter(Login)