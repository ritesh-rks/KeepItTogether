const displaytakeNoteButton = document.getElementById('displaytakeNoteButton');
const displayCard = document.getElementById('displayCard');
const close = document.getElementById('close');
const addNote = document.getElementById('addNote');
const title = document.getElementById('title');
const takeNoteSection = document.getElementById('takeNoteSection');
const noteCard = document.getElementById('noteCard');
const home = document.querySelector('.home');
const deleteHeading = document.querySelector('.deleteHeading');
const archiveHeading = document.querySelector('.archiveHeading');
const clearAll = document.querySelector('.clearAll');
const mobiledeleteFolder = document.querySelector('.mobiledeleteFolder');
const mobileHome = document.querySelector('.mobileHome');
const mobileArchive = document.querySelector('.mobileArchive')
// JavaScript for toggling the mobile menu
var navbarToggle = document.getElementById('navbarToggle');
var navbar = document.getElementById('navbar');

navbarToggle.addEventListener('click', function() {
    navbarToggle.classList.toggle('active');
    if (navbar.style.display === 'flex') {
        navbar.style.display = 'none';
    } else {
        navbar.style.display = 'flex';
    }
});


const deletedNotesContainer = document.getElementById('deletedNotesContainer');
let deletedNotes = JSON.parse(localStorage.getItem('deletedNotes')) || [];

const archivedNotesContainer = document.getElementById('archivedNotesContainer');
let acrchiveNotes = JSON.parse(localStorage.getItem('acrchiveNotes')) || [];

displaytakeNoteButton.addEventListener("click", () => {
    displayCard.style.display = 'flex';
    displaytakeNoteButton.style.display = 'none';
})

close.addEventListener('click', () => {
    displaytakeNoteButton.style.display='block';
    displayCard.style.display = 'none';
})

home.addEventListener('click', () => {
    location.reload();    
});

mobileHome.addEventListener('click', () => {
    location.reload();
});

let notes = [];


const updateCardContainer = () => {
    // Clear card container
    noteCard.innerHTML = '';

    let notesHTML = '';

    // Loop through notes array and create card elements
    for (let i = 0; i <notes.length; i++) {
        notesHTML += `
        <div class="notesSection">
        <div class="icon">
            <i title="Delete" class="fa-solid fa-minus deletedCard" data-index="${i}"></i>
            <i title="Edit" class="fa-solid fa-pen-to-square editCard"></i>
            <i title="Archive" class="fa-solid fa-box-archive archiveCard" data-index="${i}"></i>
        </div>
        <h4 id="cardTitle">${notes[i].titles}</h4>
        <textarea id="cardDescription">${notes[i].description}</textarea>
    </div>
        `;
        
    }
    
    
    noteCard.innerHTML = notesHTML;



   // Add event listener for edit icons
const editIcons = document.querySelectorAll('.editCard');
editIcons.forEach((icon, index) => { // Add index as second parameter
    icon.addEventListener('click', () => { 
        editNote(index); // Use index as argument for editNote function
    });
});



const deleteIcons = document.querySelectorAll('.deletedCard');
deleteIcons.forEach((icon) => {
    icon.addEventListener('click', (event) => {
        const index = parseInt(event.target.dataset.index);
        const deletedNote = notes.splice(index, 1)[0]; // Remove the deleted note from the notes array and store it
        deletedNotes.push(deletedNote); // Add the deleted note to the deletedNotes array
        localStorage.setItem('deletedNotes', JSON.stringify(deletedNotes)); // Save the deletedNotes array in local storage
        localStorage.setItem('notes', JSON.stringify(notes)); // Save the updated notes array in local storage
        updateCardContainer(); // Update the card container
    });
});


  // Add event listener for archive icons
  const archiveIcons = document.querySelectorAll('.archiveCard');
  archiveIcons.forEach((icon) => { // Add index as second parameter
      icon.addEventListener('click', (event) => { 
        const index = parseInt(event.target.dataset.index);
        const archivedNote = notes.splice(index, 1)[0]; // Remove the deleted note from the notes array and store it
        acrchiveNotes.push(archivedNote); // Add the deleted note to the deletedNotes array
        localStorage.setItem('acrchiveNotes', JSON.stringify(acrchiveNotes)); // Save the deletedNotes array in local storage
        localStorage.setItem('notes', JSON.stringify(notes)); // Save the updated notes array in local storage
        updateCardContainer(); // Update the card container
      });
  });

     
};



// Function to retrieve notes from localStorage and update notes array
const retrieveNotesFromLocalStorage = () => {
    if (localStorage.getItem('notes')) {
        notes = JSON.parse(localStorage.getItem('notes'));
        updateCardContainer(); // Update card container with retrieved notes
    }
};

// Call the function when the page loads
window.onload = () => {
    retrieveNotesFromLocalStorage();
};



// Save New Note
const createNote = () => {
    const titles = title.value;
    const description = takeNoteSection.value;
    const isValid = checkValidation();
    if (isValid) {
        displayCard.style.display = 'none';
        displaytakeNoteButton.style.display = 'block';
        const note = {
            titles: titles,
            description: description
        };
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
        title.value = '';
        takeNoteSection.value = '';
        updateCardContainer();
    }
};

addNote.addEventListener('click', createNote);



const checkValidation = () => {
    const tiltleError = document.getElementById('tiltleError');
    const textError = document.getElementById('textError');
    if(title.value === '')
    {     

         tiltleError.innerHTML = "Please enter title!"

         setTimeout(function() {
            tiltleError.style.display = 'none';
          }, 3000);

          return false;   
    }

    else if(takeNoteSection.value === '')
    {
        textError.innerHTML = "Please enter Description"

        setTimeout(function() {
           textError.style.display = 'none';
         }, 3000);

         return false; 
    }
    
        return true;

}



// Edit Note
const editNote = (index) => {
    const note = notes[index];
    title.value = note.titles;
    takeNoteSection.value = note.description;
    displayCard.style.display = 'flex';
    displaytakeNoteButton.style.display = 'none';
    addNote.textContent = 'Update Note';
    close.style.display = 'none';
    addNote.removeEventListener('click', createNote); // Remove previous event listener
    addNote.addEventListener('click', updateNote.bind(null, index));
    window.scrollTo(0, 0); // Scroll to top of the window
    setTimeout(() => {
        title.focus(); // Move cursor to beginning of title input
        title.selectionStart = 0; // Set selection start to 0 for title input
    }, 0);
};


// Update Note
const updateNote = (index) => {
    const updatedTitle = title.value;
    const updatedDescription = takeNoteSection.value;

    // Validate input
    if (!updatedTitle || !updatedDescription) {
        document.getElementById('titleError').textContent = !updatedTitle ? 'Please enter a title' : '';
        document.getElementById('textError').textContent = !updatedDescription ? 'Please enter a description' : '';
        return;
    }

    notes[index].titles = updatedTitle;
    notes[index].description = updatedDescription;

    localStorage.setItem('notes', JSON.stringify(notes));
    displayCard.style.display = 'none';
    displaytakeNoteButton.style.display = 'block';
    title.value = '';
    takeNoteSection.value = '';
    addNote.textContent = 'Add Note';
    close.style.display = 'block';
    updateCardContainer(); // Update card container after note is updated
    location.reload();  
};




const displayDeletedNotes = () => {
    deleteHeading.style.display = 'block';
    archiveHeading.style.display = 'none';
    clearAll.style.display = 'block';

    deletedNotesContainer.style.display = 'flex';
    // Clear card container
    deletedNotesContainer.innerHTML = '';

    let deletedNotesHTML = '';

    // Loop through deletedNotes array and create card elements
    for (let i = 0; i < deletedNotes.length; i++) {
        deletedNotesHTML += `
            <div class="deletedNotesSection">
            <div class="deleteSection">
            <h4 id="cardTitle">${deletedNotes[i].titles}</h4>
            <textarea id="cardDescription">${deletedNotes[i].description}</textarea>
        </div>
        </div>
        `;
    }
    deletedNotesContainer.innerHTML = deletedNotesHTML;
    displaytakeNoteButton.style.display = 'none';
    noteCard.style.display = 'none';
    archivedNotesContainer.style.display = 'none'
    displaytakeNoteButton.style.display='none';
    displayCard.style.display = 'none';

  

    clearAll.addEventListener('click', () => {
        localStorage.removeItem("deletedNotes");
        deleteHeading.innerHTML = "Empty!";
        deletedNotesContainer.remove(); 
        clearAll.remove();
    });

    if(deletedNotes.length === 0)
    {
        clearAll.style.display = 'none';
        deleteHeading.innerHTML = "Bin Folder is Empty!";
        
    }

   
};

const displayDeletedNotesButton = document.querySelector('.deletedIcon'); 
displayDeletedNotesButton.addEventListener('click', displayDeletedNotes);
mobiledeleteFolder.addEventListener('click', displayDeletedNotes);



// Update Archived Notes Container
const updateArchivedNotesContainer = () => {
    archivedNotesContainer.style.display = 'flex';
    archiveHeading.style.display = 'block';
    deleteHeading.style.display = 'none';
    clearAll.style.display = 'none';

    archivedNotesContainer.innerHTML = '';
    let archivedNotesHTML = '';

    // Loop through notes array and create archived note elements
    for (let i = 0; i <acrchiveNotes.length; i++) {
            archivedNotesHTML += `
            <div class="archivedNotesSection">
            <div class="icons">
                <i class="fa-solid fa-plus-square restoreCard" data-index="${i}"> Restore</i>
            </div>
                <h4 id="cardTitle">${acrchiveNotes[i].titles}</h4>
                <textarea id="cardDescription">${acrchiveNotes[i].description}</textarea>
            </div>
            `;
    }
    archivedNotesContainer.innerHTML = archivedNotesHTML;

    deletedNotesContainer.style.display = 'none';
    displaytakeNoteButton.style.display = 'none';
    noteCard.style.display = 'none';
    displaytakeNoteButton.style.display='none';
    displayCard.style.display = 'none';

    if(acrchiveNotes.length === 0)
    {
        archiveHeading.innerHTML = "Archive Folder is Empty!";
        
    }

  // Add event listener for restore icons
  const restoreIcons = document.querySelectorAll('.restoreCard');

  restoreIcons.forEach((restoreIcon) => {
      restoreIcon.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.index);
          const restoredNote = acrchiveNotes.splice(index, 1)[0];
          notes.push(restoredNote);
          localStorage.setItem('acrchiveNotes', JSON.stringify(acrchiveNotes));
          localStorage.setItem('notes', JSON.stringify(notes));
          updateArchivedNotesContainer();
      });
  });

 

};

const displayArchivedNotesButton = document.querySelector('.archive'); 
displayArchivedNotesButton.addEventListener('click', updateArchivedNotesContainer);
mobileArchive.addEventListener('click', updateArchivedNotesContainer)








