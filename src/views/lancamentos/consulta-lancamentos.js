import React from "react";
import { withRouter } from "react-router-dom";
import Card from "../../ components/card";
import FormGroup from "../../ components/form-gruop";
import SelectMenu from "../../ components/selectmenus";
import LancamentosTable from "./lancamentostable";
import LancamentoService from "../../app/service/lancamentoservice";
import LocalStorageServie from "../../app/service/localstorageservice";

import * as messages from "../../ components/toastr";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

class ConsultaLancamentos extends React.Component {
  state = {
    ano: "",
    mes: "",
    tipo: "",
    descricao: "",
    showConfirmDialog: false,
    lancamentoDeletar: {},
    lancamentos: [],
  };

  constructor() {
    super();
    this.service = new LancamentoService();
  }

  buscar = () => {
    if (!this.state.ano) {
      messages.mensagemErro("O preenchimento do campo Ano é obrigatório");
      return false;
    }

    const usuarioLogado = LocalStorageServie.obterItem("_usuario_logado");

    const lancamentoFiltro = {
      ano: this.state.ano,
      mes: this.state.mes,
      tipo: this.state.tipo,
      descricao: this.state.descricao,
      usuario: usuarioLogado.id,
    };

    this.service
      .consultar(lancamentoFiltro)
      .then((response) => {
        this.setState({ lancamentos: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editar = (id) => {
    console.log("edutabdi", id);
  };

  abrirConfirmacao = (lancamento) => {
    this.setState({ showConfirmDialog: true, lancamentoDeletar: lancamento });
  };

  cancelarDelecao = () => {
    this.setState({ showConfirmDialog: false, lancamentoDeletar: {} });
  };

  deletar = () => {
    this.service
      .deletar(this.state.lancamentoDeletar.id)
      .then((response) => {
        const lancamentos = this.state.lancamentos;
        const index = lancamentos.indexOf(this.state.lancamentoDeletar.id);
        lancamentos.splice(index, 1);
        this.setState({ lancamentos: lancamentos, showConfirmDialog: false });

        messages.mensagemSucesso("Deletado com sucesso.");
      })
      .catch((error) => {
        messages.mensagemErro("Não foi possível deletar.");
      });
  };

  render() {
    const meses = this.service.obterListaMeses();
    const tipos = this.service.obterListaTipos();

    const confirmDialogFooter = (
      <div>
        <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar} />
        <Button
          label="Cancelar"
          icon="pi pi-check"
          onClick={this.cancelarDelecao}
          className="p-button-secundary"
        />
      </div>
    );

    return (
      <Card title="Consulta Lançamentos">
        <div className="row">
          <div className="col-md-6">
            <div className="bs-component">
              <FormGroup htmlFor="inputAno" label="Ano: *">
                <input
                  type="text"
                  id="inputAno"
                  value={this.state.ano}
                  onChange={(e) => this.setState({ ano: e.target.value })}
                  className="form-control"
                  placeholder="Digite o Ano"
                />
              </FormGroup>

              <FormGroup htmlFor="inputMes" label="Mês:">
                <SelectMenu
                  id="inputMes"
                  value={this.state.mes}
                  onChange={(e) => this.setState({ mes: e.target.value })}
                  lista={meses}
                  className="form-control"
                />
              </FormGroup>

              <FormGroup htmlFor="inputDescricao" label="Descrição:">
                <input
                  type="text"
                  id="inputDescricao"
                  value={this.state.descricao}
                  onChange={(e) => this.setState({ descricao: e.target.value })}
                  className="form-control"
                  placeholder="Digite a descrição"
                />
              </FormGroup>

              <FormGroup htmlFor="inputTipo" label="Tipo Lançamento: *">
                <SelectMenu
                  id="inputTipo"
                  value={this.state.tipo}
                  onChange={(e) => this.setState({ tipo: e.target.value })}
                  lista={tipos}
                  className="form-control"
                />
              </FormGroup>

              <button
                onClick={this.buscar}
                type="button"
                className="btn btn-success"
              >
                Buscar
              </button>
              <button type="button" className="btn btn-danger">
                Cadastrar
              </button>
            </div>
          </div>
        </div>

        <br />
        <div className="row">
          <div className="col-md-12">
            <div className="bs-component">
              <LancamentosTable
                lancamentos={this.state.lancamentos}
                editAction={this.editar}
                deleteAction={this.abrirConfirmacao}
              />
            </div>
          </div>
        </div>
        <div>
          <Dialog
            header="Ação de Exclusção"
            visible={this.state.showConfirmDialog}
            style={{ width: "50vw" }}
            footer={confirmDialogFooter}
            modal={true}
            onHide={() => this.setState({ showConfirmDialog: false })}
          >
            Deseja confirmar a exclusão deste Lançamento?
          </Dialog>
        </div>
      </Card>
    );
  }
}

export default withRouter(ConsultaLancamentos);
