

document.getElementById('itemList').addEventListener('click', function(e){
  if(e.target && e.target.nodeName == "LI") {
    crossOutItem(e.target);
  } else if(e.target && e.target.nodeName == "H3") {
    crossOutItem(e.target.parentElement);
  } else if(e.target && e.target.nodeName == "STRIKE") {
    crossOutItem(e.target.parentElement.parentElement);
  }
});

// Listen for form submit
document.getElementById('itemForm').addEventListener('submit', saveItem);

//document.getElementById('editSubmitBtn').addEventListener('', submitEdited());



// Save Item
function saveItem(e){
  // Get form values
  var item = document.getElementById('item').value;

  if(!validateForm(item)){
    return false
  }

  // Test if bookmarks is null
  if(localStorage.getItem('items') === null){
    // init array
    var items = [];
    // Add to array
    items.push(item);
    // Set to localStorage
    localStorage.setItem('items', JSON.stringify(items));
  } else {
    // Get bookmarks from localStorage
    var items = JSON.parse(localStorage.getItem('items'));
    // Add bookmark to array
    items.push(item);
    // Reset back to localStorage
    localStorage.setItem('items', JSON.stringify(items));
  }

  //Clear form
  document.getElementById('itemForm').reset();

  //re-fetch items
  fetchItems();

  // Prevent form from submitting
  e.preventDefault();

  //Update progress bar
  updateProgress();
}

// Fetch items
function fetchItems(){
  // Get bookmarks from localStorage
  var items = JSON.parse(localStorage.getItem('items'));

  // Get output id
  var itemsList = document.getElementById('itemList');

  // Build output
  itemsList.innerHTML = '';
  for(var i = 0; i < items.length; i++){
    var item = items[i];

    itemsList.innerHTML += '<li class="list-group-item btn" id="listBtn" type="button">'+
                            '<h3 id="itemName">'+item+'</h3>'+
                            ' <a onclick="deleteItem(\''+item+'\')" class="btn btn-danger" href="#">Delete</a> ' +
                            ' <a class="btn btn-info" onclick="setEdited(\''+item+'\')" data-toggle="modal" data-target="#editModal" data-item="\''+item+'\'" href="#">Edit</a> ' +
                            '</li>';
  }
}



// Edit items
var origItem = "";
function setEdited(item){
  origItem = item;
  $('#editedItem').val(origItem);
}


function submitEdited(){
  var item = $('#editedItem').val();

  if(!validateForm(item)){
    return false
  }

  // Get items from localStorage
  var items = JSON.parse(localStorage.getItem('items'));
  for(var i = 0; i < items.length; i++){

    if (items[i].includes(origItem)){
      items[i] = item;
      break;
    }
  }

  // Reset back to localStorage
  localStorage.setItem('items', JSON.stringify(items));

  //close modal
  $('#editModal').modal('hide');

  //re-fetch items
  fetchItems();

  //Update progress bar
  updateProgress();
}


// Delete items
function deleteItem(item){
  // Get items from localStorage
  var items = JSON.parse(localStorage.getItem('items'));
  //Loop through bookmarks
  for(var i = 0; i < items.length; i++){
    if (items[i] === item){
      //remove from array
      items.splice(i,1);
    }
  }
  // Reset back to localStorage
  localStorage.setItem('items', JSON.stringify(items));

  //Clear form
  document.getElementById('itemForm').reset();

  //re-fetch items
  fetchItems();

  //Update progress bar
  updateProgress();
}

//Validate form
function validateForm(item){
  var items = JSON.parse(localStorage.getItem('items'));
  if(!item){
    alert('Please fill in the form.');
    return false;
  }
  for(var i = 0; i < items.length; i++){
    var listItem = items[i];
    listItem = listItem.replace("<strike>","");
    listItem = listItem.replace("</strike>","");
    if (listItem === item){
      alert('Item is already added to list!');
      return false;
    }
  }
  return true;
}

//Cross or uncross items
function crossOutItem(item){
  // Get items from localStorage
  var items = JSON.parse(localStorage.getItem('items'));

  var string = item.getElementsByTagName("h3")[0].innerHTML;
  if (!string.includes("<strike>")){
    var output = string.strike();
  } else{
    var output = string;
    output = output.replace("<strike>","");
    output = output.replace("</strike>","");
  }
  item.getElementsByTagName("h3")[0].innerHTML = output;

  var savingItem = output;
  savingItem = savingItem.replace("<strike>","");
  savingItem = savingItem.replace("</strike>","");

  for (var i = 0; i < items.length; i++){
    if ((items[i].includes(savingItem))) {
      items[i] = output;
    }
  }
  // Reset back to localStorage
  localStorage.setItem('items', JSON.stringify(items));

  updateProgress();
}

//Update progress bar
function updateProgress(){
  // Get items from localStorage
  var items = JSON.parse(localStorage.getItem('items'));
  var finCount = 0;
  var totalCount = items.length;

  for(var i = 0; i < totalCount; i++){
    if (items[i].includes("<strike>")){
      finCount++;
    }
  }

  var progressPercent = Math.floor((finCount / totalCount)*100);

  document.getElementById("progressBar").innerText = (progressPercent + "% Complete");
  document.getElementById("progressBar").style = ("width:" + progressPercent + "%");
}
