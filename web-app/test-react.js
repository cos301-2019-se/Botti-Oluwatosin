const claimsList = document.querySelector('#claims-list');
const form = document.querySelector('#add-claim');
const updateForm = document.querySelector('#update-claim')
const rate = 3.64;

function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

function toggleFunction() {
  var x = document.getElementById("add-claim");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
		function renderClaims(doc){
			let li = document.createElement('li');
			let date = document.createElement('span');
			let amount = document.createElement('span');
			let type = document.createElement('span');
      let username = document.createElement('span');
      let cross = document.createElement('div');
      let update = document.createElement("BUTTON");   // Create a <button> element
       

			li.setAttribute('data-id', doc.id);
			date.textContent = doc.data().date;
			amount.textContent = "Amount: R" + doc.data().amount;
			type.textContent = "Type: " + doc.data().type;
      username.textContent = "User: " + doc.data().username;
      cross.textContent = 'x';
      update.innerHTML = "Update";

      li.appendChild(date);
      li.appendChild(type);
			li.appendChild(amount);
      li.appendChild(username);
      li.appendChild(cross);
      li.appendChild(update);

      claimsList.appendChild(li);
      
      //deleting data
      cross.addEventListener('click', (e) => {
        e.stopPropagation();
        var r = confirm("Are you sure you want to delete this claim?");
        if (r == true) {
          let id = e.target.parentElement.getAttribute('data-id');
          database.collection('claims').doc(id).delete();
      }
      })

      //update data
      var modal = document.getElementById("myModal");
      update.addEventListener('click', (e) => {
        
        let id =e.target.parentElement.getAttribute('data-id');
        database.collection('claims').doc(id).get().then(function(doc){
          //get's data from db and places it on form
          if(doc.data().type == 'Miscellaneous')
          {
            updateForm.updateDate.value = doc.data().date;
            updateForm.updateType.value = doc.data().type;
            updateForm.updateAmount.value = doc.data().amount;
            updateForm.updateUsername.value = doc.data().username;
          }
          else if(doc.data().type == 'Fuel')
          {
            updateForm.updateDate.value = doc.data().date;
            updateForm.updateType.value = doc.data().type;
            updateForm.updateAmount.value = doc.data().distance;
            updateForm.updateUsername.value = doc.data().username;
          }
          modal.style.display = "block";
        })
        
        updateForm.addEventListener('submit', (e) => {
          e.preventDefault();
          
          if(updateForm.updateType.value == 'Miscellaneous'){
            database.collection('claims').doc(id).update({  
              date: updateForm.updateDate.value,
              type: updateForm.updateType.value,
              amount: updateForm.updateAmount.value,
              username: updateForm.updateUsername.value
            })
          }
          
          else if(updateForm.updateType.value == 'Fuel'){
            database.collection('claims').doc(id).update({
            date: updateForm.updateDate.value,
            type: updateForm.updateType.value,
            distance: updateForm.updateAmount.value,
            username: updateForm.updateUsername.value,
            amount: updateForm.updateAmount.value * rate
            })
          }
          modal.style.display = "none";
        })

      })
      
      var span = document.getElementsByClassName("close")[0];
      span.onclick = function() {
        modal.style.display = "none";
      }
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }

    }

    //get all data
		/*database.collection('claims').get().then((snapshot) => {
			snapshot.docs.forEach(doc => {
				renderClaims(doc);
			})
    });*/

    //get specific users data --- Queries e.g where('username', '==', 'Oluwatosin Botti')
		/*database.collection('claims').where('username', '>', 'M').get().then((snapshot) => {
			snapshot.docs.forEach(doc => {
				renderClaims(doc);
			})
    });*/

    //Order results by...   indexes need to be created
    var user = "Oluwatosin Botti";
		/*database.collection('claims').where('username','==', user).orderBy('amount').get().then((snapshot) => {
			snapshot.docs.forEach(doc => {
				renderClaims(doc);
			})
    });*/

    //Changes form based on claim type
    form.type.addEventListener('change', (e) =>{
      if(form.type.value == 'Fuel')
      {
        form.amount.setAttribute('placeholder', 'Distance')
        form.amount.setAttribute('name', 'distance');
      }
      else if(form.type.value == 'Miscellaneous'){
        form.distance.setAttribute('placeholder', 'Total Amount')
        form.distance.setAttribute('name', 'amount');
      }

    })
   
    
    function addFuelClaim(date, destination, distance, type, user){
      database.collection('claims').add({
      date: date,
      destination: destination,
      distance: distance,
      type: type,
      username: user,
      amount: distance * rate
      });//
    }
    function uploadcsv()
    {
      var x = document.getElementById("uploadCsv");
      if (x.style.display === "none") {
        x.style.display = "block";
      } 
      else {
        x.style.display = "none";
  }
    }
    function handleFileSelect(evt)
    {
      var file = evt.target.files[0];
      if (file===undefined) {
        console.log("It's undefined");
     }
     else
     {
      console.log("It's not undefined");
      
      Papa.parse(file, {
        header: true,
        dynamicTyping:true,
        complete: function(results) {
          console.log("C'est finis:", results.data)
          jsonClaims = results;
          jsonClaims.data.forEach(function(obj){
            //console.log(obj.destination);
            addFuelClaim(obj.date, obj.destination, obj.distance, obj.type, obj.user)/*.then(function(docRef){
              console.log("Document successfully added");
            }).catch(function(error) {
              console.error("Error adding document: ", error); 
            });*/
          })
        }
      });
      console.log("Success!")
        //console.log(data);
    }
    }

    $(document).ready(function(){
      $("#csv-file").change(handleFileSelect);
    });


    //save data from form
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if(form.type.value == 'Miscellaneous'){
      database.collection('claims').add({
        date: form.date.value,
        type: form.type.value,
        amount:form.amount.value,
        username:form.username.value
      });
    }
    else if(form.type.value == 'Fuel')
    {
      
      addFuelClaim(form.date.value, form.destination.value, form.distance.value, form.type.value, form.username.value);
    }// clears form data
      form.date.value = '';
      //form.type.value = '';
      form.amount.value = '';
      form.username.value ='';
      toggleFunction();

    })


    //real time listenener
    database.collection('claims').onSnapshot(snapshot =>{
      let changes = snapshot.docChanges();
      changes.forEach(change => {
        if(change.type === 'added'){
          renderClaims(change.doc);
          console.log("New city: ", change.doc.data());
        }
        /*else if(change.type == 'modified'){
          let li = claimsList.querySelector('[data-id=' + change.doc.id + ']');
          //claimsList.
          claimsList.removeChild(li);
          renderClaims(change.doc);
        }*/
        else if (change.type === "modified") {
          console.log("Modified city: ", change.doc.data());
      }
        else if(change.type === 'removed'){
          let li = claimsList.querySelector('[data-id=' + change.doc.id + ']');
          claimsList.removeChild(li);
          console.log("Removed city: ", change.doc.data());
        }
      })
    })


    /*database.collection('claims').onSnapshot(snapshot =>{
      snapshot.docChanges().forEach(function(change) {
        if (change.type === "added") {
            console.log("New city: ", change.doc.data());
        }
        if (change.type === "modified") {
            console.log("Modified city: ", change.doc.data());
        }
        if (change.type === "removed") {
            console.log("Removed city: ", change.doc.data());
        }
    });
});*/

