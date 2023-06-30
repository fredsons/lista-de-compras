/**
 * Este código é responsável por criar uma lista de itens que podem ser salvos, editados, marcados como concluídos e removidos.
 * Ele utiliza HTML, CSS e JavaScript para implementar as funcionalidades.
 */

// Variáveis globais
let listaDeItens = []; // Lista de itens a serem exibidos
let itemAEditar; // Índice do item que está sendo editado

// Elementos do DOM
const form = document.getElementById("form-itens"); // Formulário para adicionar itens
const itensInput = document.getElementById("receber-item"); // Campo de entrada para o novo item
const ulItens = document.getElementById("lista-de-itens"); // Lista de itens a serem exibidos
const ulItensComprados = document.getElementById("itens-comprados"); // Lista de itens marcados como concluídos

// Recupera a lista de itens do armazenamento local
const listaRecuperada = localStorage.getItem("listaDeItens");

// Função para atualizar o armazenamento local
function atualizaLocalStorage() {
  localStorage.setItem('listaDeItens', JSON.stringify(listaDeItens));
}

// Verifica se há uma lista recuperada do armazenamento local e a exibe
if (listaRecuperada) {
  listaDeItens = JSON.parse(listaRecuperada);
  mostrarItem();
} else {
  listaDeItens = [];
}

// Event listener para o envio do formulário
form.addEventListener("submit", function (evento) {
  evento.preventDefault(); // Impede o envio do formulário
  salvarItem(); // Salva o novo item
  mostrarItem(); // Atualiza a exibição dos itens
  itensInput.focus(); // Coloca o foco novamente no campo de entrada
});

// Função para salvar um novo item
function salvarItem() {
  const comprasItem = itensInput.value; // Obtém o valor do campo de entrada
  const checarDuplicado = listaDeItens.some((elemento) => elemento.valor.toUpperCase() === comprasItem.toUpperCase()); // Verifica se o item já foi adicionado

  if (checarDuplicado) {
    alert("Item já adicionado");
  } else {
    listaDeItens.push({
      valor: comprasItem,
      checar: false
    });
  }

  itensInput.value = ""; // Limpa o campo de entrada após salvar o item
}

// Função para exibir os itens na interface
function mostrarItem() {
  ulItens.innerHTML = ''; // Limpa a lista de itens
  ulItensComprados.innerHTML = ''; // Limpa a lista de itens concluídos

  listaDeItens.forEach((elemento, index) => {
    if (elemento.checar) {
      ulItensComprados.innerHTML += `
      <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
        <div>
            <input type="checkbox" checked class="is-clickable" />
            <span class="itens-comprados is-size-5">${elemento.valor}</span>
        </div>
        <div>
            <i class="fa-solid fa-trash is-clickable deletar"></i>
        </div>
      </li>
      `;
    } else {
      ulItens.innerHTML += `
    <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
      <div>
          <input type="checkbox" class="is-clickable" />
          <input type="text" class="is-size-5" value="${elemento.valor}" ${index !== Number(itemAEditar) ? 'disabled' : ''} ></input>
      </div>
      
      <div>
      ${index === Number(itemAEditar) ?
          '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' :
          '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'
        }
    <i class="fa-solid fa-trash is-clickable deletar"></i>
      </div >
    </li >
      `;
    }
  });

  const inputsCheck = document.querySelectorAll('input[type="checkbox"]');

  // Adiciona event listener para os checkboxes
  inputsCheck.forEach(i => {
    i.addEventListener('click', (evento) => {
      const valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
      listaDeItens[valorDoElemento].checar = evento.target.checked;
      mostrarItem();
    });
  });

  const deletarObjetos = document.querySelectorAll('.deletar');

  // Adiciona event listener para os botões de deletar
  deletarObjetos.forEach(i => {
    i.addEventListener('click', (evento) => {
      const valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
      listaDeItens.splice(valorDoElemento, 1);
      mostrarItem();
    });
  });

  const editarItens = document.querySelectorAll('.editar');

  // Adiciona event listener para os botões de editar
  editarItens.forEach(i => {
    i.addEventListener('click', (evento) => {
      itemAEditar = evento.target.parentElement.parentElement.getAttribute('data-value');
      mostrarItem();
    });
  });

  atualizaLocalStorage(); // Atualiza o armazenamento local
}

// Função para salvar a edição de um item
function salvarEdicao() {
  const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`);
  listaDeItens[itemAEditar].valor = itemEditado.value;
  itemAEditar = -1;
  mostrarItem();
}
