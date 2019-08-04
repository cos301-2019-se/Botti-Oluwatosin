const claimsList = document.querySelector('#claims-list');
const form = document.querySelector('#add-claim');
const updateForm = document.querySelector('#update-claim')
const rate = 3.64;

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
   
    
    //save data
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
      database.collection('claims').add({
        date: form.date.value,
        type: form.type.value,
        distance:form.distance.value,
        username:form.username.value,
        amount: form.distance.value * rate
      });
    }// clears form data
      form.date.value = '';
      //form.type.value = '';
      form.amount.value = '';
      form.username.value ='';
    })


    //real time listenener
    database.collection('claims').where('username', '==', user).onSnapshot(snapshot =>{
      let changes = snapshot.docChanges();
      changes.forEach(change => {
        if(change.type == 'added'){
          renderClaims(change.doc);
        }
        else if(change.type == 'modified'){
          let li = claimsList.querySelector('[data-id=' + change.doc.id + ']');
          //claimsList.
          claimsList.removeChild(li);
          renderClaims(change.doc);
        }
        else if(change.type == 'removed'){
          let li = claimsList.querySelector('[data-id=' + change.doc.id + ']');
          claimsList.removeChild(li);
        }
      });
    })


    database.collection('claims').onSnapshot(snapshot =>{
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
});

