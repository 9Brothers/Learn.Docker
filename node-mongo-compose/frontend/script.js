const API = 'http://localhost:3000';

const createButton = (label, type) => {
  return $('<button>').addClass(`btn btn-${type}`).html(label)
};

const renderRows = clients => {
  const rows = clients.map(client => {
    
    const updateButton = createButton('Atualizar', 'warning');
    updateButton.click(() => loadClient(client));

    const removeButton = createButton('Excluir', 'danger');
    removeButton.click(() => removeClient(client));
    
    return $('<tr>')
      .append($('<td>').append(client.name))
      .append($('<td>').append(updateButton).append(removeButton));
  });

  $('#clientsRows').html(rows);
};

const getClients = () => {
  $.ajax({
    url: `${API}/clients`,
    method: 'GET',
    headers: 'application/json',
    success: clients => {
      renderRows(clients);
      $('[name]').val('');
      $('[id]').val('');
    }
  })
};

const saveClient = () => {
  const _id = $('[name=id').val();
  const name = $('[name=name').val();

  $.ajax({
    url: `${API}/clients/${_id}`,
    method: _id ? 'PUT' : 'POST',
    data: _id ? { _id, name } : { name },
    success: getClients
  });
}

const loadClient = client => {
  $('[name=id]').val(client._id);
  $('[name=name]').val(client.name);
}

const removeClient = (client) => {
  $.ajax({
    url: `${API}/clients/${client._id}`,
    method: 'DELETE',
    success: getClients
  })
}

$(() => {
  getClients();


  $('[save]').click(saveClient);
});